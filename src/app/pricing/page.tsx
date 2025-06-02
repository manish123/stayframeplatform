import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Choose Your Creative Journey
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Unlock your creative potential with tools designed for every stage of your journey—from first inspiration to professional mastery.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Free Tier */}
          <div className="relative group">
            <Card 
              title="Creator Starter" 
              className="h-full border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
            >
              <div className="space-y-6 p-6">
                <div className="text-center space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">Free</span>
                    <span className="text-muted-foreground text-sm">forever</span>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Perfect for exploring your creative spark
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground text-center">What's included:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Curated quotes & idioms library</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Essential templates with editable text</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Custom background image uploads</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">PNG export with discrete watermark</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Quick copy & download options</span>
                    </li>
                  </ul>
                </div>

                <Button variant="secondary" className="w-full mt-6 hover:bg-secondary/80 transition-colors">
                  Start Creating Free
                </Button>
              </div>
            </Card>
          </div>

          {/* Pro Tier - Featured */}
          <div className="relative group lg:scale-105">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Card 
              title="Creator Pro" 
              className="relative h-full border-2 border-primary/50 hover:border-primary transition-all duration-300 shadow-xl hover:shadow-2xl bg-card"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="space-y-6 p-6 pt-8">
                <div className="text-center space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">Flexible</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">monthly or yearly billing</p>
                  <p className="text-muted-foreground font-medium">
                    Ideal for creators & digital entrepreneurs
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground text-center">Everything in Starter, plus:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">AI-powered quote discovery engine</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Watermark removal & customization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Personal template library & organization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">AI-suggested web image integration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Direct social media publishing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Community galleries & networking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Creator marketplace access</span>
                    </li>
                  </ul>
                </div>

                <Button variant="secondary" className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Get Pro Access
                </Button>
              </div>
            </Card>
          </div>

          {/* Team Tier */}
          <div className="relative group">
            <Card 
              title="Studio Team" 
              className="h-full border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
            >
              <div className="space-y-6 p-6">
                <div className="text-center space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">Team</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">per project or seat</p>
                  <p className="text-muted-foreground font-medium">
                    Built for agencies & collaborative teams
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground text-center">Everything in Pro, plus:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Team workspaces (up to 5 members)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Project templates & version control</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Review & feedback workflows</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Automated invoice generation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Enhanced marketplace & client portal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Analytics dashboard (coming soon)</span>
                    </li>
                  </ul>
                </div>

                <Button variant="secondary" className="w-full mt-6 hover:bg-secondary/80 transition-colors">
                  Contact Sales Team
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-in">
          <p className="text-muted-foreground mb-4">
            Need something custom? We're here to help you scale.
          </p>
          <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
            Talk to Our Team
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}