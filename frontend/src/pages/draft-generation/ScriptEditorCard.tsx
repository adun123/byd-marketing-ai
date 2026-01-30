import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Loader2, Copy, Trash2 } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  title?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  onPolish?: (plainText: string) => void;
  isLoading?: boolean;
};

export default function ScriptEditorCard({
  title = "Storyline & Script",
  value,
  defaultValue,
  onChange,
  onPolish,
  isLoading = false,
}: Props) {
  const initialHtml = useMemo(() => {
    if (value != null) return value;
    if (defaultValue) return defaultValue;

    return `
      <div>
        <div style="color:#068773;font-weight:800;letter-spacing:.18em;font-size:10px;text-transform:uppercase;">Slide 1 — Hook</div>
        <p style="margin-top:8px;">
          Open with a high-energy shot of the Haka SUV navigating a winding coastal road at dawn.
        </p>
      </div>
    `;
  }, [defaultValue, value]);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState(initialHtml);

  useEffect(() => {
    if (value == null) return;
    setHtml(value);
  }, [value]);

  function setBoth(v: string) {
    if (value == null) setHtml(v);
    onChange?.(v);
  }

  function handleInput() {
    if (isLoading) return;
    if (!editorRef.current) return;
    setBoth(editorRef.current.innerHTML);
  }

  async function handleCopy() {
    const plain = editorRef.current?.innerText || "";
    if (!plain.trim()) return;
    try {
      await navigator.clipboard.writeText(plain);
    } catch {
      // ignore (browser permission)
    }
  }

  function handleClear() {
    if (isLoading) return;
    setBoth(`<p></p>`);
    if (editorRef.current) editorRef.current.innerHTML = `<p></p>`;
  }

  return (
    <div>
      {/* Title */}
      <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-50">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
          ▤
        </span>
        {title}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
        {/* shimmer overlay */}
        {isLoading && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/70 to-transparent dark:via-slate-800/50 animate-[shimmer_1.15s_infinite]" />
          </div>
        )}

        {/* Toolbar */}
        <div
          className={cn(
            "relative flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 px-4 py-3",
            isLoading && "opacity-70"
          )}
        >
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Editor
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition",
                "border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950",
                "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
                isLoading && "cursor-not-allowed opacity-70"
              )}
              title="Copy text"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleClear}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition",
                "border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950",
                "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
                isLoading && "cursor-not-allowed opacity-70"
              )}
              title="Clear editor"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => onPolish?.(editorRef.current?.innerText || "")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                isLoading
                  ? "cursor-wait bg-[#068773]"
                  : "bg-gradient-to-r from-[#068773] to-[#0fb9a8] hover:brightness-105 active:brightness-95"
              )}
              title="Polish with AI"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isLoading ? "Generating…" : "Polish"}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="relative px-4 py-4">
          {isLoading ? (
            <div className="min-h-[240px] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
              <div className="h-3.5 w-[92%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[78%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[70%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[86%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[62%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[74%] rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          ) : (
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              dangerouslySetInnerHTML={{ __html: html }}
              className={cn(
                // height & scroll
                "min-h-[220px] max-h-[360px] overflow-y-auto",

                // base
                "rounded-2xl border px-4 py-3",
                "border-slate-200/80 dark:border-slate-800/80",
                "bg-slate-50 dark:bg-slate-950",

                // text
                "text-[13px] leading-relaxed text-slate-800 dark:text-slate-100",

                // interaction
                "outline-none transition",
                "focus:border-[#068773]/35 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#068773]/15",

                // scrollbar polish (optional but sexy)
                "scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent"
              )}
            />

          )}

          <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
            {isLoading
              ? "AI is refining your storyline…"
              : "Tip: paste hooks, then polish with AI for tone & clarity."}
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-60%); opacity: .35; }
            60% { opacity: .55; }
            100% { transform: translateX(160%); opacity: .35; }
          }
        `}</style>
      </div>
    </div>
  );
}
