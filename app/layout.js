// "use client";
import localFont from "next/font/local";
import "./globals.css";
import SplashScreen from "./components/SplashScreen";
import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

const HelveticaNow = localFont({
  src: [
    {
      path: "./font/HelveticaNowText-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./font/HelveticaNowText-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./font/HelveticaNowText-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
});
export const metadata = {
  title: "SAMPLES",
  description: "INFINITE STREAM OF DESIGN REFERENCES",
  openGraph: {
    title: "SAMPLES",
    images: "/samplesog.png",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "SAMPLES",
  //   description: "INFINITE STREAM OF DESIGN REFERENCES",
  //   images: "/samplesog.png",
  // },
};

export default function RootLayout({ children }) {
  // const pathname = usePathname();
  // const isHome = pathname === "/";
  // const [isLoading, setIsLoading] = useState(isHome);

  // useEffect(() => {
  //   if (isLoading) return;
  // }, [isLoading]);
  return (
    <html lang="en">
      {/* <head>
        <title>SAMPLES</title>
        <meta
          name="description"
          content="INFINITE STREAM OF DESIGN REFERENCES"
        />
      </head> */}
      <body className={HelveticaNow.className}>{children}</body>
    </html>
  );
}
