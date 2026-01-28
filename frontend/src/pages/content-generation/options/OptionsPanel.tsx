// src/pages/content-generation/OptionsPanel.tsx
import React from "react";
import OptionsStep1SourcePlatform from "../PlatformCardOption";
import OptionsStep2CreativeModeStyle from "./OptionsStep2CreativeModeStyle";
import OptionsStep3PromptInput from "./OptionsStep3PromptInput";


export type Workflow = "text_to_image" | "image_to_image" | "upscale";
export type VisualStyle = "clean" | "premium" | "lifestyle" | "ugc" | "bold";

type Props = {
  workflow: Workflow; // kita pakai untuk Source tab (drop-in)
  visualStyle: VisualStyle; // keep (belum dipakai UI ini)
  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  onChange: (v: Partial<Props>) => void;
};



export default function OptionsPanel({ workflow, visualStyle, aspect, onChange }: Props) {
 const [prompt, setPrompt] = React.useState("");
  return (
    <div className="space-y-4">
      <OptionsStep1SourcePlatform workflow={workflow} aspect={aspect} onChange={onChange} />

   
      {/* <OptionsStep2... /> */}
      <OptionsStep2CreativeModeStyle workflow={workflow} visualStyle={visualStyle} onChange={onChange} />


      {/* <OptionsStep3... /> */}
       <OptionsStep3PromptInput
        prompt={prompt}
        onChange={setPrompt}
        onGenerate={() => console.log("generate with prompt:", prompt)}
      />
    </div>
    
  );
}


