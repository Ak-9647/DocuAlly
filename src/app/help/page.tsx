import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata = {
  title: 'Help Center | Docually',
  description: 'Find answers to your questions about using Docually',
};

export default function HelpPage() {
  return (
    <PlaceholderPage 
      title="Help Center" 
      description="Find answers to your questions about using Docually. Our support team is building a comprehensive help center to assist you with any issues you may encounter." 
      linkText="Contact Support"
      linkHref="/contact"
    />
  );
} 