// src/pages/marketing-dashboard/playground/PinnedIdeasCard.tsx
import { BookmarkX, Pin, X } from "lucide-react";
import type { PinnedItem } from "./types";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function PinnedIdeasCard({
  pinned,
  onRemove,
}: {
  pinned: PinnedItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <aside className="xl:sticky xl:top-20 xl:self-start">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="p-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <Pin className="h-3.5 w-3.5 text-[#068773]" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-900">Pinned</div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Pilihan terbaik untuk diekspor
              </div>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
            {pinned.length}
          </span>
        </div>

        <div className="px-4 pb-4">
          {pinned.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
              <div className="mx-auto grid h-9 w-9 place-items-center rounded-2xl bg-white ring-1 ring-slate-200">
                <BookmarkX className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-2 text-[12px] font-semibold text-slate-900">
                Belum ada pin
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Klik <span className="font-semibold text-slate-700">Pin</span> di item output.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {pinned.map((p) => (
                <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold text-[#068773]">
                        {p.group}
                      </div>
                      <div className="mt-1 text-[12px] text-slate-800 whitespace-pre-wrap">
                        {p.text}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      aria-label="Remove pin"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}
