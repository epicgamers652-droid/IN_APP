'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/store';
import { Heart, MessageCircle, Share2, Upload, Pause, Play } from 'lucide-react';

export function Reels() {
  const { reels, currentUser, addReel, users } = useStore();
  const [selectedReel, setSelectedReel] = useState(reels[0] || null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      // For demo, use a video URL or placeholder
      const videoUrl = URL.createObjectURL(file);
      const newReel = {
        id: Date.now().toString(),
        userId: currentUser.id || currentUser._id!,
        username: currentUser.username,
        avatar: currentUser.avatar,
        video: videoUrl,
        caption,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      addReel(newReel);
      setCaption('');
      setShowUploadModal(false);
    }
  };

  const toggleLike = (reelId: string) => {
    const newLiked = new Set(likedReels);
    if (newLiked.has(reelId)) {
      newLiked.delete(reelId);
    } else {
      newLiked.add(reelId);
    }
    setLikedReels(newLiked);
  };

  const navigateReel = (direction: 'next' | 'prev') => {
    const currentIndex = reels.findIndex((r) => r.id === selectedReel?.id);
    if (direction === 'next' && currentIndex < reels.length - 1) {
      setSelectedReel(reels[currentIndex + 1]);
      setIsPlaying(true);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedReel(reels[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 transition-colors">
        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          Create a Reel
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-96 space-y-4">
            <h2 className="text-2xl font-bold text-black dark:text-white">Create a Reel</h2>
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
              >
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Click to select video</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  hidden
                />
              </div>
              <textarea
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-black dark:text-white rounded-lg outline-none focus:border-blue-500 transition"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reels Feed */}
      {selectedReel ? (
        <div className="relative bg-black rounded-lg overflow-hidden max-h-[600px] flex items-center justify-center group">
          {/* Video Player */}
          <video
            ref={videoRef}
            src={selectedReel.video}
            className="w-full h-full object-cover"
            onClick={() => setIsPlaying(!isPlaying)}
            autoPlay
            loop
            muted
          />

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition">
            {!isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-white/80 hover:bg-white rounded-full p-4"
              >
                <Play size={32} className="text-black fill-black" />
              </button>
            )}
          </div>

          {/* Reel Info - Bottom Left */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <div className="flex items-start gap-3">
              <img
                src={selectedReel.avatar || 'https://i.pravatar.cc/150'}
                alt={selectedReel.username}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div className="flex-1">
                <p className="font-bold text-lg">{selectedReel.username}</p>
                {selectedReel.caption && (
                  <p className="text-sm text-gray-200 line-clamp-2">{selectedReel.caption}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions - Right Side */}
          <div className="absolute right-4 bottom-24 flex flex-col gap-4">
            {/* Like */}
            <button
              onClick={() => toggleLike(selectedReel.id)}
              className="flex flex-col items-center gap-1 text-white hover:scale-110 transition"
            >
              <Heart
                size={24}
                fill={likedReels.has(selectedReel.id) ? 'currentColor' : 'none'}
                className={likedReels.has(selectedReel.id) ? 'text-red-500' : ''}
              />
              <p className="text-xs font-semibold">{selectedReel.likes.length + (likedReels.has(selectedReel.id) ? 1 : 0)}</p>
            </button>

            {/* Comment */}
            <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition">
              <MessageCircle size={24} />
              <p className="text-xs font-semibold">{selectedReel.comments.length}</p>
            </button>

            {/* Share */}
            <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition">
              <Share2 size={24} />
              <p className="text-xs font-semibold">Share</p>
            </button>
          </div>

          {/* Navigation - Arrows */}
          {reels.length > 1 && (
            <>
              <button
                onClick={() => navigateReel('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition"
              >
                ‹
              </button>
              <button
                onClick={() => navigateReel('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition"
              >
                ›
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700 transition-colors">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No reels yet. Create one!</p>
        </div>
      )}

      {/* Reels Sidebar - Thumbnails */}
      {reels.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-black dark:text-white">More Reels</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {reels.map((reel) => (
              <button
                key={reel.id}
                onClick={() => {
                  setSelectedReel(reel);
                  setIsPlaying(true);
                }}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition ${selectedReel?.id === reel.id
                    ? 'border-blue-500'
                    : 'border-gray-200 dark:border-gray-700'
                  }`}
              >
                <video
                  src={reel.video}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition flex items-center justify-center">
                  <Play size={16} className="text-white fill-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
