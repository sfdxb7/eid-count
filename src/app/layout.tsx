import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eid Count - My Eid Money Tracker',
  description: 'A fun way for kids to track their Eid money collection in Dubai.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary selection:text-black">{children}</body>
    </html>
  );
}