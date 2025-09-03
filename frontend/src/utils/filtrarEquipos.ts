// utils/filtrarEquipos.ts
import type { Equipo } from '@/types';

export interface FiltrosEquipos {
  dependenciaSeleccionada?: string;
  direccionSeleccionada?: string;
  dispositivoSeleccionado?: string;
  equipamientoSeleccionado?: string;
  tipoEquipoSeleccionado?: string;
  tipoSistemaOperativoSeleccionado?: string;
  marcaSeleccionada?: string;
  caracteristicaSeleccionada?: string;
  ramSeleccionada?: string;
  discoSeleccionado?: string;
  officeSeleccionado?: string;
  tipoConexionSeleccionada?: string;
  programaAdicionalSeleccionado?: string[];
  estado?: 'Activo' | 'Mantenimiento' | 'Inactivo' | '';
}

export function filtrarEquipos(equipos: Equipo[], filtros: FiltrosEquipos): Equipo[] {
  let resultado = [...equipos];
  if (filtros.dependenciaSeleccionada) resultado = resultado.filter(e => String(e.dependencia_id) === filtros.dependenciaSeleccionada);
  if (filtros.direccionSeleccionada) resultado = resultado.filter(e => String(e.direccion_area_id) === filtros.direccionSeleccionada);
  if (filtros.dispositivoSeleccionado) resultado = resultado.filter(e => String(e.dispositivo_id) === filtros.dispositivoSeleccionado);
  if (filtros.equipamientoSeleccionado) resultado = resultado.filter(e => String(e.equipamiento_id) === filtros.equipamientoSeleccionado);
  if (filtros.tipoEquipoSeleccionado) resultado = resultado.filter(e => String(e.tipo_equipo_id) === filtros.tipoEquipoSeleccionado);
  if (filtros.tipoSistemaOperativoSeleccionado) resultado = resultado.filter(e => String(e.tipo_sistema_operativo_id) === filtros.tipoSistemaOperativoSeleccionado);
  if (filtros.marcaSeleccionada) resultado = resultado.filter(e => String(e.marca_id) === filtros.marcaSeleccionada);
  if (filtros.caracteristicaSeleccionada) resultado = resultado.filter(e => String(e.caracteristicas_id) === filtros.caracteristicaSeleccionada);
  if (filtros.ramSeleccionada) resultado = resultado.filter(e => String(e.ram_id) === filtros.ramSeleccionada);
  if (filtros.discoSeleccionado) resultado = resultado.filter(e => String(e.disco_id) === filtros.discoSeleccionado);
  if (filtros.officeSeleccionado) resultado = resultado.filter(e => String(e.office_id) === filtros.officeSeleccionado);
  if (filtros.tipoConexionSeleccionada) resultado = resultado.filter(e => String(e.tipo_conexion_id) === filtros.tipoConexionSeleccionada);
  if (filtros.programaAdicionalSeleccionado && filtros.programaAdicionalSeleccionado.length > 0) {
    resultado = resultado.filter(e => filtros.programaAdicionalSeleccionado!.every(p => e.programa_adicional_ids?.includes(Number(p))));
  }
  if (filtros.estado) resultado = resultado.filter(e => e.estado === filtros.estado);
  return resultado;
}
