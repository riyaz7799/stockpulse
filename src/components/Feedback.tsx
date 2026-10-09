export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-live="polite" aria-label="Loading stocks">
      <ul className="stock-list" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="skeleton skeleton-row" />
        ))}
      </ul>
      <span className="sr-only">Loading stocks…</span>
    </div>
  );
}

interface ErrorMessageProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-box" role="alert">
      <strong>{title}</strong>
      {message && <p>{message}</p>}
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
