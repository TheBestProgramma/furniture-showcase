/**
 * Security utilities for input validation and sanitization
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters and patterns
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .replace(/&/g, '&amp;') // Escape ampersands
    .trim();
}

/**
 * Sanitize HTML content (more permissive than sanitizeInput)
 */
export function sanitizeHTML(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate phone number (Kenyan format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (typeof phone !== 'string') {
    return false;
  }

  const cleaned = phone.replace(/\D/g, '');
  return /^(254|0)?[0-9]{9}$/.test(cleaned);
}

/**
 * Validate and sanitize URL
 */
export function isValidURL(url: string): boolean {
  if (typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize MongoDB query to prevent NoSQL injection
 */
export function sanitizeMongoQuery(query: any): any {
  if (typeof query !== 'object' || query === null) {
    return query;
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(query)) {
    // Prevent MongoDB operators injection
    if (key.startsWith('$')) {
      continue; // Skip MongoDB operators from user input
    }

    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeMongoQuery(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate numeric input
 */
export function isValidNumber(value: any, min?: number, max?: number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(num)) {
    return false;
  }

  if (min !== undefined && num < min) {
    return false;
  }

  if (max !== undefined && num > max) {
    return false;
  }

  return true;
}

/**
 * Validate and sanitize text input with length constraints
 */
export function validateTextInput(
  input: string,
  minLength?: number,
  maxLength?: number
): { isValid: boolean; sanitized: string; error?: string } {
  if (typeof input !== 'string') {
    return {
      isValid: false,
      sanitized: '',
      error: 'Input must be a string'
    };
  }

  const sanitized = sanitizeInput(input);

  if (minLength !== undefined && sanitized.length < minLength) {
    return {
      isValid: false,
      sanitized,
      error: `Input must be at least ${minLength} characters`
    };
  }

  if (maxLength !== undefined && sanitized.length > maxLength) {
    return {
      isValid: false,
      sanitized,
      error: `Input must not exceed ${maxLength} characters`
    };
  }

  return {
    isValid: true,
    sanitized
  };
}

/**
 * Escape special characters for use in regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate ObjectId format (MongoDB)
 */
export function isValidObjectId(id: string): boolean {
  if (typeof id !== 'string') {
    return false;
  }

  return /^[0-9a-fA-F]{24}$/.test(id);
}

