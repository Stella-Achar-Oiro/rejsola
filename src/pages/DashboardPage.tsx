import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, DollarSign, Thermometer, Battery, Clock, Leaf } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import StatusBadge from '../components/ui/StatusBadge';
import { mockLoans, mockCoolers, mockImpactMetrics, translations } from '../data/mockData';

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const currentLanguage = user?.language || 'en';
  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  
  const activeLoan = mockLoans[0];
  const activeCooler = mockCoolers[0];
  const impactMetrics = mockImpactMetrics;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(currentLanguage === 'en' ? 'en-US' : 'sw-KE', { 
      month: 'short', 
      day: 'numeric', 
      year: '2-digit' 
    }).format(date);
  };
  
  const calculateDaysUntilPayment = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysUntilPayment = calculateDaysUntilPayment(activeLoan.nextPaymentDue);
  
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
              <p className="text-xl font-medium">${activeLoan.weeklyPayment}</p>
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
              <p className="text-xl font-medium">{formatDate(activeLoan.nextPaymentDue)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-xl font-medium text-white">Active Loan: {activeLoan.coolerType}</h3>
                  <p className="mt-1 text-sm text-primary-100">Contract: {activeLoan.contractAddress}</p>
                </div>
                <StatusBadge status={activeLoan.status} className="mt-2 sm:mt-0" />
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
    </div>
  );
};

export default DashboardPage;