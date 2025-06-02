import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PaymentHistory() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Payment History</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card title="Recent Transactions" className="shadow-md">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <p className="font-medium">Pro Plan Subscription</p>
                    <p className="text-gray-500 text-sm">May 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <p className="text-green-600 text-sm">Paid</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <p className="font-medium">Pro Plan Subscription</p>
                    <p className="text-gray-500 text-sm">April 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <p className="text-green-600 text-sm">Paid</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <p className="font-medium">Marketplace Purchase - Quote Template</p>
                    <p className="text-gray-500 text-sm">April 10, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$2.99</p>
                    <p className="text-green-600 text-sm">Paid</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <p className="font-medium">Pro Plan Subscription</p>
                    <p className="text-gray-500 text-sm">March 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <p className="text-green-600 text-sm">Paid</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button variant="secondary">Load More</Button>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card title="Quick Links" className="shadow-md">
              <div className="space-y-2">
                <a href="/billing/subscription" className="block text-primary hover:underline">Subscription & Billing</a>
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
