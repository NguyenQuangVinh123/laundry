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
        <ul className="flex flex-wrap -mb-px justify-center items-center">
          <li className="me-2">
            <Link
              href="/contacts"
              className={`inline-block p-4 border-b-2   rounded-t-lg ${router === '/contacts' ? active : inactive} `} >
              Bills
            </Link>
          </li>
          <li className="me-2">
            <Link
              href="/customers"
              className={`inline-block p-4  ${router === '/customers' ? active : inactive}`}
              aria-current="page"
            >
              Customers
            </Link>
          </li>
        </ul>

        {children}
      </body>
    </html>
  );
}
