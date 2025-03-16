import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata = {
  title: 'Guides | Docually',
  description: 'Learn how to use Docually with our step-by-step guides',
};

export default function GuidesPage() {
  return (
    <PlaceholderPage 
      title="User Guides" 
      description="Learn how to use Docually with our step-by-step guides. We're preparing comprehensive tutorials to help you get the most out of our document signing platform." 
      linkText="View Sample Document"
      linkHref="/documents/sample-123"
    />
  );
} 