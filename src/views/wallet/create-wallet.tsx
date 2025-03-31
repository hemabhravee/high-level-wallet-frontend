import { Button, Input, Form, message, Modal } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import WalletService from "../../services/wallet.service";
import { appStore } from "../../stores/app-store";
import { Wallet } from "../../types/wallet.types";
import { MessageInstance } from "antd/es/message/interface";
interface CreateWalletProps {
  messageApi: MessageInstance
}

const CreateWallet: FunctionComponent<CreateWalletProps> = ({ messageApi }) => {
  // const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [tempWallet, setTempWallet] = useState<Wallet>();
  const [showDuplicateWalletConfirmationModal, setShowDuplicateWalletConfirmationModal] = useState(false);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const { name, balance } = values;

    try {
      setSubmitting(true);
      const initialBalance = balance ? parseFloat(balance) : undefined;

      const createdWallet = await WalletService.createWallet(name, initialBalance).catch(async (error) => {
        if (error?.data?.message && error?.data?.message.includes("Duplicate value")) {
          console.log("Duplicate value error");
          const existingWallet = await WalletService.findWalletByName(name);
          setTempWallet(existingWallet.data);
          setShowDuplicateWalletConfirmationModal(true);
          // appStore.loadWallet(existingWallet.data);
        } else throw error;
      });
      if (createdWallet) {
        console.log("Wallet created:", createdWallet);
        appStore.loadWallet(createdWallet.data);
        messageApi.success(`Wallet created successfully for ${name}`);
        form.resetFields();
      }
      setSubmitting(false);
    } catch (error: any) {
      console.error("Error creating wallet:", error);
      messageApi.error(error?.data?.message || "Failed to create wallet");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* { contextHolder } */}
      <h2>Create Wallet</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please enter a name" },
          ]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          name="balance"
          label="Initial Balance"
          rules={[
            {
              type: "number",
              min: 0,
              transform: (value) => value ? Number(value) : null,
              message: "Balance must be a non-negative number"
            }
          ]}
        >
          <Input
            type="number"
            placeholder="Enter optional initial balance"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Wallet already exists"
        open={showDuplicateWalletConfirmationModal}
        onOk={() => {
          if(tempWallet) appStore.loadWallet(tempWallet);
          setTempWallet(undefined);
          setShowDuplicateWalletConfirmationModal(false);
        }}
        onCancel={() => {
          setTempWallet(undefined);
          setShowDuplicateWalletConfirmationModal(false);
         }}
        onClose={() => {
          setShowDuplicateWalletConfirmationModal(false);
        }}
      >
        A wallet already exists with the user name <b>{tempWallet?.name}</b>.
        Do you want to use this wallet?
      </Modal>
    </div>
  );
};

export default CreateWallet;