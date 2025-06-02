'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Simple loading placeholder with animation
const LoadingPlaceholder = ({ className = '' }: { className?: string }) => (
  <motion.div 
    className={`bg-gray-200 dark:bg-gray-700 rounded-full ${className}`}
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 0.8 }}
    transition={{ 
      duration: 1.5, 
      repeat: Infinity, 
      repeatType: 'reverse' 
    }}
  />
);

interface Stats {
  quotes: number;
  memes: number;
  videos: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export function SimpleStats() {
  const [stats, setStats] = useState<Stats>({ quotes: 0, memes: 0, videos: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
        setHasError(false);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const StatItem = ({ 
    value, 
    label, 
    icon: Icon 
  }: { 
    value: number; 
    label: string; 
    icon: React.ComponentType<{ className?: string }> 
  }) => (
    <motion.div 
      className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="p-3 mb-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <Icon className="w-8 h-8" />
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {isLoading ? (
          <LoadingPlaceholder className="h-8 w-16 mx-auto" />
        ) : hasError ? (
          <span className="text-red-500">Error</span>
        ) : (
          formatNumber(value)
        )}
      </div>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </motion.div>
  );

  // Simple icons for each stat
  const QuoteIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  const MemeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const VideoIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatItem 
          value={stats.quotes} 
          label="Quotes Created"
          icon={QuoteIcon}
        />
        <StatItem 
          value={stats.memes} 
          label="Memes Created"
          icon={MemeIcon}
        />
        <StatItem 
          value={stats.videos} 
          label="Videos Created"
          icon={VideoIcon}
        />
      </div>
    </div>
  );
}
