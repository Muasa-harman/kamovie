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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % headlines.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const headline = headlines[index];

  return (
    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-center transition-all duration-700 ease-in-out">
      {headline.split(" ").map((word, idx) =>
        ["movie", "love", "discover"].some((kw) =>
          word.toLowerCase().includes(kw)
        ) ? (
          <span key={idx} className="text-primary">
            {word}{" "}
          </span>
        ) : (
          <span key={idx}>{word} </span>
        )
      )}
    </h1>
  );
}
