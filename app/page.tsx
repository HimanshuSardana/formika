"use client"
import { Button } from "@/components/ui/button";
import LoginSchema from '@/schemas/LoginSchema'
import Link from "next/link";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { Lightbulb, FormInput, BicepsFlexed, Presentation } from "lucide-react";

export default function Home() {
        return (
                <>
                        <Navbar />
                        <Hero />
                        <Features />
                </>
        );
}

function Navbar() {
        return (
                <div className=" h-32 flex items-center justify-between mx-[10%]">
                        {/* BRAND */}
                        <h3 className="font-extrabold text-xl"><span className="text-primary">Form</span>ika</h3>

                        {/* LINKS */}
                        <div className="flex gap-3">
                                <ThemeToggleButton />
                                <Button asChild className="font-bold">
                                        <Link href="/register">Get Started</Link>
                                </Button>
                                <Button variant={"secondary"} className="bg-inherit text-primary font-bold" asChild>
                                        <Link href="/login">Log In</Link>
                                </Button>
                        </div>
                </div >
        );
}

function Hero() {
        return (
                <div className="h-[calc(90vh-128px)] flex md:flex-row sm:flex-col items-center  mx-[10%] flex gap-5">
                        {/* LEFT */}
                        <div className="left flex md:items-start sm:items-center sm:text-center md:text-left flex-col space-y-3">
                                <Chip />

                                <h3 className="text-5xl font-extrabold">Smarter <span className="text-primary">forms</span> powered by AI</h3>
                                <p className="font-bold text-muted-foreground sm:w-full md:w-2/3">Effortlessly design, share, and analyze smarter forms with Formika's AI-powered tools.</p>

                                <div className="buttons flex gap-5">
                                        <Button className="font-bold">Get Started</Button>
                                        <Button variant={"secondary"} className="bg-inherit text-primary font-bold">Learn More</Button>
                                </div>
                        </div>
                </div>
        )
}

function Chip() {
        return (
                <span className="bg-primary/20  rounded-full text-base text-xs font-bold px-4 text-primary w-fit p-2">Beta version out now!</span>
        )
}

function Features() {
        return (
                <div className="mx-[10%] flex flex-col py-16">
                        <div className="flex justify-between flex-col gap-2">
                                <h3 className="xs:text-left md:text-center font-black text-primary text-lg">Why us?</h3>
                                <h3 className="font-black text-5xl xs:text-left md:text-center">A full-fledged form analysis tool</h3>
                                <div className="md:w-1/2 md:mx-auto mt-2">
                                        <p className="xs:text-left md:text-center text-muted-foreground ">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit libero soluta, placeat consequuntur nam neque hic rem omnis. Earum odit ex rerum reprehenderit dolor nulla.
                                        </p>

                                </div>
                        </div>

                        {/* FEATURE CARDS */}
                        <div className="feature-cards flex flex-col justify-around md:mx-auto md:w-2/3 gap-10 mt-10">
                                <div className="row flex xs:flex-col md:flex-row justify-between gap-10">
                                        <Card icon={<FormInput />} title="AI Powered Form Generation" description="Describe your needs, and let Formika’s AI create tailored forms in seconds—powered by Gemini." />
                                        <Card icon={<Presentation />} title="Real-time Form Previews" description="Visualize your forms instantly with our seamless preview feature, ensuring they look perfect before sharing." />
                                </div>
                                <div className="row flex xs:flex-col md:flex-row justify-between gap-10">
                                        <Card icon={<BicepsFlexed />} title="Easy Form Sharing" description="Generate shareable links for your forms, making collaboration and collection a breeze." />
                                        <Card icon={<Lightbulb />} title="AI Driven Insights" description="Unlock the power of your data with actionable insights derived from responses, powered by advanced AI analytics." />
                                </div>

                        </div>

                </div>
        )
}

interface CardProps {
        icon: JSX.Element,
        title: string,
        description: string
}

function Card({ icon, title, description }: CardProps) {
        return (
                <div className="card flex xs:flex-col md:flex-row gap-3 flex-[1] items-start">
                        <div className="bg-primary rounded-md p-3 text-background">
                                {icon}
                        </div>
                        <div className="text-content flex flex-col gap-1">
                                <h3 className="font-bold text-lg">{title}</h3>
                                <p className="text-muted-foreground">{description}</p>
                        </div>
                </div>

        )
}
