import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  title?: string;
  defaultValue?: string; // html string
  value?: string; // controlled html
  onChange?: (html: string) => void;
  onPolish?: (plainText: string) => void; // hook ke AI nanti
};

function htmlToText(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.innerText || "";
}

export default function ScriptEditorCard({
  title = "Storyline & Script",
  defaultValue,
  value,
  onChange,
  onPolish,
}: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const initialHtml = useMemo(() => {
    if (value != null) return value;
    if (defaultValue) return defaultValue;

    // fallback content
    return `
      <div>
        <div style="color:#068773;font-weight:700;letter-spacing:.16em;font-size:11px;">[SLIDE 1: HOOK]</div>
        <p style="margin-top:8px;font-style:italic;">
          Open with a high-energy shot of the Haka SUV navigating a winding coastal road at dawn.
          The camera focuses on the sleek LED signature headlights.
        </p>
      </div>
      <div style="margin-top:18px;">
        <div style="color:#068773;font-weight:700;letter-spacing:.16em;font-size:11px;">[SLIDE 2: SAFETY SPECS]</div>
        <p style="margin-top:8px;">
          Narrator: “Safety isn't just a feature; it’s a foundation. With 12 active sensors and AI-assisted collision avoidance,
          Haka keeps your family protected before you even know there’s a risk.”
        </p>
      </div>
      <div style="margin-top:18px;">
        <div style="color:#068773;font-weight:700;letter-spacing:.16em;font-size:11px;">[SLIDE 3: INTERIOR LUXURY]</div>
        <p style="margin-top:8px;">
          Transition to the interior. Focus on the vegan leather stitching and the 15-inch immersive display.
        </p>
      </div>
    `;
  }, [defaultValue, value]);

  const [html, setHtml] = useState<string>(initialHtml);

  // If controlled `value` changes from parent, sync editor.
  useEffect(() => {
    if (value == null) return;
    setHtml(value);
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // on mount set innerHTML (for uncontrolled)
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = html;
  }, []);

  function focusEditor() {
    editorRef.current?.focus();
  }

  function exec(cmd: string, val?: string) {
    focusEditor();
    // eslint-disable-next-line deprecation/deprecation
    document.execCommand(cmd, false, val);
    // pull updated HTML
    const next = editorRef.current?.innerHTML ?? "";
    if (value == null) setHtml(next);
    onChange?.(next);
  }

  function handleInput() {
    const next = editorRef.current?.innerHTML ?? "";
    if (value == null) setHtml(next);
    onChange?.(next);
  }

  function onPolishClick() {
    const current = editorRef.current?.innerHTML ?? html;
    onPolish?.(htmlToText(current));
  }

  return (
    <div className="">
      {/* Title row */}
      <div className="flex items-center gap-2 py-3 pt-5 text-sm font-semibold text-slate-900">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
          ▤
        </span>
        {title}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_-26px_rgba(15,23,42,0.20)]">
        {/* Toolbar row */}
        <div className="mt-4 flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-1">
            <ToolbarButton label="Bold" onClick={() => exec("bold")}>
                B
            </ToolbarButton>
            <ToolbarButton label="Italic" onClick={() => exec("italic")}>
                <span className="italic">I</span>
            </ToolbarButton>
            <ToolbarButton label="Underline" onClick={() => exec("underline")}>
                <span className="underline">U</span>
            </ToolbarButton>

            <div className="mx-2 h-4 w-px bg-slate-200" />

            <ToolbarButton label="Bullet list" onClick={() => exec("insertUnorderedList")}>
                • List
            </ToolbarButton>
            <ToolbarButton label="Numbered list" onClick={() => exec("insertOrderedList")}>
                1. List
            </ToolbarButton>

            <div className="mx-2 h-4 w-px bg-slate-200" />

            <ToolbarButton label="H2" onClick={() => exec("formatBlock", "h2")}>
                H2
            </ToolbarButton>
            <ToolbarButton label="Paragraph" onClick={() => exec("formatBlock", "p")}>
                P
            </ToolbarButton>
            </div>

            <button
            type="button"
            onClick={onPolishClick}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-emerald-600/25"
            >
            <Sparkles className="h-4 w-4" />
            Polish with AI
            </button>
        </div>
        {/* Editor */}
        <div className="px-5 py-4">
            <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className={cn(
                "min-h-[260px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3",
                "text-sm leading-relaxed text-slate-800 outline-none",
                "focus:border-emerald-600/30 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
            )}
            />
            <div className="mt-2 text-[11px] text-slate-500">
            Tip: pilih teks lalu gunakan toolbar untuk format.
            </div>
        </div>
      </div>

      

      
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
<button
    type="button"
    title={label}
    onMouseDown={(e) => {
        // prevent losing selection when clicking toolbar
        e.preventDefault();
    }}
    onClick={onClick}
    className="
        inline-flex items-center justify-center
        rounded-md
        border border-transparent
        px-1.5 py-0.5
        text-[10px] font-medium
        text-slate-500
        transition
        hover:border-slate-200
        hover:bg-white
        hover:text-slate-700
    "
    >
    {children}
    </button>

  );
}
