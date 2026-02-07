'use client';

import { useStore, User } from '@/store/store';
import { X, UserCheck, UserPlus, Lock, Globe, MessageCircle, MoreVertical, Flag } from 'lucide-react';
import { useState } from 'react';

interface UserProfileProps {
  user: User | null;
  onClose: () => void;
  isOwnProfile?: boolean;
}

export function UserProfile({ user, onClose, isOwnProfile = false }: UserProfileProps) {
  const { currentUser, posts, toggleFollow, blockUser, unblockUser } = useStore();
  const [showOptions, setShowOptions] = useState(false);

  if (!user) return null;

  const userId = (user._id || user.id) as string;
  const isFollowing = currentUser?.following?.includes(userId) || false;
  const isBlocked = currentUser?.blockedUsers?.includes(userId) || false;
  const userPosts = posts.filter((p) =>
    p.userId === userId || (typeof p.userId === 'object' && (p.userId as any)?._id === userId)
  );

  const handleFollow = () => {
    toggleFollow(userId);
  };

  const handleBlock = () => {
    if (isBlocked) {
      unblockUser(userId);
    } else {
      blockUser(userId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-black dark:text-white">{user.username}</h2>
          <div className="flex items-center gap-2">
            {!isOwnProfile && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition"
                >
                  <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                {showOptions && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                    <button
                      onClick={() => {
                        handleBlock();
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm"
                    >
                      <Flag size={16} />
                      {isBlocked ? 'Unblock' : 'Block'} User
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-4">
          <div className="flex gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user.avatar || 'https://i.pravatar.cc/150'}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* User Info and Stats */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-2xl text-black dark:text-white">{user.username}</h3>
                  {user.isPrivate && (
                    <Lock size={20} className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                {user.pronouns && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.pronouns}</p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-black dark:text-white">{userPosts.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-black dark:text-white">{user.followers?.length || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-black dark:text-white">{user.following?.length || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Account Status */}
          {user.isPrivate && !isFollowing && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                🔒 This is a private account. Follow to see their posts.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {!isOwnProfile && (
            <div className="flex gap-2">
              <button
                onClick={handleFollow}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={18} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Follow
                  </>
                )}
              </button>
              <button className="flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <MessageCircle size={18} />
                Message
              </button>
            </div>
          )}

          {/* Posts Preview */}
          {userPosts.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Posts</p>
              <div className="grid grid-cols-3 gap-2">
                {userPosts.slice(0, 3).map((post) => (
                  <div key={post._id || post.id} className="aspect-square rounded-lg overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Post</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
