// src/pages/preview-generation/PreviewMetaPanel.tsx
import * as React from "react";
import { Tag, Users, MonitorSmartphone, LayoutTemplate } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type RowProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

function MetaRow({ label, value, icon }: RowProps) {
  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-slate-200">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            {label}
          </div>
          <div className="mt-1 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  topic: string;
  targetAudience: string;
  platformLabel: string;
  formatLabel: string;
};

export default function PreviewMetaPanel({
  topic,
  targetAudience,
  platformLabel,
  formatLabel,
}: Props) {
  
   function humanizeTerm(term: string) {
    return term
      // spasi sebelum huruf besar
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // spasi sebelum angka
      .replace(/([a-zA-Z])([0-9])/g, "$1 $2")
      // kapital di awal
      .replace(/^./, (s) => s.toUpperCase());
  }
  const topicPretty = topic
  .split(",")
  .map((t) => humanizeTerm(t.trim()))
  .filter(Boolean)
  .join(", ");
  return (
    <aside className="h-fit">
      {/* PANEL container (tidak full height) */}
      <div
        className={cn(
          "rounded-3xl border border-slate-200/70 dark:border-slate-800/70",
          "bg-white/60 dark:bg-slate-900/30",
          "p-4"
        )}
      >
        <div className="px-1">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            Content Metadata
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <MetaRow label="Topic" value={topicPretty} icon={<Tag className="h-4 w-4" />} />
          <MetaRow
            label="Target Audience"
            value={targetAudience}
            icon={<Users className="h-4 w-4" />}
          />
          <MetaRow
            label="Platform"
            value={platformLabel}
            icon={<MonitorSmartphone className="h-4 w-4" />}
          />
          <MetaRow
            label="Format"
            value={formatLabel}
            icon={<LayoutTemplate className="h-4 w-4" />}
          />
        </div>
      </div>
    </aside>
  );
}

