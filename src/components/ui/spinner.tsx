import { cn } from "@/lib/utils";

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-6 h-6 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin",
        className
      )}
    />
  );
};
