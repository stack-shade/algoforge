"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark, Calendar, Clock, Plus, Save, Tag, X } from "lucide-react";
import { getUserStore, type ProgressStatus } from "@/lib/user/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StudyPanelProps {
  slug: string;
  title: string;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function StudyPanel({ slug, title }: StudyPanelProps) {
  const [notes, setNotes] = useState("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [inQueue, setInQueue] = useState(false);
  const [reminder, setReminder] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [status, setStatus] = useState<ProgressStatus>("todo");
  const [confidence, setConfidence] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);


  useEffect(() => {
    if (!isTimerRunning) return;

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeSpent((previous) => previous + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);

      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (elapsed > 0) getUserStore().updateTimeSpent(slug, elapsed);
        startTimeRef.current = null;
      }
    };
  }, [isTimerRunning, slug]);

  function saveNotes() {
    getUserStore().setProgress(slug, { notes });
  }

  function addTag() {
    const tag = newTag.trim().toLowerCase();
    if (!tag || customTags.includes(tag)) return;
    getUserStore().addCustomTag(slug, tag);
    setCustomTags((previous) => [...previous, tag]);
    setNewTag("");
  }

  function removeTag(tag: string) {
    getUserStore().removeCustomTag(slug, tag);
    setCustomTags((previous) => previous.filter((item) => item !== tag));
  }

  function toggleQueue() {
    if (inQueue) getUserStore().removeFromStudyQueue(slug);
    else getUserStore().addToStudyQueue(slug);
    setInQueue((previous) => !previous);
  }

  function toggleReminder() {
    if (reminder) {
      getUserStore().clearReminder(slug);
      setReminder(null);
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const value = tomorrow.toISOString();
    getUserStore().setReminder(slug, value);
    setReminder(value);
  }

  function logAttempt(nextStatus: ProgressStatus, nextConfidence: number) {
    getUserStore().logAttempt(slug, nextStatus, nextConfidence);
    setStatus(nextStatus);
    setConfidence(nextConfidence);
  }

  return (
    <Card aria-label={`Study tools for ${title}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Study tools</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Local controls for review and recall.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold tabular-nums">{formatTime(timeSpent)}</span>
            <Button
              size="sm"
              variant={isTimerRunning ? "destructive" : "outline"}
              onClick={() => setIsTimerRunning((previous) => !previous)}
            >
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              {isTimerRunning ? "Stop" : "Start"}
            </Button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["solved", "Solved", 5],
            ["attempted", "Tried", 3],
            ["review", "Review", 2],
          ].map(([value, label, score]) => (
            <Button
              key={value}
              size="sm"
              variant={status === value ? "default" : "outline"}
              onClick={() => logAttempt(value as ProgressStatus, score as number)}
              className="h-9 text-xs"
            >
              {label}
            </Button>
          ))}
        </div>

        {confidence > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Confidence recorded: {confidence}/5
          </p>
        )}

        <details className="mt-4 group">
          <summary className="cursor-pointer list-none border-t border-border pt-3 text-xs font-medium text-muted-foreground group-open:text-foreground">
            Personal notes & tags
          </summary>
          <div className="mt-3 space-y-3">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Write the idea you want to remember…"
              className="min-h-24 w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm leading-6 outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveNotes}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save
              </Button>
              <div className="flex min-w-0 flex-1 gap-2">
                <input
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && addTag()}
                  placeholder="Add a tag"
                  className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="sm" variant="outline" onClick={addTag} aria-label="Add tag">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            {customTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {customTags.map((tag) => (
                  <Badge key={tag} variant="muted" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full hover:text-destructive"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </details>

        <details className="mt-3 group">
          <summary className="cursor-pointer list-none border-t border-border pt-3 text-xs font-medium text-muted-foreground group-open:text-foreground">
            Queue & review reminder
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" variant={inQueue ? "default" : "outline"} onClick={toggleQueue}>
              <Bookmark className="mr-1.5 h-3.5 w-3.5" />
              {inQueue ? "Queued" : "Add to queue"}
            </Button>
            <Button size="sm" variant={reminder ? "default" : "outline"} onClick={toggleReminder}>
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              {reminder ? "Tomorrow set" : "Review tomorrow"}
            </Button>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
