import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; // Import the Header

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Photo & Blog Viewer",
  description: "A simple app to view photos and blogs",
};

export default function RootLayout({ children }) {
  // Note: We don't need the page state here anymore,
  // as Next.js handles routing. The Header component will
  // need a small modification (see below).
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-gray-50 min-h-screen">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
