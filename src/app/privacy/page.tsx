export const metadata = {
  title: 'Privacy Policy | Docually',
  description: 'Learn about how we collect, use and protect your data',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose">
      <h1>Privacy Policy</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Introduction</h2>
      <p>
        At Docually, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
        and safeguard your information when you visit our website or use our document signing service.
      </p>
      
      <h2>2. Information We Collect</h2>
      <p>
        We collect information that you provide directly to us, information we collect automatically when 
        you use our services, and information from third-party sources.
      </p>
      <h3>2.1 Information You Provide</h3>
      <ul>
        <li>Account information (name, email, password)</li>
        <li>Profile information</li>
        <li>Document content and metadata</li>
        <li>Payment information</li>
        <li>Communications with us</li>
      </ul>
      
      <h2>3. How We Use Your Information</h2>
      <p>
        We use the information we collect to provide, maintain, and improve our services, 
        communicate with you, and for legal and security purposes.
      </p>
      
      <h2>4. Sharing Your Information</h2>
      <p>
        We may share your information with third-party service providers, 
        for legal reasons, or in connection with business transfers.
      </p>
      
      <h2>5. Your Choices</h2>
      <p>
        You have certain choices about how we use your information, including 
        accessing, updating, or deleting your information.
      </p>
      
      <h2>6. Security</h2>
      <p>
        We take reasonable measures to help protect your information from loss, theft, misuse, 
        and unauthorized access, disclosure, alteration, and destruction.
      </p>
      
      <h2>7. Changes to This Privacy Policy</h2>
      <p>
        We may change this Privacy Policy from time to time. We will notify you of any changes 
        by posting the new Privacy Policy on this page.
      </p>
      
      <h2>8. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at: 
        <a href="mailto:privacy@docually.com">privacy@docually.com</a>
      </p>
    </div>
  );
} 