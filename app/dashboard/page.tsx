"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FloatingLabelTextarea } from "@/components/floating-label-textarea";
import generateForm from "@/actions/generate_form";
import {
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
        DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
        const router = useRouter();
        const [formDescription, setFormDescription] = useState<string>("");


        const handleGenerateForm = async () => {
                if (!formDescription.trim()) {
                        console.warn("Form description cannot be empty");
                        return;
                }

                try {
                        const response = await generateForm({ formDescription });
                } catch (err) {
                        console.error("Error generating form:", err);
                }
        };

        return (
                <div className="content mx-5 -mt-5">
                        <div className="flex justify-between gap-3 mt-3 w-full">
                                <h3 className="font-extrabold text-3xl">Recent activity</h3>

                                {/* ADD Form Dialog */}
                                <Dialog>
                                        <DialogTrigger asChild>
                                                <Button>
                                                        <Plus /> New Form
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                                <DialogHeader>
                                                        <DialogTitle>Create New Form</DialogTitle>
                                                        <DialogDescription>Describe your form</DialogDescription>
                                                </DialogHeader>

                                                <FloatingLabelTextarea
                                                        value={formDescription}
                                                        onChange={(e) => setFormDescription(e.target.value)}
                                                        label="Form description"
                                                />
                                                <DialogFooter>
                                                        <Button
                                                                variant="secondary"
                                                                className="font-bold bg-inherit text-destructive"
                                                        >
                                                                Cancel
                                                        </Button>
                                                        <Button className="font-bold" onClick={handleGenerateForm}>
                                                                Generate Form
                                                        </Button>
                                                </DialogFooter>
                                        </DialogContent>
                                </Dialog>
                        </div>

                        <div className="flex gap-3 mt-5">

                        </div>
                </div>
        );
}

function NewFormCard() {
        return (
                <div className="p-5 card rounded-md cursor-pointer flex justify-center text-muted-foreground border border-muted-foreground border-dashed items-center flex-col gap-3">
                        <Plus />
                        <h3 className="font-bold">New Form</h3>
                </div>
        );
}
