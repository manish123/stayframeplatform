import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Pricing Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Free" className="border border-gray-200">
            <div className="space-y-4 text-center">
              <p className="text-2xl font-bold">$0 <span className="text-base font-normal">/forever</span></p>
              <p className="text-gray-600">Basic features for personal use</p>
              <ul className="space-y-2 text-gray-700">
                <li>Limited templates</li>
                <li>Basic sharing options</li>
              </ul>
              <Button variant="secondary">Start Free</Button>
            </div>
          </Card>
          <Card title="Pro" className="border-2 border-accent">
            <div className="space-y-4 text-center">
              <p className="text-2xl font-bold">$9.99 <span className="text-base font-normal">/month</span></p>
              <p className="text-gray-600">Advanced features & marketplace access</p>
              <ul className="space-y-2 text-gray-700">
                <li>All templates</li>
                <li>Priority support</li>
                <li>Marketplace selling</li>
              </ul>
              <Button variant="primary">Try 7 Days Free</Button>
            </div>
          </Card>
          <Card title="Advanced" className="border border-gray-200">
            <div className="space-y-4 text-center">
              <p className="text-2xl font-bold">$19.99 <span className="text-base font-normal">/month</span></p>
              <p className="text-gray-600">Team collaboration & analytics</p>
              <ul className="space-y-2 text-gray-700">
                <li>Team workspaces</li>
                <li>Advanced analytics</li>
                <li>Dedicated support</li>
              </ul>
              <Button variant="secondary">Contact Sales</Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
