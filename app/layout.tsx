import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/auth/auth-provider";

const zalandoSans = localFont({
    src: "./fonts/ZalandoSans-Regular.woff2",
});

export const metadata: Metadata = {
    title: "Flock",
    description: "Modern & Different Chat app",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${zalandoSans.className} antialiased`}
                suppressHydrationWarning
            >
                {/* @ts-expect-error - SessionProvider session prop type issue */}
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
