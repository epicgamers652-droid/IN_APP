'use client';

import { useStore } from '@/store/store';
import { X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Stories() {
  const { stories, setStories } = useStore();
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories');
        if (response.ok) {
          const data = await response.json();
          setStories(data);
        }
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [setStories]);

  if (currentStoryIndex !== null) {
    const story = stories[currentStoryIndex];
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <button
          onClick={() => setCurrentStoryIndex(null)}
          className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
        >
          <X size={28} />
        </button>

        <button
          onClick={() =>
            setCurrentStoryIndex(
              currentStoryIndex > 0 ? currentStoryIndex - 1 : stories.length - 1
            )
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="relative max-w-md w-full">
          {/* Progress bars */}
          <div className="flex gap-1 mb-4 px-4">
            {stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{
                    width: idx < currentStoryIndex ? '100%' : idx === currentStoryIndex ? '50%' : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story Content */}
          <img
            src={story.image}
            alt="Story"
            className="w-full rounded-2xl object-cover aspect-square shadow-2xl"
          />

          {/* Story Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <img
                src={story.avatar || 'https://i.pravatar.cc/150'}
                alt={story.username}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <p className="font-semibold text-sm">{story.username}</p>
                <p className="text-xs opacity-80">2h ago</p>
              </div>
            </div>
            <button className="text-white hover:opacity-80">⋯</button>
          </div>

          {/* Story Footer */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white text-sm">
            <Eye size={14} />
            <span>{story.views?.length || 0} views</span>
          </div>
        </div>

        <button
          onClick={() =>
            setCurrentStoryIndex((currentStoryIndex + 1) % stories.length)
          }
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4 overflow-hidden">
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {/* Add Story Button */}
        <button className="flex-shrink-0 relative group">
          <div className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors flex items-center justify-center bg-gray-50 dark:bg-gray-900 group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
            <span className="text-2xl">+</span>
          </div>
          <p className="text-xs text-center mt-2 font-medium text-gray-700 dark:text-gray-300">Your story</p>
        </button>

        {/* Story Items */}
        {stories.map((story, idx) => (
          <button
            key={story._id}
            onClick={() => setCurrentStoryIndex(idx)}
            className="flex-shrink-0 relative group snap-center"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 group-hover:border-purple-500 transition-colors">
              <img
                src={story.image}
                alt={story.username}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-center mt-2 truncate text-gray-700 dark:text-gray-300 max-w-20 font-medium">
              {story.username}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
