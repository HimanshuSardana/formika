"use client";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "./ui/accordion";
import { useTransition, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import generateForm from "@/actions/generate_form";
import { Plus, Ellipsis, Clipboard, Book, Eye, X, Loader2 } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FloatingLabelTextarea } from "./floating-label-textarea";
import { FloatingLabelInput } from "./floating-label-input";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "./ui/drawer";
import { LoadingButton } from "./ui/loading-button";
import { toast } from "sonner";
import {
        Table,
        TableBody,
        TableCaption,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";


export function Forms() {
        const [formsData, setFormsData] = useState<FormData[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null); // Added error state
        const { user, loading: isUserLoading } = useCurrentUser();
        const [formDescription, setFormDescription] = useState<string>("");
        const [formName, setFormName] = useState<string>("");
        const [isPending, startTransition] = useTransition();

        // Move fetching forms logic into a useEffect so it runs properly on mount
        useEffect(() => {
                async function fetchForms() {
                        if (isUserLoading) return; // Wait for user data

                        try {
                                const supabase = await createClient();

                                const { data, error } = await supabase
                                        .from("forms")
                                        .select("*")
                                        .eq("created_by_email", user?.user_metadata?.email);

                                if (error) {
                                        throw error;
                                }

                                setFormsData(data || []);
                                console.log(data);
                        } catch (err) {
                                console.error("Error fetching forms:", err);
                                setError(err instanceof Error ? err.message : "An error occurred while fetching forms.");
                        } finally {
                                setLoading(false);
                        }
                }

                fetchForms();
        }, [isUserLoading, user?.user_metadata?.email]); // Dependency on isUserLoading or user

        const handleGenerateForm = () => {
                if (!formDescription.trim()) {
                        console.warn("Form description cannot be empty");
                        return;
                }

                if (isUserLoading || !user?.email) {
                        console.error("User data is not available");
                        return;
                }

                startTransition(async () => {
                        try {
                                const response = await generateForm({ email: user.email || " ", formDescription, formName });
                                if (response?.success) {
                                        console.log("Form generated successfully:", response);
                                        toast.success("Form generated successfully");
                                }
                        } catch (err) {
                                console.error("Error generating form:", err);
                        }
                });
        };

        if (isUserLoading) {
                return <div>Loading...</div>; // Replace with a proper loading state if needed
        }

        if (loading) {
                return <div className="mx-5 -mt-3">Loading forms...</div>;
        }

        if (error) {
                return (
                        <div className="mx-5 -mt-3">
                                <p className="text-red-500">Error: {error}</p>
                        </div>
                );
        }

        return (
                <div className="mx-5 -mt-3">
                        <div className="w-full flex justify-between items-center">
                                <h3 className="font-extrabold text-3xl">All Forms</h3>
                                <Dialog>
                                        <DialogTrigger asChild>
                                                <Button disabled={isPending} className="font-bold">
                                                        <Plus /> New Form
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                                <DialogHeader>
                                                        <DialogTitle>Create New Form</DialogTitle>
                                                        <DialogDescription>Describe your form</DialogDescription>
                                                </DialogHeader>

                                                <FloatingLabelInput onChange={(e) => setFormName(e.target.value)} disabled={isPending} value={formName} label="Form Name" />

                                                <FloatingLabelTextarea
                                                        value={formDescription}
                                                        onChange={(e) => setFormDescription(e.target.value)}
                                                        label="Form description"
                                                        disabled={isPending}
                                                />
                                                <DialogFooter>
                                                        <Button
                                                                variant="secondary"
                                                                className="font-bold bg-inherit text-destructive"
                                                                disabled={isPending}
                                                        >
                                                                Cancel
                                                        </Button>
                                                        <LoadingButton
                                                                className="font-bold"
                                                                onClick={handleGenerateForm}
                                                                disabled={isPending}
                                                                loading={isPending}
                                                        >
                                                                {isPending ? "Generating" : "Generate Form"}
                                                        </LoadingButton>
                                                </DialogFooter>
                                        </DialogContent>
                                </Dialog>
                        </div>

                        <div className="mt-5">
                                {formsData.length === 0 ? (
                                        <p className="text-muted-foreground">No forms available. Start by creating one!</p>
                                ) : (
                                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                                {formsData.map((form) => (
                                                        <FormCard key={form.id} id={form.id} formName={form.formName} createdAt={form.createdAt} formSchema={form.formSchema} />
                                                ))}
                                        </div>
                                )}
                        </div>
                </div>
        );
}

type FormData = {
        id: string;
        formName: string;
        createdAt: string;
        formSchema: any[];
};

type FormCardProps = {
        id: string;
        formName: string;
        createdAt: string;
        formSchema: any[];
};

function FormCard({ id, formName, createdAt, formSchema }: FormCardProps) {
        const router = useRouter();
        const [isDrawerOpen, setIsDrawerOpen] = useState(false);
        const [responses, setResponses] = useState<any[]>([]); // Ensure responses state is typed

        useEffect(() => {
                async function fetchResponses() {
                        try {
                                const supabase = await createClient();

                                // Fetch responses specific to the form's ID
                                const { data, error } = await supabase
                                        .from("responses")
                                        .select("*")
                                        .eq("form_id", id); // Assuming `form_id` links responses to the form

                                if (error) {
                                        throw error;
                                }

                                setResponses(data || []);
                        } catch (err) {
                                console.error("Error fetching responses:", err);
                        }
                }

                // Fetch responses only when the drawer is opened
                if (isDrawerOpen) {
                        fetchResponses();
                }
        }, [isDrawerOpen, id]); // Depend on `isDrawerOpen` and `id`

        return (
                <div
                        key={id}
                        className="border border-muted hover:border-primary rounded-md p-5 shadow-sm hover:shadow-lg cursor-pointer flex justify-between items-center"
                >
                        <div className="description">
                                <h4 className="font-bold text-lg">{formName || "Untitled Form"}</h4>
                                <p className="text-sm text-muted-foreground">
                                        Created on: {new Date(createdAt).toLocaleDateString()}
                                </p>
                        </div>
                        <DropdownMenu>
                                <DropdownMenuTrigger>
                                        <Ellipsis className="text-muted-foreground" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => router.push(`/forms/${id}`)}>
                                                <Eye /> Preview
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                                <Clipboard /> Copy Form Link
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setIsDrawerOpen(true)}>
                                                <Book /> View Responses
                                        </DropdownMenuItem>
                                </DropdownMenuContent>
                        </DropdownMenu>

                        <Drawer open={isDrawerOpen} direction="right">
                                <DrawerContent className="w-1/3 py-3 px-3">
                                        <DrawerHeader className="flex justify-between gap-3">
                                                <DrawerTitle className="font-extrabold text-3xl">{formName}'s Responses</DrawerTitle>
                                                <DrawerClose onClick={() => setIsDrawerOpen(false)} asChild>
                                                        <Button
                                                                variant={"secondary"}
                                                                size={"icon"}
                                                                className="bg-inherit rounded-full hover:bg-background"
                                                        >
                                                                <X />
                                                        </Button>
                                                </DrawerClose>
                                        </DrawerHeader>

                                        {responses.length > 0 ? (
                                                <ResponseViewer
                                                        responses={responses}
                                                        formSchema={formSchema} // Pass form schema if available
                                                />
                                        ) : (
                                                <p className="p-4 text-muted-foreground">No responses available for this form.</p>
                                        )}
                                </DrawerContent>
                        </Drawer>
                </div>
        );
}

