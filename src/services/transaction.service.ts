import { Transaction } from "../types/transaction.types";
import { DataSuccessObjectResponse, DataSuccessPaginatedResponse } from "../types/response.types";
import { axiosInstance } from "./axios.service";

/**
 * Fetches transactions with filtering, pagination, and sorting
 *
 * @param walletId - Filter transactions by wallet ID
 * @param skip - Number of transactions to skip (for pagination)
 * @param limit - Maximum number of transactions to return
 * @param options - Additional options for filtering and sorting
 * @returns Promise<Transaction[]> - A promise that resolves to an array of transactions
 */
const fetchTransactions = (
  walletId: string,
  skip: number = 0,
  limit: number = 10,
  options?: {
    searchText?: string; // searches on description, amount, and balance
    sortField?: 'date' | 'amount';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<DataSuccessPaginatedResponse<Transaction>> => {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/transaction/query', {
      params: {
        walletId,
        skip,
        limit,
        ...(options ? {
          search: options?.searchText,
          sortField: options?.sortField,
          sortOrder: options?.sortOrder,
        } : {})
      }
    })
    .then((response) => {
      resolve(response?.data as DataSuccessPaginatedResponse<Transaction>);
    })
    .catch((error) => {
      console.error("error :: ", error);
      reject(error?.response?.data);
    })
  });
};

const createTransaction = (
  walletId: string,
  amount: number,
  description: string,
  version: number, // wallet version used to check if wallet is latest
): Promise<DataSuccessObjectResponse<Transaction>> => {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/transaction', { walletId, amount, description, version })
      .then((response) => {
        console.log("response :: ", response);
        resolve(response?.data as DataSuccessObjectResponse<Transaction>);
      })
      .catch((error) => {
        console.error("error :: ", error);
        reject(error?.response?.data);
      })
  });
};

const TransactionService = {
  fetchTransactions,
  createTransaction
};

export default TransactionService;