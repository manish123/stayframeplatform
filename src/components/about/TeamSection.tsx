import Image from 'next/image';
import { Linkedin, Twitter, Github, Cpu } from 'lucide-react';

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
};

const teamMembers: TeamMember[] = [
  {
    name: 'x',
    role: 'Founder',
    bio: 'Visionary technologist with deep expertise in architecting enterprise-scale platforms that serve millions. Passionate about leveraging AI to transform and democratize content creation.',
    image: '/team/1.jpg',
    social: {
      linkedin: 'https://linkedin.com/',
      twitter: 'https://twitter.com/',
    },
  },
  {
    name: 'y',
    role: 'Co-Founder',
    bio: 'Strategic operations leader with a proven track record of scaling products from concept to global impact. Expert in building high-performance teams and delivering exceptional user experiences.',
    image: '/team/2.jpg',
    social: {
      linkedin: 'https://linkedin.com/',
      twitter: 'https://twitter.com/',
    },
  },
  {
    name: 'z',
    role: 'Head of Marketing',
    bio: 'Creative strategist and storyteller who transforms complex ideas into compelling narratives. Masters the art of building authentic connections between brands and their communities.',
    image: '/team/3.jpg',
    social: {
      linkedin: 'https://linkedin.com/',
      twitter: 'https://twitter.com/',
    },
  },
  {
    name: 'AI Tools',
    role: 'Digital Team Members',
    bio: 'Next-generation AI collaborators that amplify human creativity 24/7. Continuously learning and evolving to deliver personalized insights, intelligent automation, and seamless user experiences.',
    image: '/team/ai-assistant.jpg',
    social: {},
  },
];

export function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Minds Behind the Magic</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Where visionary thinking meets execution excellence. Our diverse team of innovators is redefining what's possible in the world of content creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {member.name === 'AI Tools' ? (
                    <Cpu className="h-16 w-16 text-primary" />
                  ) : (
                    <span className="text-4xl font-bold text-muted-foreground">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                
                <div className="flex space-x-3">
                  {member.social.linkedin && (
                    <a 
                      href={member.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a 
                      href={member.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a 
                      href={member.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Shape Tomorrow With Us</h3>
            <p className="text-muted-foreground max-w-2xl mb-6">
              Ready to push boundaries and create something extraordinary? Join our remote-first culture where innovation thrives and every voice matters in defining the future of digital creativity.
            </p>
            <a 
              href="/careers" 
              className="inline-flex items-center text-primary hover:underline"
            >
              Explore Opportunities
              <svg 
                className="ml-1 w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
