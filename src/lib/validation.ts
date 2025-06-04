import { z } from 'zod';

// Common validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (length: number) => `Must be at least ${length} characters`,
  maxLength: (length: number) => `Must be at most ${length} characters`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be at most ${max}`,
  url: 'Please enter a valid URL',
  number: 'Please enter a valid number',
  positive: 'Must be a positive number',
  integer: 'Must be an integer',
  match: (field: string) => `Must match ${field}`,
  invalid: (field: string) => `Invalid ${field}`,
};

// Common validation schemas
export const schemas = {
  email: z.string().min(1, VALIDATION_MESSAGES.required).email(VALIDATION_MESSAGES.email),
  password: z
    .string()
    .min(8, VALIDATION_MESSAGES.minLength(8))
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  url: z.string().url(VALIDATION_MESSAGES.url),
  phone: z
    .string()
    .regex(
      /^\+?[0-9\s-]{10,}$/,
      'Please enter a valid phone number (e.g., +1234567890)'
    ),
  positiveNumber: z.number().positive(VALIDATION_MESSAGES.positive),
  integer: z.number().int(VALIDATION_MESSAGES.integer),
  nonEmptyString: (field: string) =>
    z.string().min(1, `${field} is required`),
};

// Feedback form schema
export const feedbackFormSchema = z.object({
  type: z.enum(['bug', 'feature', 'general'], {
    required_error: 'Please select a feedback type',
  }),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be at most 2000 characters'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority',
  }),
  screenshot: z.string().nullable().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms to submit feedback',
  }),
  metadata: z.record(z.any()).optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

// Progress log schema
export const progressLogSchema = z.object({
  noteType: z.enum(['Update', 'Comment', 'Decision']),
  comment: z.string().min(1, 'Comment is required'),
});

export type ProgressLogValues = z.infer<typeof progressLogSchema>;

// User profile schema
export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: schemas.email,
  avatar: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
});

export type UserProfileValues = z.infer<typeof userProfileSchema>;

// Helper function to format validation errors
export function formatValidationError(
  error: z.ZodError | null | undefined
): Record<string, string> {
  if (!error) return {};

  return error.errors.reduce((acc, curr) => {
    const key = curr.path.join('.');
    return {
      ...acc,
      [key]: curr.message,
    };
  }, {});
}

// Helper function to validate form data against a schema
export async function validateFormData<T>(
  formData: FormData,
  schema: z.ZodSchema<T>
): Promise<{ data?: T; errors?: Record<string, string> }> {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = await schema.parseAsync(data);
    return { data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: formatValidationError(error),
      };
    }
    throw error;
  }
}

// Helper function to validate a single field
export function validateField<T>(
  value: unknown,
  schema: z.ZodSchema<T>
): { valid: boolean; error?: string } {
  try {
    schema.parse(value);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors[0]?.message || 'Invalid field',
      };
    }
    return { valid: false, error: 'Validation error' };
  }
}

// Helper function to create a validation schema with custom messages
export function createSchema<T extends z.ZodRawShape>(
  shape: T,
  messages?: Record<string, string>
) {
  return z.object(shape).superRefine((data, ctx) => {
    if (!messages) return;

    Object.entries(messages).forEach(([key, message]) => {
      if (!(key in data) || data[key as keyof typeof data] === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
          path: [key],
        });
      }
    });
  });
}

// Utility function to get the first validation error for a field
export function getFieldError(
  field: string,
  errors: Record<string, string> | undefined
): string | undefined {
  if (!errors) return undefined;
  return errors[field];
}

// Utility function to check if a field has an error
export function hasError(
  field: string,
  errors: Record<string, string> | undefined
): boolean {
  return !!getFieldError(field, errors);
}

// Utility function to get all validation errors as a string
export function getErrorMessages(
  errors: Record<string, string> | undefined
): string {
  if (!errors) return '';
  return Object.values(errors).join('\n');
}

// Utility function to validate a file
interface FileValidationOptions {
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): { valid: boolean; error?: string } {
  const { allowedTypes = [], maxSizeMB = 5 } = options;

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size (default 5MB)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

// Utility function to validate an image
export async function validateImage(
  file: File,
  options: { maxWidth?: number; maxHeight?: number } = {}
): Promise<{ valid: boolean; error?: string }> {
  const { maxWidth, maxHeight } = options;

  // First validate it's an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File is not an image' };
  }

  // If no dimension checks needed, return early
  if (!maxWidth && !maxHeight) {
    return { valid: true };
  }

  // Check image dimensions
  try {
    const img = new Image();
    const imgLoad = new Promise<{ width: number; height: number }>((resolve, reject) => {
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });

    const { width, height } = await imgLoad;

    if (maxWidth && width > maxWidth) {
      return {
        valid: false,
        error: `Image width (${width}px) exceeds maximum allowed width (${maxWidth}px)`,
      };
    }

    if (maxHeight && height > maxHeight) {
      return {
        valid: false,
        error: `Image height (${height}px) exceeds maximum allowed height (${maxHeight}px)`,
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating image:', error);
    return {
      valid: false,
      error: 'Failed to validate image dimensions',
    };
  }
}
