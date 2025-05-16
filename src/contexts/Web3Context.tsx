import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import DyletsLoanContractABI from '../contracts/DyletsLoanContract.json';
import USDCABI from '../contracts/USDC.json';

// Environment variables
const LOAN_CONTRACT_ADDRESS = import.meta.env.VITE_LOAN_CONTRACT_ADDRESS as string || '0x0000000000000000000000000000000000000000';
const USDC_CONTRACT_ADDRESS = import.meta.env.VITE_USDC_CONTRACT_ADDRESS as string || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const BASE_CHAIN_ID = parseInt(import.meta.env.VITE_BASE_CHAIN_ID as string || '8453');
const BASE_RPC_URL = import.meta.env.VITE_BASE_RPC_URL as string || 'https://mainnet.base.org';

// Base network configuration
const baseNetwork = {
  chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: [BASE_RPC_URL],
  blockExplorerUrls: ['https://basescan.org']
};

export interface Loan {
  id: string;
  borrower: string;
  principal: number;
  interestRate: number;
  termMonths: number;
  weeklyPayment: number;
  totalPaid: number;
  remainingBalance: number;
  nextPaymentDue: Date;
  coolerSerialNumber: string;
  coolerType: string;
  status: 'Pending' | 'Active' | 'Paid' | 'Defaulted';
  startDate: Date;
  endDate: Date;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  timestamp: Date;
  transactionHash: string;
}

interface Web3ContextState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  connected: boolean;
  isCorrectNetwork: boolean;
  usdcBalance: string;
  loanContract: ethers.Contract | null;
  usdcContract: ethers.Contract | null;
}

interface Web3ContextActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBaseNetwork: () => Promise<void>;
  getLoans: () => Promise<Loan[]>;
  getLoan: (loanId: string) => Promise<Loan>;
  getLoanPayments: (loanId: string) => Promise<Payment[]>;
  makePayment: (loanId: string, amount: string) => Promise<string>;
  approveUSDC: (amount: string) => Promise<string>;
  refreshUSDCBalance: () => Promise<void>;
}

interface Web3ContextType {
  state: Web3ContextState;
  actions: Web3ContextActions;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return [context.state, context.actions] as const;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [state, setState] = useState<Web3ContextState>({
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    connected: false,
    isCorrectNetwork: false,
    usdcBalance: '0',
    loanContract: null,
    usdcContract: null
  });

  // Initialize provider from window.ethereum
  const initializeProvider = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        const isCorrectNetwork = chainId === BASE_CHAIN_ID;
        
        setState(prev => ({ ...prev, provider, chainId, isCorrectNetwork }));
        
