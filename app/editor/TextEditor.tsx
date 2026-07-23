"use client";

import type { Value } from "platejs";

import { Plate, usePlateEditor } from "platejs/react";
import { Controller, type Control } from "react-hook-form";

import { Editor, EditorContainer } from "../components/ui/editor/editor";
import { EditorKit } from "./plugins/editor-kit";

const emptyValue: Value = [{ type: "p", children: [{ text: "" }] }];

interface TextEditorProps {
  name: string;
  control: Control<any>;
  defaultValue?: Value;
}

export default function TextEditor({
  name,
  control,
  defaultValue,
}: TextEditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: defaultValue ?? emptyValue,
  });

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? emptyValue}
      render={({ field }) => (
        <Plate
          key={defaultValue ? JSON.stringify(defaultValue).length : "new"}
          editor={editor}
          onChange={({ value }) => field.onChange(value)}
        >
          <EditorContainer>
            <Editor placeholder="Write your blog post..." />
          </EditorContainer>
        </Plate>
      )}
    />
  );
}
