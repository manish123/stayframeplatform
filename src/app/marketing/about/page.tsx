'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
            Turn Your Creativity Into Income
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            At StayFrame, we empower content creators to monetize their passion. 
            Our AI-driven platform provides the tools, knowledge, and marketplace you need to transform 
            your creative work into sustainable income.
          </p>
          <Button onClick={handleGetStarted} size="lg">
            Start Earning Today
          </Button>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Empowering Creator Success</h2>
              <p className="text-muted-foreground">
                In today's digital landscape, creators face the challenge of not just creating amazing content, 
                but also making it financially sustainable. StayFrame was born in 2025 to solve this exact challenge 
                by providing a comprehensive ecosystem where creativity meets commerce.
              </p>
              <p className="text-muted-foreground">
                We understand that every like, share, and view represents more than just engagement—it's an 
                opportunity to build a sustainable career. Our platform is designed to help you maximize 
                your content's earning potential through intelligent tools, data-driven insights, and direct 
                monetization channels that put you in control of your financial success.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <p className="text-primary font-medium">
                  "The best creators deserve to be rewarded for their work. We're building the future where 
                  creative talent is valued and compensated fairly."
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-background p-6 rounded-xl border">
                <h3 className="font-semibold text-lg mb-3">How We Help You Earn</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="text-primary mt-0.5">💰</div>
                    <span>Monetize your content through our creator marketplace</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-primary mt-0.5">📈</div>
                    <span>Access real-time analytics to optimize your content strategy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-primary mt-0.5">🤖</div>
                    <span>Leverage AI to identify trending topics and viral opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-primary mt-0.5">🔄</div>
                    <span>Automate content repurposing for multiple platforms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-primary mt-0.5">💼</div>
                    <span>Connect with brands and sponsors through our network</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Join thousands of creators already growing their income with StayFrame
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The StayFrame Difference */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Grow Your Income, Not Just Your Audience</h2>
            <p className="text-muted-foreground">
              StayFrame isn't just about creating content—it's about building a sustainable creative business. 
              Our platform is packed with features designed to help you maximize your earnings and turn your passion into profit.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
              <p className="text-muted-foreground">
                Get real-time analytics on what content performs best and when to post for maximum visibility and revenue.
                Our AI identifies patterns to help you create more of what your audience loves.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Viral Potential</h3>
              <p className="text-muted-foreground">
                Our AI predicts trending topics and helps you create content with higher viral potential. 
                Stay ahead of the curve and ride the wave of what's about to be popular.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Revenue Streams</h3>
              <p className="text-muted-foreground">
                Diversify your income with our marketplace, brand partnerships, and direct fan support. 
                We make it easy to monetize every aspect of your creative work.
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-background p-8 rounded-xl border">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Beta Tester Testimonials</h3>
              <p className="text-muted-foreground mb-6">
                Don't just take our word for it. Here's what our beta testers are saying after their first two weeks with StayFrame.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Testimonial 1 - Small Brand Owner */}
                <div className="bg-background p-6 rounded-xl border hover:shadow-md transition-shadow">
                  <div className="text-primary text-4xl mb-4">"</div>
                  <p className="text-muted-foreground mb-6">
                    "After just two weeks with StayFrame, I'm impressed by how the knowledge base and simple tools work together. The trend highlighter 
                    helped me spot a rising ingredient trend that I featured in my latest post—it got 3x our usual engagement! The platform's potential 
                    to help small businesses like Salsa Salad is really exciting."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">A</div>
                    <div>
                      <div className="font-semibold">Archie</div>
                      <div className="text-sm text-muted-foreground">Owner, Salsa Salad</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 - Marketing Agency Owner */}
                <div className="bg-background p-6 rounded-xl border hover:shadow-md transition-shadow">
                  <div className="text-primary text-4xl mb-4">"</div>
                  <p className="text-muted-foreground mb-6">
                    "The vision behind StayFrame's marketplace is exactly what our agency has been looking for. Even in these early stages, I can see 
                    how the campaign management workflow could transform how we handle client projects. The ability to coordinate content, track performance, 
                    and manage approvals all in one place shows tremendous promise for scaling our operations."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">M</div>
                    <div>
                      <div className="font-semibold">Mitest K.</div>
                      <div className="text-sm text-muted-foreground">CEO, Horizon Digital Solutions</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 - Independent Content Creator */}
                <div className="bg-background p-6 rounded-xl border hover:shadow-md transition-shadow">
                  <div className="text-primary text-4xl mb-4">"</div>
                  <p className="text-muted-foreground mb-6">
                    "I was skeptical about trying another content tool, but StayFrame's Quote Forge Pro surprised me! The trend picker is incredibly 
                    intuitive, and I love that I can post directly to X without switching apps. In just a couple of weeks, it's already made my content 
                    creation process so much smoother. The interface is clean and doesn't feel overwhelming like some professional tools can be."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">U</div>
                    <div>
                      <div className="font-semibold">Usha M.</div>
                      <div className="text-sm text-muted-foreground">Hobbyist Creator on X</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Commitment to Your Success</h2>
            <p className="text-muted-foreground">
              We're building more than a platform—we're building pathways to financial freedom for creators. 
              These principles guide how we help you turn your creativity into a sustainable career.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Creator-First Monetization</h3>
                  <p className="text-muted-foreground">
                    We prioritize features that put money in your pocket first. From our marketplace to brand 
                    partnerships, we ensure you keep the lion's share of your earnings.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-xl">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data-Backed Growth</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes millions of data points to give you actionable insights that actually 
                    grow your audience and income, not just vanity metrics.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Community & Collaboration</h3>
                  <p className="text-muted-foreground">
                    Connect with fellow creators, share strategies, and find collaboration opportunities that 
                    amplify your reach and revenue potential.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Efficiency = Profitability</h3>
                  <p className="text-muted-foreground">
                    Our tools help you create better content faster, giving you more time to focus on growing 
                    your business and less time on tedious tasks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Earning with StayFrame */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Turn Your Creativity Into Income?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">
              Join thousands of creators who are already building sustainable businesses with StayFrame. 
              Start monetizing your passion today—no large following required.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="px-8 py-6 text-lg bg-background text-foreground hover:bg-background/90 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Earning Now — It's Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg border-2 border-white/20 hover:bg-white/10 transition-all"
                onClick={handleGetStarted}
              >
                See How It Works
              </Button>
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center items-center gap-2 text-sm opacity-70">
                <span>Trusted by 10,000+ creators worldwide</span>
                <span className="text-xs">•</span>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium">
                      {i}+{i*2}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToolSelector open={isToolSelectorOpen} onOpenChange={setIsToolSelectorOpen} />
    </div>
  );
}
