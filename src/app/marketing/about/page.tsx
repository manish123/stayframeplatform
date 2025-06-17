'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TeamSection } from '@/components/about/TeamSection';
import Link from 'next/link';
import { ToolSelector } from '@/components/ToolSelector';

export default function AboutPage() {
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);

  const handleGetStarted = () => {
    setIsToolSelectorOpen(true);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Where Creativity Meets Intelligence
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            At StayFrame, we're revolutionizing digital storytelling by seamlessly blending 
            advanced AI capabilities with intuitive design experiences that inspire creators worldwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleGetStarted} size="lg">
              Begin Your Journey
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#team">Meet the Visionaries</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Genesis</h2>
              <p className="text-muted-foreground">
                Born in early 2025 from a bold vision to democratize creative expression, StayFrame represents 
                the convergence of imagination and technology. Co-founders x and y 
                identified a crucial opportunity to bridge the gap between sophisticated AI and accessible creativity.
              </p>
              <p className="text-muted-foreground">
                What began as passionate conversations between industry veterans has evolved into a thriving, 
                remote-first organization that spans continents. We champion the belief that extraordinary 
                content should be within everyone's reach, regardless of technical expertise.
              </p>
            </div>
            <div className="bg-muted rounded-xl aspect-video flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-muted-foreground">
                  Transforming ideas into extraordinary experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Purpose & Principles</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We exist to unlock human creativity through intelligent technology, making professional-grade content creation effortless and inspiring.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Innovation at Heart</h3>
              <p className="text-muted-foreground">
                We relentlessly explore the frontiers of AI and design, crafting tools that don't just respond 
                to creativity—they amplify and inspire it.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Creative Empowerment</h3>
              <p className="text-muted-foreground">
                Every individual has a unique voice worth sharing. We eliminate barriers between imagination 
                and expression, making powerful creation tools universally accessible.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Global Mindset</h3>
              <p className="text-muted-foreground">
                Our distributed team celebrates diverse perspectives and cultural richness, building inclusive 
                products that resonate across borders and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <div id="team">
        <TeamSection />
      </div>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Elevate Your Creative Vision?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join a growing community of creators who are already transforming their ideas into compelling content with StayFrame.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/pricing">Discover Plans</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white/20 hover:bg-white/10" asChild>
              <Link href="/marketing/contact">Let's Connect</Link>
            </Button>
          </div>
        </div>
      </section>
      <ToolSelector open={isToolSelectorOpen} onOpenChange={setIsToolSelectorOpen} />
    </div>
  );
}
