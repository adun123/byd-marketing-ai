// src/pages/marketing-dashboard/playground/CampaignStudioPage.tsx
import * as React from "react";
import StudioBriefPanel from "./StudioBriefPanel";
import StudioWorkspace from ".//StudioWorkSpace";
import type { PinnedItem, StudioBrief, StudioOutput } from "./types";
import { generateMockStudioOutput } from "./mock";

export default function CampaignStudioPage() {
  const [brief, setBrief] = React.useState<StudioBrief>({
    campaignName: "",
    objective: "awareness",
    product: "",
    offer: "",
    audience: "",
    tone: "corporate",
    platforms: ["Instagram", "TikTok"],
    brandNotes: "",
  });

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [output, setOutput] = React.useState<StudioOutput | null>(null);
  const [pinned, setPinned] = React.useState<PinnedItem[]>([]);

  function onGenerate() {
    setIsGenerating(true);
    setTimeout(() => {
      setOutput(generateMockStudioOutput(brief));
      setIsGenerating(false);
    }, 600);
  }

  function pin(group: PinnedItem["group"], text: string) {
    setPinned((prev) => {
      const id = `${group}:${text}`;
      if (prev.some((p) => p.id === id)) return prev;
      return [{ id, group, text }, ...prev].slice(0, 12);
    });
  }

  function unpin(id: string) {
    setPinned((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <StudioBriefPanel
        brief={brief}
        setBrief={setBrief}
        isGenerating={isGenerating}
        onGenerate={onGenerate}
      />

      <StudioWorkspace
        brief={brief}
        output={output}
        isGenerating={isGenerating}
        pinned={pinned}
        onPin={pin}
        onUnpin={unpin}
        onSaveToLibrary={() => {}}
        onAddToScheduler={() => {}}
      />
    </div>
  );
}
