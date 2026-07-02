import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from './auth-context';

export const metadata: Metadata = {
  title: 'CodeCraft AI Studio',
  description: 'A futuristic full-stack workspace for building modern apps'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
