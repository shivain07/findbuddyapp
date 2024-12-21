import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/root/header/Header";
import "@/app.css";
import ApiLoader from "@/components/loaders/ApiLoader";
import 'leaflet/dist/leaflet.css';
import VerificationPopup from "@/components/root/popup/VerificationPopup";
import LoginRequiredPopup from "@/components/root/popup/LoginRequiredPopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ApiLoader/>
        <VerificationPopup/>
        <LoginRequiredPopup/>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
