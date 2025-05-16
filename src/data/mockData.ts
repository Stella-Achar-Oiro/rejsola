import { User, Loan, Cooler, ImpactMetrics, LoanApplication } from '../types/user';

export const mockUser: User = {
  id: 'user-1',
  name: 'Akinyi Otieno',
  walletAddress: '0x1234...5678',
  email: 'akinyi@example.com',
  phone: '+254712345678',
  location: 'Dunga Beach, Kisumu',
  businessType: 'Fish Trader',
  language: 'en',
  avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150',
  createdAt: '2024-05-01T12:00:00Z',
  kycVerified: true,
  creditScore: 85
};

export const mockLoanApplications: LoanApplication[] = [
  {
    id: 'app-1',
    userId: 'user-1',
    coolerType: 'RejSola Standard 50L',
    loanAmount: 350,
    termMonths: 12,
    weeklyPayment: 8.75,
    purpose: 'Preserve fresh tilapia and Nile perch',
    businessIncome: 120,
    status: 'approved',
    createdAt: '2024-05-05T09:30:00Z'
  },
  {
    id: 'app-2',
    userId: 'user-1',
    coolerType: 'RejSola Pro 80L',
    loanAmount: 450,
    termMonths: 18,
    weeklyPayment: 7.50,
    purpose: 'Expand business to nearby markets',
    businessIncome: 120,
    status: 'pending',
    createdAt: '2024-06-10T14:45:00Z'
  }
];

export const mockLoans: Loan[] = [
  {
    id: 'loan-1',
    userId: 'user-1',
    contractAddress: '0xabcd...1234',
    coolerSerialNumber: 'RS-50L-2024-001',
    coolerType: 'RejSola Standard 50L',
    principal: 350,
    termMonths: 12,
    interestRate: 12,
    weeklyPayment: 8.75,
    totalPaid: 105,
    remainingBalance: 245,
    nextPaymentDue: '2024-06-19T00:00:00Z',
    startDate: '2024-05-15T00:00:00Z',
    endDate: '2025-05-15T00:00:00Z',
    status: 'active',
    payments: [
      {
        id: 'payment-1',
        loanId: 'loan-1',
        amount: 8.75,
        timestamp: '2024-05-22T14:30:00Z',
        transactionHash: '0x9876...5432',
        status: 'completed'
      },
      {
        id: 'payment-2',
        loanId: 'loan-1',
        amount: 8.75,
        timestamp: '2024-05-29T15:10:00Z',
        transactionHash: '0x8765...4321',
        status: 'completed'
      },
      {
        id: 'payment-3',
        loanId: 'loan-1',
        amount: 8.75,
        timestamp: '2024-06-05T12:45:00Z',
        transactionHash: '0x7654...3210',
        status: 'completed'
      },
      {
        id: 'payment-4',
        loanId: 'loan-1',
        amount: 8.75,
        timestamp: '2024-06-12T10:30:00Z',
        transactionHash: '0x6543...2109',
        status: 'completed'
      }
    ]
  }
];

export const mockCoolers: Cooler[] = [
  {
    id: 'cooler-1',
    userId: 'user-1',
    loanId: 'loan-1',
    serialNumber: 'RS-50L-2024-001',
    model: 'RejSola Standard 50L',
    capacityLiters: 50,
    solarPanelWatts: 100,
    batteryCapacityAh: 60,
    purchaseDate: '2024-05-15T00:00:00Z',
    warrantyEnd: '2026-05-15T00:00:00Z',
    status: 'active',
    temperature: 2.5,
    batteryLevel: 85,
    lastUpdated: '2024-06-18T08:45:00Z',
    location: {
      latitude: -0.0917,
      longitude: 34.7680
    }
  }
];

export const mockDailyTemperatures = [
  { time: '00:00', temperature: 2.1 },
  { time: '02:00', temperature: 1.9 },
  { time: '04:00', temperature: 2.0 },
  { time: '06:00', temperature: 2.2 },
  { time: '08:00', temperature: 2.5 },
  { time: '10:00', temperature: 2.8 },
  { time: '12:00', temperature: 3.0 },
  { time: '14:00', temperature: 3.2 },
  { time: '16:00', temperature: 3.0 },
  { time: '18:00', temperature: 2.7 },
  { time: '20:00', temperature: 2.5 },
  { time: '22:00', temperature: 2.3 }
];

