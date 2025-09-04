// Exporta los 4 archivos principales que cubren toda la aplicación

// ===== ESTILOS GLOBALES Y COMPONENTES UI =====
export { estiloGlobal } from './EstiloGlobal';
export { EstiloComponentesUI } from './EstiloComponentesUI';

// ===== ESTILOS ESPECÍFICOS DEL DASHBOARD =====  
export { EstiloDashboard } from './EstiloDashboard';
export { EstiloEfectosVisuales } from './EstiloEfectosVisuales';
export { estiloAnimaciones } from './EstiloAnimaciones';
export { EstiloDashboardEspecifico } from './EstiloDashboardEspecifico';

// ===== EXPORTACIONES UNIFICADAS PARA FACILIDAD DE USO =====
import { estiloGlobal } from './EstiloGlobal';
import { EstiloComponentesUI } from './EstiloComponentesUI';
import { EstiloDashboard } from './EstiloDashboard';
import { EstiloDashboardEspecifico } from './EstiloDashboardEspecifico';

// Objeto unificado con todos los estilos principales
export const Estilos = {
  global: estiloGlobal,
  componentes: EstiloComponentesUI,
  dashboard: EstiloDashboard,
  dashboardEspecifico: EstiloDashboardEspecifico,
};

export default Estilos;
