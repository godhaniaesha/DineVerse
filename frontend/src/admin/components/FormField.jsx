import React, { useState, useEffect } from 'react';
import { detectLanguage, isGujaratiInput, convertGujaratiNumerals } from '../utils/languageDetection';

export default function FormField({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  error, 
  required = false, 
  placeholder = '',
  options = [],
  disabled = false,
  ...props 
}) {
  const hasError = !!error;
  const [detectedLanguage, setDetectedLanguage] = useState('unknown');
  const [showLanguageIndicator, setShowLanguageIndicator] = useState(false);
  
  // Detect language when value changes
  useEffect(() => {
    if (value && value.length > 0) {
      const lang = detectLanguage(value);
      setDetectedLanguage(lang);
      setShowLanguageIndicator(lang === 'gujarati' || lang === 'mixed');
    } else {
      setDetectedLanguage('unknown');
      setShowLanguageIndicator(false);
    }
  }, [value]);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // If phone field and Gujarati input detected, convert numerals
    if (type === 'tel' && (isGujaratiInput(newValue) || detectedLanguage === 'gujarati')) {
      const convertedValue = convertGujaratiNumerals(newValue);
      e.target.value = convertedValue;
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  
  return (
    <div className="form-field">
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <label className={`form-field__label ${required ? 'form-field__label--required' : ''}`}>
            {label}
          </label>
          {showLanguageIndicator && (
            <span 
              className="form-field__language-indicator"
              title={`Detected: ${detectedLanguage === 'gujarati' ? 'Gujarati' : detectedLanguage === 'mixed' ? 'Mixed' : 'English'}`}
            >
              {detectedLanguage === 'gujarati' ? '🇮🇳' : detectedLanguage === 'mixed' ? '🌐' : '🇺🇸'}
            </span>
          )}
        </div>
      )}
      
      {type === 'select' ? (
        <select
          className={`form-field__input ${hasError ? 'form-field__input--error' : ''} ${disabled ? 'form-field__input--disabled' : ''}`}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map(option => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className={`form-field__input ${hasError ? 'form-field__input--error' : ''} ${disabled ? 'form-field__input--disabled' : ''}`}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      ) : (
        <input
          type={type}
          className={`form-field__input ${hasError ? 'form-field__input--error' : ''} ${disabled ? 'form-field__input--disabled' : ''}`}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      )}
      
      {hasError && (
        <div className="form-field__error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
