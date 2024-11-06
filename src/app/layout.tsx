import { Nunito } from 'next/font/google';

const nunito = Nunito({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Chatbot',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={nunito.className} style={{ backgroundColor: '#132337', color: '#f4f4f4' }}>
        {children}
      </body>
    </html>
  );
}
