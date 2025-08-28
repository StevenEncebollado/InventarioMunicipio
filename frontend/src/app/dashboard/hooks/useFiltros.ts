import { useState } from 'react';

export interface Filtros {
  dependencia?: string;
  direccion?: string;
  dispositivo?: string;
  equipamiento?: string;
  tipo_equipo?: string;
  tipo_sistema_operativo?: string;
  marca?: string;
  caracteristica?: string;
  ram?: string;
  disco?: string;
  office?: string;
  tipo_conexion?: string;
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
    dependencia: dependenciaSeleccionada || undefined,
    direccion: direccionSeleccionada || undefined,
    dispositivo: dispositivoSeleccionado || undefined,
    equipamiento: equipamientoSeleccionado || undefined,
    tipo_equipo: tipoEquipoSeleccionado || undefined,
    tipo_sistema_operativo: tipoSistemaOperativoSeleccionado || undefined,
    marca: marcaSeleccionada || undefined,
    caracteristica: caracteristicaSeleccionada || undefined,
    ram: ramSeleccionada || undefined,
    disco: discoSeleccionado || undefined,
    office: officeSeleccionado || undefined,
    tipo_conexion: tipoConexionSeleccionada || undefined,
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
