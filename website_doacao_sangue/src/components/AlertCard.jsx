import { useEffect, useState } from "react";
import { HiXCircle } from "react-icons/hi";

const AlertCard = ({ message, type = "success", duration = 4000, onClose }) => {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!message) return;

    setShow(true);
    setFade(true);

    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setShow(false);
        onClose && onClose();
      }, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!show) return null;

  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-800"
      : type === "error"
      ? "bg-red-100 border-red-400 text-red-800"
      : "bg-yellow-100 border-yellow-400 text-yellow-800";

  return (
    <div
      className={`border-l-4 p-4 rounded shadow-md flex justify-between items-center mb-4 transition-opacity duration-300 ${
        fade ? "opacity-100" : "opacity-0"
      } ${bgColor}`}
    >
      <span className="text-sm font-medium">{message}</span>

      <button
        onClick={() => {
          setFade(false);
          setTimeout(() => {
            setShow(false);
            onClose && onClose();
          }, 200);
        }}
        className="ml-4 text-xl hover:text-gray-600 transition-colors"
      >
        <HiXCircle />
      </button>
    </div>
  );
};

export default AlertCard;
