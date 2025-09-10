// Hace que los catálogos estén disponibles para todo el dashboard 
// de forma sencilla y centralizada.

"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCatalogos as useCatalogosHook } from '../hooks/useCatalogos';

// Tipo para las categorías disponibles
export type CategoriaType = 
  | 'dependencias' 
  | 'direcciones' 
  | 'dispositivos' 
  | 'equipamientos' 
  | 'tiposEquipo' 
  | 'tiposSistemaOperativo' 
  | 'caracteristicas' 
  | 'marcas' 
  | 'rams' 
  | 'discos' 
  | 'offices' 
  | 'tiposConexion' 
  | 'programasAdicionales';

interface CatalogosContextProps {
  catalogos: ReturnType<typeof useCatalogosHook>["catalogos"];
  isLoading: boolean;
  error: string | null;
  // Nuevas funciones para modificar categorías
  updateCategoria: (categoria: CategoriaType, items: any[]) => Promise<void>;
  addItemToCategoria: (categoria: CategoriaType, item: any) => Promise<void>;
  removeItemFromCategoria: (categoria: CategoriaType, itemId: string | number) => Promise<void>;
  editItemInCategoria: (categoria: CategoriaType, itemId: string | number, newData: any) => Promise<void>;
  refreshCatalogos: () => Promise<void>;
}

const CatalogosContext = createContext<CatalogosContextProps | undefined>(undefined);

export const CatalogosProvider = ({ children }: { children: ReactNode }) => {
  const { catalogos, isLoading, error, refreshCatalogos } = useCatalogosHook();

  // Funciones para modificar categorías (aquí deberás implementar las llamadas a tu API)
  const updateCategoria = async (categoria: CategoriaType, items: any[]) => {
    try {
      console.log(`Actualizando categoría ${categoria}:`, items);
      // Aquí deberías hacer la llamada a tu API
      // await updateCategoriaAPI(categoria, items);
      
      // Por ahora solo mostramos en consola
      alert(`Categoría ${categoria} actualizada correctamente`);
      
      // Refrescar catálogos después de la actualización
      await refreshCatalogos();
    } catch (err) {
      console.error(`Error al actualizar categoría ${categoria}:`, err);
      throw new Error(`Error al actualizar la categoría ${categoria}`);
    }
  };

  const addItemToCategoria = async (categoria: CategoriaType, item: any) => {
    try {
      console.log(`Agregando item a ${categoria}:`, item);
      // Aquí deberías hacer la llamada a tu API
      // await addItemToCategoriaAPI(categoria, item);
      
      alert(`Item agregado a ${categoria} correctamente`);
      await refreshCatalogos();
    } catch (err) {
      console.error(`Error al agregar item a ${categoria}:`, err);
      throw new Error(`Error al agregar el item a ${categoria}`);
    }
  };

  const removeItemFromCategoria = async (categoria: CategoriaType, itemId: string | number) => {
    try {
      console.log(`Eliminando item ${itemId} de ${categoria}`);
      // Aquí deberías hacer la llamada a tu API
      // await removeItemFromCategoriaAPI(categoria, itemId);
      
      alert(`Item eliminado de ${categoria} correctamente`);
      await refreshCatalogos();
    } catch (err) {
      console.error(`Error al eliminar item de ${categoria}:`, err);
      throw new Error(`Error al eliminar el item de ${categoria}`);
    }
  };

  const editItemInCategoria = async (categoria: CategoriaType, itemId: string | number, newData: any) => {
    try {
      console.log(`Editando item ${itemId} en ${categoria}:`, newData);
      // Aquí deberías hacer la llamada a tu API
      // await editItemInCategoriaAPI(categoria, itemId, newData);
      
      alert(`Item editado en ${categoria} correctamente`);
      await refreshCatalogos();
    } catch (err) {
      console.error(`Error al editar item en ${categoria}:`, err);
      throw new Error(`Error al editar el item en ${categoria}`);
    }
  };

  return (
    <CatalogosContext.Provider value={{ 
      catalogos, 
      isLoading, 
      error,
      updateCategoria,
      addItemToCategoria,
      removeItemFromCategoria,
      editItemInCategoria,
      refreshCatalogos
    }}>
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
