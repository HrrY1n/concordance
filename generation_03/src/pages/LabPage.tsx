import { DEMO_REGISTRY } from "@/content/ids";
import { labIntro } from "@/content/lab";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import { CorruptionSandbox } from "@/demos/CorruptionSandbox";
import { ContextBudget } from "@/demos/ContextBudget";
import { RankersSideBySide } from "@/demos/RankersSideBySide";

/**
 * §03 LAB — three hand-built instruments. Each is a live figure: real
 * arithmetic on hand-written data, method stated in its header row, honest
 * declaration in its footer. The sandbox deep-links to its own page.
 */
export default function LabPage() {
  useDocumentMeta(
    "Lab",
    "Three offline instruments for the research directions: the Corruption Sandbox, a context budget calculator, and two rankers side by side. All computation is local.",
  );
  const meta = sectionByRoute("/lab")!;

  return (
    <PageShell meta={meta} lede={labIntro}>
      <div className="space-y-20">
        <section aria-labelledby={DEMO_REGISTRY["corruption-sandbox"].anchor} id={DEMO_REGISTRY["corruption-sandbox"].anchor} className="scroll-mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id={DEMO_REGISTRY["corruption-sandbox"].anchor} className="t-kicker text-ink-2">
              {DEMO_REGISTRY["corruption-sandbox"].index} — corruption sandbox (flagship)
            </h2>
            <p className="t-meta text-ink-2">inject · rank · defend · re-rank</p>
          </div>
          <div className="mt-5">
            <CorruptionSandbox detailed />
          </div>
        </section>

        <section aria-labelledby={DEMO_REGISTRY["context-budget"].anchor} id={DEMO_REGISTRY["context-budget"].anchor} className="scroll-mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id={DEMO_REGISTRY["context-budget"].anchor} className="t-kicker text-ink-2">
              {DEMO_REGISTRY["context-budget"].index} — context budget
            </h2>
            <p className="t-meta text-ink-2">budget · order · truncate</p>
          </div>
          <div className="mt-5">
            <ContextBudget />
          </div>
        </section>

        <section aria-labelledby={DEMO_REGISTRY["rankers-side-by-side"].anchor} id={DEMO_REGISTRY["rankers-side-by-side"].anchor} className="scroll-mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id={DEMO_REGISTRY["rankers-side-by-side"].anchor} className="t-kicker text-ink-2">
              {DEMO_REGISTRY["rankers-side-by-side"].index} — rankers, side by side
            </h2>
            <p className="t-meta text-ink-2">same corpus · two scorers</p>
          </div>
          <div className="mt-5">
            <RankersSideBySide />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
