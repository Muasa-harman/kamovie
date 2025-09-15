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
        {["/", "/watchlist", "/discover", "/about"].map((path, idx) => (
          <li key={idx}>
            <Link
              href={path}
              className="hover:text-white transition-colors"
            >
              {["Home", "Watchlist", "Discover", "About"][idx]}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold mb-3">Follow Us</h2>
      <div className="flex items-center gap-4 justify-start md:justify-start sm:justify-center">
        {[FaTwitter, FaInstagram, FaFacebook].map((Icon, idx) => (
          <a
            key={idx}
            href={["https://twitter.com", "https://instagram.com", "https://facebook.com"][idx]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={["Twitter", "Instagram", "Facebook"][idx]}
            className="hover:text-white transition-colors transform hover:scale-110 duration-200"
          >
            <Icon size={24} />
          </a>
        ))}
      </div>
    </div>
  </div>

  <small className="border-t border-gray-800 mt-6 pt-4 block text-center text-gray-500">
    &copy; {new Date().getFullYear()} Kamovy. All rights reserved.
  </small>
</footer>

  );
};

export default Footer;
