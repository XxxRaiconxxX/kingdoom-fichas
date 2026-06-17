type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  ratio?: number;
  tone?: "neutral" | "ok" | "over";
};

// Tarjeta de métrica con valor grande y medidor de progreso opcional.
export function MetricCard({
  label,
  value,
  detail,
  ratio,
  tone = "neutral",
}: MetricCardProps) {
  const hasMeter = typeof ratio === "number";
  return (
    <div className={`metric-card metric-card--${tone}`}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
      {hasMeter ? (
        <span className="metric-card__meter" aria-hidden="true">
          <span
            className="metric-card__meter-fill"
            style={{ transform: `scaleX(${Math.min(1, Math.max(0, ratio ?? 0))})` }}
          />
        </span>
      ) : null}
      <span className="metric-card__detail">{detail}</span>
    </div>
  );
}
