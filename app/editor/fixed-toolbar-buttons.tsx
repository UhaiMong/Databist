"use client";

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  Code2Icon,
  HighlighterIcon,
  ListIcon,
  ListOrderedIcon,
  SquareIcon,
  QuoteIcon,
  MinusIcon,
  ImageIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef } from "platejs/react";

// import { MarkToolbarButton } from "@/components/ui/edit/mark-toolbar-button";
import { ToolbarButton, ToolbarGroup } from "../components/ui/editor/toolbar";
import { TurnIntoToolbarButton } from "../components/ui/editor/turn-into-toolbar-button";
import { InsertToolbarButton } from "../components/ui/editor/insert-toolbar-button";
import { LinkToolbarButton } from "../components/ui/editor/link-toolbar-button";
import { MediaToolbarButton } from "../components/ui/editor/media-toolbar-button";
import { AlignToolbarButton } from "../components/ui/editor/align-toolbar-button";
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from "../components/ui/editor/indent-toolbar-button";
import {
  UndoToolbarButton,
  RedoToolbarButton,
} from "../components/ui/editor/history-toolbar-button";
import { MarkToolbarButton } from "../components/ui/editor/mark-toolbar-button";

export function FixedToolbarButtons() {
  const editor = useEditorRef();

  return (
    <div className="flex w-full flex-wrap items-center gap-1">
      <ToolbarGroup>
        <UndoToolbarButton />
        <RedoToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <InsertToolbarButton />
        <TurnIntoToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
          <BoldIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
          <ItalicIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline (⌘+U)">
          <UnderlineIcon />
        </MarkToolbarButton>
        <MarkToolbarButton
          nodeType={KEYS.strikethrough}
          tooltip="Strikethrough (⌘+⇧+M)"
        >
          <StrikethroughIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
          <Code2Icon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
          <HighlighterIcon />
        </MarkToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <AlignToolbarButton />
        <ToolbarButton
          tooltip="Bulleted list"
          onClick={() =>
            (editor?.tf as any)?.toggle?.list?.({ listStyleType: KEYS.ul })
          }
        >
          <ListIcon />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Numbered list"
          onClick={() =>
            (editor?.tf as any)?.toggle?.list?.({ listStyleType: KEYS.ol })
          }
        >
          <ListOrderedIcon />
        </ToolbarButton>
        <ToolbarButton
          tooltip="To-do list"
          onClick={() =>
            (editor?.tf as any)?.toggle?.list?.({
              listStyleType: KEYS.listTodo,
            })
          }
        >
          <SquareIcon />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Quote"
          onClick={() => (editor?.tf as any)?.blockquote?.toggle?.()}
        >
          <QuoteIcon />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Divider"
          onClick={() =>
            (editor?.tf as any)?.insertNodes?.({
              type: KEYS.hr,
              children: [{ text: "" }],
            })
          }
        >
          <MinusIcon />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <LinkToolbarButton />
        <MediaToolbarButton nodeType={KEYS.img}>
          <ImageIcon />
        </MediaToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <OutdentToolbarButton />
        <IndentToolbarButton />
      </ToolbarGroup>
    </div>
  );
}
