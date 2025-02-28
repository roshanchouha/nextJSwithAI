import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./context/AuthProvider";
import Navbar from "@/components/Navbar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AuthProvider>
                <body className={` antialiased`} >
                    <Navbar />
                    {children}
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
