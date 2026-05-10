"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import { books as seedBooks } from "./data/books";

const STORAGE_KEY = "lydias-lil-library-books";

const STATUS_STYLES = {
  finished: {
    label: "Finished",
    className:
      "bg-[#e5cfc0] text-[#5a3829] ring-1 ring-[#c49a7e]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
  },
  reading: {
    label: "Reading",
    className:
      "bg-[#e8ddaa] text-[#6b5422] ring-1 ring-[#c9b76e]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
  },
  "want to read": {
    label: "Want to read",
    className:
      "bg-[#c9ddd0] text-[#2f4a3c] ring-1 ring-[#8fb5a2]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
  },
};

const STATUS_ORDER = ["finished", "reading", "want to read"];

function statusPillClass(status) {
  const config = STATUS_STYLES[status];
  return config?.className ?? "bg-stone-200 text-stone-700 ring-1 ring-stone-300/80";
}

function normalizeBook(raw) {
  const status =
    typeof raw?.status === "string" && raw.status in STATUS_STYLES
      ? raw.status
      : "want to read";
  return {
    id:
      typeof raw?.id === "string" && raw.id.trim()
        ? raw.id
        : typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `book-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: typeof raw?.title === "string" ? raw.title : "",
    author: typeof raw?.author === "string" ? raw.author : "",
    status,
    thoughts:
      raw?.thoughts != null && raw.thoughts !== ""
        ? String(raw.thoughts)
        : "",
  };
}

function normalizeList(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  return raw.map(normalizeBook);
}

function StatusSelect({ value, onChange, id }) {
  const pill = statusPillClass(value);

  return (
    <div className="relative shrink-0">
      <select
        id={id}
        value={value in STATUS_STYLES ? value : "want to read"}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Book status"
        className={`cursor-pointer appearance-none rounded-full py-0.5 pl-3 pr-8 text-[0.65rem] font-medium uppercase tracking-[0.14em] outline-none transition-[box-shadow,ring] focus-visible:ring-2 focus-visible:ring-[#a08068] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf9] ${pill}`}
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_STYLES[s].label}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.5rem] text-current opacity-60"
        aria-hidden
      >
        ▼
      </span>
    </div>
  );
}

