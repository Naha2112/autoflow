import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoFlow',
  description: 'Invoicing and client management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
} 