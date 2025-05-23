import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediHelp",
  description: "Your personal health care hospital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${poppins.variable} antialiased`}>
        <SidebarProvider>
          <AppSidebar>{children}</AppSidebar>
        </SidebarProvider>
      </body>
    </html>
  );
}
