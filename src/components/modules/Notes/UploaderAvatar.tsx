import type { INote } from "@/types/note.types";

interface UploaderAvatarProps {
  uploader: INote["uploader"];
}

export const UploaderAvatar = ({ uploader }: UploaderAvatarProps) => (
  <div className="flex items-center gap-2">
    {uploader.image ? (
      <img
        src={uploader.image}
        alt={uploader.name}
        className="h-6 w-6 rounded-full object-cover ring-1 ring-border"
      />
    ) : (
      <div className="h-6 w-6 rounded-full bg-orange-500/15 ring-1 ring-orange-500/25 flex items-center justify-center">
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