import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock database for user storage (replace with real backend later)
let USERS_DB: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
  },
];

// Password storage (in a real app, passwords would be hashed and stored securely)
const PASSWORDS_DB: Record<string, string> = {
  'demo@example.com': 'password123',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API request delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists and password matches
    const userExists = USERS_DB.find(u => u.email === email);
    if (userExists && PASSWORDS_DB[email] === password) {
      setUser(userExists);
      localStorage.setItem('user', JSON.stringify(userExists));
      toast.success('Logged in successfully!');
    } else {
      toast.error('Invalid email or password');
    }
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API request delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (USERS_DB.some(u => u.email === email)) {
      toast.error('User with this email already exists');
      setIsLoading(false);
      return;
    }

    // Create new user
    const newUser: User = {
      id: String(USERS_DB.length + 1),
      email,
      name,
    };

    // Update mock databases
    USERS_DB.push(newUser);
    PASSWORDS_DB[email] = password;

    // Log in the new user
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success('Account created successfully!');
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
