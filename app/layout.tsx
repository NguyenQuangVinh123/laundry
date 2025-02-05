"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = usePathname()
  const active = "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
  const inactive = "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-transparent"
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
