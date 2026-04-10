import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CORES = ["#3b82f6", "#ec4899"]; // Azul = Masculino, Rosa = Feminino

export default function GraficoCircular({ doadores }) {
  const dados = doadores && doadores.length > 0 
    ? doadores 
    : [
        { name: "Homem", value: 0 },
        { name: "Mulher", value: 0 },
      ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-8">
        Distribuição de Doadores por Género
      </h2>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        
        {/* Gráfico */}
        <div className="w-full max-w-[290px] h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={110}
                paddingAngle={5}
               label={({ percent }) => ` ${(percent * 100).toFixed(1)}%`}
              >
                {dados.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CORES[index % CORES.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} doadores`, "Quantidade"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda*/}
        <div className="flex">
          <div className="space-y">
            {dados.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 "
                  style={{ backgroundColor: CORES[index] }}
                />
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}