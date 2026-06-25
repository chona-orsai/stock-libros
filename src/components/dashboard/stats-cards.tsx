import { formatCurrency } from "@/lib/stats";
import type { StockStats } from "@/lib/types";
import { BookCopy, Coins, Library, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: StockStats;
}

const cards = [
  {
    key: "titulosEnStock" as const,
    label: "Títulos en stock",
    icon: Library,
    format: (v: number) => String(v),
    color: "text-violet-600 bg-violet-50",
  },
  {
    key: "ejemplaresTotales" as const,
    label: "Ejemplares totales",
    icon: BookCopy,
    format: (v: number) => String(v),
    color: "text-sky-600 bg-sky-50",
  },
  {
    key: "gananciaPotencial" as const,
    label: "Ganancia potencial",
    icon: TrendingUp,
    format: formatCurrency,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "capitalInvertido" as const,
    label: "Capital invertido",
    icon: Coins,
    format: formatCurrency,
    color: "text-amber-600 bg-amber-50",
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, format, color }) => (
        <div
          key={key}
          className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-muted">{label}</p>
            <div className={`rounded-lg p-2 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-semibold text-ink">
            {format(stats[key])}
          </p>
        </div>
      ))}
    </div>
  );
}
