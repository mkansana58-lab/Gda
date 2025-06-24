'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);
  
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const updateUser = (newUser: Partial<User>) => {
    if (user) {
        const updatedUser = { ...user, ...newUser };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
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
