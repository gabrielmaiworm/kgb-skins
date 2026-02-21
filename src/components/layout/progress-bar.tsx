"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProgressBarComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    document.body.classList.add("loading-cursor");

    const timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.remove("loading-cursor");
    }, 500);

    return () => {
      clearTimeout(timeout);
      document.body.classList.remove("loading-cursor");
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-500 animate-[progress_1s_ease-in-out_infinite]" />
    </div>
  );
}
