const GotaNivel = ({ nivel = 0, label }) => {
  const altura = 80;
  const preenchimento = (nivel / 100) * altura;

  const getCores = () => {
    if (nivel < 20)
      return { from: "#ef4444", to: "#b91c1c", badge: true }; // vermelho vibrante
    if (nivel < 60)
      return { from: "#facc15", to: "#f97316", badge: false }; // amarelo/laranja
    return { from: "#5eead4", to: "#14b8a6", badge: false };   // verde água
  };

  const { from, to, badge } = getCores();

  return (
 <div className="relative bg-gray-50 rounded-xl shadow-sm p-3 flex flex-col items-center gap-2
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      {/* Badge Crítico */}
     {badge && (
  <div className="absolute top-2 right-2 group cursor-pointer">
    <div className="bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
      !
    </div>

    {/* Tooltip */}
    <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white text-xs p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-10">
      Estoque {nivel}% abaixo do ideal.
      <br />
      Recomendado iniciar campanha.
    </div>
  </div>
)}

      <svg width="55" height="85" viewBox="0 0 64 100">
        <defs>
          <clipPath id={`clip-${label}`}>
            <path d="M32 5 C32 5 60 45 60 70 A28 28 0 0 1 4 70 C4 45 32 5 32 5 Z" />
          </clipPath>

          {/* 🎨 Gradiente vertical */}
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        {/* Contorno mais forte */}
        <path
          d="M32 5 C32 5 60 45 60 70 A28 28 0 0 1 4 70 C4 45 32 5 32 5 Z"
          fill="#ffffff"
          stroke="#64748b"
          strokeWidth="3"
        />

        {/* Preenchimento com gradiente */}
        <rect
          x="0"
          y={100 - preenchimento}
          width="64"
          height={preenchimento}
          fill={`url(#grad-${label})`}
          clipPath={`url(#clip-${label})`}
          style={{ transition: "all 0.6s ease" }}
        />

        {nivel > 0 && (
          <text
            x="32"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="13"
            fontWeight="bold"
          >
            {nivel}%
          </text>
        )}
      </svg>

      <span className="text-sm font-semibold text-gray-700">
        {label}
      </span>
    </div>
  );
};

export default GotaNivel;