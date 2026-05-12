// Common validation rules for admin forms

// Bilingual error messages (English/Gujarati)
const errorMessages = {
  required: {
    en: 'is required',
    gu: 'જરૂરી છે'
  },
  emailRequired: {
    en: 'Email address is required. Please enter a valid email.',
    gu: 'ઈમેલ એડ્રેસ જરૂરી છે. કૃપય એક માન્ય ઈમેલ દાખો.'
  },
  phoneRequired: {
    en: 'Phone number is required. Please enter a valid phone number.',
    gu: 'ફોન નંબર જરૂરી છે. કૃપય એક માન્ય ફોન નંબર દાખો.'
  },
  nameRequired: {
    en: 'Name is required. Please enter your full name.',
    gu: 'નામ જરૂરી છે. કૃપય તમારું પૂરું નામ દાખો.'
  },
  invalidEmail: {
    en: 'Please enter a valid email address.',
    gu: 'કૃપય એક માન્ય ઈમેલ દાખો.'
  },
  invalidPhone: {
    en: 'Please enter a valid phone number.',
    gu: 'કૃપય એક માન્ય ફોન નંબર દાખો.'
  },
  phoneRange: {
    en: 'Phone number must be between 10-15 digits',
    gu: 'ફોન નંબર ૧૦-૧૫ અંકો હોવો જોઈએ'
  },
  passwordMatch: {
    en: 'Passwords do not match. Please ensure both passwords are identical.',
    gu: 'પાસવર્ડ બંધબા નથી. કૃપય બંન્ના પાસવર્ડ સમાન હોવ તે સુનિશ્ચિત કરો.'
  },
  minLength: {
    en: 'must be at least',
    gu: 'ઓછામાં'
  },
  maxLength: {
    en: 'cannot exceed',
    gu: 'વધારે શકો ભોળ'
  },
  characters: {
    en: 'characters',
    gu: 'અક્ષરો'
  }
};

// Helper function to get bilingual message
const getBilingualMessage = (key, fieldName = '', params = {}) => {
  const message = errorMessages[key];
  if (!message) return '';
  
  let enMsg = message.en;
  let guMsg = message.gu;
  
  // Replace field name and parameters
  if (fieldName) {
    enMsg = enMsg.replace('{field}', fieldName);
    guMsg = guMsg.replace('{field}', fieldName);
  }
  
  Object.keys(params).forEach(param => {
    const value = params[param];
    enMsg = enMsg.replace(`{${param}}`, value);
    guMsg = guMsg.replace(`{${param}}`, value);
  });
  
  return { en: enMsg, gu: guMsg };
};

export const commonValidationRules = {
  // User/Staff validation
  full_name: {
    required: true,
    requiredMessage: () => getBilingualMessage('nameRequired', 'Full Name'),
    minLength: 2,
    maxLength: 50,
    message: () => getBilingualMessage('minLength', 'Full Name', { min: 2 }) + ' ' + getBilingualMessage('characters').en + ' ' + getBilingualMessage('maxLength', 'Full Name', { max: 50 })
  },
  email: {
    required: true,
    requiredMessage: () => getBilingualMessage('emailRequired'),
    email: true,
    maxLength: 100,
    message: () => getBilingualMessage('invalidEmail')
  },
  phone: {
    required: true,
    requiredMessage: () => getBilingualMessage('phoneRequired'),
    phone: true,
    minLength: 10,
    maxLength: 15,
    message: () => getBilingualMessage('phoneRange'),
    validate: (value) => {
      // Support both English digits and Gujarati numerals
      const gujaratiToEnglish = value.replace(/[૦૧૨૩૪૫૬૭૮૯૦૧૨૩૪૫૬૭૮૯]/g, (match) => {
        const gujaratiDigits = '૦૧૨૩૪૫૬૭૮૯';
        const englishDigits = '0123456789';
        const index = gujaratiDigits.indexOf(match);
        return index !== -1 ? englishDigits[index] : match;
      });
      
      // Remove all non-digit characters after conversion
      const digitsOnly = gujaratiToEnglish.replace(/\D/g, '');
      
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return getBilingualMessage('phoneRange');
      }
      
      // Check if it's a valid phone number format
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(digitsOnly)) {
        return getBilingualMessage('invalidPhone');
      }
      
      return '';
    }
  },
  password: {
    required: true,
    requiredMessage: () => getBilingualMessage('passwordRequired'),
    minLength: 6,
    maxLength: 50,
    message: () => getBilingualMessage('minLength', 'Password', { min: 6 }) + ' ' + getBilingualMessage('characters').en + ' ' + getBilingualMessage('maxLength', 'Password', { max: 50 })
  },
  confirmPassword: {
    required: true,
    requiredMessage: () => getBilingualMessage('passwordRequired'),
    validate: (value, form) => {
      if (value !== form.password) {
        return getBilingualMessage('passwordMatch');
      }
      return '';
    }
  },
  
  // Room validation
  roomNumber: {
    required: true,
    requiredMessage: 'Room number is required.',
    maxLength: 10
  },
  roomType: {
    required: true,
    requiredMessage: 'Please select a room type.'
  },
  capacity: {
    required: true,
    requiredMessage: 'Capacity is required.',
    validate: (value) => {
      const num = parseInt(value);
      if (isNaN(num) || num < 1) {
        return 'Capacity must be at least 1 person.';
      }
      if (num > 10) {
        return 'Capacity cannot exceed 10 people.';
      }
      return '';
    }
  },
  
  // Table validation
  tableNo: {
    required: true,
    requiredMessage: 'Table number is required.',
    maxLength: 10
  },
  area: {
    required: true,
    requiredMessage: 'Please select an area.'
  },
  
  // Blog validation
  title: {
    required: true,
    requiredMessage: 'Blog title is required.',
    minLength: 5,
    maxLength: 100,
    message: 'Title must be between 5 and 100 characters'
  },
  content: {
    required: true,
    requiredMessage: 'Blog content is required.',
    minLength: 20,
    message: 'Content must be at least 20 characters long'
  },
  
  // General validation
  role: {
    required: true,
    requiredMessage: 'Please select a role.'
  },
  status: {
    required: true,
    requiredMessage: 'Please select a status.'
  },
  department: {
    required: true,
    requiredMessage: 'Please select a department.'
  },
  
  // Price validation
  price: {
    required: true,
    requiredMessage: 'Price is required.',
    validate: (value) => {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        return 'Please enter a valid price.';
      }
      return '';
    }
  },
  
  // Description validation
  description: {
    required: false,
    maxLength: 500,
    message: 'Description cannot exceed 500 characters'
  }
};

// Helper function to get validation rules for specific forms
export const getValidationRules = (formType) => {
  const ruleSets = {
    user: ['full_name', 'email', 'phone', 'password', 'confirmPassword'],
    userEdit: ['full_name', 'email', 'phone'],
    staff: ['full_name', 'email', 'phone', 'password', 'confirmPassword', 'role', 'status', 'department'],
    staffEdit: ['full_name', 'email', 'phone', 'role', 'status', 'department'],
    room: ['roomNumber', 'roomType', 'capacity', 'status'],
    table: ['tableNo', 'area', 'capacity', 'status'],
    blog: ['title', 'content'],
    profile: ['full_name', 'email', 'phone']
  };

  const fields = ruleSets[formType] || [];
  const rules = {};
  
  fields.forEach(field => {
    if (commonValidationRules[field]) {
      rules[field] = commonValidationRules[field];
    }
  });

  return rules;
};
