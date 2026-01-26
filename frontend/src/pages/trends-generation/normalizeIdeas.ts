// src/pages/trends-generation/normalizeIdeas.ts
export type Ideas = {
  hooks: string[];
  angles: string[];
  captions: string[];
  scripts: string[];
};

function pickStringArray(x: any): string[] {
  if (!x) return [];
  if (Array.isArray(x)) return x.filter((v) => typeof v === "string");
  return [];
}

export function normalizeIdeas(res: any): Ideas {
  // Coba beberapa kemungkinan bentuk response:
  // 1) res.ideas.hooks / angles / captions / scripts
  // 2) res.hooks / res.angles / ...
  // 3) res.text / res.output (single string) → masuk captions
  const ideas = res?.ideas ?? res ?? {};

  const hooks = pickStringArray(ideas.hooks) || pickStringArray(res?.hooks);
  const angles = pickStringArray(ideas.angles) || pickStringArray(res?.angles);
  const captions =
    pickStringArray(ideas.captions) ||
    pickStringArray(res?.captions) ||
    (typeof ideas.text === "string" ? [ideas.text] : []) ||
    (typeof res?.text === "string" ? [res.text] : []);
  const scripts =
    pickStringArray(ideas.scripts) || pickStringArray(res?.scripts);

  return {
    hooks,
    angles,
    captions,
    scripts,
  };
}
