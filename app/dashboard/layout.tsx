"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Forms } from "@/components/forms"
import { useState, useEffect, useRef } from "react";
import ProtectedRoute from "@/components/auth/protected-route-wrapper";
import useCurrentUser from "@/hooks/useCurrentUser";
import logout from "@/actions/logout";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Bell, Power, User } from "lucide-react";
import { FloatingLabelInput } from "@/components/floating-label-input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { Dashboard } from "@/components/dashboard";
import { usePathname } from "next/navigation";
import { add_usernames } from "@/actions/add_usernames";

function useTabUnderline(initialTabIndex: number) {
        const [activeTab, setActiveTab] = useState(initialTabIndex);
        const [tabUnderlineWidth, setTabUnderlineWidth] = useState(10);
        const [tabUnderlineLeft, setTabUnderlineLeft] = useState(10);
        const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);


        useEffect(() => {
                const setTabPosition = () => {
                        const currentTab = tabsRef.current[activeTab];
                        setTabUnderlineLeft(currentTab?.offsetLeft ?? tabsRef.current[0]?.offsetLeft);
                        setTabUnderlineWidth(currentTab?.clientWidth ?? tabsRef.current[0]?.clientWidth);
                };

                setTabPosition();
                window.addEventListener("resize", setTabPosition);

                return () => window.removeEventListener("resize", setTabPosition);
        }, [activeTab]);

        return { activeTab, setActiveTab, tabUnderlineWidth, tabUnderlineLeft, tabsRef };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
        const { user, loading } = useCurrentUser();
        const initials = user?.user_metadata?.name?.split(" ").map((name) => name.charAt(0).toUpperCase()).join("");
        const path = usePathname();
        const email = user?.email
        const breadcrumbs = path.split("/").map((path) => path.charAt(0).toUpperCase() + path.slice(1)).slice(1);


        // Use custom hook to manage tab underline
        const { activeTab, setActiveTab, tabUnderlineWidth, tabUnderlineLeft, tabsRef } = useTabUnderline(0);
        const tabs = ["Dashboard", "Forms"];

        return (
                <ProtectedRoute user={user} loading={loading}>
                        <main className="w-full">
                                <Navbar initials={initials} email={email} />
                                <div className="w-full max-p-2xl px-auto">
                                        <div className="relative">
                                                <div className="flex border-b border-b-[1px] px-10 outline-none">
                                                        {tabs.map((tab, index) => (
                                                                <button
                                                                        key={index}
                                                                        ref={(el) => (tabsRef.current[index] = el)}
                                                                        className={`py-4 px-4 text-center text-sm font-medium transition-colors duration-200 ${activeTab === index ? "text-primary" : "text-muted-foreground hover:text-primary"
                                                                                }`}
                                                                        onClick={() => setActiveTab(index)}
                                                                        aria-selected={activeTab === index}
                                                                        role="tab"
                                                                >
                                                                        {tab}
                                                                </button>
                                                        ))}
                                                </div>
                                                <motion.div
                                                        className="absolute bottom-0 h-0.5 bg-primary"
                                                        initial={false}
                                                        animate={{
                                                                left: tabUnderlineLeft,
                                                                width: tabUnderlineWidth,
                                                        }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                        </div>
                                        <div className="mt-4 p-4 bg-inherit rounded-lg">
                                                {tabs[activeTab] === "Dashboard" && <Dashboard />}
                                                {tabs[activeTab] === "Forms" && <Forms />}
                                        </div>
                                </div>
                        </main>
                </ProtectedRoute>
        );
}

function Navbar({ initials, email }: { initials: string, email: string }) {
        async function handleSubmit(e: React.FormEvent) {
                e.preventDefault();
        }
        return (
                <div className="px-[3.75rem] pr-[2%] flex flex-row justify-between items-center w-full gap-3 py-6">
                        <div className="flex gap-3 items-center">
                                <h3 className="font-extrabold text-lg">Form<span className="text-primary">ika</span></h3>
                        </div>
                        <div className="flex gap-5">
                                <TooltipProvider>
                                        <Tooltip>
                                                <TooltipTrigger asChild>
                                                        <Dialog>
                                                                <DialogTrigger asChild>
                                                                        <Button className="bg-inherit rounded-full" size="icon" variant="secondary">
                                                                                <Bell size={24} />
                                                                        </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                        <DialogTitle>Bell</DialogTitle>
                                                                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                                                                                <h3>Link your Lichess and Chess.com accounts to directly fetch games</h3>
                                                                                <FloatingLabelInput name="lichess_username" label="Lichess Username" />
                                                                                <FloatingLabelInput name="chesscom_username" label="Chess.com Username" />
                                                                        </form>
                                                                        <DialogFooter>
                                                                                <Button type="submit" className="font-bold">Save Changes</Button>
                                                                        </DialogFooter>
                                                                </DialogContent>
                                                        </Dialog>
                                                </TooltipTrigger>
                                                <TooltipContent>Bell</TooltipContent>
                                        </Tooltip>
                                </TooltipProvider>
                                <div className="flex items-center gap-3">
                                        <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                        <Avatar className="bg-primary/20 font-bold hover:bg-inherit/10 hover:-p-2 cursor-pointer">
                                                                <AvatarFallback className="bg-primary/50 font-bold">{initials}</AvatarFallback>
                                                        </Avatar>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                        <DropdownMenuItem><User /> Profile</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => logout()} className="font-bold text-destructive w-36">
                                                                <Power /> Logout
                                                        </DropdownMenuItem>
                                                </DropdownMenuContent>
                                        </DropdownMenu>
                                </div>
                        </div>
                </div>
        );
}