type ResponseViewerProps = {
        responses: any[];
        formSchema: any[];
};

export function ResponseViewer({ responses, formSchema }: ResponseViewerProps) {
        const [currentIndex, setCurrentIndex] = useState(0); // Track current response
        const [insights, setInsights] = useState<string>("");

        const currentResponse = responses[currentIndex]; // Get the current response

        const handlePrevious = () => {
                if (currentIndex > 0) {
                        setCurrentIndex((prev) => prev - 1);
                }
        };

        function convertToWords(input: string) {
                return input.replace(/([a-z])([A-Z])/g, "$1 $2");
        }

        const handleNext = () => {
                if (currentIndex < responses.length - 1) {
                        setCurrentIndex((prev) => prev + 1);
                }
        };

        useEffect(() => {
                async function getAIInsights() {
                        try {
                                const genAI = new GoogleGenerativeAI("AIzaSyACJmEUuOUzeaKK7F_CgNGO8Wk2gnCAe34");
                                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { maxOutputTokens: 500 } });

                                const formattedResponses = responses
                                        .map((response, index) => {
                                                const fields = formSchema
                                                        .map((field) => `${convertToWords(field.name)}: ${response.response[field.name] || "N/A"}`)
                                                        .join(", ");
                                                return `Response ${index + 1}: ${fields}`;
                                        })
                                        .join("\n");

                                const prompt = `Given the following form submissions, provide insights, your reply (excluding markdown syntax) should not exceed 300 words. Respond with markdown.\n\n${formattedResponses}`;

                                const result = await model.generateContent(prompt);
                                setInsights(result.response.text());
                        } catch (err) {
                                console.error("Error fetching AI insights:", err);
                        }
                }

                if (responses.length > 0) {
                        getAIInsights();
                }
        }, [responses]);

        return (
                <div className="p-4">
                        <form className="flex flex-col gap-3">
                                {insights ? (
                                        <Accordion type="single" collapsible className="border py-1 px-5 rounded-md">
                                                <AccordionItem value={"insights"}>
                                                        <AccordionTrigger>
                                                                <h4 className="font-bold text-lg">AI Insights</h4>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                                <p>{insights}</p>
                                                        </AccordionContent>
                                                </AccordionItem>
                                        </Accordion>
                                ) : (
                                        <p>Loading insights...</p>
                                )}

                                <div className="mt-3 flex justify-between">
                                        <Button onClick={handlePrevious} disabled={currentIndex === 0}>
                                                Previous
                                        </Button>
                                        <Button onClick={handleNext} disabled={currentIndex === responses.length - 1}>
                                                Next
                                        </Button>
                                </div>
                        </form>
                </div>
        );
}

