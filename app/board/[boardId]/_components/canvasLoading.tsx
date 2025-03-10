import { Loader } from "lucide-react";

import { InfoSkeleton } from "./info";
import { ToolbarSkeleton } from "./toolbar";
import { ParticipantsSkeleton } from "./participants";

export const Loading = () => {
  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center"
    >
      <span className="loader2"></span>
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  );
};