
export type RouteType = {
  path: string;
  tabText: string;
  key: RouteKeys;
  tooltip?: string;
  helmetText?: string;
  description: string;
};

export enum RouteKeys {
  WALLET = 'wallet',
  TRANSACTIONS = 'transactions',
}

export const RouteConstants: { [key in RouteKeys]: RouteType } = {
  wallet: {
    path: '/wallet',
    tabText: 'Wallet',
    key: RouteKeys.WALLET,
    description: 'This is where the wallet is',
    // icon: <VideoCameraOutlined />,
  },
  transactions: {
    path: '/transactions',
    tabText: 'Transactions',
    key: RouteKeys.TRANSACTIONS,
    description: 'This is where the transactions are',
    // icon: <ProfileOutlined />,
  },
};
