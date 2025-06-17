// src/components/KnowledgeHub.tsx
'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Image as ImageIcon, Film, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const knowledgeHubItems = [
  {
    title: 'The Psychology of Viral Quotes',
    description: 'Unlock the emotional triggers and storytelling techniques that make quotes resonate deeply and inspire immediate sharing across communities.',
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    slug: 'psychology-viral-quotes',
  },
  {
    title: 'Meme Mastery & Cultural Intelligence',
    description: 'Decode the art of cultural timing and visual humor. Learn to create memes that capture zeitgeist moments and spark conversations.',
    icon: <ImageIcon className="h-6 w-6 text-blue-500" />,
    slug: 'meme-mastery-cultural-intelligence',
  },
  {
    title: 'Short-Form Video Storytelling',
    description: 'Master the craft of micro-narratives that captivate within seconds. Transform fleeting attention into lasting engagement and meaningful connections.',
    icon: <Film className="h-6 w-6 text-pink-500" />,
    slug: 'short-form-video-storytelling',
  },
];

export function KnowledgeHub() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Creative Intelligence Center</h2>
          <p className="max-w-[700px] text-muted-foreground mt-4">
            Elevate your content strategy with insights that blend creative intuition, cultural awareness, and data-driven storytelling techniques.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {knowledgeHubItems.map((item, index) => (
            <motion.div 
              key={index}
              className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 rounded-md bg-primary/10">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="text-muted-foreground">{item.description}</p>
              <Link href={`/knowledge-hub/${item.slug}`}>
                <Button variant="ghost" size="sm" className="mt-4 pl-0">
                  Explore Insights
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}