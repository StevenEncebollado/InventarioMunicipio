interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 0, minWidth: 350, maxWidth: 500, maxHeight: '90vh', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <div style={{ padding: 32, overflowY: 'auto', maxHeight: '90vh', minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
