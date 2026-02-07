'use client';

import { useStore, type User } from '@/store/store';
import { Edit2, LogOut, Camera, Lock, Globe, MessageSquare, Share2, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Profile() {
  const { currentUser, posts, setCurrentUser, togglePrivateAccount, updateUserProfile, token, setPosts } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
    website: currentUser?.website || '',
    pronouns: currentUser?.pronouns || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!posts.length) {
        try {
          const res = await fetch('/api/posts');
          if (res.ok) {
            const data = await res.json();
            setPosts(data);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchUserPosts();
  }, [posts.length, setPosts]);

  const userPosts = posts.filter((p: any) =>
    p.userId === currentUser?._id || (typeof p.userId === 'object' && p.userId?._id === currentUser?._id)
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        if (currentUser) {
          const updated = {
            ...currentUser,
            avatar: dataUrl,
          };
          setCurrentUser(updated);
          updateUserProfile(updated);

          if (token) {
            try {
              await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ avatar: dataUrl })
              });
            } catch (err) {
              console.error("Failed to update avatar", err);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        username: editData.username,
        bio: editData.bio,
        website: editData.website,
        pronouns: editData.pronouns,
      };
      updateUserProfile(updatedUser);
      setIsEditing(false);

      if (token) {
        fetch('/api/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            username: editData.username,
            bio: editData.bio,
            website: editData.website,
            pronouns: editData.pronouns
          })
        }).catch(err => console.error("Failed to update profile", err));
      }
    }
  };

  const handleTogglePrivate = () => {
    if (!currentUser) return;
    const userId = currentUser._id || currentUser.id;
    if (userId) {
      togglePrivateAccount(userId);
      const updated = { ...currentUser, isPrivate: !currentUser.isPrivate } as User;
      setCurrentUser(updated);

      if (token) {
        fetch('/api/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ isPrivate: !currentUser.isPrivate })
        }).catch(err => console.error("Failed to update privacy", err));
      }
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
        <div className="flex flex-col md:flex-row gap-12 mb-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative group w-32 h-32 md:w-48 md:h-48 mx-auto md:mx-0">
              <img
                src={currentUser.avatar ?? 'https://i.pravatar.cc/150'}
                alt={currentUser.username}
                className="w-full h-full rounded-full object-cover border-2 border-gray-200 dark:border-gray-800"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                <Camera size={32} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-light text-black dark:text-white">
                {currentUser.username}
              </h1>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-semibold text-sm rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-semibold text-sm rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                    <button className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-semibold text-sm rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-700">
                      Share Profile
                    </button>
                    <button className="p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-700">
                      <MoreHorizontal size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6 md:gap-8">
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold text-black dark:text-white">{userPosts.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">posts</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold text-black dark:text-white">{(currentUser.followers?.length || 0)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">followers</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold text-black dark:text-white">{(currentUser.following?.length || 0)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">following</p>
              </div>
            </div>

            {/* Bio Section */}
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white text-sm rounded outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Bio</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white text-sm rounded outline-none focus:border-gray-400"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Website</label>
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white text-sm rounded outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            ) : (
              <>
                {currentUser.bio && (
                  <p className="text-sm text-black dark:text-white mb-3">{currentUser.bio}</p>
                )}
                {currentUser.website && (
                  <a
                    href={currentUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-semibold mb-3"
                  >
                    <LinkIcon size={14} />
                    {currentUser.website}
                  </a>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  {currentUser.isPrivate ? (
                    <>
                      <Lock size={14} />
                      <span>Private Account</span>
                    </>
                  ) : (
                    <>
                      <Globe size={14} />
                      <span>Public Account</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Account Privacy Card */}
        {!isEditing && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentUser.isPrivate ? (
                <Lock size={20} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Globe size={20} className="text-gray-700 dark:text-gray-300" />
              )}
              <div>
                <p className="font-semibold text-black dark:text-white text-sm">
                  {currentUser.isPrivate ? 'Private Account' : 'Public Account'}
                </p>
              </div>
            </div>
            <button
              onClick={handleTogglePrivate}
              className="px-6 py-1.5 text-blue-500 hover:text-blue-600 font-semibold text-sm transition"
            >
              {currentUser.isPrivate ? 'Make Public' : 'Make Private'}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 mb-6 flex gap-8 overflow-x-auto">
        <button className="py-3 px-1 border-b-2 border-black dark:border-white font-semibold text-black dark:text-white">
          Posts
        </button>
        <button className="py-3 px-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-semibold transition">
          Reels
        </button>
        <button className="py-3 px-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-semibold transition">
          Tagged
        </button>
      </div>

      {/* Posts Grid */}
      {userPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-3">
          {userPosts.map((post: any) => (
            <div
              key={post._id}
              className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden group cursor-pointer rounded"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover group-hover:brightness-75 transition duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <p className="text-center px-2 text-gray-600 dark:text-gray-400 line-clamp-2 text-xs">
                    {post.content}
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-8 opacity-0 group-hover:opacity-100">
                <div className="text-white text-center flex items-center gap-2 font-bold">
                  <span>❤️</span>
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="text-white text-center flex items-center gap-2 font-bold">
                  <span>💬</span>
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-semibold text-black dark:text-white mb-2">No posts yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Share a post to get started</p>
        </div>
      )}
    </div>
  );
}
