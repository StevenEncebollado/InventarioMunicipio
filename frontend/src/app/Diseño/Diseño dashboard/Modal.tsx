import { estiloModal } from '../Estilos/EstiloModal';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div style={estiloModal.overlay}>
      <div style={estiloModal.modal}>
        <button onClick={onClose} style={estiloModal.closeBtn}>&times;</button>
        <div style={estiloModal.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
