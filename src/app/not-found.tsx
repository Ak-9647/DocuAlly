import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you were looking for. It might have been moved, 
          deleted, or maybe the URL was mistyped.
        </p>
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition duration-200"
          >
            Return to Home
          </Link>
          <Link 
            href="/documents"
            className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded transition duration-200"
          >
            Go to Documents
          </Link>
        </div>
      </div>
    </div>
  );
} 