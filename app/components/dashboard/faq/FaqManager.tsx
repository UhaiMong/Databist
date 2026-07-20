"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

interface FaqManagerProps {
  initialFaqs: Faq[];
}

const EMPTY_FORM = {
  question: "",
  answer: "",
  category: "",
  order: 0,
  isPublished: true,
};

export default function FaqManager({ initialFaqs }: FaqManagerProps) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditingId(faq._id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isPublished: faq.isPublished,
    });
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);

    if (editingId) {
      const res = await fetch(`/api/faq/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) =>
          prev.map((f) => (f._id === editingId ? data.faq : f)),
        );
        setOpen(false);
      }
    } else {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) => [...prev, data.faq]);
        setOpen(false);
      }
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) setFaqs((prev) => prev.filter((f) => f._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Services & Pricing"
                />
              </div>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <Switch
                    checked={form.isPublished}
                    onCheckedChange={(v) =>
                      setForm({ ...form, isPublished: v })
                    }
                  />
                  <Label>Published</Label>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save FAQ"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left">
            <tr>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Question</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-muted-foreground"
                >
                  No FAQs yet.
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr key={faq._id} className="border-b last:border-0">
                  <td className="p-3">{faq.category}</td>
                  <td className="p-3">{faq.question}</td>
                  <td className="p-3">
                    <Badge variant={faq.isPublished ? "default" : "outline"}>
                      {faq.isPublished ? "Published" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(faq)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(faq._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
