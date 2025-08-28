import { useState } from 'react';

export function useAgregarEquipo() {
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
  const [programaAdicional, setProgramaAdicional] = useState<string[]>([]);
  const [dependencia, setDependencia] = useState("");
  const [direccion, setDireccion] = useState("");
  const [equipamiento, setEquipamiento] = useState("");
  const [caracteristica, setCaracteristica] = useState("");
  const [sistemaOperativo, setSistemaOperativo] = useState("");
  
  // Estados de validación
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const limpiarCampos = () => {
    setIp("");
    setMac("");
    setNombrePc("");
    setFuncionario("");
    setAnydesk("");
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
  };

  const validarCampos = (): boolean => {
    if (!ip || !mac || !nombrePc || !funcionario || !anydesk || 
        !tipoEquipo || !marca || !ram || !disco || !office || 
        !tipoConexion || !dependencia || !direccion || !equipamiento || 
        !caracteristica || !sistemaOperativo) {
      setAddError("Todos los campos son obligatorios");
      return false;
    }
    return true;
  };

  const getFormData = () => ({
    usuario_id: 4, // O el id real del usuario logueado
    dependencia_id: dependencia,
    direccion_area_id: direccion,
    dispositivo_id: tipoEquipo,
    direccion_ip: ip,
    direccion_mac: mac,
    nombre_pc: nombrePc,
    nombres_funcionario: funcionario,
    equipamiento_id: equipamiento,
    tipo_equipo_id: tipoEquipo,
    tipo_sistema_operativo_id: sistemaOperativo,
    caracteristicas_id: caracteristica,
    ram_id: ram,
    disco_id: disco,
    office_id: office,
    marca_id: marca,
    codigo_inventario: mac,
    tipo_conexion_id: tipoConexion,
    anydesk: anydesk
  });

  return {
    // Campos de texto
    ip, setIp,
    mac, setMac,
    nombrePc, setNombrePc,
    funcionario, setFuncionario,
    anydesk, setAnydesk,
    
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
    
    // Estados de validación
    addLoading, setAddLoading,
    addError, setAddError,
    
    // Funciones utilitarias
    limpiarCampos,
    validarCampos,
    getFormData
  };
}
