export function ConfirmDialog({ open, title, text, confirmLabel, onConfirm, onClose }: {
  open: boolean; title: string; text: string; confirmLabel: string; onConfirm: () => void; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4" role="dialog" aria-modal="true" aria-labelledby="cd-title" onClick={onClose}>
      <div className="card shadow-soft w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 id="cd-title" className="text-2xl">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>Voltar</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "confirmado" | "cancelado" }) {
  return status === "confirmado"
    ? <span className="rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-sage-foreground">● Confirmado</span>
    : <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">✕ Cancelado</span>;
}
