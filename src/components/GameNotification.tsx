import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Clock, Gift } from 'lucide-react';

interface NotificationProps {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

interface GameNotificationSystemProps {
  notifications: NotificationProps[];
  onClose: (id: string) => void;
}

const NotificationItem = ({ notification }: { notification: NotificationProps }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    // Auto close after duration
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      notification.onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'info':
        return <Gift className="w-5 h-5 text-blue-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-400 bg-green-900/20 text-green-400';
      case 'warning':
        return 'border-yellow-400 bg-yellow-900/20 text-yellow-400';
      case 'error':
        return 'border-red-400 bg-red-900/20 text-red-400';
      case 'info':
        return 'border-blue-400 bg-blue-900/20 text-blue-400';
      default:
        return 'border-green-400 bg-green-900/20 text-green-400';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'scale-95' : 'scale-100'}
      `}
    >
      <div className={`
        relative bg-black/95 border-2 backdrop-blur-md
        ${getColors()}
        p-4 min-w-80 max-w-md shadow-2xl
        font-mono
      `}>
        {/* Corner decorations */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-current animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-current animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-current animate-pulse" style={{animationDelay: '0.4s'}}></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-current animate-pulse" style={{animationDelay: '0.6s'}}></div>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-orbitron font-bold text-sm tracking-wider mb-1">
              {notification.title}
            </div>
            <div className="text-xs opacity-90 leading-relaxed">
              {notification.message}
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-current/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Animated border effect */}
        <div className="absolute inset-0 border-2 border-current opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export const GameNotificationSystem = ({ notifications, onClose }: GameNotificationSystemProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationItem notification={notification} />
        </div>
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useGameNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationProps = {
      ...notification,
      id,
      duration: notification.duration || 5000,
      onClose: removeNotification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
};

// Convenience functions for different notification types
export const createSuccessNotification = (title: string, message: string, duration?: number) => ({
  type: 'success' as const,
  title,
  message,
  duration
});

export const createWarningNotification = (title: string, message: string, duration?: number) => ({
  type: 'warning' as const,
  title,
  message,
  duration
});

export const createErrorNotification = (title: string, message: string, duration?: number) => ({
  type: 'error' as const,
  title,
  message,
  duration
});

export const createInfoNotification = (title: string, message: string, duration?: number) => ({
  type: 'info' as const,
  title,
  message,
  duration
});