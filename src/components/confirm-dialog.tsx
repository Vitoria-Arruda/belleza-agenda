import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export function ConfirmDialog({ open, title, text, confirmLabel, onConfirm, onClose }: {
  open: boolean; title: string; text: string; confirmLabel: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(value) => { if (!value) onClose(); }}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-lg bg-card shadow-soft">
        <AlertDialogTitle className="font-display text-2xl font-medium">{title}</AlertDialogTitle>
        <AlertDialogDescription>{text}</AlertDialogDescription>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="btn btn-outline">Voltar</AlertDialogCancel>
          <AlertDialogAction className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function StatusBadge({ status }: { status: "confirmado" | "cancelado" }) {
  return status === "confirmado"
    ? <span className="rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-sage-foreground">● Confirmado</span>
    : <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">✕ Cancelado</span>;
}
