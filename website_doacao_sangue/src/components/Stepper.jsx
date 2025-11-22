
const Stepper = ({ etapaAtual, totalEtapas }) => {
  const steps = Array.from({ length: totalEtapas }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      {steps.map((step) => (
        <div
          key={step}
          className={`w-5 h-5 rounded-full transition-colors duration-300 ${
            step <= etapaAtual ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default Stepper;
