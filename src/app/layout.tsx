import type { Metadata } from "next";
import "@fontsource/archivo-black/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://art2fcl.my.id"),
  title: "ART2FCL // SYSTEM BREACH",
  description:
    "A scroll-directed cybernetic art experience. Justice is blind. The system is not.",
  openGraph: {
    title: "JUSTICE.exe — SYSTEM//BREACH",
    description: "The system was never neutral.",
    images: ["/assets/goddess.png"],
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
