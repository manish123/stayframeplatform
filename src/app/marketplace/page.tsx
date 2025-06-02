import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Marketplace() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Marketplace</h1>
        <div className="mb-6">
          <input 
            type="text" 
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
            placeholder="Search creations..." 
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(item => (
            <Card key={item} className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 rounded-t-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Featured Creation {item}</h3>
              <p className="text-gray-600 mb-2">By Creator Name</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">$4.99</span>
                <Button variant="accent" className="text-sm py-1 px-2">Buy Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
