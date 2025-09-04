import { EstiloComponentesUI } from '../Estilos/EstiloComponentesUI';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div style={EstiloComponentesUI.modales.overlay}>
      <div style={EstiloComponentesUI.modales.modal}>
        <button onClick={onClose} style={EstiloComponentesUI.modales.closeButton}>&times;</button>
        <div style={EstiloComponentesUI.modales.body}>
          {children}
        </div>
      </div>
    </div>
  );
}
