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

// export default function Hero() {
//   const [moviesData, setMoviesData] = useState<Record<string, any[]>>({});
//   const [loading, setLoading] = useState(true);
//   const [isClient, setIsClient] = useState(false); // ✅ track client mount

//   useEffect(() => {
//     setIsClient(true); // mark client-side mount

//     setLoading(true);
//     Promise.all(sections.map((s) => s.fetcher()))
//       .then((results) => {
//         const data: Record<string, any[]> = {};
//         sections.forEach((s, idx) => {
//           data[s.title] = results[idx].slice(0, 10);
//         });
//         setMoviesData(data);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   // Render nothing until client mount to avoid hydration issues
//   if (!isClient) return null;

//   return (
//     <section className="relative w-full min-h-screen px-6 md:px-10 bg-black/90">
//       <div className="max-w-6xl mx-auto text-center mb-12">
//         <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
//           Discover Your Next <span className="text-primary">Favorite</span> Movie
//         </h1>
//         <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
//           Explore trending, popular, top rated, and upcoming movies curated just for you.
//         </p>
//       </div>

//       {sections.map((section) => (
//         <div key={section.title} className="mb-10">
//           <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-left">
//             {section.title}
//           </h2>

//           <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-black py-3">
//             {loading
//               ? Array.from({ length: 5 }).map((_, idx) => <MovieCardDisplay key={idx} />)
//               : moviesData[section.title]?.map((movie) => (
//                   <MovieCard
//                     key={movie.id}
//                     title={movie.title}
//                     rating={movie.vote_average}
//                     poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                   />
//                 ))}
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import MovieCard from "../card/MovieCard";
import MovieCardDisplay from "../card/MovieCardDisplay";
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

export default function Hero() {
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

  return (
    <section className="relative w-full min-h-screen px-6 md:px-10 bg-black/90">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Discover Your Next <span className="text-primary">Favorite</span> Movie
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
          Explore trending, popular, top rated, and upcoming movies curated just for you.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-left">
            {section.title}
          </h2>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto py-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <MovieCardDisplay key={idx} />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]} // ✅ Correct modules
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
          )}
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

// export default function Hero() {
//   const [moviesData, setMoviesData] = useState<Record<string, any[]>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     Promise.all(sections.map((s) => s.fetcher()))
//       .then((results) => {
//         const data: Record<string, any[]> = {};
//         sections.forEach((s, idx) => {
//           data[s.title] = results[idx].slice(0, 10); // take top 10
//         });
//         setMoviesData(data);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <section className="relative w-full min-h-screen px-6 md:px-10 bg-black/90">
//       <div className="max-w-6xl mx-auto text-center mb-12">
//         <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
//           Discover Your Next <span className="text-primary">Favorite</span> Movie
//         </h1>
//         <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
//           Explore trending, popular, top rated, and upcoming movies curated just for you.
//         </p>
//       </div>

//       {sections.map((section) => (
//         <div key={section.title} className="mb-10">
//           <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-left">
//             {section.title}
//           </h2>

//           <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-black py-3">
//             {loading
//               ? Array.from({ length: 5 }).map((_, idx) => (
//                   <MovieCardDisplay key={idx} />
//                 ))
//               : moviesData[section.title]?.map((movie) => (
//                   <MovieCard
//                     key={movie.id}
//                     title={movie.title}
//                     rating={movie.vote_average}
//                     poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                   />
//                 ))}
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// }



// "use client";

// import { getTrendingMovies } from "@/lib/movieApi";
// import React, { useEffect, useState } from "react";
// import MovieCard from "../card/MovieCard";
// import MovieCardDisplay from "../card/MovieCardDisplay"; 

// export default function Hero() {
//   const [movies, setMovies] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getTrendingMovies()
//       .then((data) => {
//         setMovies(data.slice(0, 5)); // limit to 5 trending
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <section
//       className="relative min-h-screen w-full bg-gradient-to-br from-black/90 to-indigo-950/80 bg-cover bg-center flex items-center justify-center px-6 md:px-10"
//       style={{
//         backgroundImage: `linear-gradient(135deg, rgba(15, 15, 26, 0.9), rgba(30, 30, 60, 0.8)), url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1850&q=80')`,
//       }}
//     >
//       <div className="max-w-6xl mx-auto text-center">
//         {/* Headline */}
//         <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
//           Discover Your Next <span className="text-primary">Favorite</span> Movie
//         </h1>

//         {/* Description */}
//         <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
//           Get personalized movie recommendations based on your preferences. From
//           classic cinema to the latest blockbusters, we'll help you find the
//           perfect movie for any mood.
//         </p>

//         {/* Search Box */}
//         <div className="flex items-center bg-white/10 border border-white/20 rounded-full px-5 py-3 backdrop-blur-md mb-12 max-w-xl mx-auto">
//           <input
//             type="text"
//             placeholder="Search for movies, genres, or actors..."
//             className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2"
//           />
//           <button className="bg-primary hover:bg-primary-hover transition px-5 py-2 rounded-full font-semibold text-primary-foreground">
//             Find Movies
//           </button>
//         </div>

//         {/* Trending Section */}
//         <div>
//           <div className="flex items-center justify-center text-lg font-semibold mb-6">
//             <i className="fas fa-fire text-primary mr-2"></i>
//             Trending Now
//           </div>

//           <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-black py-3 justify-center">
//             {loading
//               ? Array.from({ length: 5 }).map((_, idx) => (
//                   <MovieCardDisplay key={idx} /> // show skeleton while loading
//                 ))
//               : movies.map((movie) => (
//                   <MovieCard
//                     key={movie.id}
//                     title={movie.title}
//                     rating={movie.vote_average}
//                     poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                   />
//                 ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



