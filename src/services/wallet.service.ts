import { DataSuccessObjectResponse } from "../types/response.types";
import { Wallet } from "../types/wallet.types";
import { axiosInstance } from "./axios.service";

/**
 * Creates a new wallet
 *
 * @param name - Name for the new wallet
 * @returns Promise<Wallet> - A promise that resolves to the created wallet
 */
export const createWallet = (
  name: string,
  balance: number | undefined,
): Promise<DataSuccessObjectResponse<Wallet>> => {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/wallet', { name, balance })
      .then((response) => {
        resolve(response?.data as DataSuccessObjectResponse<Wallet>);
      })
      .catch((error) => {
        console.error("error :: ", error);
        reject(error?.response?.data);
      })
  });
};

export const findWalletById = (
  id: string,
): Promise<DataSuccessObjectResponse<Wallet>> => {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/wallet/' + id,)
      .then((response) => {
        resolve(response?.data as DataSuccessObjectResponse<Wallet>);
      })
      .catch((error) => {
        console.error("error :: ", error);
        reject(error?.response?.data);
      })
  });
};

export const findWalletByName = (
  name: string,
): Promise<DataSuccessObjectResponse<Wallet>> => {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/wallet/name/' + name,)
      .then((response) => {
        resolve(response?.data as DataSuccessObjectResponse<Wallet>);
      })
      .catch((error) => {
        console.error("error :: ", error);
        reject(error?.response?.data);
      })
  });
};

const WalletService = {
  createWallet,
  findWalletById,
  findWalletByName
};

export default WalletService;