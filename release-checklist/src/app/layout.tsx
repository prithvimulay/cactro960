import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/global.css";
import { ApolloWrapper } from "@/src/lib/apollo-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Release Checklist",
  description: "A tool to manage release steps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}