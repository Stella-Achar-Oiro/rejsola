import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (walletAddress: string) => Promise<void>;
  logout: () => void;
  setUserLanguage: (language: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (walletAddress: string) => {
    try {
      // Create a basic user object with the wallet address
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: `User ${walletAddress.substring(0, 6)}`,
        walletAddress: walletAddress,
        email: '',
        phone: '',
        location: '',
        businessType: 'Fish Trader',
        language: 'en',
        createdAt: new Date().toISOString(),
        kycVerified: false,
        creditScore: 0
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  const setUserLanguage = (language: string) => {
    if (user) {
      const updatedUser = { ...user, language };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, setUserLanguage }}>
      {children}
    </UserContext.Provider>
  );
};