        return provider;
      } catch (error) {
        console.error('Error initializing provider:', error);
      }
    }
    return null;
  };

  // Connect wallet
  const connect = async () => {
    try {
      const provider = state.provider || await initializeProvider();
      if (!provider) throw new Error('No provider available');

      // Request accounts
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      
      // Get signer
      const signer = await provider.getSigner();
      
      // Initialize contracts
      const loanContract = new ethers.Contract(
        LOAN_CONTRACT_ADDRESS,
        DyletsLoanContractABI,
        signer
      );
      
      const usdcContract = new ethers.Contract(
        USDC_CONTRACT_ADDRESS,
        USDCABI,
        signer
      );
      
      // Get USDC balance
      const usdcBalance = await usdcContract.balanceOf(account);
      const formattedBalance = ethers.formatUnits(usdcBalance, 6); // USDC has 6 decimals
      
      setState(prev => ({
        ...prev,
        signer,
        account,
        connected: true,
        loanContract,
        usdcContract,
        usdcBalance: formattedBalance
      }));
      
      // Store connection in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', account);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setState({
      provider: null,
      signer: null,
      account: null,
      chainId: null,
      connected: false,
      isCorrectNetwork: false,
      usdcBalance: '0',
      loanContract: null,
      usdcContract: null
    });
    
    // Clear localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  // Switch to Base network
  const switchToBaseNetwork = async () => {
    if (!window.ethereum) throw new Error('No ethereum provider found');
    
    try {
      // Try to switch to Base
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: baseNetwork.chainId }]
      });
    } catch (error: any) {
      // If Base is not added to MetaMask, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [baseNetwork]
          });
        } catch (addError) {
          console.error('Error adding Base network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to Base network:', error);
        throw error;
      }
    }
    
    // Refresh provider after network switch
    await initializeProvider();
  };

  // Helper function to format loan data from contract
  const formatLoanData = (loanData: any): Loan => {
    const statusMap = ['Pending', 'Active', 'Paid', 'Defaulted'];
    
    return {
      id: loanData.id.toString(),
      borrower: loanData.borrower,
      principal: Number(ethers.formatUnits(loanData.principal, 6)),
      interestRate: Number(loanData.interestRate) / 100, // Convert basis points to percentage
      termMonths: Number(loanData.termMonths),
      weeklyPayment: Number(ethers.formatUnits(loanData.weeklyPayment, 6)),
      totalPaid: Number(ethers.formatUnits(loanData.totalPaid, 6)),
      remainingBalance: Number(ethers.formatUnits(loanData.remainingBalance, 6)),
      nextPaymentDue: new Date(Number(loanData.nextPaymentDue) * 1000),
      coolerSerialNumber: loanData.coolerSerialNumber,
      coolerType: loanData.coolerType,
      status: statusMap[Number(loanData.status)] as 'Pending' | 'Active' | 'Paid' | 'Defaulted',
      startDate: new Date(Number(loanData.startDate) * 1000),
      endDate: new Date(Number(loanData.endDate) * 1000)
    };
  };

  // Get all loans for connected user
  const getLoans = async (): Promise<Loan[]> => {
    if (!state.loanContract || !state.account) {
      throw new Error('Contract or account not initialized');
    }
    
    try {
      // Since we've checked for null above, we can safely assert that loanContract is not null
      const contract = state.loanContract;
      
      // Get loan IDs for the connected account
      const loanIds = await contract.getBorrowerLoans(state.account);
      
      // Fetch details for each loan
      const loans = await Promise.all(
        loanIds.map(async (id: bigint) => {
          const loanData = await contract.getLoan(id);
          return formatLoanData(loanData);
        })
      );
      
      return loans;
    } catch (error) {
      console.error('Error fetching loans:', error);
      throw error;
    }
  };

  // Get a specific loan by ID
  const getLoan = async (loanId: string): Promise<Loan> => {
    if (!state.loanContract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      // Store the non-null contract in a local variable
      const contract = state.loanContract;
      const loanData = await contract.getLoan(loanId);
      return formatLoanData(loanData);
    } catch (error) {
      console.error(`Error fetching loan ${loanId}:`, error);
      throw error;
    }
  };

  // Get payments for a specific loan
  const getLoanPayments = async (loanId: string): Promise<Payment[]> => {
    if (!state.loanContract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      // Store the non-null contract in a local variable
      const contract = state.loanContract;
      const paymentsData = await contract.getLoanPayments(loanId);
      
      return paymentsData.map((payment: any) => ({
        id: payment.id.toString(),
        loanId: payment.loanId.toString(),
        amount: Number(ethers.formatUnits(payment.amount, 6)),
        timestamp: new Date(Number(payment.timestamp) * 1000),
        transactionHash: payment.transactionHash
      }));
    } catch (error) {
      console.error(`Error fetching payments for loan ${loanId}:`, error);
      throw error;
    }
  };

  // Make a payment on a loan
  const makePayment = async (loanId: string, amount: string): Promise<string> => {
    if (!state.loanContract || !state.signer) {
      throw new Error('Contract or signer not initialized');
    }
    
    try {
      // Convert amount to USDC units (6 decimals)
      const amountInWei = ethers.parseUnits(amount, 6);
      
      // Store the non-null contract in a local variable
      const contract = state.loanContract;
      
      // Make the payment
      const tx = await contract.makePayment(
        loanId,
        amountInWei,
        '' // Transaction hash will be filled by the contract
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Refresh USDC balance
      await refreshUSDCBalance();
      
      return receipt.hash;
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    }
  };

  // Approve USDC spending
  const approveUSDC = async (amount: string): Promise<string> => {
    if (!state.usdcContract || !state.signer) {
      throw new Error('USDC contract or signer not initialized');
    }
    
    try {
      // Convert amount to USDC units (6 decimals)
      const amountInWei = ethers.parseUnits(amount, 6);
      
      // Store the non-null contract in a local variable
      const contract = state.usdcContract;
      
      // Approve USDC spending
      const tx = await contract.approve(
        LOAN_CONTRACT_ADDRESS,
        amountInWei
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return receipt.hash;
    } catch (error) {
      console.error('Error approving USDC:', error);
      throw error;
    }
  };

  // Refresh USDC balance
  const refreshUSDCBalance = async (): Promise<void> => {
    if (!state.usdcContract || !state.account) {
      throw new Error('USDC contract or account not initialized');
    }
    
    try {
      // Store the non-null contract in a local variable
      const contract = state.usdcContract;
      
      const balance = await contract.balanceOf(state.account);
      const formattedBalance = ethers.formatUnits(balance, 6);
      
      setState(prev => ({ ...prev, usdcBalance: formattedBalance }));
    } catch (error) {
      console.error('Error refreshing USDC balance:', error);
      throw error;
    }
  };

  // Initialize on component mount
  useEffect(() => {
    const init = async () => {
      const provider = await initializeProvider();
      
      // Check if user was previously connected
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      if (wasConnected && provider) {
        try {
          await connect();
        } catch (error) {
          console.error('Error reconnecting wallet:', error);
          // Clear localStorage if reconnection fails
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletAddress');
        }
      }
    };
    
    init();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else {
          // User switched accounts, reconnect
          connect();
        }
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        // Refresh the page on chain change
        window.location.reload();
      });
    }
    
    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const actions: Web3ContextActions = {
    connect,
    disconnect,
    switchToBaseNetwork,
    getLoans,
    getLoan,
    getLoanPayments,
    makePayment,
    approveUSDC,
    refreshUSDCBalance
  };

  return (
    <Web3Context.Provider value={{ state, actions }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;