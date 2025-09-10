// Hace que todas las páginas del dashboard puedan usar los catálogos
// Utiliza el contenido de la carpeta Context e incluye el footer

'use client';
import { useState } from 'react';
import { CatalogosProvider } from './context/CatalogosContext';
import Footer from '../Diseño/Diseño dashboard/Footer';
import ModalModificarCategorias from '../Diseño/Diseño dashboard/ModalModificarCategorias';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <CatalogosProvider>
      <div style={{
        minHeight: '100vh',
        position: 'relative',
      }}>
        {/* Contenido principal */}
        <div style={{
          paddingBottom: '80px', // Espacio para el footer
        }}>
          {children}
        </div>
        
        {/* Footer siempre visible */}
        <Footer onModificarCategorias={handleOpenModal} />
        
        {/* Modal de modificar categorías */}
        <ModalModificarCategorias 
          open={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </div>
    </CatalogosProvider>
  );
}
