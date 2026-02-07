'use client';

import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'About', href: '#about' },
    { label: 'Help', href: '#help' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Terms', href: '#terms' },
    { label: 'Contact', href: '#contact' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Footer Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {footerLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 dark:text-gray-500 text-sm">
            <p>
              CREATED BY MARTIN <Heart className="inline w-4 h-4 text-red-500" /> © {currentYear}
            </p>
            <p className="mt-2">
              <span className="font-semibold">v1.0.0</span> - IN Social Network
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
