// src/pages/content-generation/OutputPreview.tsx

export default function OutputPreview() {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      Output preview area (placeholder). Nanti di sini bisa muncul:
      <ul className="mt-2 list-disc pl-5 text-sm">
        <li>Grid hasil image / video</li>
        <li>Variations A/B</li>
        <li>Download / Save</li>
        <li>Copy prompt & metadata per channel</li>
      </ul>
    </div>
  );
}
