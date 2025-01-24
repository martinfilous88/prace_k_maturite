import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Game } from '../types/game';
import { toast } from 'react-hot-toast';

interface UserProfile extends User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  age?: number;
  totalSpend: number;
  level: number;
  progress: number;
  ownedGames: Game[];
  wheelPrizes?: { 
    result?: { 
      type: string; 
      value: string; 
      description: string; 
    }; 
    remainingSpins: number; 
    lastSpinTimestamp?: number;
  };
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<UserProfile>) => void;
  updateProgress: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const defaultUser = {
    id: '',
    username: 'Uživatel',
    email: '',
    phone: '',
    age: 0,
    totalSpend: 0,
    level: 1,
    progress: 0,
    ownedGames: [],
    wheelPrizes: {
      remainingSpins: 0,
    },
  };

  async function signup(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  }

  async function login(email: string, password: string) {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.error) {
      throw result.error;
    }

    return result;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function register(username: string, email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    }, {
      data: {
        username,
      },
    });
    if (error) throw error;
  }

  function updateUser(userData: Partial<UserProfile>) {
    setCurrentUser(current => {
      if (!current) return null;
      return { ...current, ...userData };
    });
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ? {
        ...session.user,
        ...defaultUser,
      } : null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ? {
        ...session.user,
        ...defaultUser,
      } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProgress = () => {
    setCurrentUser(current => {
      if (!current) return null;
      
      const newProgress = current.progress + 10;
      if (newProgress >= 100) {
        return {
          ...current,
          level: (current.level || 1) + 1,
          progress: 0
        };
      }
      
      return {
        ...current,
        progress: newProgress
      };
    });
  };

  const isAdmin = () => {
    const adminEmails = [
      'admin@example.com',
      'martin@example.com',
      'game.admin@example.com',
      currentUser?.email
    ];

    const isAdminUser = currentUser && adminEmails.includes(currentUser.email);
    
    if (!isAdminUser) {
      console.warn('Pokus o přístup nepovoleným uživatelem:', currentUser?.email);
      toast.error('Nemáte oprávnění pro přístup do administrace');
    }

    return !!isAdminUser;
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    register,
    updateUser,
    updateProgress,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}