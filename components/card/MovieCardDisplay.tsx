import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MovieCardDisplay = () => {
  return (
    <Card className="relative min-w-[160px] h-[260px] overflow-hidden rounded-xl shadow-md">
      {/* Poster skeleton */}
      <CardContent className="p-0 h-full w-full">
        <Skeleton className="h-full w-full" />
      </CardContent>

      {/* Overlay footer skeleton */}
      <CardFooter className="absolute bottom-0 left-0 right-0 p-3 flex flex-col items-start gap-2">
        <Skeleton className="h-4 w-24" /> {/* title */}
        <Skeleton className="h-3 w-12" /> {/* rating */}
      </CardFooter>
    </Card>
  );
};

export default MovieCardDisplay;
