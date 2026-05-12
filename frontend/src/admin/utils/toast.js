// Toast utility functions for easy usage throughout the admin app

export const showToast = (type, title, message, duration = 5000) => {
  const event = new CustomEvent('showToast', {
    detail: { type, title, message, duration }
  });
  document.dispatchEvent(event);
};

// Convenience methods
export const showSuccessToast = (message, title = 'Success') => {
  showToast('success', title, message);
};

export const showErrorToast = (message, title = 'Error') => {
  showToast('error', title, message, 6000); // Errors stay longer
};

export const showWarningToast = (message, title = 'Warning') => {
  showToast('warning', title, message);
};

export const showInfoToast = (message, title = 'Info') => {
  showToast('info', title, message);
};

// Form validation helper with enhanced messages (for inline validation)
export const showValidationError = (errors, fieldName = '') => {
  // This is now used for inline validation - no toasts for individual field errors
  // Return the errors for inline display instead of showing toasts
  if (typeof errors === 'string') {
    return { general: errors };
  } else if (Array.isArray(errors)) {
    return { general: errors.join(', ') };
  } else if (typeof errors === 'object') {
    return errors;
  }
  return {};
};

// Show validation errors as toast (only for critical validation failures)
export const showValidationErrorToast = (errors) => {
  if (typeof errors === 'string') {
    showErrorToast(errors, 'Validation Error');
  } else if (Array.isArray(errors)) {
    errors.forEach(error => {
      showErrorToast(error, 'Validation Error');
    });
  } else if (typeof errors === 'object') {
    Object.values(errors).forEach(error => {
      if (Array.isArray(error)) {
        error.forEach(err => showErrorToast(err, 'Validation Error'));
      } else {
        showErrorToast(error, 'Validation Error');
      }
    });
  }
};

// Enhanced field-specific validation messages
export const showFieldValidationError = (fieldName, requirement) => {
  const messages = {
    required: `${fieldName} is required. Please fill this field to continue.`,
    email: `Please enter a valid email address for ${fieldName}.`,
    phone: `Please enter a valid phone number for ${fieldName}.`,
    minLength: `${fieldName} must be at least ${requirement} characters long.`,
    maxLength: `${fieldName} cannot exceed ${requirement} characters.`,
    passwordMatch: `Passwords do not match. Please ensure both passwords are identical.`,
    passwordRequired: `Password is required. Please enter a secure password.`,
    emailRequired: `Email address is required. Please enter a valid email.`,
    nameRequired: `Name is required. Please enter your full name.`,
    phoneRequired: `Phone number is required. Please enter a valid phone number.`,
    selectRequired: `Please select an option from ${fieldName}.`,
    fileRequired: `Please upload a file for ${fieldName}.`,
    imageRequired: `Please upload an image for ${fieldName}.`,
    urlRequired: `Please enter a valid URL for ${fieldName}.`,
    numberRequired: `Please enter a valid number for ${fieldName}.`,
    dateRequired: `Please select a date for ${fieldName}.`,
    timeRequired: `Please select a time for ${fieldName}.`,
    invalidFormat: `Invalid format for ${fieldName}. ${requirement}`,
    duplicate: `This ${fieldName} already exists. Please use a different value.`,
    range: `${fieldName} must be between ${requirement}.`
  };

  const message = messages[requirement] || `${fieldName}: ${requirement}`;
  showErrorToast(message, 'Validation Error');
};

// Comprehensive form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = [];

  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
    }

    // Email validation
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push(`Please enter a valid email address`);
    }

    // Phone validation
    if (rules.phone && value && !/^[+]?[\d\s\-\(\)]+$/.test(value)) {
      errors.push(`Please enter a valid phone number`);
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`);
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot exceed ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors.push(rules.message || `${field.charAt(0).toUpperCase() + field.slice(1)} format is invalid`);
    }
  });

  return errors;
};

// API error handler
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  let message = defaultMessage;
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  // Handle specific authentication errors
  if (message.includes('Authentication') || message.includes('login') || message.includes('token')) {
    showErrorToast(message, 'Authentication Error');
  } else if (message.includes('validation') || message.includes('required')) {
    showErrorToast(message, 'Validation Error');
  } else if (message.includes('permission') || message.includes('unauthorized')) {
    showErrorToast(message, 'Permission Error');
  } else {
    showErrorToast(message, 'Error');
  }
};

// Success handler
export const handleSuccess = (message, title = 'Success') => {
  showSuccessToast(message, title);
};
