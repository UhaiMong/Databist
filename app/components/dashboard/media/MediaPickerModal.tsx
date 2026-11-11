"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

export type MediaItem = {
  _id: string;
  publicId: string;
  secureUrl: string;
  url: string;
  width?: number;
  height?: number;
  originalFilename?: string;
  alt?: string;
  createdAt?: string;
};

type MediaPickerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaItem) => void;
  title?: string;
};

export default function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  title = "Media library",
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = items.find((item) => item._id === selectedId) ?? null;

  const loadMedia = useCallback(
    async (nextPage = 1, search = query) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(nextPage),
          limit: "24",
        });
        if (search.trim()) params.set("q", search.trim());

        const res = await fetch(`/api/media?${params.toString()}`);
        const data = await res.json();

        if (!data.success) {
          toast.error(data.message ?? "Failed to load media");
          return;
        }

        setItems(data.items ?? []);
        setPage(data.pagination?.page ?? 1);
        setTotalPages(data.pagination?.totalPages ?? 1);
      } catch {
        toast.error("Failed to load media");
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    void loadMedia(1, query);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);

        const res = await fetch("/api/media", {
          method: "POST",
          body,
        });
        const data = await res.json();

        if (!data.success) {
          toast.error(data.message ?? `Failed to upload ${file.name}`);
          continue;
        }

        toast.success(`Uploaded ${file.name}`);
        setSelectedId(data.media._id);
      }

      await loadMedia(1, query);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this media from Cloudinary?");
    if (!confirmed) return;

    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!data.success) {
      toast.error(data.message ?? "Failed to delete media");
      return;
    }

    toast.success("Media deleted");
    if (selectedId === id) setSelectedId(null);
    await loadMedia(page, query);
  }

  function handleConfirm() {
    if (!selected) return;
    onSelect(selected);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-4xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Pick an uploaded image or upload a new one from your device.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3 border-b px-6 py-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void loadMedia(1, query);
              }}
              placeholder="Search media…"
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadMedia(1, query)}
            disabled={loading}
          >
            Search
          </Button>
          <Button
            type="button"
            className="brand-gradient text-white"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload from device
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
            multiple
            className="hidden"
            onChange={(e) => void handleUpload(e.target.files)}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading media…
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <ImagePlus className="h-10 w-10 opacity-50" />
              <p>No media yet. Upload your first image.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => {
                const isSelected = item._id === selectedId;
                return (
                  <div
                    key={item._id}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border bg-muted/30",
                      isSelected && "ring-2 ring-brand border-brand",
                    )}
                  >
                    <button
                      type="button"
                      className="block w-full text-left"
                      onClick={() => setSelectedId(item._id)}
                      onDoubleClick={() => {
                        onSelect(item);
                        onOpenChange(false);
                      }}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={item.secureUrl}
                          alt={item.alt || item.originalFilename || "Media"}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate px-2 py-1.5 text-xs">
                        {item.originalFilename || item.publicId}
                      </div>
                    </button>
                    <button
                      type="button"
                      className="absolute top-2 right-2 rounded-md bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                      aria-label="Delete media"
                      onClick={() => void handleDelete(item._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-3 border-t px-6 py-4 sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => void loadMedia(page - 1, query)}
            >
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} / {Math.max(totalPages, 1)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => void loadMedia(page + 1, query)}
            >
              Next
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="brand-gradient text-white"
              disabled={!selected}
              onClick={handleConfirm}
            >
              Use selected
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
