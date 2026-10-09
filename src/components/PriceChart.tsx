import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HistoricalPoint } from '../types';
import { formatPrice } from '../utils/format';

interface Props {
  symbol: string;
  data: HistoricalPoint[];
}

export default function PriceChart({ symbol, data }: Props) {
  if (data.length === 0) return <p className="muted">No historical data to display.</p>;

  const first = data[0];
  const last = data[data.length - 1];
  const summary = `${symbol} closing price over ${data.length} days, from ${formatPrice(first.close)} on ${first.date} to ${formatPrice(last.close)} on ${last.date}.`;

  return (
    <figure className="chart" role="img" aria-label={summary}>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} minTickGap={24} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--muted)', fontSize: 11 }} width={52} tickFormatter={(v: number) => `$${Math.round(v)}`} />
            <Tooltip formatter={(v) => formatPrice(Number(v))} labelFormatter={(l) => `Date: ${l}`} />
            <Area type="monotone" dataKey="close" name="Close" stroke="var(--accent)" strokeWidth={2} fill="url(#fill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
