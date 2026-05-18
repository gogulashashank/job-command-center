import './globals.css';
import { Inter } from 'next/font/google';
import { JccProvider } from './JccProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Job Command Center',
  description: 'Operating system for job tracking and applications.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JccProvider>
          {children}
        </JccProvider>
      </body>
    </html>
  );
}
