import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { mockUser } from '../data/mockData';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (walletAddress: string) => void;
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

  const login = (walletAddress: string) => {
    // In a real app, we would authenticate with the blockchain
    // For now, use mock data
    const userWithAddress = {
      ...mockUser,
      walletAddress
    };
    
    setUser(userWithAddress);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithAddress));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
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