/* VistaGraficas.jsx */
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from "recharts";
import { formatearPesos, formatearMillones } from "../../../utils/formatters";

const COLORES = ["#5b6ef5","#9b59f5","#34d399","#fbbf24","#f87171","#38bdf8","#fb923c"];

const TOOLTIP_STYLE = {
  background: "#21253a",
  border: "1px solid rgba(91,110,245,0.18)",
  borderRadius: 10,
  color: "#f0f2ff",
};

// ── Dona: gastos por categoría ────────────────────────────────────────────────
function GraficaCategorias({ transacciones }) {
  const datos = Object.values(
    transacciones
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        const key = t.category_name;
        acc[key] = acc[key] ?? { name: key, value: 0 };
        acc[key].value += t.amount;
        return acc;
      }, {})
  );

  if (!datos.length) return <p style={{ color: "#555e82" }}>Sin gastos registrados.</p>;

  return (
    <div className="db-card">
      <h3 className="db-card-title">Gastos por categoría</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={datos} dataKey="value" nameKey="name"
            cx="50%" cy="50%" innerRadius={60} outerRadius={100}
            paddingAngle={3}>
            {datos.map((_, i) => (
              <Cell key={i} fill={COLORES[i % COLORES.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => formatearPesos(v)} />
          <Legend wrapperStyle={{ fontSize: "0.8rem", color: "#9ba3c7" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Barras: ingresos vs gastos por mes ───────────────────────────────────────
function GraficaBarras({ transacciones }) {
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  const datos = meses.map((mes, i) => {
    const delMes = transacciones.filter(t => new Date(t.trans_date).getMonth() === i);
    return {
      mes,
      Ingresos: delMes.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Gastos:   delMes.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  return (
    <div className="db-card">
      <h3 className="db-card-title">Ingresos vs Gastos mensual</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={datos} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,110,245,0.18)" />
          <XAxis dataKey="mes" stroke="#9ba3c7" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ba3c7" tick={{ fontSize: 12 }} tickFormatter={formatearMillones} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => formatearPesos(v)} />
          <Legend wrapperStyle={{ fontSize: "0.8rem", color: "#9ba3c7" }} />
          <Bar dataKey="Ingresos" fill="#34d399" radius={[4,4,0,0]} />
          <Bar dataKey="Gastos"   fill="#f87171" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Área: evolución del ahorro ────────────────────────────────────────────────
function GraficaAhorro({ transacciones }) {
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  const datos = meses.map((mes, i) => {
    const delMes = transacciones.filter(t => new Date(t.trans_date).getMonth() === i);
    const ingresos = delMes.filter(t => t.type === "income").reduce((s, t)  => s + t.amount, 0);
    const gastos   = delMes.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { mes, Ahorros: ingresos - gastos };
  });

  return (
    <div className="db-card">
      <h3 className="db-card-title">Evolución del ahorro</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={datos} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradAhorro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#5b6ef5" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#5b6ef5" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,110,245,0.18)" />
          <XAxis dataKey="mes" stroke="#9ba3c7" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ba3c7" tick={{ fontSize: 12 }} tickFormatter={formatearMillones} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => formatearPesos(v)} />
          <Area type="monotone" dataKey="Ahorros" stroke="#5b6ef5"
            fill="url(#gradAhorro)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Vista principal ───────────────────────────────────────────────────────────
export default function VistaGraficas({ finanzas }) {
  const { transacciones, loading, error } = finanzas;

  if (loading) return <div className="db-empty"><span>Cargando...</span></div>;
  if (error)   return <div className="db-empty"><span>⚠️ {error}</span></div>;

  return (
    <div>
      <h2 className="db-view-title">
        Gráficas — <span>{new Date().getFullYear()}</span>
      </h2>
      <GraficaCategorias transacciones={transacciones} />
      <GraficaBarras     transacciones={transacciones} />
      <GraficaAhorro     transacciones={transacciones} />
    </div>
  );
}