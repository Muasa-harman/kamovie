import { MediaType, WatchlistState } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: WatchlistState = {
  movies: {},
  lastAction: { type: null, movie: null },
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<MediaType>) => {
      state.movies[action.payload.id] = action.payload;
      state.lastAction = { type: "add", movie: action.payload };
    },
    removeMovie: (state, action: PayloadAction<number>) => {
      const movie = state.movies[action.payload];
      if (movie) {
        delete state.movies[action.payload];
        state.lastAction = { type: "remove", movie };
      }
    },
    undoLastAction: (state) => {
      if (!state.lastAction.type || !state.lastAction.movie) return;

      const { type, movie } = state.lastAction;
      if (type === "add") {
        delete state.movies[movie.id];
      } else if (type === "remove") {
        state.movies[movie.id] = movie;
      }

      state.lastAction = { type: null, movie: null };
    },
  },
});

export const { addMovie, removeMovie, undoLastAction } = watchlistSlice.actions;
export default watchlistSlice.reducer;


