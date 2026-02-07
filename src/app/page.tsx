/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/store';
import { MOCK_USERS, MOCK_POSTS, MOCK_STORIES } from '@/lib/mockData';
import Feed from '@/components/Feed';
import { Messages } from '@/components/Messages';
import { Explore } from '@/components/Explore';
import { Profile } from '@/components/Profile';
import Login from '@/components/Login';
import { Navigation } from '@/components/Navigation';
import { CreatePost } from '@/components/CreatePost';
import { Stories } from '@/components/Stories';
import { Reels } from '@/components/Reels';
import Activity from '@/components/Activity';
import { Saved } from '@/components/Saved';
import { Footer } from '@/components/Footer';
import { AccountsShowcase } from '@/components/AccountsShowcase';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const { currentUser, setCurrentUser, setPosts, setStories, setUsers, setMessages } = useStore();

  useEffect(() => {
    // Initial data is now fetched in respective components (Feed, Explore, etc.)
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main content with sidebar offset */}
      <main className="md:ml-64 pt-14 md:pt-0">
        {activeTab === 'home' && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <AccountsShowcase />
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Feed Column */}
              <div className="lg:col-span-2 space-y-4">
                <Stories />
                <CreatePost />
                <Feed />
              </div>

              {/* Suggested Users Sidebar */}
              <div className="hidden lg:block">
                <div className="sticky top-20 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-sm font-bold text-black dark:text-white mb-4">Suggested For You</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {MOCK_USERS.slice(0, 5).map((user: any, index: number) => (
                      <div key={user?.id || user?.username || `user-${index}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <img
                            src={user.avatar || 'https://i.pravatar.cc/150'}
                            alt={user.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-black dark:text-white truncate">
                              {user.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              Suggested for you
                            </p>
                          </div>
                        </div>
                        <button className="text-xs font-semibold text-blue-500 hover:text-blue-600 whitespace-nowrap ml-2">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Explore />
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Reels />
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Create New Post</h2>
              <CreatePost />
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="max-w-6xl mx-auto h-[calc(100vh-80px)]">
            <Messages />
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <Activity />
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <Saved />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-5xl mx-auto px-4 py-6">
            <Profile />
          </div>
        )}
      </main>

      {/* Footer with roadmap */}
      <Footer />
    </div>
  );
}
