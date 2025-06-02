import React from 'react';
import MemeGenerator from '@/app/meme/MemeGenerator';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MemeCreator() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Meme Creator</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card title="Create Your Meme" className="shadow-md">
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-100 h-64 flex items-center justify-center relative">
                  <p className="text-gray-500">Upload or select an image...</p>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3/4 text-center">
                    <input 
                      type="text" 
                      className="w-full p-1 bg-white bg-opacity-80 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                      placeholder="Top text" 
                    />
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 text-center">
                    <input 
                      type="text" 
                      className="w-full p-1 bg-white bg-opacity-80 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                      placeholder="Bottom text" 
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="secondary">Upload Image</Button>
                  <Button variant="primary">Preview & Share</Button>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card title="Image Library" className="shadow-md">
              <div className="space-y-4">
                <div className="h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">Image 1</div>
                <div className="h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">Image 2</div>
                <div className="h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">Image 3</div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
