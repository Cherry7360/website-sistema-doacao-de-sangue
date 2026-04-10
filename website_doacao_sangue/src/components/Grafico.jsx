import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Grafico = ({ dados, titulo, xKey, barras = [], barraUnica, altura = 300, icone }) => {
  // Se barra Unica existir, transforma em array para map
  const barrasParaRender = barraUnica ? [barraUnica] : barras;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-center gap-2 mb-4">
        {icone && <span className="text-xl text-gray-700">{icone}</span>}
          <h2 className="text-2xl font-bold text-gray-800">
            {titulo}
          </h2>
      </div>

      {(!dados || dados.length === 0) ? (
        <p className="text-center text-gray-500 py-20">
          Ainda não há dados para mostrar.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={altura}>
          <BarChart data={dados} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey || (barraUnica?.dataField || 'data')} />
            <YAxis allowDecimals={false} tickFormatter={(value) => Math.floor(value)} />
            <Tooltip />
            <Legend />
            {barrasParaRender.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.chave}
                fill={bar.cor}
                barSize={20}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Grafico;
