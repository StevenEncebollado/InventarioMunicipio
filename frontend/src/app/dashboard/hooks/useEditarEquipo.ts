//Este hook gestiona el estado y la lógica de un formulario para editar un equipo.

import { useState, useEffect } from 'react';
import type { Equipo } from '@/types';

export function useEditarEquipo(equipoId: string, usuarioId?: number) {
  // Campos de texto
  const [ip, setIp] = useState("");
  const [mac, setMac] = useState("");
  const [nombrePc, setNombrePc] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [anydesk, setAnydesk] = useState("");
  
  // Campos select
  const [tipoEquipo, setTipoEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [ram, setRam] = useState("");
  const [disco, setDisco] = useState("");
  const [office, setOffice] = useState("");
  const [tipoConexion, setTipoConexion] = useState("");
  const [programaAdicional, setProgramaAdicional] = useState<number[]>([]);
  const [dependencia, setDependencia] = useState("");
  const [direccion, setDireccion] = useState("");
  const [equipamiento, setEquipamiento] = useState("");
  const [caracteristica, setCaracteristica] = useState("");
  const [sistemaOperativo, setSistemaOperativo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  
  // Estado del equipo
  const [estado, setEstado] = useState("");

  // Estados de validación y carga
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [loadingEquipo, setLoadingEquipo] = useState(true);
  const [equipo, setEquipo] = useState<Equipo | null>(null);

  // Cargar datos del equipo
  useEffect(() => {
    const cargarEquipo = async () => {
      if (!equipoId) {
        setEditError("ID de equipo no válido");
        setLoadingEquipo(false);
        return;
      }
      
      try {
        setLoadingEquipo(true);
        setEditError(""); // Limpiar errores previos
        
        const response = await fetch(`http://localhost:5000/inventario/inventario/${equipoId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Equipo no encontrado');
          } else {
            throw new Error(`Error del servidor: ${response.status}`);
          }
        }
        
        const equipoData = await response.json();
        setEquipo(equipoData);
        
        // Llenar los campos con los datos existentes (con valores por defecto seguros)
        setIp(equipoData.direccion_ip || "");
        setMac(equipoData.direccion_mac || "");
        setNombrePc(equipoData.nombre_pc || "");
        setFuncionario(equipoData.nombres_funcionario || "");
        setAnydesk(equipoData.anydesk || "");
        setTipoEquipo(equipoData.dispositivo_id?.toString() || equipoData.tipo_equipo_id?.toString() || "");
        setMarca(equipoData.marca_id?.toString() || "");
        setRam(equipoData.ram_id?.toString() || "");
        setDisco(equipoData.disco_id?.toString() || "");
        setOffice(equipoData.office_id?.toString() || "");
        setTipoConexion(equipoData.tipo_conexion_id?.toString() || "");
        setProgramaAdicional(Array.isArray(equipoData.programa_adicional_ids) ? equipoData.programa_adicional_ids : []);
        setDependencia(equipoData.dependencia_id?.toString() || "");
        setDireccion(equipoData.direccion_area_id?.toString() || "");
        setEquipamiento(equipoData.equipamiento_id?.toString() || "");
        setCaracteristica(equipoData.caracteristicas_id?.toString() || "");
        setSistemaOperativo(equipoData.tipo_sistema_operativo_id?.toString() || "");
        setObservaciones(equipoData.observaciones || "");
        setEstado(equipoData.estado || "");
        
      } catch (err: any) {
        console.error('Error al cargar equipo:', err);
        setEditError("Error al cargar equipo: " + (err.message || 'Error desconocido'));
      } finally {
        setLoadingEquipo(false);
      }
    };

    cargarEquipo();
  }, [equipoId]);

  const limpiarCampos = () => {
    setIp("");
    setMac("");
    setNombrePc("");
    setFuncionario("");
    setAnydesk("");
    setObservaciones("");
    setTipoEquipo("");
    setMarca("");
    setRam("");
    setDisco("");
    setOffice("");
    setTipoConexion("");
    setProgramaAdicional([]);
    setDependencia("");
    setDireccion("");
    setEquipamiento("");
    setCaracteristica("");
    setSistemaOperativo("");
    setEstado("");
  };

  const validarCampos = (): boolean => {
    setEditError(""); // Limpiar errores previos
    
    if (!usuarioId) {
      setEditError("Usuario no autenticado. Por favor, inicie sesión nuevamente.");
      return false;
    }
    
    // Validar campos obligatorios
    const camposObligatorios = [
      { valor: ip, nombre: "Dirección IP" },
      { valor: mac, nombre: "Dirección MAC" },
      { valor: nombrePc, nombre: "Nombre de PC" },
      { valor: funcionario, nombre: "Funcionario Responsable" },
      { valor: tipoEquipo, nombre: "Tipo de Equipo" },
      { valor: marca, nombre: "Marca" },
      { valor: ram, nombre: "RAM" },
      { valor: disco, nombre: "Disco Duro" },
      { valor: dependencia, nombre: "Dependencia" },
      { valor: estado, nombre: "Estado" }
    ];
    
    const camposFaltantes = camposObligatorios.filter(campo => !campo.valor || campo.valor.trim() === "");
    
    if (camposFaltantes.length > 0) {
      const nombresCampos = camposFaltantes.map(campo => campo.nombre).join(", ");
      setEditError(`Los siguientes campos son obligatorios: ${nombresCampos}`);
      return false;
    }
    
    // Validar formato de IP (básico)
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ip)) {
      setEditError("La dirección IP no tiene un formato válido");
      return false;
    }
    
    // Validar formato de MAC (básico)
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(mac)) {
      setEditError("La dirección MAC no tiene un formato válido (Ejemplo: 00:1B:63:84:45:E6)");
      return false;
    }
    
    return true;
  };

  const getFormData = () => {
    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }
    
    // Función auxiliar para procesar arrays de IDs
    const procesarArrayIds = (array: any[]): any[] => {
      if (!Array.isArray(array)) return [];
      return array.filter(id => id !== null && id !== undefined && id !== "");
    };
    
    // Función auxiliar para validar y limpiar strings
    const limpiarString = (valor: string): string => {
      return typeof valor === 'string' ? valor.trim() : '';
    };
    
    return {
      usuario_id: usuarioId,
      dependencia_id: dependencia || null,
      direccion_area_id: direccion || null,
      dispositivo_id: tipoEquipo || null, // Backend espera dispositivo_id no tipo_equipo_id
      direccion_ip: limpiarString(ip),
      direccion_mac: limpiarString(mac),
      nombre_pc: limpiarString(nombrePc),
      nombres_funcionario: limpiarString(funcionario),
      equipamiento_id: equipamiento || null,
      tipo_equipo_id: tipoEquipo || null,
      tipo_sistema_operativo_id: sistemaOperativo || null,
      caracteristicas_id: caracteristica || null,
      ram_id: ram || null,
      disco_id: disco || null,
      office_id: office || null,
      marca_id: marca || null,
      codigo_inventario: limpiarString(mac),
      tipo_conexion_id: tipoConexion || null,
      anydesk: limpiarString(anydesk) || null,
      estado: estado || 'Activo',
      fecha_eliminacion: null, // Campo requerido por el backend
      programa_adicional_ids: procesarArrayIds(programaAdicional),
      observaciones: observaciones ? limpiarString(observaciones) : null
    };
  };

  return {
    // Campos de texto
    ip, setIp,
    mac, setMac,
    nombrePc, setNombrePc,
    funcionario, setFuncionario,
    anydesk, setAnydesk,
    observaciones, setObservaciones,
    
    // Campos select
    tipoEquipo, setTipoEquipo,
    marca, setMarca,
    ram, setRam,
    disco, setDisco,
    office, setOffice,
    tipoConexion, setTipoConexion,
    programaAdicional, setProgramaAdicional,
    dependencia, setDependencia,
    direccion, setDireccion,
    equipamiento, setEquipamiento,
    caracteristica, setCaracteristica,
    sistemaOperativo, setSistemaOperativo,
    
    // Estado del equipo
    estado, setEstado,
    
    // Estados de validación
    editLoading, setEditLoading,
    editError, setEditError,
    loadingEquipo,
    equipo,
    
    // Funciones utilitarias
    limpiarCampos,
    validarCampos,
    getFormData
  };
}
