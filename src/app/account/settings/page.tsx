import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Settings() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Account Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="username">Username</label>
                    <input 
                      id="username"
                      type="text" 
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                      value="johndoe" 
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input 
                      id="email"
                      type="email" 
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                      value="john.doe@example.com" 
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
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="current-password">Current Password</label>
                    <input 
                      id="current-password"
                      type="password" 
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                      placeholder="Enter current password" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="new-password">New Password</label>
                    <input 
                      id="new-password"
                      type="password" 
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                      placeholder="Enter new password" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="confirm-password">Confirm New Password</label>
                    <input 
                      id="confirm-password"
                      type="password" 
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                      placeholder="Confirm new password" 
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary">Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md mt-6">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-700">Make Profile Public</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-gray-700">Allow Others to Follow</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary">Save Privacy Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a href="/account/profile" className="block text-primary hover:underline">User Profile</a>
                  <a href="/billing/subscription" className="block text-primary hover:underline">Billing Information</a>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md mt-6 border border-red-200">
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <Button variant="secondary" className="w-full text-red-600 border border-red-300 hover:bg-red-50">Delete Account</Button>
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
