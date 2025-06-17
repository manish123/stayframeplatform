// src/app/knowledge-hub/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import remarkBreaks from 'remark-breaks';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './article-styles.module.css';
import 'highlight.js/styles/github-dark.css'; // Or any other highlight.js theme

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'knowledge-hub');

type Params = {
  params: {
    slug: string;
  };
};

async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process markdown to HTML with remark and plugins
    const processedContent = await remark()
      .use(remarkGfm) // Support GitHub Flavored Markdown (tables, task lists, etc.)
      .use(remarkEmoji) // Convert emoji shortcodes to emoji
      .use(remarkBreaks) // Preserve line breaks like GitHub
      .use(html, { sanitize: false }) // Convert to HTML
      .process(content);
    let contentHtml = processedContent.toString();
    
    // Add custom styling for markdown elements
    contentHtml = contentHtml.replace(
      /<table>/g,
      '<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">'
    );
    
    // Add responsive container for code blocks
    contentHtml = contentHtml.replace(
      /<pre><code/g,
      '<div class="not-prose"><pre class="rounded-lg overflow-hidden"><code class="language-javascript text-sm"'
    );
    contentHtml = contentHtml.replace(
      /<\/code><\/pre>/g,
      '</code></pre></div>'
    );
    
    // Add styling for blockquotes
    contentHtml = contentHtml.replace(
      /<blockquote>/g,
      '<blockquote class="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-300 my-4">'
    );

    return {
      slug,
      ...(data as { title: string; date: string; description: string }),
      contentHtml,
    };
  } catch (error) {
    console.error(`Error reading markdown file for slug ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const post = await getPostData(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${post.title} | StayFrame`,
    description: post.description,
  };
}

export async function generateStaticParams() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
  } catch (error) {
    console.error('Error reading posts directory for generateStaticParams:', error);
    return [];
  }
}

export default async function KnowledgeHubArticlePage({ params }: Params) {
  const post = await getPostData(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-6">
            <a 
              href="/knowledge" 
              className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Knowledge Hub
            </a>
          </div>
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
              {post.title}
            </h1>
            {post.date && (
              <p className="text-muted-foreground text-lg">
                Published on {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </header>
          <>
            <div 
              className={`prose dark:prose-invert max-w-none ${styles.prose}`}
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </>
        </article>
      </main>
      <Footer />
    </div>
  );
}
