

type Mode = "snapshot" | "brainstorm";

export default function ModeTabs({
  mode,
  onChange,
  hasIdeas,
  hasSnapshot,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
  hasIdeas: boolean;
  hasSnapshot: boolean;
}) {
  const indicatorLeft = mode === "snapshot" ? "left-1" : "left-1/2";

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-2 shadow-[0_1px_0_0_rgba(15,23,42,0.04)] backdrop-blur">
      <div className="relative flex items-center rounded-2xl bg-slate-50 p-1">
        <div
          className={[
            "pointer-events-none absolute top-1 bottom-1 w-1/2 rounded-xl transition-all duration-200",
            indicatorLeft,
            "bg-gradient-to-r from-[#068773] to-[#0fb9a8]",
            "shadow-[0_10px_26px_-18px_rgba(6,135,115,0.7)]",
          ].join(" ")}
        />

        <button
          type="button"
          onClick={() => onChange("snapshot")}
          className={[
            "relative z-10 flex-1 rounded-xl px-3 py-2 text-[12px] font-semibold transition",
            "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
            mode === "snapshot" ? "text-white" : "text-slate-700 hover:text-slate-900",
          ].join(" ")}
        >
          Trend Snapshot
        </button>

        <button
          type="button"
          onClick={() => onChange("brainstorm")}
          className={[
            "relative z-10 flex-1 rounded-xl px-3 py-2 text-[12px] font-semibold transition",
            "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
            mode === "brainstorm" ? "text-white" : "text-slate-700 hover:text-slate-900",
          ].join(" ")}
        >
          Brainstorm
        </button>
      </div>

      {!hasSnapshot && mode === "snapshot" ? (
        <div className="mt-2 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-600">
          Snapshot belum tersedia. Klik{" "}
          <span className="font-semibold text-slate-800">Lihat Trend Snapshot</span>{" "}
          untuk mengambil data.
        </div>
      ) : null}

      {!hasIdeas && mode === "brainstorm" ? (
        <div className="mt-2 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-600">
          Belum ada ide. Jalankan <span className="font-semibold text-slate-800">Brainstorm</span>{" "}
          dari panel kiri untuk generate ide.
        </div>
      ) : null}
    </div>
  );
}
