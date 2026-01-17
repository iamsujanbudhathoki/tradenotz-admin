import { cn } from "@/lib/utils";
import type { UserRole } from "@/api/types.gen";

interface RoleBadgeProps {
    role: UserRole | string;
    className?: string;
    size?: "sm" | "md" | "lg";
}

// Role configuration with colors and labels
const roleConfig: Record<
    string,
    {
        label: string;
        bgColor: string;
        textColor: string;
        borderColor: string;
    }
> = {
    ADMIN: {
        label: "Admin",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        borderColor: "border-purple-300",
    },
    CLIENT: {
        label: "Client",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-300",
    },
    CONTRACTOR: {
        label: "Contractor",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
    },
    AGENT: {
        label: "Agent",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        borderColor: "border-orange-300",
    },
    CONSULTANCY: {
        label: "Design Consultancy",
        bgColor: "bg-pink-100",
        textColor: "text-pink-800",
        borderColor: "border-pink-300",
    },
};

// Size configuration
const sizeConfig = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
};

export function RoleBadge({ role, className, size = "md" }: RoleBadgeProps) {
    const config = roleConfig[role] || {
        label: role,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-300",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full border",
                config.bgColor,
                config.textColor,
                config.borderColor,
                sizeConfig[size],
                className
            )}
        >
            {config.label}
        </span>
    );
}
