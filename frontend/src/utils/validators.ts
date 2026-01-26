import { z } from 'zod';
import { VALIDATION_RULES } from './constants';

// Booking Form Schema
export const bookingSchema = z.object({
  life_certificate_no: z
    .string()
    .min(VALIDATION_RULES.lifeCertificateNo.minLength, 'Certificate number must be at least 5 characters')
    .max(VALIDATION_RULES.lifeCertificateNo.maxLength, 'Certificate number must not exceed 20 characters')
    .regex(VALIDATION_RULES.lifeCertificateNo.pattern, 'Certificate number must contain only letters and numbers'),
  
  name: z
    .string()
    .min(VALIDATION_RULES.name.minLength, 'Name must be at least 2 characters')
    .max(VALIDATION_RULES.name.maxLength, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, periods, apostrophes, and hyphens'),
  
  age: z
    .number({
      required_error: 'Age is required',
      invalid_type_error: 'Age must be a number',
    })
    .min(VALIDATION_RULES.age.min, 'Age must be at least 0')
    .max(VALIDATION_RULES.age.max, 'Age must not exceed 150'),
  
  phone: z
    .string()
    .length(VALIDATION_RULES.phone.length, 'Phone number must be exactly 10 digits')
    .regex(VALIDATION_RULES.phone.pattern, 'Phone number must contain only digits'),
  
  proof_guardian_name: z
    .string()
    .min(VALIDATION_RULES.name.minLength, 'Guardian name must be at least 2 characters')
    .max(VALIDATION_RULES.name.maxLength, 'Guardian name must not exceed 100 characters'),
  
  verification_mode: z.enum(['presence', 'online'], {
    required_error: 'Please select a verification mode',
  }),
  
  preferred_date: z
    .string()
    .regex(VALIDATION_RULES.date.pattern, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Date cannot be in the past'),
  
  preferred_time: z
    .string()
    .regex(VALIDATION_RULES.time.pattern, 'Time must be in HH:MM format'),
});

// Search Form Schema
export const searchSchema = z.object({
  life_certificate_no: z
    .string()
    .min(1, 'Please enter a certificate number')
    .min(VALIDATION_RULES.lifeCertificateNo.minLength, 'Certificate number must be at least 5 characters'),
});

// Admin Login Schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

// Validation helper functions
export const validateLifeCertificateNo = (value: string): string | null => {
  if (!value) return 'Certificate number is required';
  if (value.length < VALIDATION_RULES.lifeCertificateNo.minLength) {
    return 'Certificate number must be at least 5 characters';
  }
  if (!VALIDATION_RULES.lifeCertificateNo.pattern.test(value)) {
    return 'Certificate number must contain only letters and numbers';
  }
  return null;
};

export const validatePhone = (value: string): string | null => {
  if (!value) return 'Phone number is required';
  if (!VALIDATION_RULES.phone.pattern.test(value)) {
    return 'Phone number must be exactly 10 digits';
  }
  return null;
};

export const validateAge = (value: number | string): string | null => {
  const age = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(age)) return 'Age must be a number';
  if (age < VALIDATION_RULES.age.min) return 'Age must be at least 0';
  if (age > VALIDATION_RULES.age.max) return 'Age must not exceed 150';
  return null;
};

export const validateDate = (value: string): string | null => {
  if (!value) return 'Date is required';
  if (!VALIDATION_RULES.date.pattern.test(value)) {
    return 'Date must be in YYYY-MM-DD format';
  }
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return 'Date cannot be in the past';
  }
  return null;
};

export const validateTime = (value: string): string | null => {
  if (!value) return 'Time is required';
  if (!VALIDATION_RULES.time.pattern.test(value)) {
    return 'Time must be in HH:MM format';
  }
  return null;
};

// Type exports for form data
export type BookingFormData = z.infer<typeof bookingSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
