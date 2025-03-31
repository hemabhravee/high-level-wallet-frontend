import { Table, Tag, Typography, Input, Form, Button, message } from "antd";
import { useState, useEffect, FunctionComponent } from "react";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Transaction } from "../types/transaction.types";
import ReadableDate from "../components/common/readable-date";
import TransactionService from "../services/transaction.service";
import { appStore } from "../stores/app-store";
import { DownloadOutlined } from '@ant-design/icons';
import { formatNumberWithCommas } from "../utils/string.utils";
import { observer } from "mobx-react-lite";
import TooltipWrapper from "../components/common/tooltip-wrapper";


const Transactions: FunctionComponent = () => {
    const [messageApi, contextHolder] = message.useMessage();

  // State for transactions data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // State for filters and sorting
  const [searchText, setSearchText] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [sortField, setSortField] = useState<'date' | 'amount' | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(undefined);

  // Fetch transactions from service
  const fetchData = async () => {
    const walletId = appStore.wallet?._id;
    if (!walletId) {
      setTransactions([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const skip = (pagination.current - 1) * pagination.pageSize;
      const data = await TransactionService.fetchTransactions(
        walletId,
        skip,
        pagination.pageSize,
        {
          searchText,
          sortField,
          sortOrder: sortDirection,
        }
      );
      setTransactions(data.data);

      setTotal(data.totalCount);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, searchText, sortField, sortDirection, appStore.wallet?._id]);

  useEffect(() => {
    if (!appStore.wallet?._id)
      messageApi.warning("Please add a wallet in the wallet tab to see its transactions");
  }, []);

  // Handle table change (pagination, filters, sorter)
  const handleTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10
    });

    if (sorter && sorter.field) {
      console.log("sorter :: ", sorter);
      if (sorter.field === 'date' || sorter.field === 'amount') {
        setSortField(sorter.field);
        setSortDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
      } else {
        setSortField(undefined);
        setSortDirection(undefined);
      }
    } else {
      setSortField(undefined);
      setSortDirection(undefined);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPagination({ ...pagination, current: 1 }); // Reset to first page on search
  };

  // Function to handle downloading all transaction data
  const handleDownloadAllData = async () => {
    const walletId = appStore.wallet?._id;
    if (!walletId) return;
    try {
      setLoading(true);
      // Fetch all transactions without pagination
      const allData = await TransactionService.fetchTransactions(
        walletId,
        0,
        total, // Use total count to fetch all records
        {
          searchText,
          sortField,
          sortOrder: sortDirection,
        }
      );

      // Convert data to CSV format
      const csvData = convertToCSV(allData.data);
      downloadCSV(csvData, 'all_transactions.csv');
    } catch (error) {
      console.error("Failed to download all transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle downloading current page data
  const handleDownloadPageData = () => {
    try {
      // Convert current page data to CSV format
      const csvData = convertToCSV(transactions);
      downloadCSV(csvData, 'page_transactions.csv');
    } catch (error) {
      console.error("Failed to download page transactions:", error);
    }
  };

  // Helper function to convert transaction data to CSV format
  const convertToCSV = (data: Transaction[]) => {
    const headers = ['Type', 'Date', 'Amount', 'Updated Balance', 'Description', 'Wallet ID'];

    const rows = data.map(item => [
      item.amount > 0 ? 'Credit' : 'Debit',
      new Date(item.date).toLocaleDateString(),
      item.amount.toFixed(2),
      item.balance.toFixed(2),
      item.description,
      item.walletId
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  // Helper function to trigger CSV download
  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    // Append to document, trigger download, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // No menu items needed as we're using direct buttons

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Type',
      dataIndex: 'amount',
      key: 'type',
      render: (amount: number) => {
        return <Tag
          color={amount > 0 ? 'green' : 'red'}
        >
          {amount > 0 ? "Credit" : "Debit"}
        </Tag>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'end',
      key: 'amount',
      render: (amount: number, record: Transaction) => {
        const prefix = record.amount > 0 ? '+' : '-';
        const color = record.amount > 0 ? 'green' : 'red';
        return (
          <Typography.Text style={{ color, whiteSpace: 'nowrap' }}>
            {prefix} ${formatNumberWithCommas(Math.abs(amount))}
          </Typography.Text>
        );
      },
      sorter: true,
    },
    {
      title: 'Updated Balance',
      dataIndex: 'balance',
      align: 'end',
      key: 'balance',
      render: (balance: number) => {
        return <Typography.Text style={{ whiteSpace: 'nowrap' }}>${formatNumberWithCommas(balance)}</Typography.Text>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        return <ReadableDate date={new Date(date)} />;
      },
      sorter: true,
    },
  ];

  return (
    <div>
      { contextHolder }
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Transaction History</Typography.Title>

        {/* Download Buttons */}
        <div>
          <TooltipWrapper text={ transactions?.length ? "Download the transactions present on the screen" : `No data to download` }>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadPageData}
                style={{ marginRight: '8px' }}
                disabled={!transactions?.length}
            >
              Download Page Data
            </Button>
          </TooltipWrapper>
          <TooltipWrapper text={ transactions?.length ? `Download all (${total}) transactions matching the current search` : "No data to download" }>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadAllData}
              disabled={!transactions?.length}
            >
              Download All Data
            </Button>
          </TooltipWrapper>
        </div>
      </div>

      {/* Search control */}
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <Form.Item label="Search">
          <Input
            placeholder="Search in description or amount"
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 250 }}
            allowClear
          />
        </Form.Item>
      </Form>

      {/* Transactions table */}
      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        pagination={{
          ...pagination,
          total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Total ${total} transactions`,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default observer(Transactions);