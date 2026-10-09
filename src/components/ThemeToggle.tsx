import { useUiStore } from '../stores/uiStore';

export default function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const next = theme === 'light' ? 'dark' : 'light';
  return (
    <button type="button" className="btn" onClick={toggleTheme} aria-label={`Switch to ${next} theme`}>
      <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span> {next === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
