import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | StayFrame',
  description: 'Terms and conditions governing the use of StayFrame services.',
};

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: June 1, 2025
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">
            Welcome to StayFrame! These Terms of Service ("Terms") govern your access to and use of our 
            platform, services, and applications (collectively, the "Service") operated by StayFrame, 
            a company registered in Pune, Maharashtra, India.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing, using, or registering for the Service, you acknowledge that you have read, 
            understood, and agree to be legally bound by these Terms and our Privacy Policy. If you do 
            not agree to these Terms in their entirety, you are prohibited from accessing or using the 
            Service. Your continued use of the Service constitutes ongoing acceptance of these Terms.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            StayFrame is a digital content creation platform that enables users to create quotes, memes, 
            reels, and other visual content by adding text overlays to images. The Service includes all 
            features, tools, content creation capabilities, and applications offered by StayFrame. 
            StayFrame reserves the right to modify, suspend, or discontinue any aspect of the Service 
            at any time without prior notice.
          </p>

          <h2>3. User Eligibility and Account Registration</h2>
          <p>To access certain features of the Service, you must create an account. By creating an account, you represent and warrant that:</p>
          <ul>
            <li>You are at least 18 years of age or have reached the age of majority in your jurisdiction</li>
            <li>You have the legal capacity to enter into binding agreements</li>
            <li>You will provide accurate, current, and complete information during registration</li>
            <li>You will maintain the security of your password and accept all risks of unauthorized access</li>
            <li>You will notify us immediately if you discover or suspect any security breaches</li>
            <li>You are solely responsible for all activities that occur under your account</li>
            <li>You will not create multiple accounts or allow others to use your account</li>
          </ul>

          <h2>4. User Content and Intellectual Property</h2>
          <p>
            You retain ownership of any original content you create using the Service ("User Content"). 
            However, by using the Service, you grant StayFrame a perpetual, worldwide, non-exclusive, 
            royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, 
            publish, translate, create derivative works from, distribute, and display such User Content 
            in connection with operating and providing the Service.
          </p>
          
          <h3>4.1 Content Responsibility and Warranties</h3>
          <p>You acknowledge and agree that:</p>
          <ul>
            <li>You are solely responsible for all User Content you create, post, or share</li>
            <li>You must have all necessary rights, licenses, and permissions for any images, text, or other materials you use</li>
            <li>You warrant that your User Content does not infringe upon any third party's intellectual property rights</li>
            <li>StayFrame does not claim ownership of third-party images or content used in your creations</li>
            <li>You indemnify StayFrame against any claims arising from your use of copyrighted or proprietary materials</li>
          </ul>

          <h2>5. Prohibited Content and Conduct</h2>
          <p>You expressly agree not to create, post, share, or distribute User Content that:</p>
          <ul>
            <li>Contains or promotes pornography, sexual content, or adult material</li>
            <li>Promotes, incites, or facilitates terrorism, violence, or illegal activities</li>
            <li>Contains hate speech, discrimination, or promotes harm against individuals or groups</li>
            <li>Spreads false information, misinformation, or deliberately misleading content</li>
            <li>Infringes on any third party's intellectual property, privacy, or other rights</li>
            <li>Contains defamatory, libelous, or harassing content</li>
            <li>Promotes self-harm, suicide, or dangerous activities</li>
            <li>Contains malware, viruses, or other harmful code</li>
            <li>Violates any applicable laws, regulations, or third-party rights</li>
            <li>Impersonates any person, entity, or misrepresents your affiliation</li>
            <li>Contains spam, unsolicited advertising, or commercial content without authorization</li>
            <li>Exploits minors or contains content harmful to children</li>
          </ul>

          <h3>5.1 Additional Prohibited Activities</h3>
          <p>You further agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law</li>
            <li>Reverse engineer, decompile, or attempt to extract source code from the Service</li>
            <li>Interfere with, disrupt, or create an undue burden on the Service or networks connected to the Service</li>
            <li>Attempt to gain unauthorized access to any portion of the Service, other accounts, or computer systems</li>
            <li>Use any automated means, including bots, scrapers, or crawlers, to access the Service</li>
            <li>Sell, transfer, or sublicense your access to the Service</li>
            <li>Use the Service to compete directly with StayFrame or create a similar service</li>
          </ul>

          <h2>6. Content Moderation and Enforcement</h2>
          <p>
            StayFrame reserves the right, but assumes no obligation, to monitor, review, and remove any 
            User Content at our sole discretion. We may use automated systems and human moderators to 
            detect and remove prohibited content. Violation of these Terms may result in immediate 
            account suspension or termination without prior notice.
          </p>

          <h2>7. Subscription and Payments</h2>
          <p>
            Some features of the Service require payment of fees. You agree to pay all applicable fees, 
            taxes, and charges. All payments are processed in Indian Rupees (INR) unless otherwise specified. 
            Subscription fees are non-refundable except as required by applicable law. We reserve the right 
            to change our pricing at any time with 30 days' notice.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior 
            notice or liability, for any reason whatsoever, including without limitation if you breach 
            these Terms. Upon termination, your right to use the Service ceases immediately, and we may 
            delete your account and all associated content without liability to you.
          </p>

          <h2>9. Disclaimers and Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
            FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE. STAYFRAME 
            DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE FROM VIRUSES 
            OR OTHER HARMFUL COMPONENTS.
          </p>

          <h2>10. Limitation of Liability and Indemnification</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL STAYFRAME, ITS OFFICERS, 
            DIRECTORS, EMPLOYEES, AGENTS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, 
            GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE, REGARDLESS OF 
            THE THEORY OF LIABILITY.
          </p>
          
          <h3>10.1 User Indemnification</h3>
          <p>
            You agree to defend, indemnify, and hold harmless StayFrame and its affiliates, officers, 
            directors, employees, and agents from and against any and all claims, damages, obligations, 
            losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) 
            arising from: (i) your use of the Service; (ii) your violation of any term of these Terms; 
            (iii) your violation of any third party right, including without limitation any copyright, 
            property, or privacy right; or (iv) any claim that your User Content caused damage to a third party.
          </p>

          <h2>11. International Use and Compliance</h2>
          <p>
            The Service is controlled and operated from India. We make no representations that the Service 
            is appropriate or available for use in other locations. Users accessing the Service from outside 
            India do so at their own initiative and are responsible for compliance with local laws. 
            You agree not to use the Service in any jurisdiction where such use would be illegal.
          </p>

          <h2>12. Governing Law and Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without 
            regard to conflict of law principles. Any legal action or proceeding arising under these Terms 
            will be brought exclusively in the courts located in Pune, Maharashtra, India, and you hereby 
            irrevocably consent to the personal jurisdiction and venue therein. This jurisdiction clause 
            applies regardless of your location or residence.
          </p>

          <h2>13. Dispute Resolution</h2>
          <p>
            Any dispute, controversy, or claim arising out of or relating to these Terms or the Service 
            shall first be addressed through good faith negotiations. If such negotiations fail, disputes 
            shall be resolved through binding arbitration in Pune, Maharashtra, India, in accordance with 
            the Arbitration and Conciliation Act, 2015, conducted in English.
          </p>

          <h2>14. Force Majeure</h2>
          <p>
            StayFrame shall not be liable for any failure or delay in performance under these Terms which 
            is due to fire, flood, earthquake, elements of nature, acts of God, acts of war, terrorism, 
            riots, civil disorders, rebellions, or other similar causes beyond our reasonable control.
          </p>

          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable, such provision shall 
            be struck and the remaining provisions shall be enforced to the fullest extent under law.
          </p>

          <h2>16. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time in our sole discretion. We will provide 
            notice of material changes by posting the updated Terms on this page and updating the "Last updated" 
            date. Your continued use of the Service after such modifications constitutes acceptance of the 
            updated Terms. If you do not agree to the modified Terms, you must discontinue use of the Service.
          </p>

          <h2>17. Entire Agreement</h2>
          <p>
            These Terms constitute the entire agreement between you and StayFrame regarding the Service and 
            supersede all prior and contemporaneous written or oral agreements between you and StayFrame.
          </p>

          <h2>18. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us through feedback form 
            . Our registered office is located in Pune, Maharashtra, India.
          </p>

          <h2>19. Survival</h2>
          <p>
            The provisions of these Terms which by their nature should survive termination shall survive 
            termination, including but not limited to ownership provisions, warranty disclaimers, 
            indemnity, and limitations of liability.
          </p>
        </div>
      </div>
    </div>
  );
}