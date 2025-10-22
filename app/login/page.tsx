"use client";

import { Eye, EyeOff } from "lucide-react";
import Aurora from "@/components/Aurora";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="-z-10 absolute inset-0">
                <Aurora
                    colorStops={["#46aec5", "#005f8e", "#0081c1"]}
                    amplitude={1.7}
                    blend={2}
                    speed={0.2}
                />
            </div>
            <div className="flex flex-col items-center bg-background/40 backdrop-blur-2xl p-8 border border-muted rounded-2xl w-full max-w-md">
                <Logo />
                <p className="mt-4 font-semibold text-xl tracking-tight">
                    Log in to Flock
                </p>

                <Button className="gap-3 mt-8 border-2 border-primary-300 w-full cursor-pointer">
                    <GoogleLogo />
                    Continue with Google
                </Button>

                <div className="flex justify-center items-center my-7 w-full overflow-hidden">
                    <Separator />
                    <span className="px-2 text-sm">OR</span>
                    <Separator />
                </div>

                <Form {...form}>
                    <form
                        className="space-y-4 w-full"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            className="login-inputs"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Password"
                                                className="login-inputs"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="top-1/2 right-3 absolute disabled:opacity-50 text-muted hover:text-muted-foreground -translate-y-1/2 transform"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="mt-4 border-2 border-primary-300 w-full cursor-pointer"
                        >
                            Continue with Email
                        </Button>
                    </form>
                </Form>

                <div className="space-y-5 mt-5">
                    <Link
                        href="#"
                        className="block text-muted-foreground text-sm text-center underline"
                    >
                        Forgot your password?
                    </Link>
                    <p className="text-sm text-center">
                        Don&apos;t have an account?
                        <Link
                            href="#"
                            className="ml-1 text-muted-foreground underline"
                        >
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const GoogleLogo = () => (
    <svg
        width="1.2em"
        height="1.2em"
        id="icon-google"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block size-lg text-inherit align-sub shrink-0"
    >
        <g clipPath="url(#clip0)">
            <path
                d="M15.6823 8.18368C15.6823 7.63986 15.6382 7.0931 15.5442 6.55811H7.99829V9.63876H12.3194C12.1401 10.6323 11.564 11.5113 10.7203 12.0698V14.0687H13.2983C14.8122 12.6753 15.6823 10.6176 15.6823 8.18368Z"
                fill="#4285F4"
            ></path>
            <path
                d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
                fill="#34A853"
            ></path>
            <path
                d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
                fill="#FBBC04"
            ></path>
            <path
                d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
                fill="#EA4335"
            ></path>
        </g>
        <defs>
            <clipPath id="clip0">
                <rect width="15.6825" height="16" fill="white"></rect>
            </clipPath>
        </defs>
    </svg>
);

export default LoginPage;
