"use client";

import React, { useEffect, useState } from "react";
import MovieCard from "../card/MovieCard";
import MovieCardDisplay from "../card/MovieCardDisplay";
// import Spinner from "../common/Spinner"; // ✅ import your spinner
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/movieApi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Spinner from "../Spinner";

interface MovieSection {
  title: string;
  fetcher: () => Promise<any[]>;
}

const sections: MovieSection[] = [
  { title: "Trending Now", fetcher: getTrendingMovies },
  { title: "Popular Movies", fetcher: getPopularMovies },
  { title: "Top Rated", fetcher: getTopRatedMovies },
  { title: "Upcoming", fetcher: getUpcomingMovies },
];

export default function Movies() {
  const [moviesData, setMoviesData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all(sections.map((s) => s.fetcher()))
      .then((results) => {
        const data: Record<string, any[]> = {};
        sections.forEach((s, idx) => {
          data[s.title] = results[idx].slice(0, 10); // top 10
        });
        setMoviesData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-black/90">
        <Spinner /> {/* ✅ global loading spinner */}
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen px-6 md:px-10 bg-black/90">
      {sections.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-left">
            {section.title}
          </h2>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={2.5}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 3.5 },
              768: { slidesPerView: 4.5 },
              1024: { slidesPerView: 5.5 },
            }}
          >
            {moviesData[section.title]?.map((movie) => (
              <SwiperSlide key={movie.id}>
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  rating={movie.vote_average}
                  poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </section>
  );
}




// "use client";

// import React, { useEffect, useState } from "react";
// import MovieCard from "../card/MovieCard";
// import MovieCardDisplay from "../card/MovieCardDisplay";
// import {
//   getTrendingMovies,
//   getPopularMovies,
//   getTopRatedMovies,
//   getUpcomingMovies,
// } from "@/lib/movieApi";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// interface MovieSection {
//   title: string;
//   fetcher: () => Promise<any[]>;
// }

// const sections: MovieSection[] = [
//   { title: "Trending Now", fetcher: getTrendingMovies },
//   { title: "Popular Movies", fetcher: getPopularMovies },
//   { title: "Top Rated", fetcher: getTopRatedMovies },
//   { title: "Upcoming", fetcher: getUpcomingMovies },
// ];

// export default function Movies() {
//   const [moviesData, setMoviesData] = useState<Record<string, any[]>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     Promise.all(sections.map((s) => s.fetcher()))
//       .then((results) => {
//         const data: Record<string, any[]> = {};
//         sections.forEach((s, idx) => {
//           data[s.title] = results[idx].slice(0, 10); // top 10
//         });
//         setMoviesData(data);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <section className="relative w-full min-h-screen px-6 md:px-10 bg-black/90">

//       {sections.map((section) => (
//         <div key={section.title} className="mb-10">
//           <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-left">
//             {section.title}
//           </h2>

//           {loading ? (
//             <div className="flex gap-4 overflow-x-auto py-3">
//               {Array.from({ length: 5 }).map((_, idx) => (
//                 <MovieCardDisplay key={idx} />
//               ))}
//             </div>
//           ) : (
//             <Swiper
//               modules={[Navigation, Pagination]} 
//               spaceBetween={16}
//               slidesPerView={2.5}
//               navigation
//               pagination={{ clickable: true }}
//               breakpoints={{
//                 640: { slidesPerView: 3.5 },
//                 768: { slidesPerView: 4.5 },
//                 1024: { slidesPerView: 5.5 },
//               }}
//             >
//               {moviesData[section.title]?.map((movie) => (
//                 <SwiperSlide key={movie.id}>
//                   <MovieCard
//                     id={movie.id}
//                     title={movie.title}
//                     rating={movie.vote_average}
//                     poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           )}
//         </div>
//       ))}
//     </section>
//   );
// }
