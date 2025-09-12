"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import {
  addMovie,
  MovieType,
  removeMovie,
  undoLastAction,
} from "@/store/slice/watchlistSlice";

export function useWatchlist(movie?: MovieType) {
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: RootState) => state.watchlist.movies);
  const lastAction = useSelector(
    (state: RootState) => state.watchlist.lastAction
  );

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"add" | "remove">("add");

  const isInWatchlist = movie ? !!movies[movie.id] : false;
  const watchlistIds = Object.keys(movies).map(Number);

  const toggleWatchlist = () => {
    if (!movie) return;

    if (isInWatchlist) {
      dispatch(removeMovie(movie.id));
      setToastMessage(`"${movie.title}" removed from your watchlist`);
      setToastType("remove");
    } else {
      dispatch(addMovie(movie));
      setToastMessage(`"${movie.title}" added to your watchlist`);
      setToastType("add");
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleUndo = () => {
    dispatch(undoLastAction());
    setShowToast(false);
  };

  const removeFromWatchlist = (id: number) => {
    dispatch(removeMovie(id));
  };

  return {
    movies,
    watchlistIds,       
    isInWatchlist,      
    toggleWatchlist,    
    removeFromWatchlist,
    toastMessage,
    showToast,
    toastType,
    handleUndo,
    lastAction,
  };
}