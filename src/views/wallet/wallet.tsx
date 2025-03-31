import { FunctionComponent, useEffect } from "react";
import CreateWallet from "./create-wallet";
import WalletBalance from "./wallet-balance";
import { appStore } from "../../stores/app-store";
import { observer } from "mobx-react-lite";
import { message } from "antd";

interface WalletProps {

}

const Wallet: FunctionComponent<WalletProps> = () => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    console.log("appStore.wallet :: ", appStore.wallet);
  }, [appStore.wallet])
  return <>
    { contextHolder }
    { appStore.wallet?._id
    ? <WalletBalance />
      : <CreateWallet messageApi={messageApi}/>
    }
  </>;
}

export default observer(Wallet);