"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Trash2, Download } from "lucide-react";

interface Subscriber {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

interface ContactTableProps {
  initialContactLists: Subscriber[];
}

export default function ContactListTable({
  initialContactLists,
}: ContactTableProps) {
  const [contactList, setContactList] = useState(initialContactLists);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return;

    setDeletingId(id);
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    const data = await res.json();
    setDeletingId(null);

    if (data.success) {
      setContactList((prev) => prev.filter((s) => s._id !== id));
    }
  }

  function exportCsv() {
    const headers = ["Name", "Phone", "Email", "Message", "Contacted On"];
    const rows = contactList.map((s) => [
      s.name,
      s.phone,
      s.email,
      s.message,
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ContactList-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {contactList.length} total Contact
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Message</th>
              <th className="p-3 font-medium">Contacted On</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactList.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-muted-foreground"
                >
                  No Contact list yet.
                </td>
              </tr>
            ) : (
              contactList.map((s) => (
                <tr key={s._id} className="border-b last:border-0">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3">{s.message}</td>
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
