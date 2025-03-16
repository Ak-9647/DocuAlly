export const metadata = {
  title: 'Cookie Policy | Docually',
  description: 'Learn about how we use cookies on our website',
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose">
      <h1>Cookie Policy</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>What Are Cookies</h2>
      <p>
        Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
        They are widely used to make websites work more efficiently and provide information to the owners of the site.
      </p>
      
      <h2>How We Use Cookies</h2>
      <p>
        Docually uses cookies for a variety of purposes, including:
      </p>
      <ul>
        <li><strong>Essential cookies:</strong> These cookies are necessary for the website to function properly.</li>
        <li><strong>Preference cookies:</strong> These cookies remember your preferences and settings.</li>
        <li><strong>Analytics cookies:</strong> These cookies help us understand how visitors interact with our website.</li>
        <li><strong>Marketing cookies:</strong> These cookies track your online activity to help deliver more relevant advertising.</li>
        <li><strong>Session cookies:</strong> These cookies keep you signed in while navigating our platform.</li>
      </ul>
      
      <h2>Types of Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>
        These cookies are strictly necessary to provide you with services available through our website and to use some of its features, 
        such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without 
        impacting how our website functions.
      </p>
      
      <h3>Performance and Analytics Cookies</h3>
      <p>
        These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. 
        They help us know which pages are the most and least popular and see how visitors move around the site. If you do not allow 
        these cookies, we will not know when you have visited our site.
      </p>
      
      <h3>Functional Cookies</h3>
      <p>
        These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party 
        providers whose services we have added to our pages. If you do not allow these cookies, then some or all of these services may 
        not function properly.
      </p>
      
      <h3>Targeting Cookies</h3>
      <p>
        These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of 
        your interests and show you relevant advertisements on other sites. They do not store directly personal information, but are based 
        on uniquely identifying your browser and internet device.
      </p>
      
      <h2>Managing Cookies</h2>
      <p>
        Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when 
        cookies are being sent. The help function within your browser should tell you how.
      </p>
      <p>
        Alternatively, you may wish to visit <a href="http://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>, 
        which contains comprehensive information on how to manage cookies on a wide variety of desktop browsers.
      </p>
      
      <h2>Changes to Our Cookie Policy</h2>
      <p>
        We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
      </p>
      
      <h2>Contact Us</h2>
      <p>
        If you have any questions about our Cookie Policy, please contact us at: 
        <a href="mailto:privacy@docually.com">privacy@docually.com</a>
      </p>
    </div>
  );
} 