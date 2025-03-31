import { Button, Input, Switch, Form, Typography, message, Spin } from "antd";
import { FunctionComponent, useState } from "react";
import { appStore } from "../../stores/app-store";
import { observer } from "mobx-react-lite";
import TransactionService from "../../services/transaction.service";
import { formatNumberWithCommas } from "../../utils/string.utils";
import { ServerErrorConstants } from "../../constants/server-error-constants";
import WalletService from "../../services/wallet.service";
import { DataErrorObjectResponse } from "../../types/response.types";

interface WalletBalanceProps {}

const WalletBalance: FunctionComponent<WalletBalanceProps> = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isCredit, setIsCredit] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [displayAmount, setDisplayAmount] = useState('');
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  const handleTransactionTypeChange = (checked: boolean) => {
    setIsCredit(checked);
  };

  // Handle input amount change to format with commas
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Remove non-numeric characters for processing
    const numericValue = value.replace(/[^\d.]/g, '');

    if (numericValue) {
      // Store the actual numeric value in form
      form.setFieldValue('amount', numericValue);

      // Display formatted value with commas
      const parsed = parseFloat(numericValue);
      if (!isNaN(parsed)) {
        setDisplayAmount(formatNumberWithCommas(parsed));
      } else {
        setDisplayAmount(numericValue);
      }
    } else {
      form.setFieldValue('amount', '');
      setDisplayAmount('');
    }
  };

  const refreshWallet = async () => {
    try {
      setIsBalanceLoading(true);
      if (appStore.wallet?._id) {
        const wallet = await WalletService.findWalletById(appStore.wallet._id);
        appStore.loadWallet(wallet.data);
        messageApi.success(`Wallet refreshed!`);
      }
    } catch (error: any) {
      console.error("Error while refreshing wallet :: ", error);
      messageApi.error(error?.data?.message || 'Error while refreshing wallet');
    } finally {
      setIsBalanceLoading(false);
    }
  }

  const onSubmit = () => {
    const walletId = appStore.wallet?._id;
    const version = appStore.wallet?.__v;
    if (!walletId || version === undefined) return;
    form.validateFields()
      .then(values => {
        setSubmitting(true);

        const { amount, description } = values;
        const transactionAmount = parseFloat(amount);
        const finalAmount = isCredit ? transactionAmount : -transactionAmount;

        TransactionService.createTransaction(
          walletId,
          finalAmount,
          description,
          version,
        )
          .then(response => {
            messageApi.success(`Transaction successful: ${isCredit ? 'Added' : 'Deducted'} $${formatNumberWithCommas(Math.abs(finalAmount))}`);
            form.resetFields();
            setDisplayAmount('');

            appStore.setBalance(response.data.balance);
            appStore.incrementVersion();
          })
          .catch(error => {
            console.error("here :: ", error)
            messageApi.error(error?.data?.message || 'Transaction failed');
            if (error?.data?.message === ServerErrorConstants.walletVersionMismatch) {
              refreshWallet();
            }
            console.error(error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      })
      .catch(error => {
        console.error("Validation failed:", error);
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <Typography.Title level={3}>Wallet Balance</Typography.Title>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <Typography.Text strong style={{ fontSize: '16px' }}>
          {appStore.wallet?.name}'s Wallet
        </Typography.Text>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>

      <Typography.Title level={2}>
          {
            isBalanceLoading ? <Spin />
              : `$ ${appStore.wallet?.balance ? formatNumberWithCommas(appStore.wallet.balance) : '0.00'}`
          }
      </Typography.Title>

        <Typography.Text type="secondary">Current Balance</Typography.Text>
      </div>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="amount"
          label="Transaction Amount"
          rules={[
            { required: true, message: "Please enter an amount" },
            {
              type: "number",
              min: 0.0001,
              transform: (value) => value ? Number(value) : null,
              message: "Amount must be a positive number"
            }
          ]}
        >
          <Input
            placeholder="Enter amount"
            prefix="$"
            min={0}
            step={0.01}
            onChange={handleAmountChange}
            value={displayAmount}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter a description" }
          ]}
        >
          <Input
            placeholder="Enter transaction description"
          />
        </Form.Item>

        <Form.Item label="Transaction Type">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Typography.Text>Debit</Typography.Text>
            <Switch
              checked={isCredit}
              onChange={handleTransactionTypeChange}
              defaultChecked
            />

            <Typography.Text>Credit</Typography.Text>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            block
          >
            {isCredit ? 'Add Funds' : 'Withdraw Funds'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default observer(WalletBalance);