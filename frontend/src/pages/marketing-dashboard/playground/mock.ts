// src/pages/marketing-dashboard/playground/mock.ts
import type { StudioBrief, StudioOutput } from "./types";

export function generateMockStudioOutput(brief: StudioBrief): StudioOutput {
  const name = brief.campaignName?.trim() || "Campaign";
  const prod = brief.product?.trim() || "your product";
  const offer = brief.offer?.trim() || "special offer";
  const aud = brief.audience?.trim() || "your audience";

  return {
    hooks: [
      `Stop scrolling — ${prod} might be the simplest upgrade you make this week.`,
      `If you care about results, you’ll want to see this ${name} idea.`,
      `Quick win for ${aud}: a smarter way to get value from ${prod}.`,
      `This is what ${offer} looks like when it’s actually easy to claim.`,
      `One change. Better outcomes. Here’s how ${prod} helps.`,
    ],
    angles: [
      "Before vs After (pain → relief)",
      "Proof-driven (numbers, mini case study)",
      "Myth-busting (common misconception)",
      "Checklist / framework (step-by-step)",
      "Behind the scenes (how it works)",
    ],
    captions: {
      short: `A practical way to make ${prod} work harder for you. ${offer} available now.`,
      medium: `We built ${name} for people who want clarity and speed.\n\n What you get\n• Faster workflow\n• Cleaner output\n• Less guesswork\n\nIf you’re ${aud}, this is for you. ${offer}`,
      long: `Here’s the idea behind ${name}.\n\nMost teams lose time on repetitive steps—briefing, rewriting, reformatting.\n${prod} is designed to remove friction while keeping brand consistency.\n\nWhat to try today:\n1) Start with one clear objective\n2) Choose a single target audience\n3) Generate 3–5 variants\n4) Pin the best parts and refine\n\nIf you want a simple starting point: ${offer}.`,
    },
    ctas: [
      "Save this for later",
      "Comment “READY” and we’ll share the template",
      "DM us for the full breakdown",
      "Try the workflow today",
      "Share this with your team",
    ],
    hashtags: [
      "#marketingworkflow",
      "#contentstrategy",
      "#brandconsistency",
      "#growthmarketing",
      "#campaignplanning",
      "#socialcontent",
    ],
  };
}
