'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/store';
import { Mail, Users, FileText, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function AccountsShowcase() {
  const { users, setUsers } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [setUsers]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading community...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-blue-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2"> IN Community</h2>
        <p className="text-gray-600 dark:text-gray-400">No accounts created yet. Be the first to join!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2"> Community Members</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Total Members: <span className="font-semibold text-blue-600 dark:text-blue-400">{users.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user: any) => (
          <div
            key={user._id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg dark:hover:shadow-slate-800 transition-all"
          >
            <div className="flex items-start gap-4">
              <img
                src={user.avatar || 'https://i.pravatar.cc/150?u=' + user._id}
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-black dark:text-white truncate">{user.username}</h3>
                {user.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.bio}</p>
                )}

                <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {(user.followers?.length || 0)} followers • Following {(user.following?.length || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{user.postsCount || 0} posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'long ago'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{users.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-blue-400">
            {users.reduce((sum: number, u: any) => sum + (u.followers?.length || 0), 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Followers</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {users.reduce((sum: number, u: any) => sum + (u.postsCount || 0), 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
        </div>
      </div>
    </div>
  );
}
