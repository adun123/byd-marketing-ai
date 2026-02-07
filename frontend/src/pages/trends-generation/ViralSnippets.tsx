// import React from "react";
// import {
//   Instagram,
//   Youtube,
//   Play,
//   ExternalLink,
//   Heart,
//   MessageCircle,
//   Share2,
//   Eye,
// } from "lucide-react";
// import type { ViralSnippet, ViralSnippetSource } from "./types";

// function cn(...s: Array<string | undefined | false | null>) {
//   return s.filter(Boolean).join(" ");
// }

// function iconBySource(src: ViralSnippetSource) {
//   if (src === "instagram") return <Instagram className="h-4 w-4" />;
//   if (src === "youtube") return <Youtube className="h-4 w-4" />;
//   if (src === "tiktok") return <Play className="h-4 w-4" />;
//   return <ExternalLink className="h-4 w-4" />;
// }

// function badgeClass(src: ViralSnippetSource) {
//   // slightly muted for elegance
//   if (src === "youtube") return "bg-rose-600/90 text-white";
//   if (src === "instagram") return "bg-fuchsia-600/90 text-white";
//   if (src === "tiktok") return "bg-slate-900/90 text-white";
//   return "bg-blue-600/90 text-white";
// }

// function formatK(n?: number) {
//   if (typeof n !== "number") return "-";
//   if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
//   return String(n);
// }

// export default function ViralSnippets({
//   items,
//   onViewAll,
// }: {
//   items: ViralSnippet[];
//   onViewAll?: () => void;
// }) {
//   return (
//     <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm">
//       <header className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <div className="flex items-center gap-2">
//             <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
//               Viral Snippets
//             </div>
//             <span className="inline-flex items-center rounded-full border border-[#068773]/20 bg-[#068773]/10 px-2 py-0.5 text-[10px] font-semibold text-[#068773]">
//               Last 24h
//             </span>
//           </div>
//           <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
//             Top engagement dari berbagai platform (preview on hover)
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={onViewAll}
//           className={cn(
//             "rounded-xl px-3 py-2 text-[12px] font-semibold transition",
//             "text-[#068773] hover:bg-[#068773]/10",
//             "focus:outline-none focus:ring-2 focus:ring-[#068773]/20"
//           )}
//         >
//           View All
//         </button>
//       </header>

//       <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//         {items.slice(0, 4).map((it) => {
//           const canOpen = Boolean(it.href);
//           const initial =
//             (it.authorHandle || "?").replace("@", "").slice(0, 1).toUpperCase() || "?";

//           return (
//             <a
//               key={it.id}
//               href={it.href || "#"}
//               target={canOpen ? "_blank" : undefined}
//               rel={canOpen ? "noreferrer" : undefined}
//               aria-disabled={!canOpen}
//               className={cn(
//                 "group relative overflow-hidden rounded-2xl",
//                 "border border-slate-200/80 dark:border-slate-800/80",
//                 "bg-white dark:bg-slate-950",
//                 "transition-all duration-200",
//                 "hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700",
//                 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#068773]/35",
//                 !canOpen && "pointer-events-none opacity-70"
//               )}
//             >
//               {/* THUMB */}
//               <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-800">
//                 {it.thumbUrl ? (
//                   <img
//                     src={it.thumbUrl}
//                     alt={it.title}
//                     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
//                     loading="lazy"
//                   />
//                 ) : (
//                   <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />
//                 )}

//                 {/* subtle dark layer */}
//                 <div
//                   className={cn(
//                     "pointer-events-none absolute inset-0 bg-slate-900/0 transition",
//                     "group-hover:bg-slate-900/35"
//                   )}
//                 />

//                 {/* Preview overlay */}
//                 <div
//                   className={cn(
//                     "pointer-events-none absolute inset-0 flex items-center justify-center",
//                     "opacity-0 translate-y-1 transition duration-200",
//                     "group-hover:opacity-100 group-hover:translate-y-0"
//                   )}
//                 >
//                   <div className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 text-[12px] font-semibold text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
//                     <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[#068773]/10 text-[#068773]">
//                       <Eye className="h-4 w-4" />
//                     </span>
//                     Preview
//                   </div>
//                 </div>

//                 {/* source badge */}
//                 <div
//                   className={cn(
//                     "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-[11px] font-semibold shadow-sm",
//                     badgeClass(it.source)
//                   )}
//                 >
//                   {iconBySource(it.source)}
//                   <span className="sr-only">{it.source}</span>
//                 </div>
//               </div>

//               {/* BODY */}
//               <div className="p-4">
//                 {/* author row */}
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#068773]/10 text-[11px] font-bold text-[#068773]">
//                     {initial}
//                   </div>

//                   <div className="min-w-0">
//                     <div className="truncate text-[12px] font-semibold text-slate-900 dark:text-slate-50">
//                       {it.authorHandle || "Unknown"}
//                     </div>
//                   </div>

//                   <span className="ml-auto hidden rounded-xl bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 md:inline">
//                     24h
//                   </span>
//                 </div>

//                 {/* title */}
//                 <div className="mt-3 line-clamp-2 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
//                   {it.title}
//                 </div>

//                 {/* metrics */}
//                 <div className="mt-4 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300">
//                   <Metric icon={<Heart className="h-3.5 w-3.5" />} label="Likes" value={formatK(it.likes)} />
//                   <Metric
//                     icon={<MessageCircle className="h-3.5 w-3.5" />}
//                     label="Comments"
//                     value={formatK(it.comments)}
//                   />
//                   <Metric icon={<Share2 className="h-3.5 w-3.5" />} label="Shares" value={formatK(it.shares)} />
//                 </div>
//               </div>
//             </a>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

// function Metric({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="inline-flex items-center gap-1.5">
//       <span className="text-slate-500 dark:text-slate-400">{icon}</span>
//       <span className="font-semibold text-slate-900 dark:text-slate-100">{value}</span>
//       <span className="text-slate-500 dark:text-slate-400">{label}</span>
//     </div>
//   );
// }