export const mockBatteryLevels = [
  { time: '00:00', level: 92 },
  { time: '02:00', level: 90 },
  { time: '04:00', level: 88 },
  { time: '06:00', level: 85 },
  { time: '08:00', level: 83 },
  { time: '10:00', level: 85 },
  { time: '12:00', level: 88 },
  { time: '14:00', level: 93 },
  { time: '16:00', level: 95 },
  { time: '18:00', level: 94 },
  { time: '20:00', level: 91 },
  { time: '22:00', level: 89 }
];

export const mockImpactMetrics: ImpactMetrics = {
  userId: 'user-1',
  totalSaved: 125,
  spoilageReduction: 34,
  co2Reduction: 58,
  incomeIncrease: 32,
  fishPreserved: 185,
  daily: [
    {
      date: '2024-06-12',
      fishPreserved: 12,
      temperature: 2.5,
      batteryLevel: 88,
      savings: 8
    },
    {
      date: '2024-06-13',
      fishPreserved: 15,
      temperature: 2.3,
      batteryLevel: 90,
      savings: 9
    },
    {
      date: '2024-06-14',
      fishPreserved: 10,
      temperature: 2.6,
      batteryLevel: 86,
      savings: 7
    },
    {
      date: '2024-06-15',
      fishPreserved: 16,
      temperature: 2.4,
      batteryLevel: 89,
      savings: 10
    },
    {
      date: '2024-06-16',
      fishPreserved: 14,
      temperature: 2.2,
      batteryLevel: 92,
      savings: 8
    },
    {
      date: '2024-06-17',
      fishPreserved: 13,
      temperature: 2.5,
      batteryLevel: 87,
      savings: 8
    },
    {
      date: '2024-06-18',
      fishPreserved: 15,
      temperature: 2.7,
      batteryLevel: 85,
      savings: 9
    }
  ],
  weekly: [
    {
      weekStart: '2024-05-19',
      weekEnd: '2024-05-25',
      fishPreserved: 85,
      averageTemperature: 2.4,
      savings: 50
    },
    {
      weekStart: '2024-05-26',
      weekEnd: '2024-06-01',
      fishPreserved: 90,
      averageTemperature: 2.3,
      savings: 54
    },
    {
      weekStart: '2024-06-02',
      weekEnd: '2024-06-08',
      fishPreserved: 88,
      averageTemperature: 2.5,
      savings: 52
    },
    {
      weekStart: '2024-06-09',
      weekEnd: '2024-06-15',
      fishPreserved: 95,
      averageTemperature: 2.4,
      savings: 57
    }
  ],
  monthly: [
    {
      month: 'May',
      year: 2024,
      fishPreserved: 175,
      spoilageReduction: 30,
      incomeIncrease: 25
    },
    {
      month: 'June',
      year: 2024,
      fishPreserved: 185,
      spoilageReduction: 34,
      incomeIncrease: 32
    }
  ]
};

export const mockCoolerModels = [
  {
    id: 'model-1',
    name: 'RejSola Standard 50L',
    capacity: 50,
    solarPanelWatts: 100,
    batteryCapacityAh: 60,
    fishCapacityKg: 20,
    price: 350,
    imageSrc: 'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg?auto=compress&cs=tinysrgb&w=300',
    features: [
      'Temperature range: 0-4°C',
      '24 hours operation without sun',
      'Fits up to 20kg of fish',
      'Basic temperature monitoring'
    ]
  },
  {
    id: 'model-2',
    name: 'RejSola Pro 80L',
    capacity: 80,
    solarPanelWatts: 120,
    batteryCapacityAh: 80,
    fishCapacityKg: 30,
    price: 450,
    imageSrc: 'https://images.pexels.com/photos/988952/pexels-photo-988952.jpeg?auto=compress&cs=tinysrgb&w=300',
    features: [
      'Temperature range: 0-4°C',
      '30 hours operation without sun',
      'Fits up to 30kg of fish',
      'Advanced IoT monitoring',
      'Real-time temperature alerts'
    ]
  },
  {
    id: 'model-3',
    name: 'RejSola Elite 100L',
    capacity: 100,
    solarPanelWatts: 150,
    batteryCapacityAh: 100,
    fishCapacityKg: 40,
    price: 550,
    imageSrc: 'https://images.pexels.com/photos/10869449/pexels-photo-10869449.jpeg?auto=compress&cs=tinysrgb&w=300',
    features: [
      'Temperature range: 0-4°C',
      '36 hours operation without sun',
      'Fits up to 40kg of fish',
      'Premium IoT monitoring system',
      'GPS tracking and security',
      'Multiple compartments with different temps'
    ]
  }
];

