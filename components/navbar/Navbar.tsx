"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlist } from "@/hooks/useWatchlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearAuth } from "@/store/slice/authSlice";
// import { clearAuth } from "@/store/authSlice";

const Navbar = () => {
  const { movies } = useWatchlist();
  const watchlistIds = Object.keys(movies);
  const [prevCount, setPrevCount] = useState(watchlistIds.length);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSignIn = async () => {
     const res = await fetch("/api/auth/login");
     const data = await res.json();

    if (data.redirect) {
      window.location.href = data.redirect; 
    }
  };

  const handleLogout = () => {
    dispatch(clearAuth());
  };

  useEffect(() => {
    setPrevCount(watchlistIds.length);
  }, [watchlistIds.length]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 text-white-foreground backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-primary hover:text-primary-hover transition-colors duration-300 cursor-pointer">
          <span className="text-black-700">K</span>amovy
        </div>

        <div className="flex items-center gap-4">
          {/* Watchlist */}
          <Link
            href="/watchlist"
            className="relative px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 transition font-semibold"
          >
            Watchlist
            <AnimatePresence>
              {watchlistIds.length > 0 && (
                <motion.span
                  key={watchlistIds.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 text-xs flex items-center justify-center rounded-full"
                >
                  {watchlistIds.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar || ""} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert(`User: ${user.username}`)}>
                  User Info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => (window.location.href = "/api/auth/login")}
              // onClick={handleSignIn}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-colors duration-300"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






// "use client";

// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { useWatchlist } from "@/hooks/useWatchlist";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const Navbar = () => {
//   const { movies } = useWatchlist();
//   const watchlistIds = Object.keys(movies);
//   const [prevCount, setPrevCount] = useState(watchlistIds.length);
//   const [user, setUser] = useState<{ name: string; avatar?: string } | null>(
//     null
//   );

//   const handleSignIn = async () => {
//     try {
//       const res = await fetch("/api/auth/login");
//       const data = await res.json();

//       if (data.redirect) {
//         window.location.href = data.redirect;
//       } else {
//         console.error("No redirect URL returned:", data);
//       }
//     } catch (err) {
//       console.error("Login failed:", err);
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//     console.log("User logged out");
//   };

//   useEffect(() => {
//     setPrevCount(watchlistIds.length);
//   }, [watchlistIds.length]);

//   return (
//     <nav className="bg-white text-white-foreground shadow-md">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//         {/* Logo */}
//         <div className="text-xl font-bold text-primary hover:text-primary-hover transition-colors duration-300 cursor-pointer">
//           <span className="text-black-700">K</span>amovy
//         </div>

//         <div className="flex items-center gap-4">
//           {/* Watchlist */}
//           <Link
//             href="/watchlist"
//             className="relative px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 transition font-semibold"
//           >
//             Watchlist
//             <AnimatePresence>
//               {watchlistIds.length > 0 && (
//                 <motion.span
//                   key={watchlistIds.length}
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   exit={{ scale: 0 }}
//                   transition={{ type: "spring", stiffness: 500, damping: 20 }}
//                   className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 text-xs flex items-center justify-center rounded-full"
//                 >
//                   {watchlistIds.length}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </Link>
//           {user ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar className="cursor-pointer">
//                   <AvatarImage src={user.avatar || ""} alt={user.name} />
//                   <AvatarFallback>{user.name[0]}</AvatarFallback>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-48">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => alert(`User: ${user.name}`)}>
//                   User Info
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleLogout}>
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <Button
//               onClick={handleSignIn}
//               className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-colors duration-300"
//             >
//               Sign In
//             </Button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
