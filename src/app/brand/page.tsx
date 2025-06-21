'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button.temp';
import {
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Combobox, ComboboxOption } from '@/components/ui/Combobox';

// Sample data for components
const cardContentSample = {
  title: 'Sample Card Title',
  description: 'This is a sample description for the card component. It showcases the look and feel of a standard card.',
  imageUrl: '/placeholder-image.svg', // Assuming you have a placeholder
};

// Sample options for Combobox
const frameworks: ComboboxOption[] = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

// Sample data for search results
const textResults = [
  {
    id: '1',
    title: 'Understanding React Hooks',
    snippet: 'A deep dive into useState, useEffect, and other React Hooks for better state management...',
    source: 'Official React Blog',
  },
  {
    id: '2',
    title: 'Tailwind CSS Best Practices',
    snippet: 'Learn how to effectively use Tailwind CSS utility classes to build modern UIs quickly...',
    source: 'Tailwind CSS Docs',
  },
];

const thumbnailResults = [
  {
    id: 't1',
    title: 'Abstract Background Art',
    imageUrl: '/placeholder-image.svg', // Replace with actual image paths or use a service
    source: 'Unsplash',
  },
  {
    id: 't2',
    title: 'Mountain Landscape',
    imageUrl: '/placeholder-image.svg',
    source: 'Pexels',
  },
  {
    id: 't3',
    title: 'City Skyline at Night',
    imageUrl: '/placeholder-image.svg',
    source: 'Pixabay',
  },
];

