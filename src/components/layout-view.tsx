import { Layout, Spin, Tabs, Dropdown, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RouteConstants, RouteKeys } from '../constants/route-constants';
import { appStore } from '../stores/app-store';
import { LocalStorageConstants } from '../constants/local-storage-constants';
import WalletService from '../services/wallet.service';
import { observer } from 'mobx-react-lite';

interface LayoutProps {
    children?: React.ReactNode;
    hideTabItems?: boolean;
    showHeading?: boolean;
}

const tabs = Object.entries(RouteConstants).map(([key, value]) => ({
  key,
  label: value.tabText
}));

export const LayoutView: React.FC<LayoutProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(RouteConstants.wallet);
  const navigate = useNavigate();

  const handleTabChange = (activeKey: string) => {
    const route = RouteConstants[activeKey as RouteKeys];
    if (route) {
      setCurrentTab(route);
      navigate(route.path);
    }
  };

  useEffect(() => {
    // if path is /transactions then update tab
    if (window.location.pathname === RouteConstants.transactions.path) setCurrentTab(RouteConstants.transactions)
    fetchWallet();
  }, [])

  const fetchWallet = async () => {
    const walletId = localStorage.getItem(LocalStorageConstants.walletId);
    try {
      if (walletId) {
        const wallet = await WalletService.findWalletById(walletId);
        appStore.loadWallet(wallet.data);
      }
    } catch (error: unknown) {
      console.error("Error fetching wallet:", error);
      appStore.clearWallet();
    } finally {
      setLoading(false);
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!appStore.wallet?.name) return '?';

    const nameParts = appStore.wallet.name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
  };

  // Define the menu items for the dropdown
  const menuItems = [
    {
      key: 'logout',
      label: (
        <div onClick={() => appStore.clearWallet()} style={{ padding: '8px 12px' }}>
          <LogoutOutlined style={{ marginRight: 8 }} />
          Logout
        </div>
      ),
    },
  ];

  return (<div>
    <Layout style={{ backgroundColor: 'white', minHeight: '100vh', minWidth: "100vw", width: '100%', padding: '0' }}>
      <Layout.Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px',
          color: 'white',
          padding: '0 20px',
          boxSizing: 'border-box'
        }}
      >
        <span style={{fontSize: "32px"}}> {currentTab.tabText} </span>
        {appStore.wallet?._id && (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
            <Avatar
              style={{
                backgroundColor: '#1890ff',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              size="large"
            >
              {getUserInitials()}
            </Avatar>
          </Dropdown>
        )}
      </Layout.Header>
      <Layout.Content style={{ padding: '0px 20px', width: '100%', boxSizing: 'border-box' }}>
        <Tabs activeKey={currentTab.key} items={tabs} onChange={handleTabChange} />
        {loading ?
    <Spin /> : children}
      </Layout.Content>
    </Layout>
  </div>);
};

export default observer(LayoutView);