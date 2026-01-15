import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface IOSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const IOSInput = forwardRef<HTMLInputElement, IOSInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="ios-font ios-subhead text-muted-foreground uppercase tracking-wide px-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "ios-input ios-font w-full",
            error && "ring-2 ring-destructive/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="ios-caption text-destructive px-1">{error}</p>
        )}
      </div>
    );
  }
);

IOSInput.displayName = 'IOSInput';

interface IOSTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const IOSTextarea = forwardRef<HTMLTextAreaElement, IOSTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="ios-font ios-subhead text-muted-foreground uppercase tracking-wide px-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "ios-input ios-font w-full resize-none min-h-[100px]",
            error && "ring-2 ring-destructive/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="ios-caption text-destructive px-1">{error}</p>
        )}
      </div>
    );
  }
);

IOSTextarea.displayName = 'IOSTextarea';

export default IOSInput;
