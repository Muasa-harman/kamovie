// components/MaxWidthWrapper.tsx
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col min-h-screen w-full bg-[rgb(16,23,42)] text-white",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
