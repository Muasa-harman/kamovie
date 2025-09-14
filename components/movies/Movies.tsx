"use client";

import React, { useEffect, useState } from "react";
import MovieCard from "../card/MovieCard";
import {
  getTrendingMovies,
  getUpcomingMovies,
  discoverMovies,
  discoverTV,
} from "@/lib/movieApi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Spinner from "../Spinner";
import { MovieSection } from "@/lib/types";

const sections: MovieSection[] = [
  { title: "Trending Now", fetcher: getTrendingMovies },
  {
    title: "Recommended TV Shows",
    fetcher: () =>
      discoverTV({ page: 1 }).then((res) => res.results.slice(0, 10)),
  },
  {
    title: "Recommended Movies",
    fetcher: () =>
      discoverMovies({ page: 1 }).then((res) => res.results.slice(0, 10)),
  },
  { title: "Upcoming", fetcher: getUpcomingMovies },
];

const PLACEHOLDER_IMAGE = "/placeholder.png";

export default function Movies() {
  const [moviesData, setMoviesData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all(sections.map((s) => s.fetcher()))
      .then((results) => {
        const data: Record<string, any[]> = {};
        sections.forEach((s, idx) => {
          data[s.title] = results[idx].slice(0, 10);
        });
        setMoviesData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-black/90">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen px-4 md:px-10 bg-black/90 space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-lg md:text-2xl font-semibold text-white mb-3 md:mb-4">
            {section.title}
          </h2>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={2.2}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            grabCursor={true}
            breakpoints={{
              480: { slidesPerView: 2.5, spaceBetween: 14 },
              640: { slidesPerView: 3.5, spaceBetween: 16 },
              768: { slidesPerView: 4.5, spaceBetween: 18 },
              1024: { slidesPerView: 5.5, spaceBetween: 20 },
            }}
          >
            {moviesData[section.title]?.map((movie) => (
              <SwiperSlide key={movie.id}>
                <MovieCard
                  id={movie.id}
                  title={movie.title || movie.name || "Unknown Title"}
                  rating={movie.vote_average ?? 0}
                  poster={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : PLACEHOLDER_IMAGE
                  }
                  type={
                    section.title === "Recommended TV Shows" ? "tv" : "movie"
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </section>
  );
}
