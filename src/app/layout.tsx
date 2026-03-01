import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CANACO Dashboard Empresarial",
  description: "Sistema de gestión empresarial para CANACO.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth_user');
  const role = authCookie?.value;

  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 flex flex-col antialiased overflow-x-hidden`}>
        <ClientLayout role={role}>
          {children}
        </ClientLayout>
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}
