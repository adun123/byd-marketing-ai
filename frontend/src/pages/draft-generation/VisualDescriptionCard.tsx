import { useEffect, useMemo, useState } from "react";
import { Copy, Sparkles, Trash2 } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  title?: string;
  label?: string;

  value?: string; // controlled
  defaultValue?: string; // uncontrolled initial
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
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="">
      <div className="flex py-3 items-center pt-5 gap-2 text-sm font-semibold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
            🖼
          </span>
          {title}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_-26px_rgba(15,23,42,0.20)]">
            {/* header */}
            <div className="flex items-center justify-center-safe gap-3 border-b border-slate-100 px-5 py-4">
                

                {/* tools */}
                <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onCopy}
                    className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2",
                    "text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                    )}
                    title="Copy"
                >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied" : "Copy"}
                </button>

                <button
                    type="button"
                    onClick={() => setBoth("")}
                    className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2",
                    "text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                    )}
                    title="Clear"
                >
                    <Trash2 className="h-4 w-4" />
                    Clear
                </button>

                <button
                    type="button"
                    onClick={() => onPolish?.(text)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-emerald-600/25"
                    title="Polish with AI"
                >
                    <Sparkles className="h-4 w-4" />
                    Polish
                </button>
                </div>
            </div>

            
        <div className="px-5 py-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {label}
            </div>

            <textarea
            value={text}
            onChange={(e) => setBoth(e.target.value)}
            placeholder="Tuliskan prompt visual di sini..."
            className={cn(
                "mt-3 min-h-[260px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4",
                "text-sm leading-relaxed text-slate-800 outline-none transition",
                "focus:border-emerald-600/30 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
            )}
            />

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Tip: pakai detail kamera, lighting, mood, dan lokasi.</span>
            <span className="font-medium">{text.trim().length} chars</span>
            </div>
        </div>
      </div>
      

    </div>
  );
}
