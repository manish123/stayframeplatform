import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | StayFrame',
  description: 'Learn how StayFrame collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: May 31, 2023
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">
            At StayFrame, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect several types of information from and about users of our platform, including:</p>
          <ul>
            <li><strong>Personal Information:</strong> Such as your name, email address, and payment information when you register or make a purchase.</li>
            <li><strong>Usage Data:</strong> Information about how you use our platform, including the pages you visit and the features you use.</li>
            <li><strong>Device Information:</strong> Such as your IP address, browser type, and operating system.</li>
            <li><strong>Content:</strong> Any content you create, upload, or share on our platform.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>Business partners to offer you certain products, services, or promotions</li>
            <li>Other users if you participate in any interactive areas of our services</li>
            <li>Law enforcement or other third parties when required by law</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>

          <h2>5. Your Data Protection Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal information</li>
            <li>Rectify inaccurate or incomplete information</li>
            <li>Object to or restrict processing of your personal information</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>6. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our platform and hold certain 
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 13. We do not knowingly collect 
            personal information from children under 13.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through feedback form 
            
            .
          </p>
        </div>
      </div>
    </div>
  );
}
