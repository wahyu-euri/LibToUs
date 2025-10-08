// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return password.length >= 8;
};

// ISBN validation (basic)
export const isValidISBN = (isbn) => {
  // Basic ISBN validation - can be enhanced for specific ISBN formats
  const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/;
  return isbnRegex.test(isbn.replace(/[-]/g, ''));
};

// Required field validation
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Number validation
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Positive number validation
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

// Year validation
export const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  return isNumber(year) && year >= 1000 && year <= currentYear;
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      if (rule.required && !isRequired(value)) {
        errors[field] = rule.message || `${field} is required`;
        break;
      }

      if (rule.email && !isValidEmail(value)) {
        errors[field] = rule.message || 'Invalid email format';
        break;
      }

      if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = rule.message || `Minimum ${rule.minLength} characters required`;
        break;
      }

      if (rule.match && value !== formData[rule.match]) {
        errors[field] = rule.message || 'Fields do not match';
        break;
      }

      if (rule.number && !isNumber(value)) {
        errors[field] = rule.message || 'Must be a number';
        break;
      }

      if (rule.positive && !isPositiveNumber(value)) {
        errors[field] = rule.message || 'Must be a positive number';
        break;
      }

      if (rule.year && !isValidYear(value)) {
        errors[field] = rule.message || 'Invalid year';
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};