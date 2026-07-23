"use client";

import type { ReactNode } from "react";
import Image from "next/image";

interface BlogReaderProps {
  body: any[];
}

// ---- Leaf (text) rendering — applies marks ----
function renderLeaf(leaf: any, key: React.Key): ReactNode {
  if (typeof leaf === "string") return leaf;

  let node: ReactNode = leaf.text ?? "";

  if (leaf.code)
    node = (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
        {node}
      </code>
    );
  if (leaf.kbd)
    node = (
      <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
        {node}
      </kbd>
    );
  if (leaf.bold) node = <strong>{node}</strong>;
  if (leaf.italic) node = <em>{node}</em>;
  if (leaf.underline) node = <u>{node}</u>;
  if (leaf.strikethrough) node = <s>{node}</s>;
  if (leaf.subscript) node = <sub>{node}</sub>;
  if (leaf.superscript) node = <sup>{node}</sup>;
  if (leaf.highlight)
    node = <mark className="bg-yellow-200 dark:bg-yellow-900">{node}</mark>;
  if (leaf.color) node = <span style={{ color: leaf.color }}>{node}</span>;
  if (leaf.backgroundColor)
    node = (
      <span style={{ backgroundColor: leaf.backgroundColor }}>{node}</span>
    );

  return <span key={key}>{node}</span>;
}

// ---- Children (mix of leaves + inline elements like links) ----
function renderChildren(children: any[] = []): ReactNode[] {
  return children.map((child, i) => {
    if (child?.text !== undefined) return renderLeaf(child, i);
    return renderElement(child, i);
  });
}

// ---- Alignment / indent helpers (Plate stores these as props on the block) ----
function blockStyle(el: any): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (el.align) style.textAlign = el.align;
  if (el.indent) style.paddingLeft = `${el.indent * 24}px`;
  return style;
}

function renderElement(element: any, key: React.Key): ReactNode {
  if (element?.text !== undefined) return renderLeaf(element, key);

  const { type, children } = element;
  const content = renderChildren(children);
  const style = blockStyle(element);

  switch (type) {
    case "h1":
      return (
        <h1 key={key} style={style} className="my-4 text-4xl font-bold">
          {content}
        </h1>
      );
    case "h2":
      return (
        <h2 key={key} style={style} className="my-3 text-3xl font-bold">
          {content}
        </h2>
      );
    case "h3":
      return (
        <h3 key={key} style={style} className="my-2 text-2xl font-bold">
          {content}
        </h3>
      );
    case "h4":
      return (
        <h4 key={key} style={style} className="my-2 text-xl font-bold">
          {content}
        </h4>
      );
    case "p":
      // Plate list items are paragraphs with a listStyleType — handled by groupIntoLists below,
      // but render as a plain paragraph if it slips through ungrouped.
      return (
        <p key={key} style={style} className="my-2 leading-relaxed">
          {content}
        </p>
      );
    case "blockquote":
      return (
        <blockquote
          key={key}
          style={style}
          className="my-2 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground"
        >
          {content}
        </blockquote>
      );
    case "hr":
      return <hr key={key} className="my-6 border-muted-foreground/30" />;
    case "a":
      return (
        <a
          key={key}
          href={element.url}
          target={element.target ?? "_blank"}
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {content}
        </a>
      );
    case "img":
      return (
        <span key={key} className="my-4 block">
          <Image
            src={element.url}
            alt={element.alt ?? ""}
            width={element.width ?? 800}
            height={element.height ?? 450}
            className="h-auto w-full rounded-lg"
          />
          {element.caption && (
            <span className="mt-1 block text-center text-sm text-muted-foreground">
              {renderChildren(element.caption)}
            </span>
          )}
        </span>
      );
    case "code_block":
      return (
        <pre key={key} className="my-2 overflow-x-auto rounded bg-muted p-4">
          <code className="font-mono text-sm">
            {children?.map((line: any, i: number) => (
              <div key={i}>{renderChildren(line.children)}</div>
            ))}
          </code>
        </pre>
      );
    // Legacy nested ul/ol/li, kept in case you ever import content in that shape
    case "ul":
      return (
        <ul key={key} className="my-2 list-disc space-y-1 pl-6">
          {content}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="my-2 list-decimal space-y-1 pl-6">
          {content}
        </ol>
      );
    case "li":
      return <li key={key}>{content}</li>;
    default:
      return <div key={key}>{content}</div>;
  }
}

// ---- Group Plate's flat listStyleType paragraphs into real <ul>/<ol> ----
function groupIntoLists(body: any[]): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;

  while (i < body.length) {
    const el = body[i];

    if (el?.listStyleType) {
      const tag = el.listStyleType === "decimal" ? "ol" : "ul";
      const ListTag = tag as "ul" | "ol";
      const items: any[] = [];

      while (i < body.length && body[i]?.listStyleType === el.listStyleType) {
        items.push(body[i]);
        i++;
      }

      out.push(
        <ListTag
          key={el.id ?? `list-${i}`}
          className={
            tag === "ol"
              ? "my-2 list-decimal space-y-1 pl-6"
              : "my-2 list-disc space-y-1 pl-6"
          }
        >
          {items.map((item, idx) => (
            <li key={item.id ?? idx} style={blockStyle(item)}>
              {renderChildren(item.children)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    out.push(renderElement(el, el.id ?? i));
    i++;
  }

  return out;
}

export function BlogReader({ body }: BlogReaderProps) {
  if (!body?.length) return null;

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      {groupIntoLists(body)}
    </div>
  );
}
