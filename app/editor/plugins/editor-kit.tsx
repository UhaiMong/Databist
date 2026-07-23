"use client";

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  HighlightPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  BlockquotePlugin,
  HorizontalRulePlugin,
} from "@platejs/basic-nodes/react";
// import { AlignPlugin } from "@platejs/basic-styles/react";
import { IndentPlugin } from "@platejs/indent/react";
import { ListPlugin } from "@platejs/list/react";
import { LinkPlugin } from "@platejs/link/react";
import { ImagePlugin } from "@platejs/media/react";
import { CodeBlockPlugin } from "@platejs/code-block/react";
import { KEYS } from "platejs";
import { createPlatePlugin } from "platejs/react";

// import {
//   CodeBlockElement,
//   CodeLineElement,
// } from "@/components/ui/code-block-node";
// import { BlockList } from "@/components/ui/block-list";

import { BlockquoteElement } from "@/app/components/ui/editor/blockquote-node";
import {
  H1Element,
  H2Element,
  H3Element,
} from "@/app/components/ui/editor/heading-node";
import { HrElement } from "@/app/components/ui/editor/hr-node";
import { LinkElement } from "@/app/components/ui/editor/link-node";
import { ImageElement } from "@/app/components/ui/editor/media-image-node";
import { CodeBlockElement } from "@/app/components/ui/editor/code-block-node";
import { FixedToolbar } from "@/app/components/ui/editor/fixed-toolbar";
import { FixedToolbarButtons } from "../fixed-toolbar-buttons";

export const EditorKit = [
  // Blocks
  H1Plugin.withComponent(H1Element),
  H2Plugin.withComponent(H2Element),
  H3Plugin.withComponent(H3Element),
  BlockquotePlugin.withComponent(BlockquoteElement),
  HorizontalRulePlugin.withComponent(HrElement),
  CodeBlockPlugin.withComponent(CodeBlockElement).extend({
    node: { component: CodeBlockElement },
  }),

  // Marks
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  HighlightPlugin,

  // Lists (also injects indent for p/heading/blockquote/codeBlock)
  ListPlugin.configure({
    inject: {
      targetPlugins: [...KEYS.heading, KEYS.p, KEYS.blockquote, KEYS.codeBlock],
    },
    // render: { belowNodes: BlockList },
  }),
  IndentPlugin.configure({
    inject: {
      targetPlugins: [...KEYS.heading, KEYS.p, KEYS.blockquote, KEYS.codeBlock],
    },
  }),

  // Alignment
  // AlignPlugin.configure({
  //   inject: {
  //     targetPlugins: [...KEYS.heading, KEYS.p, KEYS.blockquote],
  //   },
  // }),

  // Link
  LinkPlugin.withComponent(LinkElement),

  // Image (kept simple for blog bodies — skip video/audio/file)
  ImagePlugin.withComponent(ImageElement),

  // Fixed toolbar
  createPlatePlugin({
    key: "fixed-toolbar",
    render: {
      beforeEditable: () => (
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
      ),
    },
  }),
];