export const mockMarketplaceItems = [
  {
    id: 'item-1',
    name: 'Fresh Tilapia',
    seller: 'James Odhiambo',
    location: 'Dunga Beach',
    price: 3.50, // USD per kg
    quantity: 12, // kg
    postedDate: '2024-06-17T10:30:00Z',
    expiryDate: '2024-06-19T10:30:00Z',
    image: 'https://images.pexels.com/photos/4709080/pexels-photo-4709080.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'item-2',
    name: 'Nile Perch',
    seller: 'Mary Achieng',
    location: 'Usoma Beach',
    price: 5.20, // USD per kg
    quantity: 8, // kg
    postedDate: '2024-06-18T08:15:00Z',
    expiryDate: '2024-06-20T08:15:00Z',
    image: 'https://images.pexels.com/photos/8885024/pexels-photo-8885024.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'item-3',
    name: 'Silver Cyprinid (Omena)',
    seller: 'Elizabeth Wanjiku',
    location: 'Kendu Bay',
    price: 2.80, // USD per kg
    quantity: 15, // kg
    postedDate: '2024-06-17T14:45:00Z',
    expiryDate: '2024-06-19T14:45:00Z',
    image: 'https://images.pexels.com/photos/8108063/pexels-photo-8108063.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'luo', name: 'Luo' }
];

export const translations = {
  en: {
    dashboard: 'Dashboard',
    loans: 'My Loans',
    apply: 'Apply for Loan',
    coolers: 'My Coolers',
    impact: 'Impact',
    marketplace: 'Marketplace',
    profile: 'Profile',
    logout: 'Logout',
    language: 'Language',
    temperature: 'Temperature',
    battery: 'Battery',
    payment: 'Payment',
    dueDate: 'Due Date',
    status: 'Status',
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    welcome: 'Welcome',
    fishSaved: 'Fish Saved',
    moneySaved: 'Money Saved',
    co2Reduced: 'CO2 Reduced',
    nextPayment: 'Next Payment'
  },
  sw: {
    dashboard: 'Dashibodi',
    loans: 'Mikopo Yangu',
    apply: 'Omba Mkopo',
    coolers: 'Vifaa vya Baridi',
    impact: 'Athari',
    marketplace: 'Soko',
    profile: 'Wasifu',
    logout: 'Ondoka',
    language: 'Lugha',
    temperature: 'Joto',
    battery: 'Betri',
    payment: 'Malipo',
    dueDate: 'Tarehe ya Malipo',
    status: 'Hali',
    active: 'Inafanya Kazi',
    pending: 'Inasubiri',
    completed: 'Imekamilika',
    welcome: 'Karibu',
    fishSaved: 'Samaki Waliookokwa',
    moneySaved: 'Pesa Zilizookolewa',
    co2Reduced: 'CO2 Iliyopunguzwa',
    nextPayment: 'Malipo Yafuatayo'
  },
  luo: {
    dashboard: 'Dashboard',
    loans: 'Honde Maga',
    apply: 'Kwa Honde',
    coolers: 'Sanduke Maga',
    impact: 'Lokruok',
    marketplace: 'Chiro',
    profile: 'Nyinga',
    logout: 'Wuok',
    language: 'Dhok',
    temperature: 'Liet',
    battery: 'Bateri',
    payment: 'Chudo',
    dueDate: 'Tarik Mar Chudo',
    status: 'Ngima',
    active: 'Tiyo',
    pending: 'Rito',
    completed: 'Orumo',
    welcome: 'Orwaki',
    fishSaved: 'Rech Moreso',
    moneySaved: 'Pesa Moreso',
    co2Reduced: 'CO2 Modwoko',
    nextPayment: 'Chudo Machieng'
  }
};