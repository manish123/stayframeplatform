import { useState, useCallback, useEffect, useRef } from 'react';
import { z, ZodSchema } from 'zod';
import { toast } from 'sonner';
import { formatValidationError } from '@/lib/validation';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  onSuccess,
  onError,
  validateOnChange = true,
  validateOnBlur = true,
  validateOnMount = false,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const isMounted = useRef(true);

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Validate form on mount if needed
  useEffect(() => {
    if (validateOnMount && validationSchema) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate the form against the schema
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    setIsValidating(true);

    try {
      await validationSchema.parseAsync(values);
      if (isMounted.current) {
        setErrors({});
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = formatValidationError(error) as FormErrors<T>;
        if (isMounted.current) {
          setErrors(formattedErrors);
        }
        return false;
      }
      return false;
    } finally {
      if (isMounted.current) {
        setIsValidating(false);
      }
    }
  }, [validationSchema, values]);

  // Validate a single field
  const validateField = useCallback(
    async (name: keyof T): Promise<string | undefined> => {
      if (!validationSchema) return undefined;

      try {
        // Create a schema for just this field
        const fieldSchema = z.object({
          [name]: (validationSchema as any).shape[name],
        });

        // Validate just this field
        await fieldSchema.parseAsync({ [name]: values[name] });
        
        // Clear any existing error for this field
        if (isMounted.current) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
        
        return undefined;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedError = formatValidationError(error)[name as string];
          if (isMounted.current) {
            setErrors((prev) => ({
              ...prev,
              [name]: formattedError,
            }));
          }
          return formattedError;
        }
        return 'Validation error';
      }
    },
    [validationSchema, values]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      ) as FormTouched<T>;
      
      if (isMounted.current) {
        setTouched(allTouched);
      }

      // Validate the form
      if (validationSchema) {
        const isValid = await validateForm();
        if (!isValid) {
          // Focus the first field with an error
          const firstError = Object.keys(errors)[0];
          if (firstError) {
            document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
          return;
        }
      }

      // Submit the form
      try {
        if (isMounted.current) {
          setIsSubmitting(true);
        }
        
        const result = await onSubmit(values);
        
        if (isMounted.current) {
          onSuccess?.(result);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        
        if (isMounted.current) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          toast.error(errorMessage);
          onError?.(error as Error);
        }
      } finally {
        if (isMounted.current) {
          setIsSubmitting(false);
        }
      }
    },
    [errors, onError, onSuccess, onSubmit, validateForm, validationSchema, values]
  );

  // Handle field changes
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      
      // Handle different input types
      let finalValue: any = value;
      
      if (type === 'number' || type === 'range') {
        finalValue = value === '' ? '' : Number(value);
      } else if (type === 'checkbox') {
        finalValue = (e.target as HTMLInputElement).checked;
      }
      
      // Update the field value
      setValues((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
      
      // Validate the field if needed
      if (validateOnChange) {
        validateField(name as keyof T);
      }
    },
    [validateField, validateOnChange]
  );

  // Handle blur events
  const handleBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      
      // Mark the field as touched
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
      
      // Validate the field if needed
      if (validateOnBlur) {
        await validateField(name as keyof T);
      }
    },
    [validateField, validateOnBlur]
  );

  // Set a field value manually
  const setFieldValue = useCallback(
    <K extends keyof T>(name: K, value: T[K], validate = true) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      
      if (validate && validateOnChange) {
        validateField(name);
      }
    },
    [validateField, validateOnChange]
  );

  // Set multiple field values
  const setValuesPartial = useCallback(
    (values: Partial<T>, validate = true) => {
      setValues((prev) => ({
        ...prev,
        ...values,
      }));
      
      if (validate && validateOnChange) {
        // Validate all fields that were updated
        Object.keys(values).forEach((key) => {
          validateField(key as keyof T);
        });
      }
    },
    [validateField, validateOnChange]
  );

  // Set a field as touched
  const setFieldTouched = useCallback(
    (name: keyof T, isTouched = true, validate = true) => {
      setTouched((prev) => ({
        ...prev,
        [name]: isTouched,
      }));
      
      if (validate && isTouched && validateOnBlur) {
        validateField(name);
      }
    },
    [validateField, validateOnBlur]
  );

  // Set an error for a field
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  // Reset the form
  const resetForm = useCallback((values?: T) => {
    setValues(values || initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Check if the form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isValid,
    
    // Event handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Form actions
    setFieldValue,
    setValues: setValuesPartial,
    setFieldTouched,
    setFieldError,
    setErrors: (errors: FormErrors<T>) => setErrors(errors),
    setTouched: (touched: FormTouched<T>) => setTouched(touched),
    resetForm,
    validateForm,
    validateField,
    
    // Helper functions
    getFieldProps: (name: keyof T) => ({
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
    }),
    
    getFieldMeta: (name: keyof T) => ({
      value: values[name],
      error: errors[name],
      touched: !!touched[name],
    }),
  };
}

// Helper hook for field arrays
interface UseFieldArrayOptions<T> {
  name: string;
  values: T[];
  onChange: (values: T[]) => void;
  defaultItem?: T;
}

export function useFieldArray<T>({
  name,
  values = [],
  onChange,
  defaultItem,
}: UseFieldArrayOptions<T>) {
  // Add a new item to the array
  const append = useCallback(
    (item: T) => {
      onChange([...values, item]);
    },
    [onChange, values]
  );

  // Insert an item at a specific index
  const insert = useCallback(
    (index: number, item: T) => {
      const newValues = [...values];
      newValues.splice(index, 0, item);
      onChange(newValues);
    },
    [onChange, values]
  );

  // Update an item at a specific index
  const update = useCallback(
    (index: number, item: T) => {
      const newValues = [...values];
      newValues[index] = item;
      onChange(newValues);
    },
    [onChange, values]
  );

  // Remove an item at a specific index
  const remove = useCallback(
    (index: number) => {
      const newValues = values.filter((_, i) => i !== index);
      onChange(newValues);
    },
    [onChange, values]
  );

  // Move an item to a new index
  const move = useCallback(
    (from: number, to: number) => {
      const newValues = [...values];
      const [movedItem] = newValues.splice(from, 1);
      newValues.splice(to, 0, movedItem);
      onChange(newValues);
    },
    [onChange, values]
  );

  // Swap two items
  const swap = useCallback(
    (indexA: number, indexB: number) => {
      const newValues = [...values];
      [newValues[indexA], newValues[indexB]] = [newValues[indexB], newValues[indexA]];
      onChange(newValues);
    },
    [onChange, values]
  );

  // Replace the entire array
  const replace = useCallback(
    (newValues: T[]) => {
      onChange(newValues);
    },
    [onChange]
  );

  // Add a new default item
  const addDefault = useCallback(() => {
    if (defaultItem !== undefined) {
      append(defaultItem);
    }
  }, [append, defaultItem]);

  return {
    fields: values,
    append,
    insert,
    update,
    remove,
    move,
    swap,
    replace,
    add: addDefault,
    name,
  };
}
