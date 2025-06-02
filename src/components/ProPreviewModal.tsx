'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, Zap, Sparkles, Users, BarChart, Clock, Mail, X, Search, Image, Download, Share2, Palette, Crown, Building2, Rocket, DollarSign, Star, Shield, Workflow } from 'lucide-react';
import { useState, FormEvent } from 'react';

const plans = {
  pro: {
    name: 'StayFrame Pro',
    subtitle: 'For serious creators & professionals',
    price: 'Premium features, affordable pricing',
    icon: <Crown className="h-6 w-6 text-yellow-500" />,
    features: [
      {
        name: 'AI-Powered Quote Search',
        description: 'Search millions of quotes by meaning, author, or theme using advanced embeddings',
        icon: <Search className="h-5 w-5 text-blue-500" />,
      },
      {
        name: 'Smart Image Suggestions',
        description: 'AI-recommended images from the internet that match your content perfectly',
        icon: <Image className="h-5 w-5 text-green-500" />,
      },
      {
        name: 'Custom Watermarks',
        description: 'Remove "Powered by StayFrame" and add your own signature branding',
        icon: <Palette className="h-5 w-5 text-purple-500" />,
      },
      {
        name: 'Direct Social Sharing',
        description: 'Export and share directly to all major social media platforms',
        icon: <Share2 className="h-5 w-5 text-pink-500" />,
      },
      {
        name: 'Private Gallery',
        description: 'Save unlimited templates and access your personal content library',
        icon: <Shield className="h-5 w-5 text-indigo-500" />,
      },
      {
        name: 'Marketplace Access',
        description: 'Sell your work or hire other creators through our marketplace',
        icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
      },
    ],
  },
  agency: {
    name: 'StayFrame Agency',
    subtitle: 'For teams & collaborative workflows',
    price: 'Team pricing available',
    icon: <Building2 className="h-6 w-6 text-blue-500" />,
    features: [
      {
        name: 'Everything in Pro',
        description: 'All professional features plus team collaboration tools',
        icon: <Star className="h-5 w-5 text-yellow-500" />,
      },
      {
        name: '5-Member Team Collaboration',
        description: 'Work together on templates with real-time editing and reviews',
        icon: <Users className="h-5 w-5 text-blue-500" />,
      },
      {
        name: 'Project Management',
        description: 'Organize work into projects with version control and approval workflows',
        icon: <Workflow className="h-5 w-5 text-purple-500" />,
      },
      {
        name: 'Client Invoicing',
        description: 'Generate professional invoices based on time spent or fixed contracts',
        icon: <BarChart className="h-5 w-5 text-green-500" />,
      },
      {
        name: 'Enhanced Marketplace',
        description: 'Priority listings and advanced marketplace features for agencies',
        icon: <Rocket className="h-5 w-5 text-pink-500" />,
      },
      {
        name: 'Advanced Analytics',
        description: 'Track team productivity and project performance metrics',
        icon: <BarChart className="h-5 w-5 text-indigo-500" />,
      },
    ],
  },
};

interface ProPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProPreviewModal({ open, onOpenChange }: ProPreviewModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'agency'>('pro');
  const [interestedIn, setInterestedIn] = useState<'creator' | 'professional' | 'agency'>('creator');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email, 'Plan:', selectedPlan, 'Interest:', interestedIn);
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
      onOpenChange(false);
    }, 3000);
  };

  const currentPlan = plans[selectedPlan];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <DialogHeader className="text-left">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-accent/20 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Unlock Your Creative Potential
            </DialogTitle>
            <p className="mt-3 text-lg text-muted-foreground">
              Professional-grade content creation at unbeatable value
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Coming Soon - Join the Waitlist</span>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-8">
          {/* Audience Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Which describes you best?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'creator', label: 'Aspiring Creator', desc: 'Starting my content journey', icon: <Sparkles className="h-5 w-5" /> },
                { id: 'professional', label: 'Professional', desc: 'Serious about quality & cost', icon: <Crown className="h-5 w-5" /> },
                { id: 'agency', label: 'Agency/Team', desc: 'Need collaboration tools', icon: <Building2 className="h-5 w-5" /> },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setInterestedIn(option.id as any);
                    setSelectedPlan(option.id === 'agency' ? 'agency' : 'pro');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    interestedIn === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {option.icon}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Plan Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-muted/50 rounded-lg p-1">
              <button
                onClick={() => setSelectedPlan('pro')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  selectedPlan === 'pro'
                    ? 'bg-background shadow-sm text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pro Plan
              </button>
              <button
                onClick={() => setSelectedPlan('agency')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  selectedPlan === 'agency'
                    ? 'bg-background shadow-sm text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Agency Plan
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Features Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                {currentPlan.icon}
                <div>
                  <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                  <p className="text-muted-foreground">{currentPlan.subtitle}</p>
                  <p className="text-sm text-primary font-medium">{currentPlan.price}</p>
                </div>
              </div>

              <div className="grid gap-4">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Value Proposition */}
              <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-foreground mb-2">The StayFrame Advantage</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>AI-powered content discovery with semantic search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Built-in marketplace for creators to monetize work</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Desktop-optimized for professional workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Transparent, value-focused pricing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Signup Column */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Get Early Access</h3>
              
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-medium text-foreground">You're on the list!</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll notify you when {currentPlan.name} launches.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Early Bird Benefits:</p>
                    <ul className="text-xs space-y-1">
                      <li>• 30% discount on first year</li>
                      <li>• Priority access to beta features</li>
                      <li>• Free migration from other platforms</li>
                    </ul>
                  </div>

                  <Button type="submit" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    Join Waitlist for {currentPlan.name}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}