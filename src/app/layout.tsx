import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cinematic",
    template: "%s | Cinematic",
  },
  description:
    "Khám phá phim mới, phim bộ, phim lẻ và hoạt hình trên Cinematic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="min-h-[70vh] flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
