import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Game } from '../types/game';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  total_spend: number;
  level: number;
  progress: number;
  owned_games: string[];
  wheel_prizes: string[];
  totalSpend: number;
  ownedGames: string[];
  app_metadata: any;
  user_metadata: any;
  aud: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<UserProfile>) => void;
  updateProgress: () => void;
  updateUserLevel: (orderAmount: number) => void;
  isAdmin: () => boolean;
  fetchUserProfile: (userId: string) => Promise<any>;
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

  async function signup(email: string, password: string, username: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('Chyba při registraci:', error.message);
        return null;
      }
      
      
      // Pokud se uživatel úspěšně zaregistroval, vytvoříme profil

      // Pokud se uživatel úspěšně zaregistroval, vytvoříme profil
      if (data.user) {
        // Vytvoření profilu uživatele
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, email, username }])
          .single();

        if (profileError) {
          console.error('Chyba při vytváření profilu:', profileError.message);
          return null;
        }

        console.log('Profil úspěšně vytvořen:', profile);
        return data.user;
      }
    } catch (error) {
      console.error('Chyba při registraci:', error);
      return null;
    }
  };

  async function login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        let userProfile = await fetchUserProfile(data.user.id);
        if (!userProfile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              email: data.user.email,
              username: email.split('@')[0],
              created_at: new Date().toISOString()
            }]);

          if (profileError) {
            return;
          }
          userProfile = await fetchUserProfile(data.user.id);
        }

        if (userProfile) {
          setCurrentUser({
            ...userProfile,
            totalSpend: userProfile.total_spend,
            ownedGames: userProfile.owned_games,
            app_metadata: data.user.app_metadata,
            user_metadata: data.user.user_metadata,
            aud: data.user.aud
          });
        } else {
          console.error('Profil uživatele nebyl nalezen pro ID:', data.user.id);
        }
        setLoading(false);
        toast.success('Přihlášení úspěšné');
      }
    } catch (error) {
      console.error('Chyba při přihlašování:', error);
    }
  };

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function register(username: string, email: string, password: string) {
    // Check if user exists
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email')
      .eq('email', email)
      .single();

    if (data) {
      throw new Error('Uživatel s tímto emailem již existuje');
    }

    // Create auth user
    const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          email,
          total_spend: 0,
          level: 1,
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    });

    if (signUpError) throw signUpError;

    // Create profile
    if (signUpData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: signUpData.user.id,
          username,
          email,
          total_spend: 0,
          level: 1,
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Manually set session after registration
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        setCurrentUser({
          id: signUpData.user.id,
          username,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_spend: 0,
          level: 1,
          progress: 0,
          owned_games: [],
          wheel_prizes: [],
          totalSpend: 0,
          ownedGames: [],
          app_metadata: signUpData.user.app_metadata,
          user_metadata: signUpData.user.user_metadata,
          aud: signUpData.user.aud
        });
      } else {
        // If session isn't set, manually trigger login
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) throw loginError;

        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setCurrentUser({
            id: signUpData.user.id,
            username,
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            total_spend: 0,
            level: 1,
            progress: 0,
            owned_games: [],
            wheel_prizes: [],
            totalSpend: 0,
            ownedGames: [],
            app_metadata: signUpData.user.app_metadata,
            user_metadata: signUpData.user.user_metadata,
            aud: signUpData.user.aud
          });
        }
      }
    }
  }

  const updateUser = async (userData: Partial<UserProfile>) => {
    if (!currentUser) {
      console.error('Nelze aktualizovat uživatele, protože není přihlášen');
      return;
    }

    try {
      // Převedeme data na formát pro Supabase
      const supabaseData: any = {
        updated_at: new Date().toISOString()
      };

      // Mapování klíčů z camelCase na snake_case
      if (userData.username !== undefined) supabaseData.username = userData.username;
      if (userData.email !== undefined) supabaseData.email = userData.email;
      if (userData.totalSpend !== undefined) supabaseData.total_spend = userData.totalSpend;
      if (userData.level !== undefined) supabaseData.level = userData.level;
      if (userData.progress !== undefined) supabaseData.progress = userData.progress;
      if (userData.ownedGames !== undefined) supabaseData.owned_games = userData.ownedGames;

      // Aktualizujeme data v Supabase
      const { error } = await supabase
        .from('profiles')
        .update(supabaseData)
        .eq('id', currentUser.id);

      if (error) {
        console.error('Chyba při aktualizaci profilu:', error);
        toast.error('Nepodařilo se aktualizovat profil');
        return;
      }

      // Aktualizujeme lokální stav
      setCurrentUser({
        ...currentUser,
        ...userData
      });

      toast.success('Profil byl úspěšně aktualizován');
    } catch (error) {
      console.error('Nezachycená chyba při aktualizaci profilu:', error);
      toast.error('Došlo k chybě při aktualizaci profilu');
    }
  };

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

  // Funkce pro aktualizaci úrovně uživatele podle celkové hodnoty objednávek
  const updateUserLevel = async (orderAmount: number) => {
    if (!currentUser) return;
    
    try {
      // Aktualizujeme totalSpend
      const newTotalSpend = (currentUser.totalSpend || 0) + orderAmount;
      
      // Vypočítáme novou úroveň podle celkové útraty
      // Každých 1000 Kč = nová úroveň
      const newLevel = Math.floor(newTotalSpend / 1000) + 1;
      const progress = ((newTotalSpend % 1000) / 1000) * 100;
      
      // Aktualizujeme data v paměti a v databázi
      await updateUser({
        totalSpend: newTotalSpend,
        level: newLevel,
        progress: progress
      });
      
      if (newLevel > (currentUser.level || 1)) {
        toast.success(`Gratulujeme! Dosáhli jste nové úrovně: ${newLevel}`);
      }
    } catch (error) {
      console.error('Chyba při aktualizaci úrovně uživatele:', error);
    }
  };

  async function fetchUserProfile(userId: string) {
    try {
      console.log('Hledám profil pro uživatele s ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, created_at, updated_at, total_spend, level, progress, owned_games, wheel_prizes')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Chyba při načítání profilu:', error.message);
        return null;
      }

      if (!data) {
        console.log('Profil pro uživatele s ID nebyl nalezen, vytvářím nový profil:', userId);
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            username: 'Neznámý uživatel',
            email: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            total_spend: 0,
            level: 1,
            progress: 0,
            owned_games: [],
            wheel_prizes: []
          }])
          .single();

        if (profileError) {
          console.error('Chyba při vytváření profilu:', profileError.message);
          return null;
        }

        return newProfile;
      }

      console.log('Načtený profil:', data);
      return data;
    } catch (error) {
      console.error('Chyba při načítání profilu:', error);
      return null;
    }
  };

  async function handleSessionChange(session: Session | null) {
    if (session) {
      console.log('Aktuální session:', session);
      const user = await fetchUserProfile(session.user.id);
      if (user) {
        console.log('Profil uživatele načten:', user);
        setCurrentUser({
          ...user,
          totalSpend: user.total_spend,
          ownedGames: user.owned_games,
          app_metadata: session.user.app_metadata,
          user_metadata: session.user.user_metadata,
          aud: session.user.aud
        });
      } else {
        console.error('Profil uživatele nebyl nalezen pro ID:', session.user.id);
      }
    } else {
      console.log('Session byla ukončena');
      setCurrentUser(null);
    }
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
    updateUserLevel,
    isAdmin,
    fetchUserProfile
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id).then(userProfile => {
          if (userProfile) {
            setCurrentUser({
              ...userProfile,
              totalSpend: userProfile.total_spend,
              ownedGames: userProfile.owned_games,
              app_metadata: session.user.app_metadata,
              user_metadata: session.user.user_metadata,
              aud: session.user.aud
            });
          } else {
            console.error('Profil uživatele nebyl nalezen pro ID:', session.user.id);
          }
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleSessionChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}