# Dylets - Solar Cooler Financing Platform

Dylets is a blockchain-powered fintech platform providing affordable solar cooler financing for fish traders in Kisumu, Kenya, reducing post-harvest losses and increasing incomes.

## Project Overview

This platform connects fish traders with solar cooler financing using USDC stablecoins on the Base blockchain. The RejSola solar coolers maintain optimal temperature (0-4°C) to keep fish fresh for days, reducing spoilage by up to 30%.

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Network**: Base Mainnet
- **Token**: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)

## Smart Contract Architecture

The main contract `DyletsLoanContract.sol` handles:
- Loan creation and management
- USDC payment processing
- Payment tracking and status updates
- Emergency controls for admin

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MetaMask wallet with Base network configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Stella-Achar-Oiro/rejsola.git
cd dylets
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the environment variables in `.env` with your specific values.

### Development

Run the development server:
```bash
npm run dev
```

### Smart Contract Deployment

1. Compile contracts:
```bash
npx hardhat compile
```

2. Deploy to Base Goerli testnet:
```bash
NETWORK=testnet npx hardhat run scripts/deploy.ts --network baseGoerli
```

3. Deploy to Base mainnet:
```bash
NETWORK=mainnet npx hardhat run scripts/deploy.ts --network baseMainnet
```

### Testing

Run smart contract tests:
```bash
npx hardhat test
```

## Features

- **Wallet Connection**: Connect with MetaMask and other Web3 wallets
- **Loan Application**: Apply for solar cooler financing
- **Loan Management**: Track loan status and make payments
- **Cooler Monitoring**: Monitor temperature and battery levels
- **Impact Metrics**: Track environmental and economic impact

## License

The project is licensed under the MIT [License](LICENSE) - see the LICENSE file for details.

## Acknowledgments

- Base blockchain for providing the infrastructure
- USDC for stable payment processing
- OpenZeppelin for secure contract libraries
