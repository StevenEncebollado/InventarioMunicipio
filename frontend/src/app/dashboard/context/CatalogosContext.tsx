// Hace que los catálogos estén disponibles para todo el dashboard 
// de forma sencilla y centralizada.

"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCatalogos as useCatalogosHook } from '../hooks/useCatalogos';

interface CatalogosContextProps {
  catalogos: ReturnType<typeof useCatalogosHook>["catalogos"];
  isLoading: boolean;
  error: string | null;
}

const CatalogosContext = createContext<CatalogosContextProps | undefined>(undefined);

export const CatalogosProvider = ({ children }: { children: ReactNode }) => {
  const { catalogos, isLoading, error } = useCatalogosHook();

  return (
    <CatalogosContext.Provider value={{ catalogos, isLoading, error }}>
      {children}
    </CatalogosContext.Provider>
  );
};

export function useCatalogosContext() {
  const context = useContext(CatalogosContext);
  if (!context) {
    throw new Error('useCatalogosContext debe usarse dentro de CatalogosProvider');
  }
  return context;
}
