import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Sun, Moon, Wallet } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { login } = useUser();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    businessType: '',
    walletAddress: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.businessType || !formData.walletAddress) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      // In a real app, we would register the user with the blockchain
      // For now, just use the mock data
      login(formData.walletAddress);
      navigate('/app');
    } catch (err) {
      setError('Failed to register. Please try again.');
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
      setFormData(prev => ({ ...prev, walletAddress: mockAddress }));
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Please fill in all fields');
        return;
      }
    }
    setError('');
    setStep(prevStep => prevStep + 1);
  };
  
  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Log in
              </Link>
            </p>
          </div>
          
          <div className="card p-8">
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 rounded-md p-4 text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className={`flex-1 border-t-2 ${step >= 1 ? 'border-primary-500' : 'border-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                  1
                </div>
                <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-primary-500' : 'border-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                  2
                </div>
                <div className={`flex-1 border-t-2 ${step >= 3 ? 'border-primary-500' : 'border-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                  3
                </div>
                <div className="flex-1 border-t-2 border-gray-300"></div>
              </div>
              <div className="flex text-xs text-gray-500 mt-2 justify-between">
                <span>Personal Info</span>
                <span>Business Info</span>
                <span>Connect Wallet</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+254..."
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              
              {step === 2 && (
                <>
                  <div className="form-group">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Beach/Market Name, Kisumu"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="businessType" className="form-label">Business Type</label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="Fish Trader">Fish Trader</option>
                      <option value="Fish Processor">Fish Processor</option>
                      <option value="Fish Transporter">Fish Transporter</option>
                      <option value="Fisherman">Fisherman</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-outline"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              
              {step === 3 && (
                <>
                  <div className="form-group">
                    <label htmlFor="walletAddress" className="form-label">Wallet Address</label>
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0x..."
                      required
                    />
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
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-outline"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registering...
                        </>
                      ) : (
                        'Register'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
            
            {step === 3 && (
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
                    Demo Register
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2024 Dylets Inc. All rights reserved. Powered by Base blockchain.
      </footer>
    </div>
  );
};

export default RegisterPage;