import { useUiStore } from '../stores/uiStore';
import type { Stock } from '../types';
import { formatChange, formatPrice, trendOf } from '../utils/format';

interface Props {
  stocks: Stock[];
}

export default function StockList({ stocks }: Props) {
  const selected = useUiStore((s) => s.selectedStockSymbol);
  const select = useUiStore((s) => s.setSelectedStockSymbol);

  if (stocks.length === 0) {
    return <p className="muted" role="status">No stocks match your search.</p>;
  }

  return (
    <ul className="stock-list" aria-label="Popular stocks">
      {stocks.map((s) => {
        const trend = trendOf(s.change);
        return (
          <li key={s.symbol}>
            <button
              type="button"
              className="stock-item"
              aria-pressed={selected === s.symbol}
              onClick={() => select(s.symbol)}
            >
              <span className="stock-id">
                <span className="symbol">{s.symbol}</span>
                <span className="name">{s.name}</span>
              </span>
              <span className="stock-quote">
                <span className="price">{formatPrice(s.price)}</span>
                <span className={`change ${trend}`}>
                  <span aria-hidden="true">{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '–'}</span>{' '}
                  {formatChange(s.change, s.percentChange)}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
