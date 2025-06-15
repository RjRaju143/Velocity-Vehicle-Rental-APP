
'use client';

import type { User, Booking } from '@/lib/types';
import React, { createContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/actions/userActions';
import { addBookingDb, getBookingsDb } from '@/actions/bookingActions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'userId' | 'bookedAt'>) => Promise<Booking | { error: string} >;
  getBookings: () => Promise<Booking[] | {error: string}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_STORAGE_USER_KEY = 'user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize to true
  const router = useRouter();

  useEffect(() => {
    // This effect runs once on mount to check for a stored session
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      // Clear potentially corrupted data
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } finally {
      setIsLoading(false); // Initial auth check complete
    }
  }, []);


  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginUser(email, password);
      if ('error' in result) {
        throw new Error(result.error);
      }
      setUser(result);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(result));
      router.push('/');
    } catch (error) {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await registerUser(name, email, password);
      if ('error' in result) {
        throw new Error(result.error);
      }
      // Don't log in automatically, user should go to login page
      router.push('/login');
    } catch (error) {
      setUser(null); // Ensure no lingering user state
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY); // Clear any potential stale session
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    router.push('/login');
  }, [router]);

  const addBooking = useCallback(async (bookingData: Omit<Booking, 'id' | 'userId' | 'bookedAt'>): Promise<Booking | {error: string}> => {
    if (!user) {
      return { error: "User not authenticated. Cannot add booking." };
    }
    setIsLoading(true);
    try {
      const result = await addBookingDb({ ...bookingData, userId: user.id });
       if ('error' in result) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      console.error("AuthContext: Failed to add booking", error);
      return { error: error instanceof Error ? error.message : "Could not save your booking." };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getBookings = useCallback(async (): Promise<Booking[] | { error: string }> => {
    if (!user) {
      return [];
    }
    setIsLoading(true);
    try {
      const result = await getBookingsDb(user.id);
      if ('error' in result) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      console.error("AuthContext: Failed to retrieve bookings", error);
      return { error: error instanceof Error ? error.message : "Could not retrieve bookings." };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, addBooking, getBookings }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
