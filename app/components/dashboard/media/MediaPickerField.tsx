"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import MediaPickerModal, { type MediaItem } from "./MediaPickerModal";

type MediaPickerFieldProps = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
  id?: string;
};

export default function MediaPickerField({
  label,
  value = "",
  onChange,
  helperText,
  id,
}: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(media: MediaItem) {
    onChange(media.secureUrl);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-full overflow-hidden rounded-lg border bg-muted/40 sm:w-40">
          {value ? (
            <>
              <Image
                src={value}
                alt={label}
                fill
                sizes="160px"
                className="object-cover"
              />
              <button
                type="button"
                className="absolute top-1.5 right-1.5 rounded-md bg-black/60 p-1 text-white"
                aria-label="Clear image"
                onClick={() => onChange("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <ImageIcon className="h-6 w-6 opacity-50" />
              <span className="text-[11px]">No image</span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(true)}>
              Choose / Upload
            </Button>
          </div>
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
          />
          {helperText ? (
            <p className="text-xs text-muted-foreground">{helperText}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Pick from the media library or paste a URL.
            </p>
          )}
        </div>
      </div>

      <MediaPickerModal
        open={open}
        onOpenChange={setOpen}
        onSelect={handleSelect}
        title={label}
      />
    </div>
  );
}
