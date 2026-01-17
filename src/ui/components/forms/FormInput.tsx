import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/ui/atoms/label";

export interface FormInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    labelClassName?: string;
    containerClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    (
        {
            label,
            error,
            required = false,
            hint,
            labelClassName,
            containerClassName,
            className,
            id,
            ...props
        },
        ref
    ) => {
        // Generate id from label if not provided
        const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className={cn("space-y-2", containerClassName)}>
                <Label
                    required={required}
                    htmlFor={inputId}
                    className={cn(
                        "block text-sm font-medium text-gray-700",
                        labelClassName
                    )}
                >
                    {label}
                </Label>
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full px-4 py-3 border rounded-lg bg-gray-50 transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-[#FF7043] focus:border-transparent",
                        "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
                        error
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300",
                        className
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={
                        error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
                    }
                    {...props}
                />
                {hint && !error && (
                    <p
                        id={`${inputId}-hint`}
                        className="text-sm text-gray-500"
                    >
                        {hint}
                    </p>
                )}
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-sm text-red-600"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormInput.displayName = "FormInput";
