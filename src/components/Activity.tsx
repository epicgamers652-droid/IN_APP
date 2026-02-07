'use client';

import { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Tag } from 'lucide-react';
import { useStore } from '@/store/store';

export default function Activity() {
  const { notifications } = useStore();
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', icon: null },
    { id: 'follows', label: 'Follows', icon: UserPlus },
    { id: 'likes', label: 'Likes', icon: Heart },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
  ];

  const typeMap: { [key: string]: string } = {
    'follows': 'follow',
    'likes': 'like',
    'comments': 'comment',
  };

  const filteredNotifications =
    selectedTab === 'all'
      ? notifications || []
      : (notifications || []).filter((n) => n.type === typeMap[selectedTab] || n.type === selectedTab);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`pb-4 font-semibold text-sm relative transition ${
              selectedTab === tab.id
                ? 'text-black dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {tab.label}
            {selectedTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black dark:bg-white" />
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            let icon = null;
            let bgColor = 'bg-gray-100 dark:bg-gray-900';

            switch (notification.type) {
              case 'like':
                icon = <Heart size={20} className="text-red-500" />;
                bgColor = 'bg-red-50 dark:bg-red-900/20';
                break;
              case 'comment':
                icon = <MessageCircle size={20} className="text-blue-500" />;
                bgColor = 'bg-blue-50 dark:bg-blue-900/20';
                break;
              case 'follow':
                icon = <UserPlus size={20} className="text-green-500" />;
                bgColor = 'bg-green-50 dark:bg-green-900/20';
                break;
              default:
                icon = <Heart size={20} className="text-gray-500" />;
            }

            return (
              <div
                key={notification.id}
                className={`flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 ${
                  !notification.read ? bgColor : 'bg-white dark:bg-black'
                } transition hover:bg-gray-50 dark:hover:bg-gray-900/50`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    {icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-black dark:text-white">
                    <span className="font-semibold">{notification.fromUser || 'User'}</span>{' '}
                    {notification.message || 'interacted with you'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>

                {/* Unread Indicator */}
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {selectedTab === 'all'
                ? "When someone likes, comments, or follows you, you'll see it here"
                : `No ${selectedTab} activity yet`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
