import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies Policy | StayFrame',
  description: 'Learn about how StayFrame uses cookies and similar technologies to enhance your experience.',
};

export default function CookiesPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookies Policy</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: May 31, 2023
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">
            This Cookies Policy explains what cookies are, how we use them, and your choices regarding cookies.
          </p>

          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer, smartphone, or other device when you 
            visit a website. They are widely used to make websites work more efficiently and to provide 
            information to the website owners.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>We use cookies for several purposes, including:</p>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be 
              switched off in our systems.
            </li>
            <li>
              <strong>Performance Cookies:</strong> These allow us to count visits and traffic sources so we can 
              measure and improve the performance of our site.
            </li>
            <li>
              <strong>Functional Cookies:</strong> These enable the website to provide enhanced functionality and 
              personalization.
            </li>
            <li>
              <strong>Targeting Cookies:</strong> These may be set through our site by our advertising partners to 
              build a profile of your interests.
            </li>
          </ul>

          <h2>3. Types of Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-muted">
                  <th className="p-4 text-left">Cookie Name</th>
                  <th className="p-4 text-left">Purpose</th>
                  <th className="p-4 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4">session_id</td>
                  <td className="p-4">Maintains your session state</td>
                  <td className="p-4">Session</td>
                </tr>
                <tr className="bg-muted/50 border-t">
                  <td className="p-4">_ga</td>
                  <td className="p-4">Google Analytics - Used to distinguish users</td>
                  <td className="p-4">2 years</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4">_gid</td>
                  <td className="p-4">Google Analytics - Used to distinguish users</td>
                  <td className="p-4">24 hours</td>
                </tr>
                <tr className="bg-muted/50 border-t">
                  <td className="p-4">cookie_consent</td>
                  <td className="p-4">Stores your cookie preferences</td>
                  <td className="p-4">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>4. Third-Party Cookies</h2>
          <p>
            We may also use various third-party cookies to report usage statistics of the Service, deliver 
            advertisements on and through the Service, and so on. These third parties may set and access 
            their own cookies, web beacons, and similar technologies to collect information about your use of 
            the Service.
          </p>

          <h2>5. Your Choices Regarding Cookies</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can set or amend your web 
            browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use 
            our website though your access to some functionality and areas of our website may be restricted.
          </p>
          <p>You can manage your cookie preferences by:</p>
          <ul>
            <li>Adjusting your browser settings</li>
            <li>Using our cookie consent manager (if available)</li>
            <li>Visiting third-party opt-out pages (for third-party cookies)</li>
          </ul>

          <h2>6. How to Manage Cookies in Your Browser</h2>
          <p>Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you. It may also stop you from saving customized settings like login information.</p>
          
          <h3>Browser-specific guides:</h3>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Safari</a></li>
            <li><a href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
          </ul>

          <h2>7. Changes to This Cookies Policy</h2>
          <p>
            We may update this Cookies Policy from time to time to reflect changes to our use of cookies or 
            for other operational, legal, or regulatory reasons. The updated version will be indicated by an 
            updated "Last updated" date at the top of this page.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please contact us at{' '}
            <a href="mailto:privacy@stayframe.com" className="text-primary hover:underline">
              privacy@stayframe.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
