import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export const SkeletonInput = () => {
  return (
    <div className="text-start w-full flex flex-col gap-2 items-start">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-5 " />
        <Skeleton className="h-5 w-20 " />
      </div>
      <Input disabled className="w-full" />

      <Skeleton className="h-4 w-[6.875rem] " />
    </div>
  );
};
