import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Chat Application',
  description: 'Next.js Chat Application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
