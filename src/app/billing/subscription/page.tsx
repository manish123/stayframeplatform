import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Subscription() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Subscription & Billing</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card title="Current Plan" className="shadow-md">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">Pro Plan</h3>
                    <p className="text-gray-600">$9.99 / month</p>
                    <p className="text-gray-500 text-sm">Next billing date: June 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">Active</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="secondary">Change Plan</Button>
                  <Button variant="secondary" className="text-red-600 border border-red-300 hover:bg-red-50">Cancel Subscription</Button>
                </div>
              </div>
            </Card>
            <Card title="Payment Method" className="shadow-md mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-gray-300 rounded-md flex items-center justify-center text-gray-500">Card</div>
                    <div>
                      <p className="font-medium">Visa **** 1234</p>
                      <p className="text-gray-500 text-sm">Expires 12/25</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-green-600 font-medium">Primary</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="secondary">Add Payment Method</Button>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card title="Quick Links" className="shadow-md">
              <div className="space-y-2">
                <a href="/billing/payment-history" className="block text-primary hover:underline">Payment History</a>
                <a href="/account/profile" className="block text-primary hover:underline">User Profile</a>
                <a href="/pricing" className="block text-primary hover:underline">View Plans</a>
              </div>
            </Card>
            <Card title="Billing Support" className="shadow-md mt-6">
              <div className="space-y-3">
                <p className="text-gray-700 text-sm">Need help with billing issues? Contact our support team.</p>
                <Button variant="secondary" className="w-full">Contact Support</Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
