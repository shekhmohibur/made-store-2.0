import "./globals.css";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import { CartProvider } from "@/context/CartContext";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "ATELIER THREADS — Contemporary Apparel",
  description: "Minimalist silhouettes crafted from organic heavyweight fabrics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white"
        suppressHydrationWarning
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}