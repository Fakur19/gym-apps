import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const Toast = ({ message, type, id, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 3000); // Toast disappears after 3 seconds

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type] || 'bg-gray-700';

  const Icon = {
    success: FaCheckCircle,
    error: FaTimesCircle,
    info: FaInfoCircle,
  }[type] || FaInfoCircle;

  if (!isVisible) return null;

  return createPortal(
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white flex items-center space-x-3 transform transition-transform duration-300 ease-out ${bgColor}`}>
      <Icon className="w-5 h-5" />
      <span>{message}</span>
      <button onClick={() => {
        setIsVisible(false);
        onClose(id);
      }} className="ml-auto focus:outline-none">
        <FaTimesCircle className="w-4 h-4" />
      </button>
    </div>,
    document.body
  );
};

export default Toast;
