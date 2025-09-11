// Hace que los catálogos estén disponibles para todo el dashboard 
// de forma sencilla y centralizada.

"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCatalogos as useCatalogosHook } from '../hooks/useCatalogos';
import { 
  addDependencia,
  addDireccion,
  addDispositivo,
  addEquipamiento,
  addTipoEquipo,
  addSistemaOperativo,
  addCaracteristica,
  addMarca,
  addRam,
  addDisco,
  addOffice,
  addTipoConexion,
  addProgramaAdicional,
  deleteDependencia,
  deleteDireccion,
  deleteDispositivo,
  deleteEquipamiento,
  deleteTipoEquipo,
  deleteSistemaOperativo,
  deleteCaracteristica,
  deleteMarca,
  deleteRam,
  deleteDisco,
  deleteOffice,
  deleteTipoConexion,
  deleteProgramaAdicional,
  updateDependencia,
  updateDireccion,
  updateDispositivo,
  updateEquipamiento,
  updateTipoEquipo,
  updateSistemaOperativo,
  updateCaracteristica,
  updateMarca,
  updateRam,
  updateDisco,
  updateOffice,
  updateTipoConexion,
  updateProgramaAdicional,
} from '../../../services/api';

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
      // Aquí deberías hacer la llamada a tu API
      // await updateCategoriaAPI(categoria, items);
      
      // Por ahora solo mostramos en consola
      alert(`Categoría ${categoria} actualizada correctamente`);
      
      // Refrescar catálogos después de la actualización
      await refreshCatalogos();
    } catch (err) {
      throw new Error(`Error al actualizar la categoría ${categoria}`);
    }
  };

  const addItemToCategoria = async (categoria: CategoriaType, item: any) => {
    try {
      // Llamadas reales a la API según la categoría
      switch (categoria) {
        case 'dependencias':
          await addDependencia({ nombre: item.nombre });
          break;
        case 'direcciones':
          await addDireccion({ nombre: item.nombre, dependencia_id: Number(item.dependencia_id) });
          await refreshCatalogos(); // Refresca catálogos tras agregar área
          break;
        case 'dispositivos':
          await addDispositivo({ nombre: item.nombre, campos: item.campos });
          break;
        case 'equipamientos':
          await addEquipamiento({ nombre: item.nombre });
          break;
        case 'tiposEquipo':
          await addTipoEquipo({ nombre: item.nombre });
          break;
        case 'tiposSistemaOperativo':
          await addSistemaOperativo({ nombre: item.nombre });
          break;
        case 'caracteristicas':
          await addCaracteristica({ descripcion: item.descripcion });
          break;
        case 'marcas':
          await addMarca({ nombre: item.nombre });
          break;
        case 'rams':
          await addRam({ capacidad: item.capacidad });
          break;
        case 'discos':
          await addDisco({ capacidad: item.capacidad });
          break;
        case 'offices':
          await addOffice({ version: item.version });
          break;
        case 'tiposConexion':
          await addTipoConexion({ nombre: item.nombre });
          break;
        case 'programasAdicionales':
          await addProgramaAdicional({ nombre: item.nombre });
          break;
        default:
          throw new Error(`Categoría ${categoria} no soportada`);
      }
      if (categoria !== 'direcciones') await refreshCatalogos();
    } catch (err) {
      throw new Error(`Error al agregar el item a ${categoria}`);
    }
  };

  const removeItemFromCategoria = async (categoria: CategoriaType, itemId: string | number) => {
    try {
      switch (categoria) {
        case 'dependencias':
          await deleteDependencia(Number(itemId));
          break;
        case 'direcciones':
          await deleteDireccion(Number(itemId));
          break;
        case 'dispositivos':
          await deleteDispositivo(Number(itemId));
          break;
        case 'equipamientos':
          await deleteEquipamiento(Number(itemId));
          break;
        case 'tiposEquipo':
          await deleteTipoEquipo(Number(itemId));
          break;
        case 'tiposSistemaOperativo':
          await deleteSistemaOperativo(Number(itemId));
          break;
        case 'caracteristicas':
          await deleteCaracteristica(Number(itemId));
          break;
        case 'marcas':
          await deleteMarca(Number(itemId));
          break;
        case 'rams':
          await deleteRam(Number(itemId));
          break;
        case 'discos':
          await deleteDisco(Number(itemId));
          break;
        case 'offices':
          await deleteOffice(Number(itemId));
          break;
        case 'tiposConexion':
          await deleteTipoConexion(Number(itemId));
          break;
        case 'programasAdicionales':
          await deleteProgramaAdicional(Number(itemId));
          break;
        default:
          throw new Error(`Eliminación no implementada para la categoría: ${categoria}`);
      }
      await refreshCatalogos();
    } catch (err) {
      throw new Error(`Error al eliminar el item de ${categoria}`);
    }
  };

  const editItemInCategoria = async (categoria: CategoriaType, itemId: string | number, newData: any) => {
    try {
      // Llamadas reales a la API según la categoría
      switch (categoria) {
        case 'dependencias':
          await updateDependencia(Number(itemId), newData);
          break;
        case 'direcciones':
          await updateDireccion(Number(itemId), newData);
          break;
        case 'dispositivos':
          await updateDispositivo(Number(itemId), newData);
          break;
        case 'equipamientos':
          await updateEquipamiento(Number(itemId), newData);
          break;
        case 'tiposEquipo':
          await updateTipoEquipo(Number(itemId), newData);
          break;
        case 'tiposSistemaOperativo':
          await updateSistemaOperativo(Number(itemId), newData);
          break;
        case 'caracteristicas':
          await updateCaracteristica(Number(itemId), newData);
          break;
        case 'marcas':
          await updateMarca(Number(itemId), newData);
          break;
        case 'rams':
          await updateRam(Number(itemId), newData);
          break;
        case 'discos':
          await updateDisco(Number(itemId), newData);
          break;
        case 'offices':
          await updateOffice(Number(itemId), newData);
          break;
        case 'tiposConexion':
          await updateTipoConexion(Number(itemId), newData);
          break;
        case 'programasAdicionales':
          await updateProgramaAdicional(Number(itemId), newData);
          break;
        default:
          throw new Error(`Edición no implementada para la categoría: ${categoria}`);
      }
      
      await refreshCatalogos();
    } catch (err) {
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
