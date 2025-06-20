'use client' // Add this because we are using a hook

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            <Link href="/albums">Photo & Blog Viewer</Link>
          </h1>
          <nav className="flex space-x-4">
            <Link href="/albums" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/albums"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                Albums
            </Link>
            <Link href="/blogs" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/blogs"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                Blogs
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header