'use client';

import { useStore } from '@/store/store';
import { Bookmark } from 'lucide-react';

export function Saved() {
  const { posts, savedPosts } = useStore();

  const savedPostsList = posts.filter((post) => savedPosts.includes(post._id));

  return (
    <div className="max-w-4xl mx-auto space-y-0">
      {/* Header */}
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 transition-colors p-4 border-b">
        <div className="flex items-center gap-2">
          <Bookmark size={24} className="text-black dark:text-white" strokeWidth={1.5} />
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Saved</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{savedPostsList.length} posts</p>
          </div>
        </div>
      </div>

      {/* Saved Posts Grid */}
      {savedPostsList.length > 0 ? (
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 transition-colors overflow-hidden">
          <div className="grid grid-cols-3 gap-1">
            {savedPostsList.map((post) => (
              <div
                key={post._id}
                className="group relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden cursor-pointer hover:brightness-90 transition"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.content}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                    <p className="text-center px-4 text-gray-600 dark:text-gray-400 line-clamp-2 text-xs">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center">
                    <p className="text-sm font-semibold">{post.likes?.length || 0}</p>
                    <p className="text-xs">Likes</p>
                  </div>
                  <div className="text-white text-center">
                    <p className="text-sm font-semibold">{post.comments?.length || 0}</p>
                    <p className="text-xs">Comments</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 transition-colors p-12 text-center">
          <Bookmark size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" strokeWidth={1.5} />
          <p className="text-gray-500 dark:text-gray-400">No saved posts yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Save posts you like to view them later
          </p>
        </div>
      )}
    </div>
  );
}
