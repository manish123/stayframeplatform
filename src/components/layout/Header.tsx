// src/components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Zap, Image, MessageSquare, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/providers/theme-toggle';
import { ProPreviewModal } from '@/components/ProPreviewModal';
import { fadeIn, staggerContainer, scaleIn } from '@/lib/animation';

const navItems = [
  { name: 'QuoteForge', href: '/quote', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  { name: 'MemeStorm', href: '/meme', icon: <Image className="h-4 w-4 mr-2" /> },
  { name: 'ReelRush', href: '/reel', icon: <Film className="h-4 w-4 mr-2" /> },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header 
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
          isScrolled ? 'shadow-sm' : ''
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">StayFrame</span>
            </Link>
            
            <nav className="hidden md:flex ml-10 space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary flex items-center',
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>


          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center"
              onClick={() => setIsProModalOpen(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Pro Preview
            </Button>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: 0.1 * index,
                      duration: 0.2,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-3 py-2 rounded-md text-base font-medium',
                        pathname === item.href 
                          ? 'bg-accent text-accent-foreground' 
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: 0.1 * navItems.length,
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="pt-2"
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      setIsProModalOpen(true);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Pro Preview
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <ProPreviewModal 
        open={isProModalOpen} 
        onOpenChange={setIsProModalOpen} 
      />
    </>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}