'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  id: string;
  name: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  inputClassName?: string;
  showLabel?: string;
  hideLabel?: string;
  describedBy?: string;
  hasError?: boolean;
}

/** Accessible password input with an explicit show/hide toggle and focus-visible ring. */
export function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  placeholder = '••••••••',
  required = false,
  minLength,
  maxLength,
  inputClassName = '',
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  describedBy,
  hasError = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[12px] font-semibold text-[#3F3F46] mb-1.5"
      >
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-[10px] border transition-[background-color,border-color,box-shadow] duration-150 ${
          hasError
            ? 'border-[#FCA5A5] bg-[#FEF2F2]/50 focus-within:bg-[#FFFFFF] focus-within:border-[#DC2626] focus-within:ring-[3px] focus-within:ring-[#DC2626]/12'
            : 'border-[#E4E4E7] bg-[#FAFAFA] hover:border-[#D4D4D8] focus-within:bg-[#FFFFFF] focus-within:border-[#18181B] focus-within:ring-[3px] focus-within:ring-[#18181B]/10'
        }`}
      >
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className={`w-full min-w-0 flex-1 bg-transparent pl-3.5 pr-1.5 py-2.5 text-[13.5px] text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none ${inputClassName}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          className="mr-1.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] active:bg-[#E4E4E7] active:scale-[0.94] motion-reduce:active:scale-100 transition-[color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
