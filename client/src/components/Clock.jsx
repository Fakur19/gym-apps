import { useState, useEffect } from 'react';

const Clock = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return date.toLocaleTimeString(undefined, options);
  };

  return (
    <div className="text-gray-600 text-sm text-right">
      <div className="font-medium">{formatDate(currentDateTime)}</div>
      <div className="text-xs">{formatTime(currentDateTime)}</div>
    </div>
  );
};

export default Clock;
