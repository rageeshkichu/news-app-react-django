const ERROR_MESSAGES = {
  
  NETWORK_ERROR: 'Network error. Please check your internet connection.',  TIMEOUT_ERROR: 'Request timeout. Please try again.',  400: 'Bad request. Please check your input.',  401: 'Unauthorized. Please log in again.',  403: 'Access forbidden.',  404: 'Resource not found.',  405: 'Method not allowed.',  409: 'Conflict. Resource may already exist.',  422: 'Unprocessable entity. Please check your input.',  429: 'Too many requests. Please try again later.',  500: 'Server error. Please try again later.',  502: 'Bad gateway. Please try again later.',  503: 'Service unavailable. Please try again later.',  DEFAULT: 'An unexpected error occurred. Please try again.',};

export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || data?.error || ERROR_MESSAGES[status] || ERROR_MESSAGES.DEFAULT;
    
    return {
      message,      status,      originalError: error,    };
  }

  if (error.request) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,      status: 0,      originalError: error,    };
  }

  if (error.code === 'ECONNABORTED') {
    return {
      message: ERROR_MESSAGES.TIMEOUT_ERROR,      status: 0,      originalError: error,    };
  }

  return {
    message: error.message || ERROR_MESSAGES.DEFAULT,    status: 0,    originalError: error,  };
};

export const validateFormInput = (data, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!data[field] || data[field].toString().trim() === '') {
      errors[field] = `${field} is required`;
    }
  });

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (data.password && data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,    errors,  };
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isAuthError = (status) => {
  return status === 401 || status === 403;
};

export const isValidationError = (status) => {
  return status === 400 || status === 422;
};

export const getErrorStatus = (error) => {
  return error?.response?.status || 0;
};

export const isNetworkError = (error) => {
  return !error?.response && error?.request;
};

export default {
  handleApiError,  validateFormInput,  isValidEmail,  isAuthError,  isValidationError,  getErrorStatus,  isNetworkError,};
