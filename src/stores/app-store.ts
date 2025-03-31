import { makeAutoObservable } from 'mobx';
import { Wallet } from '../types/wallet.types';
import { LocalStorageConstants } from '../constants/local-storage-constants';
import WalletService from '../services/wallet.service';


class AppStore {
  wallet?: Wallet;

  setBalance(balance: number) {
    if (this.wallet) {
      this.wallet.balance = balance;
    }
  }
  setWallet(wallet: Wallet) { this.wallet = wallet; }
  clearWallet() {
    this.wallet = undefined;
    localStorage.removeItem(LocalStorageConstants.walletId);
  }

  loadWallet(wallet: Wallet) {
    console.log("wallet :: ", wallet);
    this.setWallet(wallet);
    localStorage.setItem(LocalStorageConstants.walletId, wallet._id);
  }

  incrementVersion() {
    if (this.wallet?.__v) this.wallet.__v += 1;
  }

  async refreshWallet() {
    if (this.wallet?._id) {
      const wallet = await WalletService.findWalletById(this.wallet?._id);
      this.loadWallet(wallet.data);
    }
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export const appStore = new AppStore();