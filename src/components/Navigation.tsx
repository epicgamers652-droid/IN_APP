'use client';

import { Home, MessageSquare, Search, PlusSquare, User, LogOut, Film, Bell, Bookmark, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '@/store/store';
import { useState } from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export function Navigation({ activeTab, setActiveTab, onLogout }: NavigationProps) {
  const { notifications, currentUser } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.toUser === (currentUser?._id || currentUser?.id) && !n.read).length;

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'activity', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'create', label: 'Create', icon: PlusSquare },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar - Instagram Style */}
      <aside className="hidden md:fixed md:flex md:flex-col md:left-0 md:top-0 md:h-screen md:w-64 md:border-r md:border-gray-200 dark:md:border-gray-800 md:bg-white dark:md:bg-black md:transition-colors md:z-50">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-black">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              IN
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 relative group ${isActive
                    ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
              >
                <Icon size={24} strokeWidth={2} />
                <span className="text-base font-medium">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <ThemeToggle />
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <LogOut size={24} strokeWidth={2} />
              <span className="text-base font-medium">Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 h-14 flex items-center justify-between px-4 z-50">
        <div className="text-xl font-black bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
          Instagram
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 dark:text-gray-300"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 bottom-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 overflow-y-auto z-40">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all relative ${isActive
                      ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                >
                  <Icon size={24} strokeWidth={2} />
                  <span className="text-base font-medium">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="py-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <div className="px-4 py-3">
                <ThemeToggle />
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                >
                  <LogOut size={24} strokeWidth={2} />
                  <span className="text-base font-medium">Logout</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
