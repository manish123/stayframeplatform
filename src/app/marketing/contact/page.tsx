"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import ContactRedirect from './ContactRedirect';

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
  return <ContactRedirect />;
}
