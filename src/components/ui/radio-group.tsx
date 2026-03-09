"use client"

import * as React from "react"

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string
    onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupProps>({})

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className = "", value, onValueChange, ...props }, ref) => {
        return (
            <RadioGroupContext.Provider value={{ value, onValueChange }}>
                <div ref={ref} className={`space-y-2 ${className}`} {...props} />
            </RadioGroupContext.Provider>
        )
    }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
    ({ className = "", value, ...props }, ref) => {
        const context = React.useContext(RadioGroupContext)
        const isChecked = context.value === value

        return (
            <input
                type="radio"
                ref={ref}
                value={value}
                checked={isChecked}
                onChange={() => context.onValueChange?.(value)}
                className="h-4 w-4 border border-zinc-700 text-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                {...props}
            />
        )
    }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
