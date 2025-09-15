"use client";

import React from "react";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Kamovy</h1>
          <p className="text-gray-400">
            Explore movies and TV shows, create your watchlist, and stay updated.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/watchlist" className="hover:text-white transition-colors">
                Watchlist
              </Link>
            </li>
            <li>
              <Link href="/discover" className="hover:text-white transition-colors">
                Discover
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Follow Us</h2>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaFacebook size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Kamovy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
