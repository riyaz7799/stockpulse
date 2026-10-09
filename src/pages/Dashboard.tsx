import { useMemo, useState } from 'react';
import { ErrorMessage, ListSkeleton } from '../components/Feedback';
import StockDetails from '../components/StockDetails';
import StockList from '../components/StockList';
import StockSearch from '../components/StockSearch';
import ThemeToggle from '../components/ThemeToggle';
import { usePopularStocks } from '../hooks/useStocks';

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = usePopularStocks();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return (data ?? []).filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [data, query]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="app-header">
        <h1>StockPulse</h1>
        <ThemeToggle />
      </header>
      <main id="main" className="layout">
        <section className="panel" aria-labelledby="list-title">
          <h2 id="list-title">Popular stocks</h2>
          <StockSearch onChange={setQuery} />
          {isLoading && <ListSkeleton />}
          {isError && <ErrorMessage title="Couldn't load stocks" message={error.message} onRetry={() => refetch()} />}
          {data && <StockList stocks={filtered} />}
        </section>
        <StockDetails />
      </main>
      <footer className="app-footer">
        <small>Prices are for demonstration only and are not financial advice.</small>
      </footer>
    </>
  );
}
