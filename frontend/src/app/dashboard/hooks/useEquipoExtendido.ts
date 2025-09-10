import { useMemo } from 'react';
import { useCatalogos } from '../hooks/useCatalogos';
import type { Equipo, EquipoExtendido } from '@/types';

export function useEquipoExtendido(equipo: Equipo): EquipoExtendido {
  const { catalogos } = useCatalogos();

  const equipoExtendido = useMemo((): EquipoExtendido => {
    if (!equipo) return equipo as EquipoExtendido;

    // Buscar nombres en los catálogos
    const dependencia = catalogos.dependencias.find(d => d.id === equipo.dependencia_id);
    const direccionArea = catalogos.direcciones.find(d => d.id === equipo.direccion_area_id);
    const dispositivo = catalogos.dispositivos.find(d => d.id === equipo.dispositivo_id);
    const equipamiento = catalogos.equipamientos.find(e => e.id === equipo.equipamiento_id);
    const tipoEquipo = catalogos.tiposEquipo.find(t => t.id === equipo.tipo_equipo_id);
    const sistemaOperativo = catalogos.sistemasOperativos.find(s => s.id === equipo.tipo_sistema_operativo_id);
    const marca = catalogos.marcas.find(m => m.id === equipo.marca_id);
    const caracteristica = catalogos.caracteristicas.find(c => c.id === equipo.caracteristicas_id);
    const ram = catalogos.ram.find(r => r.id === equipo.ram_id);
    const disco = catalogos.disco.find(d => d.id === equipo.disco_id);
    const office = catalogos.office.find(o => o.id === equipo.office_id);
    const tipoConexion = catalogos.tipoConexion.find(t => t.id === equipo.tipo_conexion_id);
    
    // Buscar programas adicionales
    const programasAdicionales = equipo.programa_adicional_ids 
      ? equipo.programa_adicional_ids
          .map(id => catalogos.programaAdicional.find(p => p.id === id)?.nombre)
          .filter(Boolean) as string[]
      : [];

    return {
      ...equipo,
      dependencia_nombre: dependencia?.nombre,
      direccion_area_nombre: direccionArea?.nombre,
      dispositivo_nombre: dispositivo?.nombre,
      equipamiento_nombre: equipamiento?.nombre,
      tipo_equipo_nombre: tipoEquipo?.nombre,
      tipo_sistema_operativo_nombre: sistemaOperativo?.nombre,
      marca_nombre: marca?.nombre,
      caracteristicas_descripcion: caracteristica?.descripcion,
      ram_capacidad: ram?.capacidad,
      disco_capacidad: disco?.capacidad,
      office_version: office?.version,
      tipo_conexion_nombre: tipoConexion?.nombre,
      programas_adicionales_nombres: programasAdicionales,
    };
  }, [equipo, catalogos]);

  return equipoExtendido;
}
