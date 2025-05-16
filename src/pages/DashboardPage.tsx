import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, DollarSign, Thermometer, Battery, Clock, Leaf, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import StatusBadge from '../components/ui/StatusBadge';
import { translations } from '../data/mockData';
import { useWeb3 } from '../contexts/Web3Context';
import { Loan } from '../contexts/Web3Context';

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const [web3State, web3Actions] = useWeb3();
  const currentLanguage = user?.language || 'en';
  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for cooler and impact metrics until IoT integration
  const activeCooler = {
    temperature: 2.5,
    batteryLevel: 85
  };
  
  const impactMetrics = {
    fishPreserved: 185,
    totalSaved: 125,
    co2Reduction: 58
  };
  
  // Load loans from blockchain
  useEffect(() => {
    const fetchLoans = async () => {
      if (!web3State.connected || !web3State.account) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Get loans from blockchain
        const userLoans = await web3Actions.getLoans();
        setLoans(userLoans);
        
        // Set active loan (most recent active loan)
        const activeLoans = userLoans.filter(loan => loan.status === 'Active');
        if (activeLoans.length > 0) {
          setActiveLoan(activeLoans[0]);
        }
      } catch (error: any) {
        console.error('Error fetching loans:', error);
        setError('Failed to load loan data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoans();
  }, [web3State.connected, web3State.account]);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(currentLanguage === 'en' ? 'en-US' : 'sw-KE', { 
      month: 'short', 
      day: 'numeric', 
      year: '2-digit' 
    }).format(date);
  };
  
  const calculateDaysUntilPayment = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysUntilPayment = activeLoan ? calculateDaysUntilPayment(activeLoan.nextPaymentDue) : 0;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.welcome}, {user?.name.split(' ')[0]}!
        </h1>
        <div className="mt-2 md:mt-0">
          <Link to="/app/apply" className="btn-primary">
            {t.apply}
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                  <Thermometer className="text-primary-600 dark:text-primary-400 h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.temperature}</p>
                  <p className="text-xl font-medium">{activeCooler.temperature}°C</p>
                </div>
              </div>
            </div>
            
            <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <Battery className="text-green-600 dark:text-green-400 h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.battery}</p>
                  <p className="text-xl font-medium">{activeCooler.batteryLevel}%</p>
                </div>
              </div>
            </div>
            
            <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <DollarSign className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.nextPayment}</p>
                  <p className="text-xl font-medium">
                    {activeLoan ? `$${activeLoan.weeklyPayment}` : '-'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                  <Clock className="text-yellow-600 dark:text-yellow-400 h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.dueDate}</p>
                  <p className="text-xl font-medium">
                    {activeLoan ? formatDate(activeLoan.nextPaymentDue) : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {activeLoan ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="text-xl font-medium text-white">Active Loan: {activeLoan.coolerType}</h3>
                        <p className="mt-1 text-sm text-primary-100">Borrower: {activeLoan.borrower.substring(0, 6)}...{activeLoan.borrower.substring(38)}</p>
                      </div>
                      <StatusBadge status={activeLoan.status.toLowerCase() as any} className="mt-2 sm:mt-0" />
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Principal</p>
                        <p className="text-xl font-medium">${activeLoan.principal}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Term</p>
                        <p className="text-xl font-medium">{activeLoan.termMonths} months</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Interest Rate</p>
                        <p className="text-xl font-medium">{activeLoan.interestRate}%</p>
                      </div>
                    </div>
                    
                    <div className="relative pt-4">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-primary-600">
                            Loan Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-primary-600">
                            {Math.round((activeLoan.totalPaid / activeLoan.principal) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100 dark:bg-primary-900">
                        <div 
                          style={{ width: `${(activeLoan.totalPaid / activeLoan.principal) * 100}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600"
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Payment Reminder</h3>
                          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                            <p>Next payment of ${activeLoan.weeklyPayment} due in {daysUntilPayment} days.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Link to="/app/loans" className="flex items-center text-primary-600 text-sm font-medium">
                        View loan details <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="card">
                  <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 p-4 sm:p-6">
                    <h3 className="text-xl font-medium text-white">Impact Metrics</h3>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                        <BarChart3 className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.fishSaved}</p>
                        <p className="text-xl font-medium">{impactMetrics.fishPreserved} kg</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                        <DollarSign className="text-green-600 dark:text-green-400 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.moneySaved}</p>
                        <p className="text-xl font-medium">${impactMetrics.totalSaved}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-accent-100 dark:bg-accent-900 p-3 rounded-full">
                        <Leaf className="text-accent-600 dark:text-accent-400 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.co2Reduced}</p>
                        <p className="text-xl font-medium">{impactMetrics.co2Reduction} kg</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Link to="/app/impact" className="flex items-center text-secondary-600 text-sm font-medium">
                        View all metrics <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md p-6 text-center">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">No Active Loans</h3>
              <p className="text-blue-700 dark:text-blue-400 mb-4">
                You don't have any active loans yet. Apply for a solar cooler loan to get started.
              </p>
              <Link to="/app/apply" className="btn-primary">
                Apply for a Loan
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;