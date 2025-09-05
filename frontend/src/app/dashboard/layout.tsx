// Hace que todas las páginas del dashboard puedan usar los catálogo
// Utiliza el contenido de la carpeta Context

import { CatalogosProvider } from './context/CatalogosContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CatalogosProvider>
      {children}
    </CatalogosProvider>
  );
}
