import { DEMO_REGISTRY } from "@/content/ids";
import { labIntro } from "@/content/lab";
import { DEMO_COUNT } from "@/lib/sections";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import { CorruptionSandbox } from "@/demos/CorruptionSandbox";
import { ContextBudget } from "@/demos/ContextBudget";
import { RankersSideBySide } from "@/demos/RankersSideBySide";

/**
 * §03 LAB — hand-built instruments. Each is a live figure: real arithmetic on
 * hand-written data, method stated in its header row, honest declaration in
 * its footer. The sandbox deep-links to its own page.
 *
 * Anchors (P0-8): the <section> carries the registry anchor id; its heading
 * takes `-title` — the two ids must never collide (invalid HTML, and
 * aria-labelledby used to point at itself).
 */
export default function LabPage() {
  useDocumentMeta(
    "Lab",
    `${DEMO_COUNT} offline instruments for the research directions: the Corruption Sandbox, a context budget calculator, and two rankers side by side. All computation is local.`,
  );
  const meta = sectionByRoute("/lab")!;

  return (
    <PageShell meta={meta} lede={labIntro}>
      <div className="space-y-20">
        {Object.values(DEMO_REGISTRY).map((demo) => (
          <section
            key={demo.id}
            aria-labelledby={`${demo.anchor}-title`}
            id={demo.anchor}
            className="scroll-mt-24"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 id={`${demo.anchor}-title`} className="t-kicker text-ink-2">
                {demo.index} — {demo.title.toLowerCase()}
                {demo.flagship ? " (flagship)" : ""}
              </h2>
              <p className="t-meta text-ink-2">{demo.method.toLowerCase()}</p>
            </div>
            <div className="mt-5">
              {demo.id === "corruption-sandbox" ? (
                <CorruptionSandbox detailed />
              ) : demo.id === "context-budget" ? (
                <ContextBudget />
              ) : (
                <RankersSideBySide />
              )}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
