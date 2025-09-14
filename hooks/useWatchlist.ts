"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import {
  addMovie,
  // MediaType,
  removeMovie,
  undoLastAction,
} from "@/store/slice/watchlistSlice";
import { MediaType } from "@/lib/types";

export function useWatchlist(item?: MediaType) {
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: RootState) => state.watchlist.movies);
  const lastAction = useSelector(
    (state: RootState) => state.watchlist.lastAction
  );

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"add" | "remove">("add");

  const isInWatchlist = item ? !!movies[item.id] : false;
  const watchlistIds = Object.keys(movies).map(Number);

  const toggleWatchlist = () => {
    if (!item) return;

    if (isInWatchlist) {
      dispatch(removeMovie(item.id));
      setToastMessage(`"${item.title}" removed from your watchlist`);
      setToastType("remove");
    } else {
      dispatch(addMovie(item));
      setToastMessage(`"${item.title}" added to your watchlist`);
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
