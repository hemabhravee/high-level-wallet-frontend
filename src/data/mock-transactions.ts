import { Transaction, TransactionType } from "../types/transaction.types";

// Helper function to generate MongoDB-like ObjectId
function generateObjectId(): string {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0');
  const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
  const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');

  return timestamp + machineId + processId + counter;
}

// Generate wallet IDs
const walletIds = [
  "67e6a339077694445a6231b0",
  generateObjectId(),
  generateObjectId(),
  generateObjectId(),
  generateObjectId()
];

// Descriptions for transactions
const debitDescriptions = [
  "Coffee shop purchase",
  "Grocery shopping",
  "Online subscription",
  "Restaurant bill",
  "Gas station",
  "Retail purchase",
  "Utility bill payment",
  "Mobile phone bill",
  "Taxi fare",
  "Movie tickets"
];

const creditDescriptions = [
  "Salary deposit",
  "Client payment",
  "Tax refund",
  "Investment return",
  "Reimbursement",
  "Interest payment",
  "Rental income",
  "Cashback reward",
  "Gift received",
  "Rebate"
];

// Generate 200 mock transactions
export const transactions: Transaction[] = [];

// Start date (6 months ago)
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 6);

// End date (today)
const endDate = new Date();

// Initialize wallets with initial balances
const walletBalances: {[key: string]: number} = {};
walletIds.forEach(id => {
  walletBalances[id] = 10000; // Starting with 10,000 balance for each wallet
});

// Function to generate amount with up to 4 decimal places
function generateAmount(min: number, max: number): number {
  // Generate a random number with up to 4 decimal places
  return parseFloat((Math.random() * (max - min) + min).toFixed(4));
}

// Generate transactions
for (let i = 0; i < 200; i++) {
  // Select random wallet
  const walletId = walletIds[Math.floor(Math.random() * walletIds.length)];

  // Determine transaction type (slightly more debits than credits)
  const type = Math.random() < 0.6 ? TransactionType.debit : TransactionType.credit;

  // Generate random amount with up to 4 decimal places (between 1 and 1000)
  let amount = generateAmount(1, 1000);

  // For debits, ensure we don't go below 0 balance and make amount negative
  if (type === TransactionType.debit) {
    // Cap the amount to ensure balance doesn't go below 0
    amount = Math.min(amount, walletBalances[walletId]);
    // If wallet is at 0, force a credit instead
    if (amount === 0) {
      amount = generateAmount(50, 500);
      walletBalances[walletId] += amount;
    } else {
      // Make debit amount negative
      amount = -amount;
      walletBalances[walletId] += amount; // Adding negative amount (subtracting)
    }
  } else {
    // Credit amount is already positive
    walletBalances[walletId] += amount;
  }

  // Random date between start and end dates
  const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

  // Select random description based on transaction type
  const description = type === TransactionType.debit
    ? debitDescriptions[Math.floor(Math.random() * debitDescriptions.length)]
    : creditDescriptions[Math.floor(Math.random() * creditDescriptions.length)];

  transactions.push({
    id: generateObjectId(),
    walletId,
    amount,
    balance: parseFloat(walletBalances[walletId].toFixed(4)), // Ensure balance also has up to 4 decimal places
    description,
    date,
    type
  });
}

// Sort transactions by date (newer first)
transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

// Export the transactions
export default transactions;