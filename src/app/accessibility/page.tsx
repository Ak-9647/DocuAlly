export const metadata = {
  title: 'Accessibility | Docually',
  description: 'Accessibility statement for Docually',
};

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose">
      <h1>Accessibility Statement</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>Our Commitment</h2>
      <p>
        Docually is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user 
        experience for everyone, and applying the relevant accessibility standards.
      </p>
      
      <h2>Conformance Status</h2>
      <p>
        The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve 
        accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. 
        Docually is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content 
        do not fully conform to the accessibility standard.
      </p>
      
      <h2>Feedback</h2>
      <p>
        We welcome your feedback on the accessibility of Docually. Please let us know if you encounter accessibility 
        barriers on Docually:
      </p>
      <ul>
        <li>Email: <a href="mailto:accessibility@docually.com">accessibility@docually.com</a></li>
        <li>Phone: +1 (555) 123-4567</li>
        <li>Visitor address: 123 Document Lane, Suite 101, San Francisco, CA 94107</li>
      </ul>
      <p>
        We try to respond to feedback within 3 business days.
      </p>
      
      <h2>Compatibility with Browsers and Assistive Technology</h2>
      <p>
        Docually is designed to be compatible with the following assistive technologies:
      </p>
      <ul>
        <li>Screen readers (including NVDA and VoiceOver)</li>
        <li>Screen magnifiers</li>
        <li>Voice recognition software</li>
        <li>Keyboard-only navigation</li>
      </ul>
      
      <h2>Technical Specifications</h2>
      <p>
        Accessibility of Docually relies on the following technologies to work with the particular 
        combination of web browser and any assistive technologies or plugins installed on your computer:
      </p>
      <ul>
        <li>HTML</li>
        <li>WAI-ARIA</li>
        <li>CSS</li>
        <li>JavaScript</li>
      </ul>
      <p>
        These technologies are relied upon for conformance with the accessibility standards used.
      </p>
      
      <h2>Assessment Approach</h2>
      <p>
        Docually assesses the accessibility of our platform through the following approaches:
      </p>
      <ul>
        <li>Self-evaluation</li>
        <li>External evaluation</li>
        <li>User feedback</li>
      </ul>
      
      <h2>Measures to Support Accessibility</h2>
      <p>
        Docually takes the following measures to ensure accessibility:
      </p>
      <ul>
        <li>Include accessibility as part of our mission statement</li>
        <li>Integrate accessibility into our procurement practices</li>
        <li>Provide continual accessibility training for our staff</li>
        <li>Assign clear accessibility goals and responsibilities</li>
        <li>Employ formal accessibility quality assurance methods</li>
      </ul>
    </div>
  );
} 