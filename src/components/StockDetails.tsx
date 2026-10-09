import { useEffect, useRef } from 'react';
import { useHistoricalData, useStockDetails } from '../hooks/useStocks';
import { useUiStore } from '../stores/uiStore';
import { formatChange, formatPrice, formatVolume, trendOf } from '../utils/format';
import { ErrorMessage, Spinner } from './Feedback';
import PriceChart from './PriceChart';

export default function StockDetails() {
  const symbol = useUiStore((s) => s.selectedStockSymbol);
  const details = useStockDetails(symbol);
  const history = useHistoricalData(symbol);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the details heading when a stock is chosen (keyboard / screen-reader users).
  useEffect(() => {
    if (symbol) headingRef.current?.focus();
  }, [symbol]);

  if (!symbol) {
    return (
      <section className="panel" aria-labelledby="details-title">
        <h2 id="details-title">Stock details</h2>
        <p className="muted">Select a stock from the list to see its live price and 30-day history.</p>
      </section>
    );
  }

  const d = details.data;
  const trend = d ? trendOf(d.change) : 'flat';

  return (
    <section className="panel" aria-labelledby="details-title">
      <h2 id="details-title" ref={headingRef} tabIndex={-1}>
        {d ? `${d.name} (${d.symbol})` : symbol}
      </h2>

      {details.isLoading && <Spinner label="Loading quote…" />}
      {details.isError && !d && (
        <ErrorMessage title="Couldn't load this quote" message={details.error.message} onRetry={() => details.refetch()} />
      )}

      {d && (
        <>
          <div className="quote">
            <p className="big-price" aria-live="polite" aria-atomic="true">
              {formatPrice(d.price)}
            </p>
            <p className={`change ${trend}`}>
              <span aria-hidden="true">{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '–'}</span>{' '}
              {formatChange(d.change, d.percentChange)}
            </p>
            <p className="muted small">
              {details.isFetching ? 'Refreshing…' : `Updated ${new Date(details.dataUpdatedAt).toLocaleTimeString()}`}
              {details.isError && ' · Last refresh failed, showing previous data'}
            </p>
          </div>
          <dl className="stats">
            <div><dt>Open</dt><dd>{formatPrice(d.open)}</dd></div>
            <div><dt>High</dt><dd>{formatPrice(d.high)}</dd></div>
            <div><dt>Low</dt><dd>{formatPrice(d.low)}</dd></div>
            <div><dt>Prev. close</dt><dd>{formatPrice(d.previousClose)}</dd></div>
            <div><dt>Volume</dt><dd>{formatVolume(d.volume)}</dd></div>
          </dl>
        </>
      )}

      <h3>30-day price history</h3>
      {history.isLoading && <Spinner label="Loading chart…" />}
      {history.isError && (
        <ErrorMessage title="Couldn't load history" message={history.error.message} onRetry={() => history.refetch()} />
      )}
      {history.data && <PriceChart symbol={symbol} data={history.data} />}
    </section>
  );
}
