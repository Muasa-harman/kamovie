export  interface TVDetailsType {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  genres: Genre[];
  created_by?: { id: number; name: string }[];
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  videos?: {
    results: Video[];
  };
}

export  interface MovieDetailsType {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: Genre[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
    crew: Crew[];
  };
  videos?: {
    results: Video[];
  };
}

export  interface MovieCardProps {
  title: string;
  rating?: number;
  poster: string;
  id: number;
  type?:"movie" | "tv";
}

export  interface MovieSection {
  title: string;
  fetcher: () => Promise<any[]>;
}

export  interface ToastProps {
  message: string;
  show: boolean;
  type?: "add" | "remove";
  onUndo?: () => void;
}

export type FetchOptions = {
  signal?: AbortSignal;
  force?: boolean;
};


export  interface Movie {
  id: number;
  title: string;
  release_date?: string;
  genre_ids: number[];
  vote_average?: number;
  poster_path?: string;
}

export interface Keyword {
  id: number;
  name: string;
}


export interface WatchlistState {
  movies: Record<number, MediaType>;
  lastAction: {
    type: "add" | "remove" | null;
    movie: MediaType | null;
  };
}


export interface Stats {
  trending: number;
  popular: number;
  topRated: number;
  upcoming: number;
}


export type Filters = {
  genre?: string;  
  year?: string;    
  rating?: string; 
  duration?: "short" | "medium" | "long" | string;
  sortBy?: string;
  query?: string;
  page?: number;
};


export interface MediaType {
  id: number;
  title: string; 
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  release_date?: string; 
  first_air_date?: string; 
  type: "movie" | "tv";
  [key: string]: any; 
}

export type Crew = {
  id: number;
  name: string;
  job: string;
};

export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type Video = {
  id: string;
  type: string;
  site: string;
  key: string;
  name: string;
};

export type Genre = {
  id: number;
  name: string;
};

export  interface Avatar {
  tmdb?: { avatar_path: string | null };
  gravatar?: { hash: string | null };
}

export interface User {
  id: number | string;
  username: string;
  name?: string;
  avatar?: string | null;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
}

export interface TopCastProps {
  cast: Cast[];
}
