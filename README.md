# Wallet Frontend

A Vite-based wallet management system that allows creating wallets and handling transactions.

## Installation

```bash
yarn
```

## Running in Development Mode

```bash
yarn dev
```

## Pages & Features

### Wallet Page

#### Create/Select a Wallet
- **Description**: Allows users to create a new wallet or select an existing one
- **Inputs**:
  - Name (required)
  - Initial Balance (optional)
- **Notes**:
  - If a wallet with the entered name already exists, a confirmation popup appears
  - Users can choose to use the existing wallet or create a new one
- **Example**:
  ```
  Name: Savings
  Balance: 1000
  ```

#### Wallet Dashboard
- **Description**: After creating or selecting a wallet, shows wallet information and options
- **Features**:
  - Displays current wallet balance
  - Provides interface to create new transactions
  - Navigation to transaction history page

### Transaction Page

#### View Transactions
- **Description**: Displays transactions associated with the current wallet
- **Features**:
  - Paginated transaction list
  - Search functionality for filtering by amount or description
  - Sorting options (amount or date, ascending or descending)

#### Download Options
- **Description**: Export transaction data for external use
- **Options**:
  - Download currently displayed transactions (CSV)
  - Download complete transaction history (CSV)

## API Integration

The frontend integrates with the Wallet Backend API:

### Wallet API Endpoints Used

- `POST /wallet`: Create a new wallet
- `GET /wallet/name/:name`: Retrieve wallet by name
- `GET /wallet/:id`: Retrieve wallet by ID

### Transaction API Endpoints Used

- `POST /transaction`: Create a new transaction
- `GET /transaction/query`: Retrieve transactions with filtering and pagination

## Rules & Constraints

1. Wallet names must be unique
2. Minimum wallet balance is zero
3. Maximum wallet balance is 1,000,000,000
4. Balances display up to 4 decimal places

## Notes
- The transaction search functionality works on both description and amount fields
- Transaction queries support sorting by date or amount in ascending or descending order
- The application connects to the backend API hosted at `https://high-level-wallet-backend.onrender.com`