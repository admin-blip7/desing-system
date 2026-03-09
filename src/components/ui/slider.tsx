"use client"

import * as React from "react"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    value: number[]
    onValueChange?: (value: number[]) => void
    min?: number
    max?: number
    step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = Number(e.target.value)
            onValueChange?.([newValue])
        }

        return (
            <input
                type="range"
                ref={ref}
                min={min}
                max={max}
                step={step}
                value={value?.[0] || 0}
                onChange={handleChange}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                {...props}
            />
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
