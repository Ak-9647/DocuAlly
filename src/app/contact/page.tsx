import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata = {
  title: 'Contact Us | Docually',
  description: 'Get in touch with the Docually team',
};

export default function ContactPage() {
  return (
    <PlaceholderPage 
      title="Contact Us" 
      description="Have questions or need assistance? Our team is here to help. Contact form coming soon. In the meantime, you can reach us at support@docually.com" 
      comingSoon={false}
    />
  );
} 