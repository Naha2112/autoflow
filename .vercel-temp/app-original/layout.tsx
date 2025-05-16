import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AutoFlow",
  description: "Automated invoicing and client management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
