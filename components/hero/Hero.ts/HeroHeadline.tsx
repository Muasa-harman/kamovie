"use client";

import React, { useEffect, useState } from "react";

const headlines = [
  "Find Movies You’ll Actually Love",
  "Your Movie Journey Starts Here",
  "Discover. Watch. Enjoy.",
  "Explore the Stories Everyone’s Talking About",
  "From Classics to Blockbusters — All in One Place",
];

export default function HeroHeadline() {
  const [index, setIndex] = useState(0);        
  const [displayText, setDisplayText] = useState(""); 
  const [charIndex, setCharIndex] = useState(0); 

  useEffect(() => {
    if (charIndex < headlines[index].length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + headlines[index][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % headlines.length);
        setDisplayText("");
        setCharIndex(0);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, index]);

  const highlight = (text: string) => {
    const keywords = ["movie", "love", "discover"];
    return text.split(/(\s+)/).map((word, idx) => {
      if (keywords.some((kw) => word.toLowerCase().includes(kw))) {
        return (
          <span key={idx} className="text-primary">
            {word}
          </span>
        );
      }
      return <span key={idx}>{word}</span>;
    });
  };

  return (
    <h1 className="text-2xl md:text-4xl font-extrabold leading-snug mb-6 text-center transition-all duration-300 ease-in-out
             bg-gradient-to-r from-green-400 via-lime-400 to-yellow-400 bg-clip-text text-transparent">
      {highlight(displayText)}
      <span className="inline-block w-1 h-8 bg-primary ml-1 animate-pulse" /> 
    </h1>
  );
}

