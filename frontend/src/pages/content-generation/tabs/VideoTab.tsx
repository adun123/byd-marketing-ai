
import VideoOptionsPanel from "../VideoOptionsPanel";
import VideoCanvas from "../VideoCanvas";
import VideoComposer from "../VideoComposer";
import type { VideoAttachment, VideoOutput } from "../types";

type Props = {
  // state
  videoWorkflow: "text_to_video" | "image_to_video";
  setVideoWorkflow: (v: "text_to_video" | "image_to_video") => void;

  videoFormat: "reels" | "tiktok" | "yt_shorts" | "landscape";
  setVideoFormat: (v: "reels" | "tiktok" | "yt_shorts" | "landscape") => void;

  videoDurationSec: 5 | 8 | 10 | 15;
  setVideoDurationSec: (v: 5 | 8 | 10 | 15) => void;

  videoStyle: "cinematic" | "clean" | "ugc" | "bold";
  setVideoStyle: (v: "cinematic" | "clean" | "ugc" | "bold") => void;

  videoFps: 24 | 30;
  setVideoFps: (v: 24 | 30) => void;

  videoPrompt: string;
  setVideoPrompt: (v: string) => void;

  videoAttachments: VideoAttachment[];
  setVideoAttachments: (v: VideoAttachment[]) => void;

  videoItems: VideoOutput[];

  // actions
  isGenerating: boolean;
  onGenerate: (prompt: string) => void;
  onDownloadVideo: (it: VideoOutput) => void;
  onSelectVideo?: (it: VideoOutput) => void;
};

export default function VideoTab({
  videoWorkflow,
  setVideoWorkflow,
  videoFormat,
  setVideoFormat,
  videoDurationSec,
  setVideoDurationSec,
  videoStyle,
  setVideoStyle,
  videoFps,
  setVideoFps,
  videoPrompt,
  setVideoPrompt,
  videoAttachments,
  setVideoAttachments,
  videoItems,
  isGenerating,
  onGenerate,
  onDownloadVideo,
  onSelectVideo,
}: Props) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* LEFT (VIDEO OPTIONS) */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-emerald-200/60 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="text-xs font-semibold text-slate-900">Video Options</div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Sesuaikan format & durasi
            </div>
          </div>

          <div className="p-3">
            <VideoOptionsPanel
              workflow={videoWorkflow}
              format={videoFormat}
              durationSec={videoDurationSec}
              style={videoStyle}
              fps={videoFps}
              onChange={(v) => {
                if (v.workflow) setVideoWorkflow(v.workflow);
                if (v.format) setVideoFormat(v.format);
                if (v.durationSec) setVideoDurationSec(v.durationSec);
                if (v.style) setVideoStyle(v.style);
                if (v.fps) setVideoFps(v.fps);
              }}
            />
          </div>
        </div>
      </aside>

      {/* RIGHT (VIDEO CANVAS + COMPOSER) */}
      <section className="min-w-0">
        <VideoCanvas
          items={videoItems}
          isGenerating={isGenerating}
          onDownload={onDownloadVideo}
          onSelect={(it) => (onSelectVideo ? onSelectVideo(it) : undefined)}
        />

        <div className="sticky bottom-3 mt-4">
          <div className="rounded-2xl border border-emerald-200/60 bg-white/85 shadow-lg backdrop-blur">
            <div className="border-b border-slate-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900">Video Controls</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Tulis prompt, lalu render video
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  {isGenerating ? "Running" : "Ready"}
                </span>
              </div>
            </div>

            <div className="p-3">
              <VideoComposer
                prompt={videoPrompt}
                setPrompt={setVideoPrompt}
                attachments={videoAttachments}
                setAttachments={setVideoAttachments}
                workflow={videoWorkflow}
                isGenerating={isGenerating}
                onGenerate={() => onGenerate(videoPrompt)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
