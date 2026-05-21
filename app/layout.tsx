import { Poppins } from "next/font/google";
import "./globals.css";
// import ChatBubble from "@/components/assistant/chat-bubble";
import AppHeader from "@/components/app-header";
import { getSession } from "@/lib/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="vi">
      <body className={`${poppins.className} ${poppins.variable} bg-gray-50`}>
        {session && (
          <AppHeader name={session.name} role={session.role} />
        )}
        {children}
        {/* {session && <ChatBubble />} */}
      </body>
    </html>
  );
}
