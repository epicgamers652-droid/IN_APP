'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/store';
import { ImagePlus, X, Smile, MapPin } from 'lucide-react';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, addPost, token } = useStore();

  const handleSubmit = async () => {
    if (!content.trim() || !currentUser) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      addPost(data);
      setContent('');
      setImage('');
      setHashtags([]);
    } catch (err: any) {
      console.error('Post creation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractHashtags = (text: string) => {
    const tags = text.match(/#\w+/g) || [];
    return tags.map((tag) => tag.substring(1));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setHashtags(extractHashtags(text));
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <div className="flex gap-4">
        <img
          src={currentUser.avatar || 'https://i.pravatar.cc/150'}
          alt="Your avatar"
          className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="What's on your mind?"
            className="w-full p-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-lg resize-none outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:border-gray-400 dark:focus:border-gray-600 focus:ring-0 transition"
            rows={3}
          />

          {image && (
            <div className="relative mt-3 rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Preview"
                className="w-full h-auto max-h-64 object-cover"
              />
              <button
                onClick={() => setImage('')}
                className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-2 hover:bg-black transition"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition"
                title="Add photo"
              >
                <ImagePlus size={20} strokeWidth={2} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
              <button
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition"
                title="Add emoji"
              >
                <Smile size={20} strokeWidth={2} />
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition"
                title="Add location"
              >
                <MapPin size={20} strokeWidth={2} />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="px-6 py-2 bg-blue-500 text-white font-semibold text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 transition"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
