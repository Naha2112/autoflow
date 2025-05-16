import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoFlow',
  description: 'Invoicing and client management system',
};

import ClientLayout from '@/components/layout/client-layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 