"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Switch } from "../../ui/switch";
import { Trash2, Plus } from "lucide-react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface AvailabilityRule {
  _id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotLengthMinutes: number;
  bufferMinutes: number;
  isActive: boolean;
}

interface BlackoutDate {
  _id: string;
  date: string;
  reason?: string;
}

interface AvailabilityManagerProps {
  initialRules: AvailabilityRule[];
  initialBlackoutDates: BlackoutDate[];
}

export default function AvailabilityManager({
  initialRules,
  initialBlackoutDates,
}: AvailabilityManagerProps) {
  const [rules, setRules] = useState(initialRules);
  const [blackoutDates, setBlackoutDates] = useState(initialBlackoutDates);
  const [newRule, setNewRule] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
    slotLengthMinutes: 30,
    bufferMinutes: 0,
  });
  const [newBlackout, setNewBlackout] = useState({ date: "", reason: "" });

  async function addRule() {
    const res = await fetch("/api/booking/availability-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newRule, isActive: true }),
    });
    const data = await res.json();
    if (data.success) setRules((prev) => [...prev, data.rule]);
  }

  async function toggleRule(id: string, isActive: boolean) {
    setRules((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isActive } : r)),
    );
    await fetch(`/api/booking/availability-config/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
  }

  async function deleteRule(id: string) {
    await fetch(`/api/booking/availability-config/${id}`, { method: "DELETE" });
    setRules((prev) => prev.filter((r) => r._id !== id));
  }

  async function addBlackout() {
    if (!newBlackout.date) return;
    const res = await fetch("/api/booking/blackout-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlackout),
    });
    const data = await res.json();
    if (data.success) {
      setBlackoutDates((prev) => [...prev, data.blackout]);
      setNewBlackout({ date: "", reason: "" });
    }
  }

  async function deleteBlackout(id: string) {
    await fetch(`/api/booking/blackout-dates?id=${id}`, { method: "DELETE" });
    setBlackoutDates((prev) => prev.filter((b) => b._id !== id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule._id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{DAYS[rule.dayOfWeek]}</p>
                <p className="text-sm text-muted-foreground">
                  {rule.startTime} – {rule.endTime} · {rule.slotLengthMinutes}
                  min slots · {rule.bufferMinutes}min buffer
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={(v) => toggleRule(rule._id, v)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRule(rule._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}

          <div className="space-y-3 rounded-md border p-4">
            <p className="text-sm font-medium">Add Working Hours Rule</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Day</Label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={newRule.dayOfWeek}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      dayOfWeek: Number(e.target.value),
                    })
                  }
                >
                  {DAYS.map((d, i) => (
                    <option key={i} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Slot Length (min)</Label>
                <Input
                  type="number"
                  value={newRule.slotLengthMinutes}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      slotLengthMinutes: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newRule.startTime}
                  onChange={(e) =>
                    setNewRule({ ...newRule, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newRule.endTime}
                  onChange={(e) =>
                    setNewRule({ ...newRule, endTime: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Buffer Time (min)</Label>
                <Input
                  type="number"
                  value={newRule.bufferMinutes}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      bufferMinutes: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <Button size="sm" onClick={addRule} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Rule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blackout Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blackoutDates.map((b) => (
            <div
              key={b._id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{b.date}</p>
                {b.reason && (
                  <p className="text-sm text-muted-foreground">{b.reason}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteBlackout(b._id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="space-y-3 rounded-md border p-4">
            <p className="text-sm font-medium">Add Blackout Date</p>
            <div className="space-y-1">
              <Label>Date</Label>
              <Input
                type="date"
                value={newBlackout.date}
                onChange={(e) =>
                  setNewBlackout({ ...newBlackout, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Reason (optional)</Label>
              <Input
                value={newBlackout.reason}
                onChange={(e) =>
                  setNewBlackout({ ...newBlackout, reason: e.target.value })
                }
                placeholder="e.g. Public holiday"
              />
            </div>
            <Button size="sm" onClick={addBlackout} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Blackout Date
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
