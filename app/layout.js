import { Geist_Mono, Lora } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lydia's Lil Library",
  description:
    "Books I've read, am reading, and want to read — a personal reading journal.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${lora.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
