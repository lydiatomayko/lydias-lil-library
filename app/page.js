import { books } from "./data/books";

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

function StatusTag({ status }) {
  const config = STATUS_STYLES[status] ?? {
    label: status,
    className:
      "bg-stone-200 text-stone-700 ring-1 ring-stone-300/80",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.14em] ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-full bg-[#f3ebe1] text-[#2c241c]">
      <header className="border-b border-[#ddcbb8]/90 bg-[#faf5ee]/85 backdrop-blur-[2px]">
        <div className="mx-auto max-w-2xl px-6 py-12 sm:py-14">
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
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12 sm:py-14">
        <ol className="flex flex-col gap-9">
          {books.map((book, index) => (
            <li key={`${book.title}-${book.author}-${index}`}>
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
                  <StatusTag status={book.status} />
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
