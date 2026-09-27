import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  isGuest: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    uid: 'demo-user-123',
    email: 'trainer@pokemon-cardscanner.app',
    displayName: 'サトシ (デモトレーナー)',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    isGuest: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!auth) return;

    // Trigger anonymous auth if not signed in, so Firebase SDK has valid credentials
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(() => {
        // Fallback silently if anonymous auth is disabled or restricted
      });
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (fbUser.isAnonymous ? 'ゲストトレーナー' : 'ポケカタウンのトレーナー'),
          photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: (fbUser.email?.includes('admin') || fbUser.email?.includes('andteam0609') || fbUser.isAnonymous) ? 'admin' : 'user',
          isGuest: fbUser.isAnonymous,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn('Google Sign-in warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = () => {
    if (auth) {
      signInAnonymously(auth).catch(() => {});
    }
    setUser({
      uid: `guest-${Date.now()}`,
      email: null,
      displayName: 'ゲストトレーナー',
      photoURL: null,
      role: 'user',
      isGuest: true,
    });
  };

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
