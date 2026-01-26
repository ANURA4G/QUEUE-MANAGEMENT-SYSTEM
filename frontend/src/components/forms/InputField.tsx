import React from 'react';
import { clsx } from 'clsx';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, leftIcon, rightIcon, required, className, id, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full px-4 py-3 border rounded-lg text-text-primary bg-white placeholder-text-muted transition-colors duration-200',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-border',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-text-muted mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

// Select Field
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, hint, options, required, className, id, ...props }, ref) => {
    const selectId = id || `select-${label?.toLowerCase().replace(/\s/g, '-')}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-primary mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full px-4 py-3 border rounded-lg text-text-primary bg-white transition-colors duration-200 appearance-none',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
            'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-no-repeat bg-[right_1rem_center]',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-border',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="text-sm text-text-muted mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

// Radio Group
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required,
  layout = 'horizontal',
}) => {
  return (
    <fieldset className="w-full">
      {label && (
        <legend className="block text-sm font-medium text-text-primary mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
      )}
      <div
        className={clsx(
          'flex gap-4',
          layout === 'vertical' ? 'flex-col' : 'flex-wrap'
        )}
        role="radiogroup"
        aria-invalid={!!error}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={clsx(
              'relative flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all',
              value === option.value
                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                : 'border-border hover:border-primary-300',
              layout === 'horizontal' && 'flex-1 min-w-[200px]'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              className="sr-only"
            />
            <div
              className={clsx(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                value === option.value
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-border'
              )}
            >
              {value === option.value && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {option.icon && <span className="text-xl">{option.icon}</span>}
                <span className="font-medium text-text-primary">{option.label}</span>
              </div>
              {option.description && (
                <p className="text-sm text-text-secondary mt-1">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};

export default InputField;
