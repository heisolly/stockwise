import { Outfit, Varela_Round } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WorkspaceProviderWrapper } from '@/components/WorkspaceProviderWrapper';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const varelaRound = Varela_Round({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-varela',
  display: 'swap',
});

export const metadata = {
  title: 'StockWise - Professional Inventory Management',
  description: 'The heartbeat of your Business Inventory. Smart inventory management for Nigerian SMEs.',
  keywords: 'inventory management, POS, business, Nigeria, SME, retail',
  authors: [{ name: 'StockWise Team' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#004838',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${varelaRound.variable}`}>
      <body className="font-sans antialiased bg-white text-neutral-900">
        <Providers>
          <WorkspaceProviderWrapper>
            {children}
          </WorkspaceProviderWrapper>
        </Providers>
      </body>
    </html>
  );
}
