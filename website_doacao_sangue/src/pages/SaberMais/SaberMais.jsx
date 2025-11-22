import { FaHeart, FaTint, FaInfoCircle, FaHandshake, FaStar } from "react-icons/fa";


const SaberMais = () => {
  return (
    <section className="bg-gradient-to-b  via-white to-red-50 py-16 px-6 md:px-16 text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaHeart className="text-red-500 w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Requisitos e Informações sobre Doação de Sangue
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Saber mais sobre a importância da doação ajuda a salvar vidas e mantém as reservas de sangue sempre disponíveis para quem precisa.
          </p>
        </div>

        {/* Seções */}
        <div className="space-y-10">
          {/* Porquê doar */}
          <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-red-500">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-red-500" /> Porquê doar sangue?
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>O sangue é o suporte da vida.</li>
              <li>O sangue não pode ser fabricado.</li>
              <li>
                A doação ajuda a salvar vidas em situações de emergência, cirurgias,
                tratamento de doenças crónicas e na produção de medicamentos.
              </li>
            </ul>
            <p className="mt-4 text-gray-700 italic">
              A manutenção de uma reserva de sangue suficiente e segura é da
              responsabilidade de todos nós e depende do simples acto de dar sangue.
            </p>
          </section>

          {/* Quem pode doar */}
          <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-green-500">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaTint className="text-green-500" /> Quem pode doar?
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Todas as pessoas saudáveis entre 18 a 65 anos;</li>
              <li>Pesar mais de 50 kg;</li>
              <li>
                Não ter comportamento de risco para doenças infecciosas transmissíveis
                pelo sangue (SIDA, hepatites, sífilis, etc.).
              </li>
            </ul>
          </section>

          {/* Quem não pode doar */}
          <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-red-400">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-red-400" /> Quem não pode doar?
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Alguma vez utilizou drogas por via endovenosa ou nasal;</li>
              <li>Teve novo parceiro sexual nos últimos 6 meses;</li>
              <li>Teve relações sexuais a troco de dinheiro ou drogas;</li>
              <li>Teve relações sexuais com pessoas do mesmo sexo;</li>
              <li>Teve relações com prostitutas e/ou toxicodependentes;</li>
              <li>Teve múltiplos parceiros nos últimos 12 meses;</li>
              <li>Teve doenças sexualmente transmissíveis (sífilis, hepatite, SIDA, etc.);</li>
              <li>Teve transfusão de sangue há mais de 10 anos;</li>
              <li>Fez tatuagem, piercing ou acupunctura há menos de 1 ano;</li>
              <li>Esteve em zonas com paludismo há menos de 1 ano;</li>
              <li>Teve paludismo há menos de 3 anos;</li>
              <li>Esteve em zonas com dengue, zika ou chikungunya há menos de 30 dias;</li>
              <li>Fez transplante de órgãos ou tratamento com hormonas de crescimento;</li>
              <li>Esteve preso por mais de 72h nos últimos 12 meses;</li>
              <li>Se deseja apenas fazer o teste VIH.</li>
            </ul>
          </section>

          {/* Dádiva */}
          <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-blue-400">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaHandshake className="text-blue-400" /> A dádiva de ser doador
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Voluntária</li>
              <li>Gratuita</li>
              <li>Anónima</li>
              <li>Regular</li>
              <li>Responsável</li>
            </ul>
          </section>

          {/* Doador anónimo */}
          <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-purple-400">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaStar className="text-purple-400" /> O doador anónimo, voluntário e não remunerado
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dá sangue por motivação, sendo mais provável que seja um dador seguro.</li>
              <li>Contribui regularmente para manter as reservas de sangue.</li>
              <li>Baixa prevalência de doenças transmissíveis pelo sangue.</li>
              <li>É submetido a exames médicos e análises com regularidade.</li>
              <li>É responsável e solidário.</li>
            </ul>
          </section>

          {/* Outras informações */}
          <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-gray-400">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-gray-500" /> Outras informações
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Em caso de dúvida, consulte o médico ou técnico do serviço de sangue.</li>
              <li>Pode desistir da doação a qualquer momento, sem problema.</li>
              <li>
                Se acredita que o seu sangue não deve ser utilizado, contacte o profissional
                responsável pela colheita.
              </li>
            </ul>
          </section>

          {/* Encerramento */}
          <div className="text-center mt-12">
            <FaTint className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Não fique em casa à espera de ser chamado!
            </h3>
            <p className="text-gray-700 text-lg">
              Pode escolher o dia e a hora que desejar. O Banco de Sangue está à sua
              disposição de segunda a sexta-feira, das 8h às 15h.
            </p>
          </div>
         
        </div>
      </div>
   
    </section>
  );
};

export default SaberMais;
