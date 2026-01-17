import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/ui/atoms/button";
import { Input } from "@/ui/atoms/input";
import { Label } from "@/ui/atoms/label";

export type OTPPasswordFormData = {
    otp: string;
    newPassword: string;
    confirmPassword: string;
};

interface OTPPasswordFormProps {
    onSubmit: (data: OTPPasswordFormData) => void;
    onBack?: () => void;
    isLoading?: boolean;
    error?: string | null;
    success?: string | null;
    submitButtonText?: string;
    loadingText?: string;
    showBackButton?: boolean;
    inputClassName?: string;
    useCard?: boolean; // For dashboard vs landing page styling
}

export function OTPPasswordForm({
    onSubmit,
    onBack,
    isLoading = false,
    error = null,
    success = null,
    submitButtonText = "Submit",
    loadingText = "Submitting...",
    showBackButton = false,
    inputClassName = "",
    useCard = true,
}: OTPPasswordFormProps) {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<OTPPasswordFormData>();

    const baseInputClass = useCard
        ? ""
        : "w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7043] focus:border-transparent transition-all duration-200";

    // Helper function to get error styling for inputs
    const getInputErrorClass = (fieldName: keyof typeof errors) => {
        const hasError = errors[fieldName];
        const errorClass = hasError
            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
            : "";

        return `${inputClassName} ${errorClass}`.trim();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* OTP Input */}
            <div className={useCard ? "space-y-2" : ""}>
                <div className="flex items-center gap-1">
                    <Label
                        required
                        htmlFor="otp"
                        className={
                            useCard
                                ? "text-sm font-medium leading-none"
                                : "block text-sm font-medium text-gray-700 mb-2"
                        }
                    >
                        OTP Code
                    </Label>
                </div>

                {useCard ? (
                    <Input
                        id="otp"
                        type="text"
                        {...register("otp", {
                            required: "OTP is required",
                            minLength: {
                                value: 6,
                                message: "OTP must be 6 digits",
                            },
                            maxLength: {
                                value: 6,
                                message: "OTP must be 6 digits",
                            },
                            pattern: {
                                value: /^[0-9]{6}$/,
                                message: "OTP must be 6 digits",
                            },
                        })}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className={`text-center text-2xl tracking-widest ${getInputErrorClass("otp")}`}
                        aria-invalid={!!errors.otp}
                        aria-describedby={errors.otp ? "otp-error" : undefined}
                    />
                ) : (
                    <input
                        id="otp"
                        type="text"
                        {...register("otp", {
                            required: "OTP is required",
                            minLength: {
                                value: 6,
                                message: "OTP must be 6 digits",
                            },
                            maxLength: {
                                value: 6,
                                message: "OTP must be 6 digits",
                            },
                            pattern: {
                                value: /^[0-9]{6}$/,
                                message: "OTP must be 6 digits",
                            },
                        })}
                        maxLength={6}
                        placeholder="000000"
                        className={`${baseInputClass} text-center text-2xl tracking-widest ${getInputErrorClass("otp")}`}
                        aria-invalid={!!errors.otp}
                        aria-describedby={errors.otp ? "otp-error" : undefined}
                    />
                )}
                {errors.otp && (
                    <p
                        id="otp-error"
                        className="mt-1 text-sm text-red-600"
                    >
                        {errors.otp.message}
                    </p>
                )}
            </div>

            {/* New Password Input */}
            <div className={useCard ? "space-y-2" : ""}>
                <div className="flex items-center gap-1">
                    <Label
                        required
                        htmlFor="newPassword"
                        className={
                            useCard
                                ? "text-sm font-medium leading-none"
                                : "block text-sm font-medium text-gray-700 mb-2"
                        }
                    >
                        New Password
                    </Label>
                </div>

                <div className="relative">
                    {useCard ? (
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                            placeholder="Enter new password"
                            disabled={isLoading}
                            className={`pr-10 ${getInputErrorClass("newPassword")}`}
                            aria-invalid={!!errors.newPassword}
                            aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                        />
                    ) : (
                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                            placeholder="Enter new password"
                            disabled={isLoading}
                            className={`${baseInputClass} pr-12 ${getInputErrorClass("newPassword")}`}
                            aria-invalid={!!errors.newPassword}
                            aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                        disabled={isLoading}
                    >
                        {showNewPassword ? (
                            <EyeOff className={useCard ? "w-4 h-4" : "w-5 h-5"} />
                        ) : (
                            <Eye className={useCard ? "w-4 h-4" : "w-5 h-5"} />
                        )}
                    </button>
                </div>
                {errors.newPassword && (
                    <p
                        id="newPassword-error"
                        className="mt-1 text-sm text-red-600"
                    >
                        {errors.newPassword.message}
                    </p>
                )}
            </div>

            {/* Confirm Password Input */}
            <div className={useCard ? "space-y-2" : ""}>
                <div className="flex items-center gap-1">
                    <Label
                        required
                        htmlFor="confirmPassword"
                        className={
                            useCard
                                ? "text-sm font-medium leading-none"
                                : "block text-sm font-medium text-gray-700 mb-2"
                        }
                    >
                        Confirm Password
                    </Label>
                </div>

                <div className="relative">
                    {useCard ? (
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === watch("newPassword") || "Passwords do not match",
                            })}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                            className={`pr-10 ${getInputErrorClass("confirmPassword")}`}
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                        />
                    ) : (
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === watch("newPassword") || "Passwords do not match",
                            })}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                            className={`${baseInputClass} pr-12 ${getInputErrorClass("confirmPassword")}`}
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={
                            showConfirmPassword ? "Hide password" : "Show password"
                        }
                        disabled={isLoading}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className={useCard ? "w-4 h-4" : "w-5 h-5"} />
                        ) : (
                            <Eye className={useCard ? "w-4 h-4" : "w-5 h-5"} />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p
                        id="confirmPassword-error"
                        className="mt-1 text-sm text-red-600"
                    >
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* General Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {success}
                </div>
            )}

            {/* Submit Button(s) */}
            {showBackButton && onBack ? (
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onBack}
                        disabled={isLoading}
                    >
                        Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? loadingText : submitButtonText}
                    </Button>
                </div>
            ) : useCard ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? loadingText : submitButtonText}
                </Button>
            ) : (
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#FF7043] to-[#FF5722] hover:from-[#E64A19] hover:to-[#D84315] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF7043] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    {isLoading ? loadingText : submitButtonText}
                </button>
            )}
        </form>
    );
}