// src/pages/content-generation/ChannelTabs.tsx

import type { ChannelItem, ChannelKey } from "./types";

function cls(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

export default function ChannelTabs({
  channel,
  setChannel,
  channels,
}: {
  channel: ChannelKey;
  setChannel: (c: ChannelKey) => void;
  channels: ChannelItem[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {channels.map((c) => {
        const active = channel === c.key;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => setChannel(c.key)}
            className={cls(
              "rounded-xl px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
