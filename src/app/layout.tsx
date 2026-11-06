import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ib revise — Calm Revision for the International Baccalaureate',
  description:
    'Distraction-free active recall flashcards, 30,000+ past-paper question bank, and calm tracking for TOK, EE, and IAs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} dark`}>
      <body className="min-h-screen bg-surface-canvas text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
