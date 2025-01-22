"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FloatingLabelTextarea } from "@/components/floating-label-textarea";
import { LoadingButton } from "./ui/loading-button";
import useCurrentUser from "@/hooks/useCurrentUser";
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
import { FloatingLabelInput } from "./floating-label-input";

export function Dashboard() {
        const router = useRouter();

        return (
                <div className="content mx-5 -mt-5">
                        <div className="flex justify-between gap-3 mt-3 w-full">
                                <h3 className="font-extrabold text-3xl">Recently Created Forms</h3>

                                {/* ADD Form Dialog */}
                        </div>

                        {/* Cards for New Forms */}
                        <div className="flex gap-3 mt-5">
                                <NewFormCard />
                                <NewFormCard />
                                <NewFormCard />
                        </div>
                </div>
        );
}

// Reusable NewFormCard Component
function NewFormCard() {
        return (
                <div className="p-5 card rounded-md cursor-pointer flex justify-center text-muted-foreground border border-muted-foreground border-dashed items-center flex-col gap-3">
                        <Plus />
                        <h3 className="font-bold">New Form</h3>
                </div>
        );
}

