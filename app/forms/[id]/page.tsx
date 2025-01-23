"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingLabelInput } from "@/components/floating-label-input";
import { FloatingLabelTextarea } from "@/components/floating-label-textarea";
import { FloatingLabelSelect } from "@/components/floating-label-select";
import { LoadingButton } from "@/components/ui/loading-button";
import submitResponse from "@/actions/submit_response";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useCurrentUser from "@/hooks/useCurrentUser";

type FormPreviewPage = {
        params: {
                id: string;
        };
};

const FormPreviewPage: React.FC<FormPreviewPage> = ({ params }) => {
        const [formData, setFormData] = useState<any>(null);
        const [formName, setFormName] = useState("");
        const [formSchema, setFormSchema] = useState<any>(null);
        const [formId, setFormId] = useState<any>(null);

        function convertToWords(input: string) {
                return input.replace(/([a-z])([A-Z])/g, '$1 $2');
        }

        useEffect(() => {
                async function getFormSchema() {
                        const supabase = createClient();
                        const { data, error } = await supabase
                                .from("forms")
                                .select("*")
                                .eq("id", params.id);

                        if (error) {
                                console.error("Error fetching form schema:", error);
                        } else {
                                setFormData(data);
                                setFormName(data[0].formName);
                                setFormSchema(data[0].formSchema);
                                setFormId(data[0].id);
                        }
                }

                getFormSchema();
        }, [params.id]);

        async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formEntries = Object.fromEntries(formData.entries());

                const response = await submitResponse(formId, { response: formEntries });
                if (response.success) {
                        toast.success("Response submitted successfully");
                }

                console.log("Submitted form data:", response);
        };

        return (
                <div className="mx-10 my-5 flex flex-col gap-5">
                        <div className="flex justify-between">
                                <BackBar />
                        </div>
                        {formData && (
                                <div className="form-details flex justify-center items-center flex-col gap-2">
                                        <div className="text-center">
                                                <h3 className="form-name font-black text-3xl">{formName}</h3>
                                                <h3 className="font-bold">
                                                        Created on:{" "}
                                                        <span className="text-muted-foreground">
                                                                {new Date(formData[0].createdAt).toLocaleDateString("en-GB")}
                                                        </span>
                                                </h3>
                                        </div>
                                        <form
                                                onSubmit={handleSubmit}
                                                className="form-schema flex flex-col gap-4 mt-5 w-1/3 mx-auto"
                                        >
                                                {formSchema &&
                                                        formSchema.map((field: any, index: number) => (
                                                                <div key={index} className="form-field">
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
                                                                                        id={field.name}
                                                                                        label={convertToWords(field.name)}
                                                                                        name={field.name}
                                                                                        required
                                                                                />
                                                                        )}
                                                                        {field.type === "select" && field.values?.items && (
                                                                                <>
                                                                                        <FloatingLabelSelect
                                                                                                id={field.name}
                                                                                                label={convertToWords(field.name)}
                                                                                                name={field.name}
                                                                                                className="border rounded-md p-2 w-full"
                                                                                                options={field.values.items}
                                                                                                required
                                                                                        >
                                                                                                {field.values.items.map((option: any, idx: number) => (
                                                                                                        <option key={idx} value={option.value}>
                                                                                                                {option.label}
                                                                                                        </option>
                                                                                                ))}
                                                                                        </FloatingLabelSelect>
                                                                                </>
                                                                        )}
                                                                        {field.type === "radio" && field.values?.items && (
                                                                                <>
                                                                                        <label className="block text-sm font-medium text-muted-foreground">{convertToWords(field.name)}</label>
                                                                                        <div className="flex flex-col gap-2">
                                                                                                <RadioGroup name={field.name}>
                                                                                                        {field.values.items.map((item: any, idx: number) => (
                                                                                                                <RadioGroupItem key={idx} value={item.value}>
                                                                                                                        <Label>12</Label>
                                                                                                                </RadioGroupItem>
                                                                                                        ))}
                                                                                                </RadioGroup>
                                                                                        </div>
                                                                                </>
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

                                                                </div>
                                                        ))}
                                                {/* TODO: Add useTransition */}
                                                <LoadingButton type="submit" className="font-bold ">
                                                        Submit
                                                </LoadingButton>
                                        </form>
                                </div>
                        )}
                </div>
        );
};

export default FormPreviewPage;

const BackBar: React.FC = () => (
        <div className="flex">
                <Button asChild variant="secondary" className="font-bold bg-inherit">
                        <Link href="/dashboard">
                                <ChevronLeft /> Back
                        </Link>
                </Button>
        </div>
);

