const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// import { Merienda } from "next/font/google";

import { Geist, Geist_Mono, Josefin_Sans } from "next/font/google";

import "./globals.css";


// const merianda = Merienda({
//   subsets: ["latin"],
// });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Recipiehub",
// };


export const metadata = {
  title: {
    default: "Recipehub",
    template: "%s | Recipehub",
  },
  description: "Share and validate your startup ideas.",
};

export default function RootLayout({ children }) {
  return (
    // <html lang="en" className={` h-full antialiased`} suppressHydrationWarning>
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="light"
      suppressHydrationWarning
    >
      {/* <body className={`min-h-full flex flex-col ${merianda.className}`}> */}
      <body className={`min-h-full flex flex-col`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
