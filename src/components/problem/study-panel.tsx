"use client";

import { useEffect, useState, useRef } from "react";
import { getUserStore, type ProgressStatus } from "@/lib/user/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Bookmark, Tag, Calendar, Plus, X, Save, RotateCcw } from "lucide-react";

interface StudyPanelProps {
  slug: string;
  title: string;
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const state = getUserStore().getState();
    const progress = state.progress[slug];
    if (progress) {
      setNotes(progress.notes);
      setCustomTags(progress.customTags);
      setTimeSpent(progress.timeSpent);
      setStatus(progress.status);
      setConfidence(progress.confidence);
    }
    setInQueue(state.studyQueue.includes(slug));
    setReminder(state.reminders[slug] || null);
  }, [slug]);

  useEffect(() => {
    if (isTimerRunning) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (elapsed > 0) {
          getUserStore().updateTimeSpent(slug, elapsed);
        }
        startTimeRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, slug]);

  function saveNotes() {
    getUserStore().setProgress(slug, { notes });
  }

  function addTag() {
    if (!newTag.trim()) return;
    getUserStore().addCustomTag(slug, newTag.trim().toLowerCase());
    setCustomTags((prev) => [...prev, newTag.trim().toLowerCase()]);
    setNewTag("");
  }

  function removeTag(tag: string) {
    getUserStore().removeCustomTag(slug, tag);
    setCustomTags((prev) => prev.filter((t) => t !== tag));
  }

  function toggleQueue() {
    if (inQueue) {
      getUserStore().removeFromStudyQueue(slug);
    } else {
      getUserStore().addToStudyQueue(slug);
    }
    setInQueue(!inQueue);
  }

  function setOneDayReminder() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    getUserStore().setReminder(slug, tomorrow.toISOString());
    setReminder(tomorrow.toISOString());
  }

  function clearReminderAction() {
    getUserStore().clearReminder(slug);
    setReminder(null);
  }

  function logAttempt(newStatus: ProgressStatus, newConfidence: number) {
    getUserStore().logAttempt(slug, newStatus, newConfidence);
    setStatus(newStatus);
    setConfidence(newConfidence);
  }

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}h ${m}m ${s}s`;
    } else if (m > 0) {
      return `${m}m ${s}s`;
    }
    return `${s}s`;
  }

  return (
    <div className="space-y-4">
      {/* Timer */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Spent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-mono font-bold">{formatTime(timeSpent)}</span>
            <Button
              size="sm"
              variant={isTimerRunning ? "destructive" : "default"}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? "Stop" : "Start"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Save className="h-4 w-4" />
            Personal Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your personal notes, insights, or reminders..."
            className="w-full min-h-[120px] text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary resize-y"
          />
          <Button size="sm" onClick={saveNotes} className="w-full">
            Save Notes
          </Button>
        </CardContent>
      </Card>

      {/* Custom Tags */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Custom Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              className="flex-1 text-sm bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />
            <Button size="sm" variant="outline" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {customTags.map((tag) => (
              <Badge key={tag} variant="muted" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Queue */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Study Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            size="sm"
            variant={inQueue ? "default" : "outline"}
            onClick={toggleQueue}
            className="w-full"
          >
            {inQueue ? "Remove from Queue" : "Add to Queue"}
          </Button>
        </CardContent>
      </Card>

      {/* Reminder */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Review Reminder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {reminder ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Set for: {new Date(reminder).toLocaleDateString()}
              </span>
              <Button size="sm" variant="outline" onClick={clearReminderAction}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={setOneDayReminder} className="w-full">
              Remind me tomorrow
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Attempt Log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Quick Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant={status === "solved" ? "default" : "outline"}
              onClick={() => logAttempt("solved", 5)}
            >
              Solved
            </Button>
            <Button
              size="sm"
              variant={status === "attempted" ? "default" : "outline"}
              onClick={() => logAttempt("attempted", 3)}
            >
              Attempted
            </Button>
            <Button
              size="sm"
              variant={status === "review" ? "default" : "outline"}
              onClick={() => logAttempt("review", 2)}
            >
              Needs Review
            </Button>
          </div>
          {confidence > 0 && (
            <p className="text-xs text-muted-foreground">
              Confidence: {confidence}/5
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}