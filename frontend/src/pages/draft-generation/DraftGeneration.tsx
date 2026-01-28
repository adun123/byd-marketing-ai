import TopBarGenerate from "../../components/layout/TopBarGenerate";
import DraftResult from "./DraftResult";
import OptionDraftFilter from "./OptionDraftFilter";
import { useLocation } from "react-router-dom";
import DraftFooter from "./DraftFooter";
import type { DraftContextPayload } from "../trends-generation/types";
import { loadDraftContext } from "../trends-generation/utils/draftContextStorage";

export default function DraftGeneration() {

  const location = useLocation();
  const navCtx = location.state as DraftContextPayload | null;

  const ctx = navCtx || loadDraftContext();
  return (
    <div className="mx-auto w-full px-4">
       <TopBarGenerate active="draft" />

      <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* LEFT FILTER */}
         <OptionDraftFilter draftCtx={ctx} />

        {/* RIGHT CONTENT */}
        <DraftResult draftCtx={ctx} />
      </div>

      {/* FOOTER */}
      <DraftFooter
        onViewHistory={() => console.log("view history")}
        onSaveDraft={() => console.log("save draft")}
        onFinalize={() => console.log("finalize")}
      />
    </div>
  );
}
