import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'StayFrame - Create Stunning Content with AI',
  description: 'Transform your ideas into beautiful content with our AI-powered creation tools. Make quotes, memes, and video memes in seconds.',
};

export default function HomePage() {
  return (
    <main>
      {/* Your landing page content */}
      <div className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Create Amazing Content with AI</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Transform your ideas into beautiful content with our AI-powered tools. No design skills needed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/create">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/marketing/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
