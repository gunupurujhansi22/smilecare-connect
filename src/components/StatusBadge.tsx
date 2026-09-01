const styles: Record<string, string> = {
  Waiting: "bg-warning/12 text-warning border-warning/30",
  "In Consultation": "bg-primary-soft text-primary border-primary/30",
  Completed: "bg-mint-soft text-mint border-mint/30",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/25",
  "No Show": "bg-muted text-muted-foreground border-border",
  Issued: "bg-mint-soft text-mint border-mint/30",
  Draft: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? styles["No Show"]
      }`}
    >
      {status}
    </span>
  );
}
