// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut }             from 'firebase/auth';
import { ref, get }                                from 'firebase/database';
import { auth, db }                                from '../firebase/config';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [role, setRole]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await get(ref(db, `usuarios/${u.uid}`));
          setRole(snap.exists() ? snap.val().rol : null);
        } catch (e) {
          console.error('Error obteniendo rol:', e);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  if (loading) return null; // o un Splash

  return (
    <AuthContext.Provider value={{ user, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
