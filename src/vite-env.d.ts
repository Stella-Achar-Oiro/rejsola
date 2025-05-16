/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_RPC_URL: string;
  readonly VITE_BASE_CHAIN_ID: string;
  readonly VITE_LOAN_CONTRACT_ADDRESS: string;
  readonly VITE_USDC_CONTRACT_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  ethereum?: any;
}