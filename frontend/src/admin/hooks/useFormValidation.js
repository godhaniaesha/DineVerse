import { useState } from 'react';

export const useFormValidation = (initialForm, validationRules) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return typeof rules.requiredMessage === 'function' ? rules.requiredMessage() : rules.requiredMessage || `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Email validation
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return typeof rules.message === 'function' ? rules.message() : rules.message || 'Please enter a valid email address';
    }

    // Phone validation
    if (rules.phone && value && !/^[+]?[\d\s\-\(\)]+$/.test(value)) {
      return typeof rules.message === 'function' ? rules.message() : rules.message || 'Please enter a valid phone number';
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      return typeof rules.message === 'function' ? rules.message() : rules.message || `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return typeof rules.message === 'function' ? rules.message() : rules.message || `${name.charAt(0).toUpperCase() + name.slice(1)} cannot exceed ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      return typeof rules.message === 'function' ? rules.message() : rules.message || `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
    }

    // Custom validation
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, form);
      if (customError) return customError;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, form[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const updateField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const setFieldValue = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
  };

  return {
    form,
    errors,
    setForm: updateField,
    setFieldValue,
    validateForm,
    validateField,
    clearErrors,
    resetForm
  };
};
