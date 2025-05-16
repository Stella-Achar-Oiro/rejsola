import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Sun, Moon, Wallet } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { login } = useUser();
  const navigate = useNavigate();
  
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!walletAddress) {
      setError('Please enter your wallet address');
      return;
    }
    
    try {
      setIsLoading(true);
      // In a real app, we would authenticate with the blockchain
      // For now, just use the mock data
      login(walletAddress);
      navigate('/app');
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      // In a real app, we would connect to the user's wallet
      // For now, just use a mock address
      const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      setWalletAddress(mockAddress);
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Dylets</span>
          </Link>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Log in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                register for a new account
              </Link>
            </p>
          </div>
          
          <div className="card p-8">
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 rounded-md p-4 text-sm">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="walletAddress" className="form-label">
                  Wallet Address
                </label>
                <div className="mt-1">
                  <input
                    id="walletAddress"
                    name="walletAddress"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    required
                    className="form-input"
                    placeholder="0x..."
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={connectWallet}
                  className="w-full flex justify-center items-center btn-outline py-2"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </button>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center btn-primary py-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    'Log in'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-gray-500 dark:text-gray-400">
                    For demo purposes
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    login('0x1234...5678');
                    navigate('/app');
                  }}
                  className="w-full flex justify-center btn-secondary py-2"
                >
                  Demo Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2024 Dylets Inc. All rights reserved. Powered by Base blockchain.
      </footer>
    </div>
  );
};

export default LoginPage;