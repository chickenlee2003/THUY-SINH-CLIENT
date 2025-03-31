import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Chatbot } from "@/components/chatbot"
import { AuthProvider } from "./auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cửa hàng thuỷ sinh",
  description: "Cửa hàng thuỷ sinh uy tính hàng đầu tại Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Chatbot />
     
        </AuthProvider>

             <ToastProvider />
      </body>
    </html>
  );
}