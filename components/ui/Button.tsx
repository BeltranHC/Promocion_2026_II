import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2, type LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    children: ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
        bg-gradient-to-r from-una-red to-una-gold
        text-white font-medium
        hover:shadow-lg hover:shadow-una-gold/25
        hover:scale-[1.02]
        active:scale-[0.98]
    `,
    secondary: `
        bg-slate-800 text-white
        border border-slate-700
        hover:bg-slate-700 hover:border-slate-600
    `,
    outline: `
        bg-transparent
        border border-una-gold/30 text-white/80
        hover:text-una-gold hover:border-una-gold
        hover:bg-una-gold/5
    `,
    ghost: `
        bg-transparent text-white/70
        hover:bg-slate-800 hover:text-white
    `,
    danger: `
        bg-red-600 text-white
        hover:bg-red-700
        hover:shadow-lg hover:shadow-red-500/25
    `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-8 py-4 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            children,
            fullWidth = false,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={cn(
                    // Base styles
                    "inline-flex items-center justify-center",
                    "rounded-xl font-medium",
                    "transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-una-gold/50 focus:ring-offset-2 focus:ring-offset-dark-bg",
                    "uppercase tracking-wider",
                    // Variant styles
                    variantStyles[variant],
                    // Size styles
                    sizeStyles[size],
                    // Full width
                    fullWidth && "w-full",
                    // Disabled state
                    isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
                    // Custom classes
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
                ) : LeftIcon ? (
                    <LeftIcon size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
                ) : null}
                
                {children}
                
                {!isLoading && RightIcon && (
                    <RightIcon size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;

// Link styled as button
interface ButtonLinkProps {
    href: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    children: ReactNode;
    fullWidth?: boolean;
    className?: string;
    external?: boolean;
}

export function ButtonLink({
    href,
    variant = "primary",
    size = "md",
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    children,
    fullWidth = false,
    className,
    external = false,
}: ButtonLinkProps) {
    const Component = external ? "a" : "a";
    
    return (
        <Component
            href={href}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className={cn(
                // Base styles
                "inline-flex items-center justify-center",
                "rounded-xl font-medium",
                "transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-una-gold/50 focus:ring-offset-2 focus:ring-offset-dark-bg",
                "uppercase tracking-wider",
                "no-underline",
                // Variant styles
                variantStyles[variant],
                // Size styles
                sizeStyles[size],
                // Full width
                fullWidth && "w-full",
                // Custom classes
                className
            )}
        >
            {LeftIcon && <LeftIcon size={size === "sm" ? 14 : size === "md" ? 16 : 18} />}
            {children}
            {RightIcon && <RightIcon size={size === "sm" ? 14 : size === "md" ? 16 : 18} />}
        </Component>
    );
}
