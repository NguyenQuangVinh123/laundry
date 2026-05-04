import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap", // Optimize font loading with font-display: swap
  preload: true, // Preload font for better performance
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.variable} bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
