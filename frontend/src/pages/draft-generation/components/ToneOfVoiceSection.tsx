import { SlidersHorizontal } from "lucide-react";
import { cn } from "../../../lib/cn";

type Props = {
  tone: string;
  setTone: (v: string) => void;
  options?: string[];
  label?: string;
};

const defaultOptions = [
  "Professional & Authoritative",
  "Friendly & Conversational",
  "Bold & Energetic",
  "Calm & Informative",
];

export default function ToneOfVoiceSection({
  tone,
  setTone,
  options = defaultOptions,
  label = "Tone of Voice",
}: Props) {
  return (
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#068773]/10 text-[#068773]">
          <SlidersHorizontal className="h-3 w-3" />
        </span>
        {label}
      </div>

      {/* Select */}
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className={cn(
          "h-10 w-full rounded-2xl border px-3 text-[12px] font-semibold",
          "border-slate-200/80 dark:border-slate-800/80",
          "bg-white dark:bg-slate-950",
          "text-slate-900 dark:text-slate-100",
          "outline-none transition",
          "focus:border-[#068773]/35 focus:ring-2 focus:ring-[#068773]/15"
        )}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white dark:bg-slate-950">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
