import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

// Initial state
const initialState = {
  errors: [],
  loadingStates: new Map(),
  notifications: [],
  globalLoading: false,
};

// Action types
const ACTIONS = {
  ADD_ERROR: 'ADD_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_LOADING: 'SET_LOADING',
  REMOVE_LOADING: 'REMOVE_LOADING',
  CLEAR_LOADING: 'CLEAR_LOADING',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_GLOBAL_LOADING: 'SET_GLOBAL_LOADING',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, {
          id: Date.now() + Math.random(),
          ...action.payload,
          timestamp: Date.now(),
        }],
      };

    case ACTIONS.REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload),
      };

    case ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        errors: [],
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loadingStates: new Map(state.loadingStates).set(action.payload.key, {
          state: LOADING_STATES.LOADING,
          message: action.payload.message,
        }),
      };

    case ACTIONS.REMOVE_LOADING:
      const newLoadingStates = new Map(state.loadingStates);
      newLoadingStates.delete(action.payload);
      return {
        ...state,
        loadingStates: newLoadingStates,
      };

    case ACTIONS.CLEAR_LOADING:
      return {
        ...state,
        loadingStates: new Map(),
      };

    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now() + Math.random(),
          ...action.payload,
          timestamp: Date.now(),
        }],
      };

    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };

    case ACTIONS.SET_GLOBAL_LOADING:
      return {
        ...state,
        globalLoading: action.payload,
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Error handling
  const addError = useCallback((error, type = ERROR_TYPES.UNKNOWN) => {
    let message = 'An unexpected error occurred';
    let title = 'Error';

    if (typeof error === 'string') {
      message = error;
    } else if (error?.response) {
      // API error
      const status = error.response.status;
      message = error.response.data?.message || error.message;

      switch (status) {
        case 400:
          title = 'Validation Error';
          type = ERROR_TYPES.VALIDATION;
          break;
        case 401:
          title = 'Authentication Error';
          type = ERROR_TYPES.AUTHENTICATION;
          break;
        case 403:
          title = 'Authorization Error';
          type = ERROR_TYPES.AUTHORIZATION;
          break;
        case 404:
          title = 'Not Found';
          break;
        case 500:
          title = 'Server Error';
          type = ERROR_TYPES.SERVER;
          break;
        default:
          if (!navigator.onLine) {
            title = 'Network Error';
            message = 'Please check your internet connection';
            type = ERROR_TYPES.NETWORK;
          }
      }
    } else if (error?.message) {
      message = error.message;
    }

    dispatch({
      type: ACTIONS.ADD_ERROR,
      payload: {
        title,
        message,
        type,
        originalError: error,
      },
    });

    // Auto-remove error after 5 seconds
    setTimeout(() => {
      dispatch({
        type: ACTIONS.REMOVE_ERROR,
        payload: state.errors.length + 1, // This will be the ID of the added error
      });
    }, 5000);
  }, [state.errors.length]);

  const removeError = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_ERROR, payload: id });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERRORS });
  }, []);

  // Loading states
  const setLoading = useCallback((key, message = 'Loading...') => {
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: { key, message },
    });
  }, []);

  const setSuccess = useCallback((key) => {
    const newLoadingStates = new Map(state.loadingStates);
    const current = newLoadingStates.get(key);
    if (current) {
      newLoadingStates.set(key, {
        ...current,
        state: LOADING_STATES.SUCCESS,
      });
      // Auto-remove success state after 2 seconds
      setTimeout(() => {
        dispatch({ type: ACTIONS.REMOVE_LOADING, payload: key });
      }, 2000);
    }
  }, [state.loadingStates]);

  const setError = useCallback((key) => {
    const newLoadingStates = new Map(state.loadingStates);
    const current = newLoadingStates.get(key);
    if (current) {
      newLoadingStates.set(key, {
        ...current,
        state: LOADING_STATES.ERROR,
      });
      // Auto-remove error state after 3 seconds
      setTimeout(() => {
        dispatch({ type: ACTIONS.REMOVE_LOADING, payload: key });
      }, 3000);
    }
  }, [state.loadingStates]);

  const removeLoading = useCallback((key) => {
    dispatch({ type: ACTIONS.REMOVE_LOADING, payload: key });
  }, []);

  const clearLoading = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_LOADING });
  }, []);

  // Notifications
  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      payload: {
        id,
        message,
        type, // 'success', 'error', 'warning', 'info'
        duration,
      },
    });

    // Auto-remove notification
    setTimeout(() => {
      dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
  }, []);

  // Global loading
  const setGlobalLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_GLOBAL_LOADING, payload: loading });
  }, []);

  // Async operation wrapper
  const withLoading = useCallback(async (key, operation, successMessage, errorMessage) => {
    try {
      setLoading(key);
      const result = await operation();
      setSuccess(key);
      if (successMessage) {
        addNotification(successMessage, 'success');
      }
      return result;
    } catch (error) {
      setError(key);
      addError(error);
      if (errorMessage) {
        addNotification(errorMessage, 'error');
      }
      throw error;
    }
  }, [setLoading, setSuccess, setError, addError, addNotification]);

  const value = {
    // State
    errors: state.errors,
    loadingStates: state.loadingStates,
    notifications: state.notifications,
    globalLoading: state.globalLoading,

    // Error actions
    addError,
    removeError,
    clearErrors,

    // Loading actions
    setLoading,
    setSuccess,
    setError,
    removeLoading,
    clearLoading,
    withLoading,

    // Notification actions
    addNotification,
    removeNotification,

    // Global loading
    setGlobalLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Error Display Component
export function ErrorDisplay({ error, onClose }) {
  const getErrorIcon = (type) => {
    switch (type) {
      case ERROR_TYPES.NETWORK:
        return '🔌';
      case ERROR_TYPES.VALIDATION:
        return '⚠️';
      case ERROR_TYPES.AUTHENTICATION:
      case ERROR_TYPES.AUTHORIZATION:
        return '🔒';
      case ERROR_TYPES.SERVER:
        return '🖥️';
      default:
        return '❌';
    }
  };

  const getErrorColor = (type) => {
    switch (type) {
      case ERROR_TYPES.VALIDATION:
        return 'from-yellow-500 to-orange-500';
      case ERROR_TYPES.AUTHENTICATION:
      case ERROR_TYPES.AUTHORIZATION:
        return 'from-red-500 to-pink-500';
      case ERROR_TYPES.SERVER:
        return 'from-purple-500 to-indigo-500';
      default:
        return 'from-red-500 to-red-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`bg-gradient-to-r ${getErrorColor(error.type)} text-white p-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm`}
    >
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{getErrorIcon(error.type)}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{error.title}</h4>
          <p className="text-sm opacity-90 mt-1">{error.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

// Notification Display Component
export function NotificationDisplay({ notification, onClose }) {
  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500 to-emerald-500',
          icon: '✅',
        };
      case 'error':
        return {
          bg: 'from-red-500 to-red-600',
          icon: '❌',
        };
      case 'warning':
        return {
          bg: 'from-yellow-500 to-orange-500',
          icon: '⚠️',
        };
      default:
        return {
          bg: 'from-blue-500 to-indigo-500',
          icon: 'ℹ️',
        };
    }
  };

  const styles = getNotificationStyles(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className={`bg-gradient-to-r ${styles.bg} text-white p-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm min-w-80`}
    >
      <div className="flex items-start space-x-3">
        <span className="text-xl">{styles.icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors text-sm"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

// Global Error Boundary
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md"
          >
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-white/70 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            >
              Refresh Page
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Spinner Component
export function LoadingSpinner({ size = 'md', message }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-2 border-white/20 border-t-white rounded-full`}
      />
      {message && (
        <p className="text-white/70 text-sm text-center">{message}</p>
      )}
    </div>
  );
}

// Global Loading Overlay
export function GlobalLoadingOverlay({ isLoading, message = 'Loading...' }) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
      >
        <LoadingSpinner size="lg" message={message} />
      </motion.div>
    </motion.div>
  );
}

// App Container with Error and Notification Displays
export function AppContainer({ children }) {
  const { errors, removeError, notifications, removeNotification, globalLoading } = useApp();

  return (
    <>
      {/* Global Loading Overlay */}
      <GlobalLoadingOverlay isLoading={globalLoading} />

      {/* Error Display */}
      <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
        <AnimatePresence>
          {errors.map((error) => (
            <ErrorDisplay
              key={error.id}
              error={error}
              onClose={() => removeError(error.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Notification Display */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2 max-w-sm">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationDisplay
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      {children}
    </>
  );
}