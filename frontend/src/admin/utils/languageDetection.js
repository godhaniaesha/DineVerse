// Language detection utility for Gujarati/English input

// Gujarati Unicode range for characters
const GUJARATI_UNICODE_RANGE = /[\u0A80-\u0AFF\u200C\u200D\u2B81-\u2BFF]/;

// Gujarati numerals
const GUJARATI_NUMERALS = /[૦૧૨૩૪૫૬૭૮૯]/;

// English numerals
const ENGLISH_NUMERALS = /[0-9]/;

export const detectLanguage = (text) => {
  if (!text || text.length === 0) return 'unknown';
  
  // Check for Gujarati characters
  if (GUJARATI_UNICODE_RANGE.test(text)) {
    return 'gujarati';
  }
  
  // Check for Gujarati numerals
  if (GUJARATI_NUMERALS.test(text)) {
    return 'gujarati';
  }
  
  // Check for English characters
  if (/[a-zA-Z]/.test(text)) {
    return 'english';
  }
  
  // Mixed content
  if (GUJARATI_UNICODE_RANGE.test(text) && /[a-zA-Z]/.test(text)) {
    return 'mixed';
  }
  
  return 'unknown';
};

export const isGujaratiInput = (text) => {
  return detectLanguage(text) === 'gujarati';
};

export const isMixedInput = (text) => {
  return detectLanguage(text) === 'mixed';
};

export const getLanguagePreference = () => {
  // Get user's language preference from localStorage or default to 'english'
  return localStorage.getItem('adminLanguage') || 'english';
};

export const setLanguagePreference = (language) => {
  localStorage.setItem('adminLanguage', language);
};

// Convert Gujarati numerals to English numerals
export const convertGujaratiNumerals = (text) => {
  return text.replace(/[૦૧૨૩૪૫૬૭૮૯]/g, (match) => {
    const gujaratiDigits = '૦૧૨૩૪૫૬૭૮૯';
    const englishDigits = '0123456789';
    const index = gujaratiDigits.indexOf(match);
    return index !== -1 ? englishDigits[index] : match;
  });
};
