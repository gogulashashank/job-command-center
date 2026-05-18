"use client";

import { createContext, useContext } from 'react';
import { useJCCData } from '@/lib/store';

const JccContext = createContext(null);

export function JccProvider({ children }) {
  const store = useJCCData();

  return (
    <JccContext.Provider value={store}>
      {children}
    </JccContext.Provider>
  );
}

export function useJcc() {
  return useContext(JccContext);
}
