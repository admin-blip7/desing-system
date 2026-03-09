import * as React from "react"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "destructive" | "warning" | "success" | "info"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className = "", variant = "default", ...props }, ref) => {
        const variantStyles = {
            default: "bg-zinc-900 border-zinc-800 text-white",
            destructive: "bg-red-500/10 border-red-500/50 text-red-400",
            warning: "bg-amber-500/10 border-amber-500/50 text-amber-400",
            success: "bg-emerald-500/10 border-emerald-500/50 text-emerald-400",
            info: "bg-blue-500/10 border-blue-500/50 text-blue-400",
        }

        return (
            <div
                ref={ref}
                role="alert"
                className={`border rounded-lg p-4 ${variantStyles[variant]} ${className}`}
                {...props}
            />
        )
    }
)
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className = "", ...props }, ref) => {
        return <p ref={ref} className={`text-sm leading-relaxed ${className}`} {...props} />
    }
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
