export interface User {
  id: string;
  name: string;
  walletAddress: string;
  email: string;
  phone: string;
  location: string;
  businessType: string;
  language: string;
  avatar?: string;
  createdAt: string;
  kycVerified: boolean;
  creditScore: number;
}

export interface LoanApplication {
  id: string;
  userId: string;
  coolerType: string;
  loanAmount: number;
  termMonths: number;
  weeklyPayment: number;
  purpose: string;
  businessIncome: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  contractAddress: string;
  coolerSerialNumber?: string;
  coolerType: string;
  principal: number;
  termMonths: number;
  interestRate: number;
  weeklyPayment: number;
  totalPaid: number;
  remainingBalance: number;
  nextPaymentDue: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paid' | 'defaulted' | 'pending';
  payments: Payment[];
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  timestamp: string;
  transactionHash: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Cooler {
  id: string;
  userId: string;
  loanId: string;
  serialNumber: string;
  model: string;
  capacityLiters: number;
  solarPanelWatts: number;
  batteryCapacityAh: number;
  purchaseDate: string;
  warrantyEnd: string;
  status: 'active' | 'maintenance' | 'inactive';
  temperature: number;
  batteryLevel: number;
  lastUpdated: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ImpactMetrics {
  userId: string;
  totalSaved: number;
  spoilageReduction: number;
  co2Reduction: number;
  incomeIncrease: number;
  fishPreserved: number;
  daily: DailyMetric[];
  weekly: WeeklyMetric[];
  monthly: MonthlyMetric[];
}

export interface DailyMetric {
  date: string;
  fishPreserved: number;
  temperature: number;
  batteryLevel: number;
  savings: number;
}

export interface WeeklyMetric {
  weekStart: string;
  weekEnd: string;
  fishPreserved: number;
  averageTemperature: number;
  savings: number;
}

export interface MonthlyMetric {
  month: string;
  year: number;
  fishPreserved: number;
  spoilageReduction: number;
  incomeIncrease: number;
}