export default function Home() {
  const [bookList, setBookList] = useState(() => seedBooks.map(normalizeBook));
  const [hydrated, setHydrated] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newStatus, setNewStatus] = useState("want to read");
  const [newThoughts, setNewThoughts] = useState("");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const list = normalizeList(JSON.parse(raw));
          if (list) setBookList(list);
        }
      } catch {
        /* keep seed */
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList));
    } catch {
      /* quota or private mode */
    }
  }, [bookList, hydrated]);

  const updateBookStatus = useCallback((id, status) => {
    setBookList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  }, []);

  const handleAddBook = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    const author = newAuthor.trim();
    if (!title || !author) {
      setAddError("Title and author are required.");
      return;
    }
    setAddError("");
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `book-${Date.now()}`;
    setBookList((prev) => [
      {
        id,
        title,
        author,
        status: newStatus in STATUS_STYLES ? newStatus : "want to read",
        thoughts: newThoughts.trim(),
      },
      ...prev,
    ]);
    setNewTitle("");
    setNewAuthor("");
    setNewStatus("want to read");
    setNewThoughts("");
    setShowAdd(false);
  };

  return (
    <div className="min-h-full bg-[#f3ebe1] text-[#2c241c]">
      <header className="border-b border-[#ddcbb8]/90 bg-[#faf5ee]/85 backdrop-blur-[2px]">
        <div className="mx-auto max-w-2xl px-6 py-12 sm:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[#8a7365]">
                Personal shelf
              </p>
              <h1 className="mt-3 font-normal text-[2.15rem] leading-tight tracking-tight text-[#1f1711] sm:text-[2.45rem]">
                Lydia&apos;s Lil Library
              </h1>
              <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-[#5c4d42]">
                books i&apos;ve read, am reading, and want to read.
              </p>
            </div>
            <div className="shrink-0 sm:pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowAdd((v) => !v);
                  setAddError("");
                }}
                className="rounded-full border border-[#c9b8a8] bg-[#fffdf9] px-4 py-2 text-[0.8rem] font-medium tracking-wide text-[#4a3d34] shadow-sm transition-[background,box-shadow] hover:bg-[#faf5ee] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a08068]"
              >
                {showAdd ? "Close" : "Add book"}
              </button>
            </div>
          </div>

          {showAdd ? (
            <form
              onSubmit={handleAddBook}
              className="mt-8 rounded-[2px] border border-[#e8dcd0] bg-[#fffdf9] p-5 shadow-[0_8px_28px_-12px_rgba(62,47,34,0.25)] sm:p-6"
            >
              <p className="text-[0.85rem] uppercase tracking-[0.12em] text-[#8a7365]">
                New entry
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[0.8rem] text-[#6b5a4d]">
                    Title
                  </span>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-sm border border-[#ddcbb8] bg-[#faf8f4] px-3 py-2 text-[1rem] text-[#2c241c] outline-none ring-0 transition-[border,box-shadow] placeholder:text-[#a89488] focus:border-[#b89a80] focus:shadow-[inset_0_0_0_1px_rgba(184,154,128,0.35)]"
                    placeholder="Book title"
                    autoComplete="off"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[0.8rem] text-[#6b5a4d]">
                    Author
                  </span>
                  <input
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full rounded-sm border border-[#ddcbb8] bg-[#faf8f4] px-3 py-2 text-[1rem] text-[#2c241c] outline-none placeholder:text-[#a89488] focus:border-[#b89a80] focus:shadow-[inset_0_0_0_1px_rgba(184,154,128,0.35)]"
                    placeholder="Author name"
                    autoComplete="off"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[0.8rem] text-[#6b5a4d]">
                    Status
                  </span>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full cursor-pointer rounded-sm border border-[#ddcbb8] bg-[#faf8f4] px-3 py-2 text-[0.95rem] text-[#2c241c] outline-none focus:border-[#b89a80] focus:shadow-[inset_0_0_0_1px_rgba(184,154,128,0.35)]"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_STYLES[s].label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[0.8rem] text-[#6b5a4d]">
                    Thoughts{" "}
                    <span className="font-normal normal-case text-[#a89488]">
                      (optional)
                    </span>
                  </span>
                  <textarea
                    value={newThoughts}
                    onChange={(e) => setNewThoughts(e.target.value)}
                    rows={3}
                    className="w-full resize-y rounded-sm border border-[#ddcbb8] bg-[#faf8f4] px-3 py-2 text-[0.95rem] leading-relaxed text-[#2c241c] outline-none placeholder:text-[#a89488] focus:border-[#b89a80] focus:shadow-[inset_0_0_0_1px_rgba(184,154,128,0.35)]"
                    placeholder="A line or two for your journal…"
                  />
                </label>
              </div>
              {addError ? (
                <p className="mt-3 text-[0.85rem] text-[#8b4a3c]" role="alert">
                  {addError}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#4a3d34] px-5 py-2 text-[0.85rem] font-medium tracking-wide text-[#faf5ee] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a3d34]"
                >
                  Save to shelf
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdd(false);
                    setAddError("");
                  }}
                  className="rounded-full border border-transparent px-3 py-2 text-[0.85rem] text-[#6b5a4d] underline-offset-4 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12 sm:py-14">
        <ol className="flex flex-col gap-9">
          {bookList.map((book) => (
            <li key={book.id}>
              <article className="group relative rounded-[2px] bg-[#fffdf9] p-6 shadow-[0_1px_0_rgba(44,36,28,0.06),0_12px_40px_-18px_rgba(62,47,34,0.35)] ring-1 ring-[#e8dcd0] transition-[box-shadow,transform] duration-300 hover:shadow-[0_1px_0_rgba(44,36,28,0.08),0_16px_48px_-16px_rgba(62,47,34,0.42)] sm:p-7">
                <div className="absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-[#d4b896]/40 to-transparent sm:top-7 sm:bottom-7" />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[1.35rem] font-normal leading-snug tracking-tight text-[#1a1410] sm:text-[1.45rem]">
                      {book.title}
                    </h2>
                    <p className="mt-1.5 text-[0.95rem] italic text-[#6b5a4d]">
                      {book.author}
                    </p>
                  </div>
                  <StatusSelect
                    id={`status-${book.id}`}
                    value={book.status}
                    onChange={(status) => updateBookStatus(book.id, status)}
                  />
                </div>
                {book.thoughts ? (
                  <blockquote className="mt-5 border-l-[3px] border-[#ddcbb8]/90 pl-4 text-[0.92rem] leading-[1.65] text-[#7d6c62]">
                    {book.thoughts}
                  </blockquote>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
