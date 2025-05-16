import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Wallet } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

const LoginPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, login } = useUser();
  const [web3State, web3Actions] = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);
  
  const handleConnectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if on Base network
      if (!web3State.isCorrectNetwork) {
        await web3Actions.switchToBaseNetwork();
      }
      
      // Connect wallet
      await web3Actions.connect();
      
      // Login with wallet address
      if (web3State.account) {
        await login(web3State.account);
        navigate('/app');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="py-4 px-6 flex justify-between items-center shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Dylets</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Dylets</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Connect your wallet to access the platform
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            
            <button
              onClick={handleConnectWallet}
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </span>
              )}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Register
                </Link>
              </p>
            </div>
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Supported wallets:</h3>
              <div className="flex space-x-4 justify-center">
                <img src="https://metamask.io/images/metamask-fox.svg" alt="MetaMask" className="h-8 w-8" />
                <img src="https://www.coinbase.com/assets/press/coinbase-mark-dark-a25b085499cd3b56c32c5f3e3aab9380e82cfa0f2b3f51bccd46d1d59a6d9ced.png" alt="Coinbase Wallet" className="h-8 w-8" />
                <img src="https://walletconnect.com/images/walletconnect-logo.svg" alt="WalletConnect" className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2024 Dylets. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;