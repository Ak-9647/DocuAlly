export const metadata = {
  title: 'Terms of Service | Docually',
  description: 'Terms and conditions for using the Docually platform',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose">
      <h1>Terms of Service</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Agreement to Terms</h2>
      <p>
        By accessing or using Docually's services, you agree to be bound by these Terms of Service. 
        If you do not agree to these Terms, you may not access or use our services.
      </p>
      
      <h2>2. Description of Services</h2>
      <p>
        Docually provides a digital document signing and management platform that allows users to 
        create, send, sign, and manage documents electronically.
      </p>
      
      <h2>3. User Accounts</h2>
      <p>
        To use certain features of our services, you must create an account. You are responsible 
        for maintaining the confidentiality of your account credentials and for all activities 
        that occur under your account.
      </p>
      
      <h2>4. User Responsibilities</h2>
      <p>
        You agree to use our services only for lawful purposes and in accordance with these Terms. 
        You are responsible for all content you upload, share, or transmit through our services.
      </p>
      
      <h2>5. Intellectual Property Rights</h2>
      <p>
        Our services and their contents, features, and functionality are owned by Docually and 
        are protected by copyright, trademark, and other intellectual property laws.
      </p>
      
      <h2>6. Termination</h2>
      <p>
        We may terminate or suspend your account and access to our services at any time, 
        without prior notice or liability, for any reason.
      </p>
      
      <h2>7. Disclaimer of Warranties</h2>
      <p>
        Our services are provided "as is" and "as available" without warranties of any kind, 
        either express or implied.
      </p>
      
      <h2>8. Limitation of Liability</h2>
      <p>
        In no event shall Docually be liable for any indirect, incidental, special, consequential, 
        or punitive damages arising out of or related to your use of our services.
      </p>
      
      <h2>9. Changes to Terms</h2>
      <p>
        We may revise these Terms from time to time. The most current version will always be 
        posted on our website.
      </p>
      
      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at: 
        <a href="mailto:legal@docually.com">legal@docually.com</a>
      </p>
    </div>
  );
} 