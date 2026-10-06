import { Link } from "react-router-dom";
import { DEMO_REGISTRY } from "@/content/ids";
import { sandboxHonesty } from "@/content/lab";
import { useDocumentMeta } from "@/lib/seo";
import { CorruptionSandbox } from "@/demos/CorruptionSandbox";
import { XRef } from "@/components/structure";

declare const __BUILD_DATE__: string;

/**
 * /lab/corruption-sandbox — the flagship's own deep link. Focused page: the
 * instrument, its explanation, and the ledger questions it feeds. Honest
 * footer, like every other reading surface on the site.
 */
export default function SandboxPage() {
  useDocumentMeta(
    "Corruption Sandbox",
    "Inject one poisoned passage into a hand-written corpus and watch a live BM25 ranking rewrite itself — then toggle a toy defense and watch it rewrite again. All computation is local.",
  );
  const demo = DEMO_REGISTRY["corruption-sandbox"];

  return (
    <div className="min-h-[80vh]">
      <div className="wrap pb-16 pt-14 md:pt-20">
        <p className="t-meta t-caps text-ink-2">
          {demo.index} · RE: Q1 · Q2 in the ledger · build {__BUILD_DATE__}
        </p>
        <h1 className="t-h1 mt-3">{demo.title}</h1>
        <p className="t-lede text-ink-2 mt-4 max-w-[58ch]">{demo.blurb}</p>
        <p className="t-meta t-caps text-ink-2 mt-5 max-w-[64ch]">{sandboxHonesty}</p>

        <div className="mt-10">
          <CorruptionSandbox detailed />
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
          <XRef to="/research#q1">← back to the question ledger</XRef>
          <XRef to="/lab">← all lab instruments</XRef>
          <Link to="/" className="u-link t-small">
            ← home
          </Link>
        </div>
      </div>
    </div>
  );
}
