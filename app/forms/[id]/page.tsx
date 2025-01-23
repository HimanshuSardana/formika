"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { FloatingLabelInput } from "@/components/floating-label-input";
import { FloatingLabelTextarea } from "@/components/floating-label-textarea";
import { FloatingLabelSelect } from "@/components/floating-label-select";
import { LoadingButton } from "@/components/ui/loading-button";
import { Label } from "@/components/ui/label";
import submitResponse from "@/actions/submit_response";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SliderMarks } from "@/components/slider-marks";

interface FormField {
        name: string;
        type: string;
        values?: {
                items: { value: string; label: string }[];
        };
}

interface FormData {
        id: string;
        formName: string;
        formSchema: FormField[];
}

interface FormPreviewPageProps {
        params: { id: string };
}

const FormPreviewPage: React.FC<FormPreviewPageProps> = ({ params }) => {
        const id = params.id;
        const [formData, setFormData] = useState<FormData | null>(null);
        const [formName, setFormName] = useState<string>("");
        const [formSchema, setFormSchema] = useState<FormField[] | null>(null);

        useEffect(() => {
                async function getFormSchema() {
                        const supabase = createClient();
                        const { data, error } = await supabase.from("forms").select("*").eq("id", params.id);

                        if (error) {
                                console.error("Error fetching form schema:", error);
                        } else if (data && data.length > 0) {
                                setFormData(data[0]);
                                setFormName(data[0].formName);
                                setFormSchema(data[0].formSchema);
                        }
                }

                getFormSchema();
        }, [params.id]);

        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formEntries = Object.fromEntries(formData.entries());

                const response = await submitResponse(id, { response: formEntries });
                if (response.success) {
                        toast.success("Response submitted successfully");
                } else {
                        toast.error("Failed to submit response.");
                }

                console.log("Submitted form data:", response);
        };

        const convertToWords = (input: string): string => {
                return input.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
        };

        return (
                <div className="mx-10 my-5 flex flex-col gap-5">
                        <div className="flex justify-between">
                                <BackBar />
                        </div>
                        {formSchema && (
                                <div className="form-details flex flex-col items-center gap-4">
                                        <h3 className="font-black text-3xl">{formName}</h3>
                                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg">
                                                {formSchema.map((field, index) => (
                                                        <div key={index}>
                                                                {field.type === "text" && (
                                                                        <FloatingLabelInput
                                                                                type="text"
                                                                                label={convertToWords(field.name)}
                                                                                id={field.name}
                                                                                name={field.name}
                                                                                required
                                                                        />
                                                                )}
                                                                {field.type === "textarea" && (
                                                                        <FloatingLabelTextarea
                                                                                label={convertToWords(field.name)}
                                                                                id={field.name}
                                                                                name={field.name}
                                                                                required
                                                                        />
                                                                )}
                                                                {field.type === "select" && field.values?.items && (
                                                                        <FloatingLabelSelect
                                                                                label={convertToWords(field.name)}
                                                                                name={field.name}
                                                                                options={field.values.items.map((item) => ({
                                                                                        value: item.value,
                                                                                        label: item.label,
                                                                                }))}
                                                                                required
                                                                        />
                                                                )}
                                                                {field.type === "radio" && field.values?.items && (
                                                                        <RadioGroup name={field.name}>
                                                                                {field.values.items.map((item, idx) => (
                                                                                        <div key={idx} className="flex items-center gap-2">
                                                                                                <RadioGroupItem value={item.value} id={`${field.name}-${idx}`} />
                                                                                                <label htmlFor={`${field.name}-${idx}`}>{item.label}</label>
                                                                                        </div>
                                                                                ))}
                                                                        </RadioGroup>
                                                                )}
                                                                {field.type === "number" && (
                                                                        <FloatingLabelInput
                                                                                type="number"
                                                                                label={convertToWords(field.name)}
                                                                                id={field.name}
                                                                                name={field.name}
                                                                                required
                                                                        />
                                                                )}
                                                                {field.type === "range" && field.values?.items && (
                                                                        <>
                                                                                <Label className="my-2" htmlFor={field.name}>{convertToWords(field.name)}</Label>
                                                                                <SliderMarks name={field.name} stepValues={field.values.items.map((item) => parseInt(item.value.toString()))} />
                                                                        </>
                                                                )}
                                                        </div>
                                                ))}
                                                <LoadingButton type="submit">Submit</LoadingButton>
                                        </form>
                                </div>
                        )}
                </div>
        );
};

const BackBar: React.FC = () => (
        <Button asChild className="bg-inherit" variant="secondary">
                <Link href="/dashboard">
                        <ChevronLeft /> Back
                </Link>
        </Button>
);

export default FormPreviewPage;

