import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { Toaster } from "sonner";
import { ModalProvider } from "@/providers/modal-provider";
import Head from "next/head";
import { Suspense } from "react";
import LoadingPage from "./loading";

const roboto = Roboto_Condensed({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Work Together",
  description: "A Collaborative Whiteboard for Teams with lots of tools to help you work together in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="favicon.ico" sizes="512x512" type="image/x-icon" />
      </Head>
      <body className={roboto.className}>
        <Suspense fallback={<LoadingPage />}>
          <ConvexClientProvider>
            <Toaster />
            <ModalProvider />
            {children}
          </ConvexClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
