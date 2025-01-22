"use client";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTransition, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import generateForm from "@/actions/generate_form";
import { Plus, Ellipsis, Clipboard, Book, Eye } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { FloatingLabelInput } from "./floating-label-input";
import { FloatingLabelTextarea } from "./floating-label-textarea";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerSubtitle, DrawerFooter, DrawerTrigger } from "./ui/drawer";
import { LoadingButton } from "./ui/loading-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Forms() {
        const [formsData, setFormsData] = useState([]);
        const [loading, setLoading] = useState(true); // Added loading state
        const [error, setError] = useState(null); // Added error state
        const { user, isLoading: isUserLoading } = useCurrentUser();
        const [formDescription, setFormDescription] = useState<string>("");
        const [formName, setFormName] = useState<string>("");
        const [isPending, startTransition] = useTransition();

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
                                const response = await generateForm({ email: user.email, formDescription, formName });
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

        useEffect(() => {
                async function fetchForms() {
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
                                console.log(data)
                        } catch (err) {
                                console.error("Error fetching forms:", err);
                                setError(err.message || "An error occurred while fetching forms.");
                        } finally {
                                setLoading(false);
                        }
                }

                fetchForms();
        }); // Depend on `user` to refetch if it changes

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
                                                        <FormCard id={form.id} formName={form.formName} createdAt={form.createdAt} />
                                                ))}
                                        </div>
                                )}
                        </div>
                </div>
        );
}

type FormCardProps = {
        id: string;
        formName: string;
        createdAt: string;
}

function FormCard({ id, formName, createdAt }: FormCardProps) {
        const router = useRouter()
        const [isDrawerOpen, setIsDrawerOpen] = useState(false);
        const [openFormId, setOpenFormId] = useState(0);

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
                                <DrawerContent>
                                        hello
                                </DrawerContent>
                        </Drawer>
                </div>
        );
}

