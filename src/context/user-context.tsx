'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface User {
  name: string;
  mobile: string;
  email: string;
  village: string;
  district: string;
  pincode: string;
  state: string;
  class: string;
  exam: string;
  profilePhotoUrl?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  updateUser: (newUser: Partial<User>) => void;
  isProfileDialogOpen: boolean;
  setProfileDialogOpen: (open: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser'); // Also clear admin session
    setUser(null);
    router.push('/login');
  };

  const updateUser = (newUser: Partial<User>) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...newUser } as User;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, isLoading, logout, updateUser, isProfileDialogOpen, setProfileDialogOpen }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
