import { Slider } from "@/components/ui/slider";
import React, { useState } from "react";

export function SliderMarks({ stepValues, name }: { stepValues: number[], name: string }) {
        const [sliderValue, setSliderValue] = useState(stepValues[0]);

        const handleChange = (value: number[]) => {
                setSliderValue(value[0]);
        };

        return (
                <div className="w-full max-w-sm">
                        <Slider
                                defaultValue={[stepValues[0]]}
                                max={stepValues[stepValues.length - 1]}
                                step={1}
                                onValueChange={handleChange}
                                name={name}
                        />
                        <input type="hidden" name={name} value={sliderValue} />
                        <div className="mt-2 -mx-1.5 flex items-center justify-between text-muted-foreground text-xs">
                                {stepValues.map((expansion) => (
                                        <span key={expansion}>{expansion}</span>
                                ))}
                        </div>
                </div>
        );
}

