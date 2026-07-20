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
import { Pencil, Trash2, Plus, Star } from "lucide-react";

interface Testimonial {
  _id: string;
  clientName: string;
  clientRole?: string;
  companyName?: string;
  quote: string;
  avatar?: string;
  videoUrl?: string;
  relatedService?: string;
  rating: number;
  isFeatured: boolean;
  order: number;
}

interface TestimonialManagerProps {
  initialTestimonials: Testimonial[];
}

const EMPTY_FORM = {
  clientName: "",
  clientRole: "",
  companyName: "",
  quote: "",
  avatar: "",
  videoUrl: "",
  relatedService: "",
  rating: 5,
  isFeatured: false,
  order: 0,
};

export default function TestimonialManager({
  initialTestimonials,
}: TestimonialManagerProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditingId(t._id);
    setForm({
      clientName: t.clientName,
      clientRole: t.clientRole ?? "",
      companyName: t.companyName ?? "",
      quote: t.quote,
      avatar: t.avatar ?? "",
      videoUrl: t.videoUrl ?? "",
      relatedService: t.relatedService ?? "",
      rating: t.rating,
      isFeatured: t.isFeatured,
      order: t.order,
    });
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);

    if (editingId) {
      const res = await fetch(`/api/testimonials/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === editingId ? data.testimonial : t)),
        );
        setOpen(false);
      }
    } else {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) => [...prev, data.testimonial]);
        setOpen(false);
      }
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success)
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Input
                    value={form.clientName}
                    onChange={(e) =>
                      setForm({ ...form, clientName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Client Role</Label>
                  <Input
                    value={form.clientRole}
                    onChange={(e) =>
                      setForm({ ...form, clientRole: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({ ...form, companyName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Related Service</Label>
                  <Input
                    value={form.relatedService}
                    onChange={(e) =>
                      setForm({ ...form, relatedService: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Avatar URL</Label>
                  <Input
                    value={form.avatar}
                    onChange={(e) =>
                      setForm({ ...form, avatar: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video URL (optional)</Label>
                  <Input
                    value={form.videoUrl}
                    onChange={(e) =>
                      setForm({ ...form, videoUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quote</Label>
                <Textarea
                  rows={4}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                  />
                </div>
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
                    checked={form.isFeatured}
                    onCheckedChange={(v) => setForm({ ...form, isFeatured: v })}
                  />
                  <Label>Featured</Label>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Testimonial"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.length === 0 ? (
          <p className="col-span-2 py-6 text-center text-muted-foreground">
            No testimonials yet.
          </p>
        ) : (
          testimonials.map((t) => (
            <div key={t._id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex gap-0.5 text-primary">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-2 text-sm font-medium">{t.clientName}</p>
                </div>
                <div className="flex gap-1">
                  {t.isFeatured && <Badge variant="secondary">Featured</Badge>}
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(t._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
