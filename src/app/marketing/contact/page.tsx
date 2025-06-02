import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | StayFrame',
  description: 'Get in touch with our team. We\'d love to hear from you!',
};

const contactMethods = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: 'Email Us',
    description: 'We\'ll get back to you within 24 hours',
    contact: 'hello@stayframe.com',
    link: 'mailto:hello@stayframe.com',
  },
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: 'Call Us',
    description: 'Mon-Fri from 9am to 5pm',
    contact: '+1 (555) 123-4567',
    link: 'tel:+15551234567',
  },
  {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: 'Visit Us',
    description: 'Come say hello at our office',
    contact: '123 Creator St, San Francisco, CA 94107',
    link: 'https://maps.google.com',
  },
];

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-20">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-muted-foreground">
          Have questions or feedback? We'd love to hear from you. Fill out the form below or reach out using the contact information.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-card p-6 md:p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium mb-1">
                  First name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="last-name"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center">
              <Button type="submit" className="flex items-center">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                  {method.icon}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">{method.title}</h3>
                  <p className="text-muted-foreground text-sm">{method.description}</p>
                  <a 
                    href={method.link} 
                    className="text-primary hover:underline mt-1 inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {method.contact}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-medium mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {[
                { name: 'Twitter', icon: '🐦', link: '#' },
                { name: 'Instagram', icon: '📷', link: '#' },
                { name: 'LinkedIn', icon: '💼', link: '#' },
                { name: 'Facebook', icon: '👍', link: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-16 bg-muted rounded-2xl overflow-hidden h-96">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Map would be displayed here</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Can't find the answer you're looking for? Reach out to our support team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              question: 'How can I get started with StayFrame?',
              answer: 'Getting started is easy! Simply create an account, choose a template, and start customizing it to create your content.'
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards, PayPal, and bank transfers for our premium plans.'
            },
            {
              question: 'Is there a free trial available?',
              answer: 'Yes, we offer a 14-day free trial for all our premium features. No credit card is required to start your trial.'
            },
            {
              question: 'How can I cancel my subscription?',
              answer: 'You can cancel your subscription at any time from your account settings. Your subscription will remain active until the end of your billing period.'
            },
          ].map((faq, index) => (
            <div key={index} className="bg-card p-6 rounded-xl border">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-muted-foreground text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
