export default function KpiGrid({ kpis }) {
  return (
    <section className="grid kpi-grid">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="card kpi">
          <h3>{kpi.label}</h3>
          <div className="value">{kpi.value}</div>
          <div className="sub">{kpi.sub}</div>
        </div>
      ))}
    </section>
  );
}
