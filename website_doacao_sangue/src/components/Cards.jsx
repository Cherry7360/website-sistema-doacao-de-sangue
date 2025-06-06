 function Card({ title, description }) {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md p-6 ">
      <h3 className="text-xl font-semibold mb-2 text-azul">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
    </div>
  );
}
export default Card;
