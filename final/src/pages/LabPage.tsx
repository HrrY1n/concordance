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
 * §03 实验室 Lab —— 纯前端可交互实验仪器。
 * 纯本地实时运算，展示 RAG 流水线在检索扰动与预算限制下的内部机理。
 */
export default function LabPage() {
  useDocumentMeta(
    "实验室与交互仪器",
    `${DEMO_COUNT} 项面向研究方向的纯前端实验仪器：知识投毒沙盒、上下文预算折算器与检索算法双轨对照。所有运算完全在本地执行。`,
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
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-2">
              <h2 id={`${demo.anchor}-title`} className="t-kicker text-ink-2 font-mono">
                {demo.index} — {demo.title}
                {demo.flagship ? " (核心仪器)" : ""}
              </h2>
              <p className="t-meta text-ink-2 font-mono text-xs">{demo.method}</p>
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
