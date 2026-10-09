import { useId, useState } from 'react';
import { MAX_SEARCH_LENGTH, validateSearch } from '../utils/validation';

interface Props {
  onChange: (query: string) => void;
}

/** Controlled search box. Only valid values are propagated to the parent. */
export default function StockSearch({ onChange }: Props) {
  const id = useId();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handle = (next: string) => {
    setValue(next);
    const err = validateSearch(next);
    setError(err);
    if (!err) onChange(next.trim());
  };

  return (
    <div className="search" role="search">
      <label htmlFor={id}>Search stocks</label>
      <input
        id={id}
        type="search"
        value={value}
        placeholder="Symbol or company, e.g. AAPL"
        autoComplete="off"
        maxLength={MAX_SEARCH_LENGTH + 10}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => handle(e.target.value)}
      />
      {error && (
        <p id={`${id}-err`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
