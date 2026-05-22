import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext.jsx';
import { apiService } from '@/services/apiService.js';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { addNotification } = useApp();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await apiService.notifications.getAll();
      const rows = data.notifications || [];
      setNotifications(rows);
      setUnreadCount(rows.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiService.notifications.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      addNotification('Notification marked as read', 'success');
    } catch (error) {
      addNotification('Failed to mark notification as read', 'error');
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      await apiService.notifications.markAllAsRead();

      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
      addNotification('All notifications marked as read', 'success');
    } catch (error) {
      addNotification('Failed to mark all notifications as read', 'error');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      default:
        return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-96 max-h-96 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                              !notification.read_at ? 'bg-blue-500/5' : ''
                        }`}
                        onClick={() => !notification.read_at && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notification.read_at ? 'text-white/70' : 'text-white font-medium'}`}>
                              {notification.title ? `${notification.title}: ` : ''}{notification.message}
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                              {formatTime(notification.created_at)}
                            </p>
                          </div>
                          {!notification.read_at && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/10">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Notification Badge Component (for other parts of the app)
export function NotificationBadge({ count, className = '' }) {
  if (!count || count === 0) return null;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-bold ${className}`}
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
}

// Toast Notification Component (for temporary notifications)
export function ToastNotification({ message, type = 'info', onClose, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-400';
      case 'error':
        return 'bg-red-500 border-red-400';
      case 'warning':
        return 'bg-yellow-500 border-yellow-400';
      default:
        return 'bg-blue-500 border-blue-400';
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg border-l-4 shadow-lg text-white ${getToastStyles(type)} max-w-sm`}
    >
      <div className="flex items-start space-x-3">
        {getNotificationIcon(type)}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
