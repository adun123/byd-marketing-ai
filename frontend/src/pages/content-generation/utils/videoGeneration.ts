import type { VideoOutput } from "../types";

export async function handleGenerateVideo(
  prompt: string,
  onDone: (item: VideoOutput) => void
) {
  const id = crypto.randomUUID();

  setTimeout(() => {
    onDone({
      id,
      prompt,
      createdAt: Date.now(),
      status: "done",
    });
  }, 1000);

  return {
    id,
    prompt,
    createdAt: Date.now(),
    status: "processing",
  } satisfies VideoOutput;
}
