
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// cores por tipo sangue
const CORES_TIPO = {
  "A+": "#ef4444",
  "A-": "#f87171",
  "B+": "#3b82f6",
  "B-": "#60a5fa",
  "AB+": "#a855f7",
  "AB-": "#c084fc",
  "O+": "#22c55e",
  "O-": "#4ade80",
};

export default function GraficoEstoque({ totaisEstoque }) {

  // transformar dados do backend
  const dados = Object.keys(totaisEstoque).map((tipo) => {
    const item = totaisEstoque[tipo];

    return {
      name: tipo,
      value: item.quantidade,
      status: item.status,
      color: CORES_TIPO[tipo] || "#9ca3af",
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Estoque por Tipo de Sangue
      </h2>

      <div className="flex flex-col lg:flex-row items-center gap-6">

        {/* GRÁFICO */}
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                label={({ percent }) => ` ${(percent * 100).toFixed(1)}%`}
              >
                {dados.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name, props) => [
                  `${value} ml`,
                  `${name} (${props.payload.status})`,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEGENDA */}
        <div className="grid grid-cols-4 gap-2">
          {dados.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1">

              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 font-medium">
                  {item.name}
                </span>
              </div>


            </div>
          ))}
        </div>

      </div>
    </div>
  );
}