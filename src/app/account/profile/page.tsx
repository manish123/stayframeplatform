import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Profile() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">User Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">Avatar</div>
                    <div>
                      <h3 className="font-semibold text-lg">John Doe</h3>
                      <p className="text-gray-600">@johndoe</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="bio">Bio</label>
                    <textarea 
                      id="bio"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                      placeholder="Tell us about yourself..." 
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md mt-6">
              <CardHeader>
                <CardTitle>Recent Creations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">Quote - Inspirational</div>
                  <div className="h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">Meme - Funny Cat</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Creations:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketplace Sales:</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Followers:</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Following:</span>
                    <span className="font-semibold">20</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md mt-6">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a href="/account/settings" className="block text-primary hover:underline">Account Settings</a>
                  <a href="/billing/subscription" className="block text-primary hover:underline">Billing Information</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
