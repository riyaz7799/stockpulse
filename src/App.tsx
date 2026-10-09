import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import { useUiStore } from './stores/uiStore';

export default function App() {
  const theme = useUiStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return <Dashboard />;
}
