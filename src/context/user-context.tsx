
'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { getAuth, onAuthStateChanged, signInAnonymously, User as FirebaseUser } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

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
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  logout: () => void;
  updateUser: (newUser: Partial<User>) => void;
  isProfileDialogOpen: boolean;
  setProfileDialogOpen: (open: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    // Check for user data in localStorage first for faster UI updates
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
    }

    // Then, handle Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // User is signed in.
        setFirebaseUser(fbUser);
        const userDocRef = doc(db, 'students', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        // If doc doesn't exist, it will be created on login/profile update
      } else {
        // User is signed out.
        setUser(null);
        setFirebaseUser(null);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);
  
  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser'); // Also clear admin session
    setUser(null);
    setFirebaseUser(null);
    router.push('/login');
  };

  const updateUser = async (newUser: Partial<User>) => {
    if (!firebaseUser) return;

    const updatedUser = { ...user, ...newUser } as User;
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Save to Firestore
    const userDocRef = doc(db, 'students', firebaseUser.uid);
    await setDoc(userDocRef, updatedUser, { merge: true });
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, firebaseUser, isLoading, logout, updateUser, isProfileDialogOpen, setProfileDialogOpen }}>
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
