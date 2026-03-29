import type { INote } from "@/types/note.types";
import { cn } from "@/lib/utils";

interface UploaderAvatarProps {
  uploader: INote["uploader"];
  className?: string;
}

export const UploaderAvatar = ({ uploader, className }: UploaderAvatarProps) => (
  <div className="flex items-center gap-2">
    {uploader.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={uploader.image}
        alt={uploader.name}
        className={cn("h-6 w-6 rounded-full object-cover ring-1 ring-border", className)}
      />
    ) : (
      <div className={cn("h-6 w-6 rounded-full bg-orange-500/15 ring-1 ring-orange-500/25 flex items-center justify-center", className)}>
        <span className="text-[10px] font-black text-orange-500 select-none">
          {uploader.name?.[0]?.toUpperCase() ?? "?"}
        </span>
      </div>
    )}
    <span className="text-xs text-muted-foreground font-medium">
      {uploader.name}
    </span>
  </div>
);
