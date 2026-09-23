/**
 * Local-first user store. Cloud sync can implement the same interface later.
 */

export type ProgressStatus = "todo" | "attempted" | "solved" | "review";

export interface ProblemProgress {
  status: ProgressStatus;
  confidence: number;
  notes: string;
  lastSeen: string;
  timeSpent: number;
  attempts: AttemptRecord[];
  customTags: string[];
}

export interface AttemptRecord {
  timestamp: string;
  status: ProgressStatus;
  confidence: number;
}

export interface UserState {
  bookmarks: string[];
  progress: Record<string, ProblemProgress>;
  streak: { current: number; lastDate: string | null };
  studyQueue: string[];
  reminders: Record<string, string>;
  version: number;
}

export interface UserStore {
  getState(): UserState;
  toggleBookmark(slug: string): UserState;
  setProgress(slug: string, patch: Partial<ProblemProgress>): UserState;
  recordActivity(): UserState;
  addToStudyQueue(slug: string): UserState;
  removeFromStudyQueue(slug: string): UserState;
  setReminder(slug: string, date: string): UserState;
  clearReminder(slug: string): UserState;
  addCustomTag(slug: string, tag: string): UserState;
  removeCustomTag(slug: string, tag: string): UserState;
  logAttempt(slug: string, status: ProgressStatus, confidence: number): UserState;
  updateTimeSpent(slug: string, seconds: number): UserState;
  sync?(): Promise<void>;
}

const STORAGE_KEY = "algoforge:user:v1";

const emptyProgress = (): ProblemProgress => ({
  status: "todo",
  confidence: 0,
  notes: "",
  lastSeen: new Date().toISOString(),
  timeSpent: 0,
  attempts: [],
  customTags: [],
});

const defaultState = (): UserState => ({
  bookmarks: [],
  progress: {},
  streak: { current: 0, lastDate: null },
  studyQueue: [],
  reminders: {},
  version: 1,
});

function normalizeState(input: unknown): UserState {
  const parsed = input && typeof input === "object" ? (input as Partial<UserState>) : {};
  const rawProgress = parsed.progress && typeof parsed.progress === "object" ? parsed.progress : {};

  const progress = Object.fromEntries(
    Object.entries(rawProgress).map(([slug, value]) => {
      const item = value && typeof value === "object" ? (value as Partial<ProblemProgress>) : {};
      return [
        slug,
        {
          ...emptyProgress(),
          ...item,
          confidence:
            typeof item.confidence === "number"
              ? Math.max(0, Math.min(5, Math.floor(item.confidence)))
              : 0,
          attempts: Array.isArray(item.attempts) ? item.attempts : [],
          customTags: Array.isArray(item.customTags)
            ? item.customTags.filter((tag): tag is string => typeof tag === "string")
            : [],
          timeSpent:
            typeof item.timeSpent === "number" && Number.isFinite(item.timeSpent)
              ? Math.max(0, Math.floor(item.timeSpent))
              : 0,
        },
      ];
    }),
  );

  const streak =
    parsed.streak && typeof parsed.streak === "object"
      ? parsed.streak
      : defaultState().streak;

  return {
    ...defaultState(),
    ...parsed,
    bookmarks: Array.isArray(parsed.bookmarks)
      ? [...new Set(parsed.bookmarks.filter((v): v is string => typeof v === "string"))]
      : [],
    progress,
    streak: {
      current:
        typeof streak.current === "number"
          ? Math.max(0, Math.floor(streak.current))
          : 0,
      lastDate: typeof streak.lastDate === "string" ? streak.lastDate : null,
    },
    studyQueue: Array.isArray(parsed.studyQueue)
      ? [...new Set(parsed.studyQueue.filter((v): v is string => typeof v === "string"))]
      : [],
    reminders:
      parsed.reminders && typeof parsed.reminders === "object"
        ? Object.fromEntries(
            Object.entries(parsed.reminders).filter(([, value]) => typeof value === "string"),
          )
        : {},
    version: 1,
  };
}

