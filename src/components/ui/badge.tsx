import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "info"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className = "", variant = "default", ...props }, ref) => {
        const variantStyles = {
            default: "bg-zinc-800 text-zinc-300",
            secondary: "bg-zinc-700 text-zinc-300",
            destructive: "bg-red-500/20 text-red-400 border border-red-500/50",
            outline: "border border-zinc-700 text-zinc-300",
            success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50",
            info: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
        }

        return (
            <div
                ref={ref}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${variantStyles[variant]} ${className}`}
                {...props}
            />
        )
    }
)
Badge.displayName = "Badge"

export { Badge }
