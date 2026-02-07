'use client';

import { useStore, type User, type TrendingHashtag } from '@/store/store';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export function Explore() {
  const { users, currentUser, toggleFollow } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchCategory, setSearchCategory] = useState<'users' | 'tags'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [following, setFollowing] = useState<Set<string>>(new Set((currentUser?.following ?? []) as string[]));

  const categories = [
    { id: 'users', label: 'Users' },
    { id: 'tags', label: 'Tags' },
  ];

  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const type = searchCategory === 'users' ? 'users' : 'hashtags';
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data[type] || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, searchCategory]);


  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchCategory, performSearch]);

  const handleFollow = (userId: string) => {
    const newFollowing = new Set(following);
    if (newFollowing.has(userId)) {
      newFollowing.delete(userId);
    } else {
      newFollowing.add(userId);
    }
    setFollowing(newFollowing);
  };

  const suggestedUsers = users.filter((u) => {
    const userId = u._id || u.id;
    const currentId = currentUser?._id || currentUser?.id;
    return userId && currentId && userId !== currentId && !following.has(userId as string);
  });

  if (selectedUser) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedUser(null)}
          className="mb-4 text-blue-500 hover:text-blue-600 font-semibold text-sm"
        >
          ← Back to Explore
        </button>
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex gap-6 mb-6">
            <img
              src={selectedUser.avatar || 'https://i.pravatar.cc/150'}
              alt={selectedUser.username}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                {selectedUser.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{selectedUser.bio}</p>
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="font-bold text-black dark:text-white">
                    {selectedUser.followers?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">followers</p>
                </div>
                <div>
                  <p className="font-bold text-black dark:text-white">
                    {selectedUser.following?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">following</p>
                </div>
              </div>
              <button
                onClick={() => handleFollow((selectedUser._id || selectedUser.id) as string)}
                className={`px-6 py-2 font-semibold text-sm rounded-lg transition ${following.has((selectedUser._id || selectedUser.id) as string)
                  ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                {following.has((selectedUser._id || selectedUser.id) as string) ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={searchCategory === 'users' ? 'Search users...' : 'Search tags...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-gray-400 dark:focus:border-gray-600 transition"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchCategory(cat.id as 'users' | 'tags')}
            className={`py-3 px-2 font-semibold text-sm border-b-2 transition ${searchCategory === cat.id
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {searchQuery.trim() ? (
        <div className="mb-8">
          <h3 className="font-bold text-lg text-black dark:text-white mb-4">Results</h3>
          {searchResults.length > 0 ? (
            <div className="space-y-1">
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer group"
                >
                  {searchCategory === 'users' ? (
                    <>
                      <div
                        className="flex items-center gap-3 flex-1"
                        onClick={() => setSelectedUser(result)}
                      >
                        <img
                          src={result.avatar || 'https://i.pravatar.cc/150'}
                          alt={result.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-black dark:text-white group-hover:text-blue-500 transition">
                            {result.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {result.followers?.length || 0} followers
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollow(result._id);
                        }}
                        className={`px-6 py-1.5 font-semibold text-sm rounded-lg transition flex items-center gap-2 whitespace-nowrap ${following.has(result._id)
                          ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                      >
                        {following.has(result._id) ? (
                          <>
                            <UserCheck size={16} />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} />
                            Follow
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-semibold text-black dark:text-white">
                          #{result.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {result.posts.toLocaleString()} posts
                        </p>
                      </div>
                      <button className="px-6 py-1.5 bg-blue-500 text-white font-semibold text-sm rounded-lg hover:bg-blue-600 transition">
                        Explore
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No {searchCategory === 'users' ? 'users' : 'tags'} found
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-black dark:text-white">Suggested for you</h3>
              <button className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
                See All
              </button>
            </div>

            {suggestedUsers.length > 0 ? (
              <div className="space-y-1">
                {suggestedUsers.slice(0, 10).map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition group"
                  >
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <img
                        src={user.avatar || 'https://i.pravatar.cc/150'}
                        alt={user.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-black dark:text-white group-hover:text-blue-500 transition">
                          {user.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Popular in your area
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow((user._id || user._id) as string)}
                      className="px-6 py-1.5 bg-blue-500 text-white font-semibold text-sm rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                    >
                      <UserPlus size={16} />
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No suggested users at this time
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
