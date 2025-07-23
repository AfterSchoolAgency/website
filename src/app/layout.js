import './globals.css';

export const metadata = {
  title: 'After School',
  description: 'An interactive experience by After School Agency',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
