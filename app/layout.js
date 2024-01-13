import localFont from "next/font/local";
import "./globals.css";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={HelveticaNow.className}>{children}</body>
    </html>
  );
}
