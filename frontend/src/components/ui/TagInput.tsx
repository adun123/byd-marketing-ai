import { useMemo, useState } from "react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  label?: string;
  hint?: string;
  placeholder?: string;
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
};

export default function TagInput({
  label = "Terms",
  hint = "Tekan Enter untuk menambahkan",
  placeholder = "Tambah term…",
  value,
  onChange,
  max = 20,
}: Props) {
  const [text, setText] = useState("");

  const normalized = useMemo(
    () => value.map((v) => v.trim()).filter(Boolean),
    [value]
  );

  function removeTag(tag: string) {
    onChange(normalized.filter((t) => t !== tag));
  }

  function addTag(raw: string) {
    const v = raw.trim();
    if (!v) return;
    if (normalized.includes(v)) return;
    if (normalized.length >= max) return;
    onChange([...normalized, v]);
  }

  function onSubmit() {
    addTag(text);
    setText("");
  }



  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
        {label}
      </div>

      {/* “textarea look” container */}
      <div
        className={cn(
          "rounded-2xl border border-slate-200/70 bg-white p-3",
          "outline-none transition focus-within:border-emerald-600/25 focus-within:ring-2 focus-within:ring-emerald-600/10"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {normalized.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-800"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200/60"
                aria-label={`Remove ${t}`}
                title="Hapus"
              >
                ×
              </button>
            </span>
          ))}

          {/* input inline */}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="min-w-[160px] flex-1 bg-transparent px-1 py-1 text-[13px] text-slate-900 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit();
              }
              if (e.key === "Backspace" && !text && normalized.length) {
                // backspace hapus last chip
                removeTag(normalized[normalized.length - 1]);
              }
            }}
          />

          <button
            type="button"
            onClick={onSubmit}
            disabled={!text.trim()}
            className={cn(
              "ml-auto rounded-xl px-3 py-1.5 text-[12px] font-semibold transition",
              text.trim()
                ? "bg-emerald-600 text-white hover:brightness-105"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            )}
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="mt-1 text-[11px] text-slate-500">
        {hint} • {normalized.length}/{max}
      </div>
    </div>
  );
}
