import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/ui/atoms/label";
import { ChevronDown } from "lucide-react";

export interface FormSelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    labelClassName?: string;
    containerClassName?: string;
    options: { label: string; value: string | number }[];
    placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    (
        {
            label,
            error,
            required = false,
            hint,
            labelClassName,
            containerClassName,
            className,
            options,
            id,
            placeholder,
            ...props
        },
        ref
    ) => {
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
                <div className="relative">
                    <select
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full px-4 py-3 border rounded-lg appearance-none bg-gray-50",
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
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
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

FormSelect.displayName = "FormSelect";
