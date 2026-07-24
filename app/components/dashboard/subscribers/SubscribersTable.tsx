"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Trash2, Download } from "lucide-react";
import { Badge } from "../../ui/badge";

interface Subscriber {
  _id: string;
  email: string;
  status: "subscribed" | "unsubscribed";
  createdAt: string;
}

interface SubscribersTableProps {
  initialSubscribers: Subscriber[];
}

export default function SubscribersTable({
  initialSubscribers,
}: SubscribersTableProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return;

    setDeletingId(id);
    const res = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
    const data = await res.json();
    setDeletingId(null);

    if (data.success) {
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    }
  }

  function exportCsv() {
    const headers = ["Email", "Status", "Subscribed On"];
    const rows = subscribers.map((s) => [
      s.email,
      s.status,
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {subscribers.length} total subscribers
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left">
            <tr>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Subscribed On</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-muted-foreground"
                >
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s._id} className="border-b last:border-0">
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        s.status === "subscribed" ? "default" : "outline"
                      }
                    >
                      {s.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === s._id}
                      onClick={() => handleDelete(s._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