export default function BrandPage() {
  const [comboboxValue, setComboboxValue] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <h1 className="text-4xl font-bold text-center text-primary mb-12">UI Branding & Style Guide</h1>

        {/* Colors Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-primary">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Primary', class: 'bg-primary', textClass: 'text-primary-foreground' },
              { name: 'Secondary', class: 'bg-secondary', textClass: 'text-secondary-foreground' },
              { name: 'Accent', class: 'bg-accent', textClass: 'text-accent-foreground' },
              { name: 'Background', class: 'bg-background', textClass: 'text-foreground' },
              { name: 'Foreground', class: 'bg-foreground', textClass: 'text-background' },
              { name: 'Muted', class: 'bg-muted', textClass: 'text-muted-foreground' },
              { name: 'Card', class: 'bg-card', textClass: 'text-card-foreground' },
              { name: 'Destructive', class: 'bg-destructive', textClass: 'text-destructive-foreground' },
            ].map(color => (
              <div key={color.name} className={`p-6 rounded-lg shadow-md ${color.class}`}>
                <p className={`font-semibold ${color.textClass}`}>{color.name}</p>
                <p className={`text-sm ${color.textClass}`}>{color.class.replace('bg-', '')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-primary">Typography</h2>
          <div className="space-y-4 p-6 bg-card rounded-lg shadow">
            <h1 className="text-4xl font-bold text-card-foreground">Heading 1 (text-4xl font-bold)</h1>
            <h2 className="text-3xl font-semibold text-card-foreground">Heading 2 (text-3xl font-semibold)</h2>
            <h3 className="text-2xl font-medium text-card-foreground">Heading 3 (text-2xl font-medium)</h3>
            <h4 className="text-xl font-normal text-card-foreground">Heading 4 (text-xl)</h4>
            <p className="text-base text-card-foreground">This is a paragraph of body text (text-base). Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p className="text-sm text-muted-foreground">This is a smaller paragraph or muted text (text-sm text-muted-foreground). Often used for captions or less important information.</p>
            <a href="#" className="text-primary hover:underline">This is a hyperlink</a>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-primary">Buttons</h2>
          <div className="p-6 bg-card rounded-lg shadow space-y-4">
            <h3 className="text-xl font-medium mb-2 text-card-foreground">Button Variants</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="default">Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary">Accent Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>
            <h3 className="text-xl font-medium mt-6 mb-2 text-card-foreground">Button Sizes (Example with Primary)</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="default" size="sm">Small Button</Button>
              <Button variant="default" size="default">Default Button</Button>
              <Button variant="default" size="lg">Large Button</Button>
              <Button variant="default" size="icon">Icon</Button> {/* Add an icon inside if you have one */}
            </div>
             <h3 className="text-xl font-medium mt-6 mb-2 text-card-foreground">Button States (Example with Primary)</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="default">Default</Button>
              <Button variant="default" disabled>Disabled</Button>
              {/* Add hover/active states if demonstrable or describe them */}
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-primary">Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{cardContentSample.title}</CardTitle>
                <CardDescription>An example of a card description.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{cardContentSample.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="default">Action</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardContent>
                {cardContentSample.imageUrl && <img src={cardContentSample.imageUrl} alt={cardContentSample.title} className="w-full h-48 object-cover rounded-lg mb-4" />}
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Card with Image</h3>
                <p className="text-card-foreground mb-4">This card showcases an image within the content area.</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary">Learn More</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Forms Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-primary">Form Elements</h2>
          <div className="p-6 bg-card rounded-lg shadow space-y-6">
            <div>
              <label htmlFor="textInput" className="block text-sm font-medium text-card-foreground mb-1">Text Input</label>
              <input type="text" id="textInput" placeholder="Enter text here..." className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="selectInput" className="block text-sm font-medium text-card-foreground mb-1">Select Dropdown</label>
              <select id="selectInput" className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:ring-primary focus:border-primary">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <label htmlFor="textareaInput" className="block text-sm font-medium text-card-foreground mb-1">Textarea</label>
              <textarea id="textareaInput" rows={3} placeholder="Enter longer text..." className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-card-foreground">Checkboxes</p>
              <div className="flex items-center">
                <input type="checkbox" id="checkbox1" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="checkbox1" className="ml-2 block text-sm text-card-foreground">Checkbox Option 1</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="checkbox2" defaultChecked className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="checkbox2" className="ml-2 block text-sm text-card-foreground">Checkbox Option 2 (Checked)</label>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-card-foreground">Radio Buttons</p>
              <div className="flex items-center">
                <input type="radio" name="radioGroup" id="radio1" className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                <label htmlFor="radio1" className="ml-2 block text-sm text-card-foreground">Radio Option A</label>
              </div>
              <div className="flex items-center">
                <input type="radio" name="radioGroup" id="radio2" defaultChecked className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                <label htmlFor="radio2" className="ml-2 block text-sm text-card-foreground">Radio Option B (Checked)</label>
              </div>
            </div>
          </div>
        </section>

        {/* Combobox Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-primary">Combobox</h2>
          <div className="p-6 bg-card rounded-lg shadow space-y-4">
            <h3 className="text-xl font-medium mb-2 text-card-foreground">Select Framework</h3>
            <Combobox
              options={frameworks}
              value={comboboxValue}
              onChange={setComboboxValue}
              placeholder="Select framework..."
              searchPlaceholder="Search framework..."
              emptyText="No framework found."
            />
            <p className="text-sm text-muted-foreground">
              Selected value: {comboboxValue || 'None'}
            </p>
          </div>
        </section>

        {/* Search Results Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-primary">Search Results Display</h2>
          
          {/* Text-Based Results */}
          <div>
            <h3 className="text-2xl font-medium mb-4 text-foreground">Text-Based List</h3>
            <div className="space-y-4">
              {textResults.map(result => (
                <Card key={result.id}>
                  <CardHeader>
                    <CardTitle>{result.title}</CardTitle>
                    <CardDescription>Source: {result.source}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{result.snippet}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" size="sm">Read more</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Thumbnail-Based Results */}
          <div className="mt-12">
            <h3 className="text-2xl font-medium mb-4 text-foreground">Thumbnail-Based Grid</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {thumbnailResults.map(result => (
                <Card key={result.id}>
                  <CardContent className="p-0"> {/* Remove padding for image to fill */}
                    <img 
                      src={result.imageUrl} 
                      alt={result.title} 
                      className="w-full h-48 object-cover rounded-t-lg" // Ensure image covers and has rounded top corners matching card
                    />
                  </CardContent>
                  <CardHeader className="pt-4"> {/* Add some padding for title below image */}
                    <CardTitle className="text-lg">{result.title}</CardTitle> {/* Smaller title for thumbnails */}
                    <CardDescription>Source: {result.source}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" size="sm">View</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}