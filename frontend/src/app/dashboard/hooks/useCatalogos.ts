import { useState, useEffect } from 'react';
import { getCatalogosUnificados, getErrorMessage } from '@/services/api';

interface CaracteristicaItem {
  id: number;
  descripcion: string;
}

interface CatalogoItem {
  id: number;
  nombre: string;
}

interface RamItem {
  id: number;
  capacidad: string;
}

interface DiscoItem {
  id: number;
  capacidad: string;
}

interface OfficeItem {
  id: number;
  version: string;
}

interface Catalogos {
  dependencias: CatalogoItem[];
  direcciones: CatalogoItem[];
  dispositivos: CatalogoItem[];
  equipamientos: CatalogoItem[];
  tiposEquipo: CatalogoItem[];
  sistemasOperativos: CatalogoItem[];
  marcas: CatalogoItem[];
  caracteristicas: CaracteristicaItem[];
  ram: RamItem[];
  disco: DiscoItem[];
  office: OfficeItem[];
  tipoConexion: CatalogoItem[];
  programaAdicional: CatalogoItem[];
}

export function useCatalogos() {
  const [catalogos, setCatalogos] = useState<Catalogos>({
    dependencias: [],
    direcciones: [],
    dispositivos: [],
    equipamientos: [],
    tiposEquipo: [],
    sistemasOperativos: [],
    marcas: [],
    caracteristicas: [],
    ram: [],
    disco: [],
    office: [],
    tipoConexion: [],
    programaAdicional: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCatalogosUnificados();
        setCatalogos({
          dependencias: data.dependencias || [],
          direcciones: data.direcciones || [],
          dispositivos: data.dispositivos || [],
          equipamientos: data.equipamientos || [],
          tiposEquipo: data.tiposEquipo || [],
          sistemasOperativos: data.sistemasOperativos || [],
          marcas: data.marcas || [],
          caracteristicas: data.caracteristicas || [],
          ram: data.ram || [],
          disco: data.disco || [],
          office: data.office || [],
          tipoConexion: data.tipoConexion || [],
          programaAdicional: data.programaAdicional || []
        });
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(`Error al cargar catálogos: ${errorMessage}`);
        setCatalogos({
          dependencias: [],
          direcciones: [],
          dispositivos: [],
          equipamientos: [],
          tiposEquipo: [],
          sistemasOperativos: [],
          marcas: [],
          caracteristicas: [],
          ram: [],
          disco: [],
          office: [],
          tipoConexion: [],
          programaAdicional: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    cargarCatalogos();
  }, []);

  return { catalogos, isLoading, error };
}
