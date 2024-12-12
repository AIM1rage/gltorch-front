import type { Metadata } from "next";
import "./globals.css";
import Store from "@/app/store";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "gltorch",
  description: "A tool to search for code on GitLab in many projects at once",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans text-sm`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Store>{children}</Store>
        </ThemeProvider>
      </body>
    </html>
  );
}
