import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CORES = ["#6ee7b7", "#fca5a5"]; // Azul = Masculino, Vermelho = Feminino

export default function GraficoCircular({ doadores }) {
  const dados = doadores && doadores.length
    ? doadores
    : [
        { name: "Homem", value: 0 },
        { name: "Mulher", value: 0 },
      ];

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Distribuição de Doadores por Género
      </h3>

      {/* Gráfico */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
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
              
              >
                {dados.map((entry, index) => (
                  <Cell key={index} fill={CORES[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="flex flex-col gap-2">
          {dados.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: CORES[index] }}
              ></div>
              <span className="text-gray-700 font-medium">
                {item.name} 
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
