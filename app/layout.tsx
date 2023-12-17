import "./globals.css";
import { Public_Sans } from "next/font/google";

import { Navbar } from "@/components/Navbar";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Alo</title>
        <meta
          name="description"
          content="Let's find out how sharp your reasoning really is"
        />
        <meta property="og:title" content="Alo" />
        <meta
          property="og:description"
          content="et's find out how sharp your reasoning really is"
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alo" />
        <meta
          name="twitter:description"
          content="et's find out how sharp your reasoning really is"
        />
        <meta name="twitter:image" content="/images/og-image.png" />
      </head>
      <body className={publicSans.className}>
        <div className="flex flex-col p-4 md:p-12 h-[100vh]">
          {/* <Navbar></Navbar> */}
          {children}
        </div>
      </body>
    </html>
  );
}
