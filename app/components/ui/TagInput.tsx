"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Add tag...",
  disabled = false,
  maxTags,
}: TagInputProps) {
  const [input, setInput] = React.useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();

    if (!trimmed) return;

    // prevent duplicates
    if (value.includes(trimmed)) {
      setInput("");
      return;
    }

    // max limit
    if (maxTags && value.length >= maxTags) return;

    onChange?.([...value, trimmed]);

    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange?.(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }

    // remove last tag on backspace
    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
      {value.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
        >
          <span>{tag}</span>

          <button
            type="button"
            onClick={() => removeTag(tag)}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      <input
        type="text"
        value={input}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />

      <button type="button" onClick={() => addTag(input)} disabled={disabled}>
        <Plus className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
