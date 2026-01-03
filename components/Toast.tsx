import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  onClear: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClear, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Allow fade out animation to complete before clearing message
        setTimeout(onClear, 500);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClear]);

  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 bg-grey-dark text-white text-sm py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out z-50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;