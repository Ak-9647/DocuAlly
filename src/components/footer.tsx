import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="border-t pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm text-gray-600">
                © 2025 DocuAlly. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Secure document signing made simple.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <nav className="flex flex-wrap justify-center md:justify-end gap-6">
                <Link href="/developer" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  About the Developer
                </Link>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
