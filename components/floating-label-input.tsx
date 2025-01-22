"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FloatingLabelInputProps
        extends React.InputHTMLAttributes<HTMLInputElement> {
        label: string
}

export function FloatingLabelInput({
        label,
        id,
        className,
        ...props
}: FloatingLabelInputProps) {
        const [isFocused, setIsFocused] = React.useState(false)
        const [hasContent, setHasContent] = React.useState(false)

        const handleFocus = () => setIsFocused(true)
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                setIsFocused(false)
                setHasContent(e.target.value !== "")
        }
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setHasContent(e.target.value !== "")
                props.onChange?.(e)
        }

        return (
                <div className="relative">
                        <Input
                                id={id}
                                className={cn(
                                        "h-14 pt-4 focus-visible:ring-0",
                                        (isFocused) && "border-primary",
                                        className
                                )}
                                {...props}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={handleChange}
                        />
                        <label
                                htmlFor={id}
                                className={cn(
                                        "absolute left-3 transition-all duration-200 pointer-events-none",
                                        isFocused || hasContent
                                                ? "top-2 text-xs text-primary"
                                                : "top-4 text-base text-muted-foreground"
                                )}
                        >
                                {label}
                        </label>
                </div>
        )
}

