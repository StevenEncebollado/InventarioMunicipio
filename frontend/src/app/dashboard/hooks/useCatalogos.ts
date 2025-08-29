import { useState, useEffect } from 'react';
import {
  getDependencias,
  getDirecciones,
  getDispositivos,
  getEquipamientos,
  getTiposEquipo,
  getSistemasOperativos,
  getMarcas,
  getCaracteristicas,
  getRam,
  getDisco,
  getOffice,
  getTipoConexion,
  getProgramaAdicional,
  getErrorMessage
} from '@/services/api';

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

        console.log('Iniciando carga de catálogos...');
        
        const catalogosData: Partial<Catalogos> = {};
        
        try {
          console.log('Cargando dependencias...');
          catalogosData.dependencias = await getDependencias();
        } catch (err) {
          console.error('Error cargando dependencias:', err);
          catalogosData.dependencias = [];
        }

        try {
          console.log('Cargando direcciones...');
          catalogosData.direcciones = await getDirecciones();
        } catch (err) {
          console.error('Error cargando direcciones:', err);
          catalogosData.direcciones = [];
        }

        try {
          console.log('Cargando dispositivos...');
          catalogosData.dispositivos = await getDispositivos();
        } catch (err) {
          console.error('Error cargando dispositivos:', err);
          catalogosData.dispositivos = [];
        }

        try {
          console.log('Cargando equipamientos...');
          catalogosData.equipamientos = await getEquipamientos();
        } catch (err) {
          console.error('Error cargando equipamientos:', err);
          catalogosData.equipamientos = [];
        }

        try {
          console.log('Cargando tipos de equipo...');
          catalogosData.tiposEquipo = await getTiposEquipo();
        } catch (err) {
          console.error('Error cargando tipos de equipo:', err);
          catalogosData.tiposEquipo = [];
        }

        try {
          console.log('Cargando sistemas operativos...');
          catalogosData.sistemasOperativos = await getSistemasOperativos();
        } catch (err) {
          console.error('Error cargando sistemas operativos:', err);
          catalogosData.sistemasOperativos = [];
        }

        try {
          console.log('Cargando marcas...');
          catalogosData.marcas = await getMarcas();
        } catch (err) {
          console.error('Error cargando marcas:', err);
          catalogosData.marcas = [];
        }

        try {
          console.log('Cargando características...');
          catalogosData.caracteristicas = await getCaracteristicas();
        } catch (err) {
          console.error('Error cargando características:', err);
          catalogosData.caracteristicas = [];
        }

        try {
          console.log('Cargando RAM...');
          catalogosData.ram = await getRam();
        } catch (err) {
          console.error('Error cargando RAM:', err);
          catalogosData.ram = [];
        }

        try {
          console.log('Cargando disco...');
          catalogosData.disco = await getDisco();
        } catch (err) {
          console.error('Error cargando disco:', err);
          catalogosData.disco = [];
        }

        try {
          console.log('Cargando office...');
          catalogosData.office = await getOffice();
        } catch (err) {
          console.error('Error cargando office:', err);
          catalogosData.office = [];
        }

        try {
          console.log('Cargando tipo de conexión...');
          catalogosData.tipoConexion = await getTipoConexion();
        } catch (err) {
          console.error('Error cargando tipo de conexión:', err);
          catalogosData.tipoConexion = [];
        }


        try {
          console.log('Cargando programas adicionales...');
          catalogosData.programaAdicional = await getProgramaAdicional();
        } catch (err) {
          console.error('Error cargando programas adicionales:', err);
          catalogosData.programaAdicional = [];
        }

        setCatalogos({
          dependencias: catalogosData.dependencias || [],
          direcciones: catalogosData.direcciones || [],
          dispositivos: catalogosData.dispositivos || [],
          equipamientos: catalogosData.equipamientos || [],
          tiposEquipo: catalogosData.tiposEquipo || [],
          sistemasOperativos: catalogosData.sistemasOperativos || [],
          marcas: catalogosData.marcas || [],
          caracteristicas: catalogosData.caracteristicas || [],
          ram: catalogosData.ram || [],
          disco: catalogosData.disco || [],
          office: catalogosData.office || [],
          tipoConexion: catalogosData.tipoConexion || [],
          programaAdicional: catalogosData.programaAdicional || []
        });

        console.log('Catálogos cargados exitosamente');
        
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(`Error al cargar catálogos: ${errorMessage}`);
        console.error('Error general cargando catálogos:', err);
        
        // Establecer catálogos vacíos en caso de error general
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
