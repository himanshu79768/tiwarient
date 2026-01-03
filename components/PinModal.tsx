import React, { useState, useRef, useEffect } from 'react';

interface PinModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PinModal: React.FC<PinModalProps> = ({ onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input and max 4 digits
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '9049' || pin === '9216') {
      onSuccess();
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); // Duration of shake animation
    }
  };
  
  // Custom style for shake animation
  const shakeAnimation = isShaking ? 'animate-shake' : '';

  return (
    <>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className={`bg-beige rounded-lg shadow-2xl w-full max-w-sm p-8 ${shakeAnimation}`}>
          <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-serif text-brown-dark">Developer Access</h2>
               <button onClick={onClose} className="text-brown-dark hover:text-accent p-1 -mt-2 -mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
          <p className="text-grey-dark mb-4 text-sm">Please enter the 4-digit security PIN to continue.</p>
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="password"
              maxLength={4}
              value={pin}
              onChange={handleInputChange}
              className="w-full text-center text-3xl tracking-[1em] bg-white/50 border border-brown-light/50 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brown-light focus:border-brown-dark transition-all duration-200"
              placeholder="----"
            />
            {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
            <button type="submit" className="w-full mt-6 bg-brown-dark text-white py-3 px-4 rounded-md hover:bg-brown transition-colors duration-300 font-semibold disabled:bg-brown-light" disabled={pin.length !== 4}>
              Unlock
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PinModal;
