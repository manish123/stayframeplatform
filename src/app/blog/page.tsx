import Link from "next/link";

export const metadata = {
  title: "Blog - Coming Soon | StayFrame",
  description: "Our blog is under construction. Stay tuned for insightful content about content creation, monetization, and growing your online presence.",
};

export default function BlogComingSoon() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-9xl mb-6">🚧</div>
        <h1 className="text-4xl font-bold mb-6">Whoops! Our Blog Is Still in the Oven</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p className="text-xl text-muted-foreground mb-6">
            Looks like you've caught us with our pixels down! Our team of highly trained digital hamsters 
            is still running on their wheels, powering up our blog with amazing content.
          </p>
          
          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <p className="text-lg font-medium mb-4">What to expect when we launch:</p>
            <ul className="space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center gap-2">
                <span className="text-primary">✨</span>
                <span>Proven strategies to grow your audience</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">💡</span>
                <span>Tips for creating viral-worthy content</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">💰</span>
                <span>Ways to monetize your creative work</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">🎯</span>
                <span>Insider looks at upcoming platform features</span>
              </li>
            </ul>
          </div>
          
          <p className="text-muted-foreground mb-8">
            In the meantime, why not explore our <Link href="/knowledge" className="text-primary hover:underline">Knowledge Hub</Link> 
            for valuable resources to boost your content creation journey?
          </p>
          
          <div className="bg-background p-4 rounded-lg border border-dashed border-muted-foreground/20 mb-8">
            <p className="text-sm text-muted-foreground italic">
              P.S. Our blog is like a fine wine—it gets better with age. But unlike wine, we promise it won't take years!
            </p>
          </div>
        </div>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Back to Safety
        </Link>
      </div>
    </main>
  );
}
