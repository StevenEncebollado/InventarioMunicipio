import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginacionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Paginacion: React.FC<PaginacionProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      marginTop: '24px',
      padding: '20px 0'
    }}>
      {/* Información de registros */}
      <div style={{
        color: '#64748b',
        fontSize: '14px',
        fontWeight: 500
      }}>
        Mostrando {startItem} - {endItem} de {totalItems} equipos
      </div>

      {/* Controles de paginación */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: currentPage === 1 ? '#f8fafc' : '#fff',
            color: currentPage === 1 ? '#cbd5e1' : '#475569',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <FaChevronLeft size={14} />
        </button>

        {/* Números de página */}
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span style={{
                padding: '0 8px',
                color: '#94a3b8',
                fontSize: '16px'
              }}>
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: currentPage === page ? '#2563eb' : '#fff',
                  color: currentPage === page ? '#fff' : '#475569',
                  cursor: 'pointer',
                  fontWeight: currentPage === page ? 600 : 500,
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: currentPage === totalPages ? '#f8fafc' : '#fff',
            color: currentPage === totalPages ? '#cbd5e1' : '#475569',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Paginacion;
