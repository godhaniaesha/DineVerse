import { useState, useEffect } from 'react';
import Toast from './Toast';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  // Listen for custom toast events
  useEffect(() => {
    const handleToastEvent = (event) => {
      const { type, title, message, duration } = event.detail;
      addToast(type, title, message, duration);
    };

    document.addEventListener('showToast', handleToastEvent);
    
    return () => {
      document.removeEventListener('showToast', handleToastEvent);
    };
  }, []);

  const addToast = (type, title, message, duration) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="ad_toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}
