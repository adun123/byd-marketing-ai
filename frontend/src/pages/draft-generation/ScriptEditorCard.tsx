import { useEffect, useMemo, useRef, useState } from "react";
import {
  
  Copy,
  Trash2,
  Bold,
  Italic,
  Underline,

  Indent,
  Outdent,
  Smile,
} from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  title?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  onPolish?: (plainText: string) => void;
  isLoading?: boolean;
};

type CmdState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  ol: boolean;
  ul: boolean;
};

export default function ScriptEditorCard({
  title = "Storyline & Script",
  value,
  defaultValue,
  onChange,
  // onPolish,
  isLoading = false,
}: Props) {
 const initialHtml = useMemo(() => {
    if (value != null) return value;
    if (defaultValue) return defaultValue;
    return `
      <div>
        <div style="color:#068773;font-weight:800;letter-spacing:.18em;font-size:10px;text-transform:uppercase;">Slide 1 — Hook</div>
        <p style="margin-top:8px;">
          Open with a high-energy shot of the Haka SUV navigating a winding coastal road at dawn.
        </p>
        <p><br/></p>
      </div>
    `;
  }, [defaultValue, value]);

  const editorRef = useRef<HTMLDivElement | null>(null);
  // const [html, setHtml] = useState(initialHtml);
  // ✅ simpan "last html" di ref, bukan state (biar gak rerender tiap ketik)
  const lastHtmlRef = useRef<string>(initialHtml);

  const [cmd, setCmd] = useState<CmdState>({
    bold: false,
    italic: false,
    underline: false,
    ol: false,
    ul: false,
  });

  const [emojiOpen, setEmojiOpen] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = lastHtmlRef.current || `<p></p>`;
  }, []);

  // ✅ kalau parent mengirim value baru (mis. load/reset), baru kita sync ke DOM
  useEffect(() => {
    if (value == null) return; // uncontrolled: jangan ganggu saat ngetik
    lastHtmlRef.current = value;
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

   function emitChangeFromDom() {
    if (!editorRef.current) return;
    const next = editorRef.current.innerHTML;
    lastHtmlRef.current = next;
    onChange?.(next);
  }

  // function setBoth(v: string) {
  //   if (value == null) setHtml(v);
  //   onChange?.(v);
  // }

  function handleInput() {
    if (isLoading) return;
    emitChangeFromDom();
  }

 async function handleCopy() {
    const plain = editorRef.current?.innerText || "";
    if (!plain.trim()) return;
    try {
      await navigator.clipboard.writeText(plain);
    } catch {}
  }

  function handleClear() {
    if (isLoading) return;
    const empty = `<p></p>`;
    lastHtmlRef.current = empty;
    if (editorRef.current) editorRef.current.innerHTML = empty;
    onChange?.(empty);
  }

  // -------------------------
  // Helpers: command toolbar
  // -------------------------
    function focusEditor() {
    editorRef.current?.focus();
  }

  function exec(command: string, v?: string) {
    if (isLoading) return;
    focusEditor();
    try {
      document.execCommand(command, false, v);
    } catch {}
    // setelah formatting, emit HTML terbaru
    setTimeout(() => {
      emitChangeFromDom();
      refreshCmdState();
    }, 0);
  }

 function insertText(text: string) {
    if (isLoading) return;
    focusEditor();
    const sel = window.getSelection?.();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      emitChangeFromDom();
      refreshCmdState();
      return;
    }
    exec("insertText", text);
  }

  function refreshCmdState() {
    // queryCommandState cukup oke untuk bold/italic/underline
    const next: CmdState = {
      bold: safeQueryState("bold"),
      italic: safeQueryState("italic"),
      underline: safeQueryState("underline"),
      // list kadang tricky: coba pakai queryCommandState juga (works di banyak browser)
      ol: safeQueryState("insertOrderedList"),
      ul: safeQueryState("insertUnorderedList"),
    };
    setCmd(next);
  }

  function safeQueryState(command: string) {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }

  useEffect(() => {
    // update state saat user klik/seleksi
    const onSel = () => refreshCmdState();
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, []);

  // prevent toolbar click from blurring editor (biar selection tetap)
  function keepSelection(e: React.MouseEvent) {
    e.preventDefault();
  }

  const emojis = ["✨", "🔥", "✅", "🎬", "💡", "⚡", "🚗", "📌"];

  function ToolBtn(props: {
    title: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) {
    return (
      <button
        type="button"
        disabled={props.disabled}
        onMouseDown={keepSelection}
        onClick={props.onClick}
        title={props.title}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-2 py-1.5 text-[11px] font-semibold transition",
          "border border-slate-200/80 dark:border-slate-800/80",
          "bg-white dark:bg-slate-950",
          "text-slate-700 dark:text-slate-200",
          "hover:bg-slate-50 dark:hover:bg-slate-800/50",
          "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
          props.active && "border-[#068773]/40 bg-[#068773]/5 text-[#068773] dark:text-emerald-300",
          props.disabled && "cursor-not-allowed opacity-60"
        )}
      >
        {props.children}
      </button>
    );
  }

  return (
    <div>
      {/* Title */}
      <div className="mb-2 flex mt-5 items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-50">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
          ▤
        </span>
        {title}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
        {/* shimmer overlay */}
        {isLoading && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/70 to-transparent dark:via-slate-800/50 animate-[shimmer_1.15s_infinite]" />
          </div>
        )}

        {/* Toolbar */}
        <div
          className={cn(
            "relative flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 px-4 py-3",
            isLoading && "opacity-70"
          )}
        >
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Editor
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Formatting group */}
            <div className="flex items-center gap-1.5">
              <ToolBtn title="Bold" active={cmd.bold} disabled={isLoading} onClick={() => exec("bold")}>
                <Bold className="h-3.5 w-3.5" />
              </ToolBtn>

              <ToolBtn title="Italic" active={cmd.italic} disabled={isLoading} onClick={() => exec("italic")}>
                <Italic className="h-3.5 w-3.5" />
              </ToolBtn>

              <ToolBtn
                title="Underline"
                active={cmd.underline}
                disabled={isLoading}
                onClick={() => exec("underline")}
              >
                <Underline className="h-3.5 w-3.5" />
              </ToolBtn>

              <span className="mx-1 h-6 w-px bg-slate-200/80 dark:bg-slate-800/80" />
{/* 
              <ToolBtn
                title="Bulleted list"
                active={cmd.ul}
                disabled={isLoading}
                onClick={() => exec("insertUnorderedList")}
              >
                <List className="h-3.5 w-3.5" />
              </ToolBtn>

              <ToolBtn
                title="Numbered list"
                active={cmd.ol}
                disabled={isLoading}
                onClick={() => exec("insertOrderedList")}
              >
                <ListOrdered className="h-3.5 w-3.5" />
              </ToolBtn> */}

              <ToolBtn title="Indent" disabled={isLoading} onClick={() => exec("indent")}>
                <Indent className="h-3.5 w-3.5" />
              </ToolBtn>

              <ToolBtn title="Outdent" disabled={isLoading} onClick={() => exec("outdent")}>
                <Outdent className="h-3.5 w-3.5" />
              </ToolBtn>

              {/* Emoji / icon insert */}
              <div className="relative">
                <ToolBtn
                  title="Insert icon"
                  disabled={isLoading}
                  onClick={() => setEmojiOpen((v) => !v)}
                >
                  <Smile className="h-3.5 w-3.5" />
                </ToolBtn>

                {emojiOpen && !isLoading && (
                  <div
                    onMouseDown={keepSelection}
                    className="absolute right-0 z-20 mt-2 w-[220px] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-2 shadow-lg"
                  >
                    <div className="mb-1 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Icons
                    </div>
                    <div className="grid grid-cols-8 gap-1 p-1">
                      {emojis.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onMouseDown={keepSelection}
                          onClick={() => {
                            insertText(`${e} `);
                            setEmojiOpen(false);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          title={`Insert ${e}`}
                        >
                          <span className="text-[14px]">{e}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <span className="mx-1 h-6 w-px bg-slate-200/80 dark:bg-slate-800/80" />

            {/* Actions group (existing) */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition",
                "border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950",
                "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
                isLoading && "cursor-not-allowed opacity-70"
              )}
              title="Copy text"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleClear}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition",
                "border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950",
                "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
                isLoading && "cursor-not-allowed opacity-70"
              )}
              title="Clear editor"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>

            {/* <button
              type="button"
              disabled={isLoading}
              onMouseDown={keepSelection}
              onClick={() => onPolish?.(editorRef.current?.innerText || "")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                isLoading
                  ? "cursor-wait bg-[#068773]"
                  : "bg-gradient-to-r from-[#068773] to-[#0fb9a8] hover:brightness-105 active:brightness-95"
              )}
              title="Polish with AI"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isLoading ? "Generating…" : "Polish"}
            </button> */}
          </div>
        </div>

        {/* Editor */}
        <div className="relative px-4 py-4">
          {isLoading ? (
            <div className="min-h-[240px] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
              <div className="h-3.5 w-[92%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[78%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[70%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[86%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[62%] rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-[74%] rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          ) : (
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyUp={refreshCmdState}
              onMouseUp={refreshCmdState}
              onFocus={refreshCmdState}
              className={cn(
                "min-h-[220px] max-h-[360px] overflow-y-auto",
                "rounded-2xl border px-4 py-3",
                "border-slate-200/80 dark:border-slate-800/80",
                "bg-slate-50 dark:bg-slate-950",
                "text-[13px] leading-relaxed text-slate-800 dark:text-slate-100",
                "outline-none transition",
                "focus:border-[#068773]/35 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#068773]/15",
                "scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent"
              )}
            />
          )}

          <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
            {isLoading
              ? "AI is refining your storyline…"
              : "Tip: select text → gunakan toolbar (bold/italic)"}
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-60%); opacity: .35; }
            60% { opacity: .55; }
            100% { transform: translateX(160%); opacity: .35; }
          }
        `}</style>
      </div>
    </div>
  );
}
