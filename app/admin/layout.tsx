import { Inter } from 'next/font/google';
import '@/app/globals.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { auth } from '@/lib/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { headers } from 'next/headers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ROUHI | Admin Dashboard',
  description: 'Admin management panel',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
