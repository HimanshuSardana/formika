"use client"

import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FloatingLabelSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
        label: string
        className?: string
        options: { value: string; label: string }[]
}

export function FloatingLabelSelect({
        label,
        options,
        className,
        ...props
}: FloatingLabelSelectProps) {
        const [isFocused, setIsFocused] = React.useState(false)
        const [hasValue, setHasValue] = React.useState(false)

        const handleFocus = () => setIsFocused(true)
        const handleBlur = () => setIsFocused(false)
        const handleValueChange = (value: string) => {
                setHasValue(value !== "")
                props.onValueChange?.(value)
        }

        return (
                <div className="relative">
                        <Select {...props} onValueChange={handleValueChange}>
                                <SelectTrigger
                                        className={cn(
                                                "h-14 pt-4",
                                                isFocused && "border-primary",
                                                hasValue && "pl-[2.125rem]",
                                                className
                                        )}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                >
                                        <SelectValue
                                                placeholder=" "
                                                className={cn(
                                                        hasValue && "translate-x-[0.5rem]"
                                                )}
                                        />
                                </SelectTrigger>
                                <SelectContent>
                                        {options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                </SelectItem>
                                        ))}
                                </SelectContent>
                        </Select>
                        <label
                                className={cn(
                                        "absolute left-3 transition-all duration-200 pointer-events-none",
                                        isFocused || hasValue
                                                ? "top-2 text-xs text-primary"
                                                : "top-4 text-base text-muted-foreground"
                                )}
                        >
                                {label}
                        </label>
                </div>
        )
}

export default function SelectDemo() {
        const options = [
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" },
        ]

        return (
                <FloatingLabelSelect
                        label="Select an option"
                        options={options}
                />
        )
}
