import React, { useState } from 'react';

import Button from '../ui/Button';

interface FeedbackFormProps {
  onSubmit: (feedback: { rating: number; comment: string }) => void;
  className?: string;
}

export default function FeedbackForm({ onSubmit, className = '' }: FeedbackFormProps) {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setComment('');
    setRating(3);
  };

  return (
    <form onSubmit={handleSubmit} className={`border border-gray-300 p-4 rounded shadow-md bg-neutral ${className}`}>
      <h3 className="text-lg font-semibold text-primary mb-3">We Value Your Feedback</h3>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          placeholder="Share your thoughts or suggestions..."
          required
        />
      </div>
      
      <Button type="submit" variant="primary" className="w-full md:w-auto">
        Submit Feedback
      </Button>
    </form>
  );
}
