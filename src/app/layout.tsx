import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-jakarta',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'Simple Revision — Free IB Diploma Revision Workspace',
  description:
    'Distraction-free, 100% free IB Diploma revision across Biology HL, Chemistry SL, History HL, English Literature HL, French B SL, and Math AA SL.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-[#FFFFFF] text-[#18181B] antialiased">
        {children}
      </body>
    </html>
  );
}
