// Gestiona el estado de los filtros aplicados en la búsqueda/listado de equipos.

import { useState } from 'react';

export interface Filtros {
  dependencia_id?: string;
  direccion_area_id?: string;
  dispositivo_id?: string;
  equipamiento_id?: string;
  tipo_equipo_id?: string;
  tipo_sistema_operativo_id?: string;
  marca_id?: string;
  caracteristicas_id?: string;
  ram_id?: string;
  disco_id?: string;
  office_id?: string;
  tipo_conexion_id?: string;
  programa_adicional?: string;
}

export function useFiltros() {
  const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState("");
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState("");
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState("");
  const [tipoEquipoSeleccionado, setTipoEquipoSeleccionado] = useState("");
  const [tipoSistemaOperativoSeleccionado, setTipoSistemaOperativoSeleccionado] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [caracteristicaSeleccionada, setCaracteristicaSeleccionada] = useState("");
  const [ramSeleccionada, setRamSeleccionada] = useState("");
  const [discoSeleccionado, setDiscoSeleccionado] = useState("");
  const [officeSeleccionado, setOfficeSeleccionado] = useState("");
  const [tipoConexionSeleccionada, setTipoConexionSeleccionada] = useState("");
  const [programaAdicionalSeleccionado, setProgramaAdicionalSeleccionado] = useState<string[]>([]);

  const getFiltros = (): Filtros => ({
    dependencia_id: dependenciaSeleccionada || undefined,
    direccion_area_id: direccionSeleccionada || undefined,
    dispositivo_id: dispositivoSeleccionado || undefined,
    equipamiento_id: equipamientoSeleccionado || undefined,
    tipo_equipo_id: tipoEquipoSeleccionado || undefined,
    tipo_sistema_operativo_id: tipoSistemaOperativoSeleccionado || undefined,
    marca_id: marcaSeleccionada || undefined,
    caracteristicas_id: caracteristicaSeleccionada || undefined,
    ram_id: ramSeleccionada || undefined,
    disco_id: discoSeleccionado || undefined,
    office_id: officeSeleccionado || undefined,
    tipo_conexion_id: tipoConexionSeleccionada || undefined,
    programa_adicional: programaAdicionalSeleccionado.length > 0 ? programaAdicionalSeleccionado.join(',') : undefined
  });

  return {
    // Estados de los filtros
    dependenciaSeleccionada, setDependenciaSeleccionada,
    direccionSeleccionada, setDireccionSeleccionada,
    dispositivoSeleccionado, setDispositivoSeleccionado,
    equipamientoSeleccionado, setEquipamientoSeleccionado,
    tipoEquipoSeleccionado, setTipoEquipoSeleccionado,
    tipoSistemaOperativoSeleccionado, setTipoSistemaOperativoSeleccionado,
    marcaSeleccionada, setMarcaSeleccionada,
    caracteristicaSeleccionada, setCaracteristicaSeleccionada,
    ramSeleccionada, setRamSeleccionada,
    discoSeleccionado, setDiscoSeleccionado,
    officeSeleccionado, setOfficeSeleccionado,
    tipoConexionSeleccionada, setTipoConexionSeleccionada,
    programaAdicionalSeleccionado, setProgramaAdicionalSeleccionado,
    // Función para obtener filtros
    getFiltros
  };
}
