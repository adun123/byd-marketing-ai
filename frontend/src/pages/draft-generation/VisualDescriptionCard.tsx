import { useEffect, useMemo, useState } from "react";
import { Copy, Sparkles, Trash2, Image as ImageIcon } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  title?: string;
  label?: string;

  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;

  onPolish?: (plainText: string) => void;
};

export default function VisualDescriptionCard({
  title = "Visual Description",
  label = "Detailed Scene Prompt",
  value,
  defaultValue,
  onChange,
  onPolish,
}: Props) {
  const initial = useMemo(() => {
    if (value != null) return value;
    if (defaultValue != null) return defaultValue;

    return `Cinematic 8k shot, modern silver SUV on a futuristic coastal highway at sunset, drone angle, sharp focus, vibrant colors, automotive photography style. Ensure the lighting emphasizes the car's aerodynamic lines. The background should show a blend of nature and modern infrastructure. Atmosphere is hopeful and aspirational.`;
  }, [defaultValue, value]);

  const [text, setText] = useState(initial);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (value == null) return;
    setText(value);
  }, [value]);

  function setBoth(v: string) {
    if (value == null) setText(v);
    onChange?.(v);
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 900);
    } catch {
      // ignore
    }
  }

  return (
    <div>
      {/* Title */}
      <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-50">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
          <ImageIcon className="h-4 w-4" />
        </span>
        {title}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Prompt
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onCopy}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition",
                "border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950",
                "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/20"
              )}
              title="Copy"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy"}
            </button>

            <button
              type="button"
              onClick={() => setBoth("")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition",
                "border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950",
                "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/20"
              )}
              title="Clear"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>

            <button
              type="button"
              onClick={() => onPolish?.(text)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                "bg-gradient-to-r from-[#068773] to-[#0fb9a8] hover:brightness-105 active:brightness-95"
              )}
              title="Polish with AI"
            >
              <Sparkles className="h-4 w-4" />
              Polish
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {label}
          </div>

          <textarea
            value={text}
            onChange={(e) => setBoth(e.target.value)}
            placeholder="Write a detailed visual prompt… (camera, lighting, mood, location)"
            className={cn(
              "mt-3 w-full resize-none rounded-2xl border px-4 py-3",
              "border-slate-200/80 dark:border-slate-800/80",
              "bg-slate-50 dark:bg-slate-950",
              "text-[13px] leading-relaxed text-slate-800 dark:text-slate-100",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "outline-none transition",
              "focus:border-[#068773]/35 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#068773]/15",
              // ✅ scrollable so it won't be too tall
              "min-h-[220px] max-h-[360px] overflow-y-auto"
            )}
          />

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Tip: include camera angle, lighting, mood, and environment.</span>
            <span className="font-medium">{text.trim().length} chars</span>
          </div>
        </div>
      </div>
    </div>
  );
}
