export type Filters = {
  genre?: string;  
  year?: string;    
  rating?: string; 
  duration?: "short" | "medium" | "long" | string;
  sortBy?: string;
  query?: string;
  page?: number;
};
