import { CatalogosProvider } from './context/CatalogosContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CatalogosProvider>
      {children}
    </CatalogosProvider>
  );
}