function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export class LocalStorageUserStore implements UserStore {
  getState(): UserState {
    if (typeof window === "undefined") return defaultState();

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return normalizeState(JSON.parse(raw));
    } catch {
      return defaultState();
    }
  }

  private save(state: UserState): UserState {
    if (typeof window === "undefined") return state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable or full; keep the in-memory state usable.
    }
    return state;
  }

  toggleBookmark(slug: string): UserState {
    const state = this.getState();
    const set = new Set(state.bookmarks);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    return this.save({ ...state, bookmarks: [...set] });
  }

  setProgress(slug: string, patch: Partial<ProblemProgress>): UserState {
    const state = this.getState();
    const previous = state.progress[slug] ?? emptyProgress();
    return this.save({
      ...state,
      progress: {
        ...state.progress,
        [slug]: {
          ...previous,
          ...patch,
          confidence:
            typeof patch.confidence === "number"
              ? Math.max(0, Math.min(5, Math.floor(patch.confidence)))
              : previous.confidence,
          lastSeen: new Date().toISOString(),
        },
      },
    });
  }

  recordActivity(): UserState {
    const state = this.getState();
    const today = todayKey();
    if (state.streak.lastDate === today) return state;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = todayKey(yesterday);
    const current =
      state.streak.lastDate === yesterdayKey ? state.streak.current + 1 : 1;

    return this.save({
      ...state,
      streak: { current, lastDate: today },
    });
  }

  addToStudyQueue(slug: string): UserState {
    const state = this.getState();
    if (state.studyQueue.includes(slug)) return state;
    return this.save({ ...state, studyQueue: [...state.studyQueue, slug] });
  }

  removeFromStudyQueue(slug: string): UserState {
    const state = this.getState();
    return this.save({
      ...state,
      studyQueue: state.studyQueue.filter((item) => item !== slug),
    });
  }

  setReminder(slug: string, date: string): UserState {
    if (Number.isNaN(Date.parse(date))) return this.getState();
    const state = this.getState();
    return this.save({ ...state, reminders: { ...state.reminders, [slug]: date } });
  }

  clearReminder(slug: string): UserState {
    const state = this.getState();
    const reminders = { ...state.reminders };
    delete reminders[slug];
    return this.save({ ...state, reminders });
  }

  addCustomTag(slug: string, tag: string): UserState {
    const normalizedTag = tag.trim().toLowerCase();
    if (!normalizedTag) return this.getState();

    const state = this.getState();
    const previous = state.progress[slug] ?? emptyProgress();
    const customTags = previous.customTags.includes(normalizedTag)
      ? previous.customTags
      : [...previous.customTags, normalizedTag];

    return this.save({
      ...state,
      progress: {
        ...state.progress,
        [slug]: { ...previous, customTags, lastSeen: new Date().toISOString() },
      },
    });
  }

  removeCustomTag(slug: string, tag: string): UserState {
    const state = this.getState();
    const previous = state.progress[slug];
    if (!previous) return state;

    return this.save({
      ...state,
      progress: {
        ...state.progress,
        [slug]: {
          ...previous,
          customTags: previous.customTags.filter((item) => item !== tag),
          lastSeen: new Date().toISOString(),
        },
      },
    });
  }

  logAttempt(slug: string, status: ProgressStatus, confidence: number): UserState {
    const state = this.getState();
    const previous = state.progress[slug] ?? emptyProgress();
    const nextConfidence = Math.max(0, Math.min(5, Math.floor(confidence)));
    const now = new Date().toISOString();
    const attempt: AttemptRecord = {
      timestamp: now,
      status,
      confidence: nextConfidence,
    };

    const saved = this.save({
      ...state,
      progress: {
        ...state.progress,
        [slug]: {
          ...previous,
          attempts: [...previous.attempts, attempt],
          status,
          confidence: nextConfidence,
          lastSeen: now,
        },
      },
    });

    return this.recordActivityFromState(saved);
  }

  private recordActivityFromState(state: UserState): UserState {
    const today = todayKey();
    if (state.streak.lastDate === today) return state;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const current =
      state.streak.lastDate === todayKey(yesterday)
        ? state.streak.current + 1
        : 1;

    return this.save({
      ...state,
      streak: { current, lastDate: today },
    });
  }

  updateTimeSpent(slug: string, seconds: number): UserState {
    const state = this.getState();
    const previous = state.progress[slug] ?? emptyProgress();
    const safeSeconds = Number.isFinite(seconds)
      ? Math.max(0, Math.floor(seconds))
      : 0;
    if (safeSeconds <= 0) return state;

    return this.save({
      ...state,
      progress: {
        ...state.progress,
        [slug]: {
          ...previous,
          timeSpent: previous.timeSpent + safeSeconds,
          lastSeen: new Date().toISOString(),
        },
      },
    });
  }
}

let clientStore: LocalStorageUserStore | null = null;

export function getUserStore(): UserStore {
  if (typeof window === "undefined") {
    return {
      getState: defaultState,
      toggleBookmark: () => defaultState(),
      setProgress: () => defaultState(),
      recordActivity: () => defaultState(),
      addToStudyQueue: () => defaultState(),
      removeFromStudyQueue: () => defaultState(),
      setReminder: () => defaultState(),
      clearReminder: () => defaultState(),
      addCustomTag: () => defaultState(),
      removeCustomTag: () => defaultState(),
      logAttempt: () => defaultState(),
      updateTimeSpent: () => defaultState(),
    };
  }

  if (!clientStore) clientStore = new LocalStorageUserStore();
  return clientStore;
}
