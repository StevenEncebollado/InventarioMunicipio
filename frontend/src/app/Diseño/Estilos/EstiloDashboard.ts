// Estilos principales del dashboard - Versión optimizada
// Integra efectos visuales y animaciones de forma simplificada

import { EstiloEfectosVisuales } from './EstiloEfectosVisuales';
import { estiloAnimaciones } from './EstiloAnimaciones';

export const EstiloDashboard = {
  // Contenedor principal del dashboard
  dashboardContent: EstiloEfectosVisuales.fondoPrincipal,

  // Sistema completo de efectos visuales
  efectosVisuales: EstiloEfectosVisuales,

  // Contenedor de contenido con z-index relativo
  contenidoRelativo: EstiloEfectosVisuales.contenidoRelativo,

  // CSS de animaciones
  animacionesCSS: estiloAnimaciones,
};

// Exportación de estilos individuales para uso específico
export { EstiloEfectosVisuales, estiloAnimaciones };
