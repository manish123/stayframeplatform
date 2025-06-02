'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Twitter, Instagram, Linkedin, Github, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const footerLinks = [
  {
    title: 'Products',
    items: [
      { name: 'QuoteForge', href: '/quote' },
      { name: 'MemeStorm', href: '/meme' },
      { name: 'ReelRush', href: '/reel' },
    ],
  },
  {
    title: 'Company',
    items: [
      { name: 'About', href: '/marketing/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/marketing/contact' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { name: 'Privacy', href: '/marketing/privacy' },
      { name: 'Terms', href: '/marketing/terms' },
      { name: 'Cookies', href: '/marketing/cookies' },
    ],
  },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">StayFrame</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Transform your ideas into stunning visual content with our AI-powered tools.
              No design skills needed.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'text-sm text-muted-foreground hover:text-foreground transition-colors',
                        pathname === item.href && 'text-foreground font-medium'
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {currentYear} StayFrame. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
