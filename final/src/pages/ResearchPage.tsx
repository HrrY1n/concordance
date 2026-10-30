import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DEMO_REGISTRY } from "@/content/ids";
import { noteById, notes } from "@/content/notes";
import { researchQuestions, researchTopics } from "@/content/research";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";
import { Figure, PageShell, XRef, EmptyState } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import type { QuestionStatus } from "@/content/types";

const STATUS_LEGEND: Record<QuestionStatus, { label: string; tone: string; meaning: string }> = {
  active: { label: "活跃攻坚", tone: "accent", meaning: "当前正在全力推进" },
  exploring: { label: "前期探索", tone: "exploring", meaning: "阅读与文献探测，未实质立项" },
  paused: { label: "暂缓搁置", tone: "paused", meaning: "已归档留存，供后续回溯" },
};

function StatusMark({ status }: { status: QuestionStatus }) {
  const legend = STATUS_LEGEND[status];
  return (
    <span className="t-meta inline-flex items-center gap-1.5 text-ink-2 font-mono text-xs">
      <span className="dot" data-tone={legend.tone} aria-hidden="true" />
      {legend.label}
    </span>
  );
}

/** 图版 R1 —— 问题台账状态分布图（由数据计算派生） */
function StatusDistribution() {
  const counts = useMemo(() => {
    const order: QuestionStatus[] = ["active", "exploring", "paused"];
    return order.map((status) => ({
      status,
      n: researchQuestions.filter((q) => q.status === status).length,
    }));
  }, []);
  const total = researchQuestions.length;
  return (
    <Figure
      id="图版 R1"
      title="问题台账状态分布图"
      method={`由 research.ts 实时运算 · n = ${total} · 纯浏览器计算`}
    >
      <div
        className="flex h-8 w-full max-w-[560px] border border-line"
        role="img"
        aria-label={`状态分布：${counts
          .filter((c) => c.n > 0)
          .map((c) => `${c.n} 项处于 ${STATUS_LEGEND[c.status].label}`)
          .join(", ")}。`}
      >
        {counts.map(({ status, n }) =>
          n === 0 ? null : (
            <span
              key={status}
              className={
                status === "active"
                  ? "border-r border-line bg-accent/80"
                  : status === "exploring"
                    ? "border-r border-line bg-ink-2/60"
                    : "bg-transparent"
              }
              style={{ width: `${(n / total) * 100}%` }}
              title={`${STATUS_LEGEND[status].label}: ${n}`}
            />
          ),
        )}
      </div>
      <p className="t-meta text-ink-2 mt-3 font-mono text-xs">
        {counts.map((c) => `${STATUS_LEGEND[c.status].label} ${c.n}`).join(" · ")}
      </p>
    </Figure>
  );
}

export default function ResearchPage() {
  useDocumentMeta(
    "研究方向与问题台账",
    "学术研究方向：检索增强生成（RAG）、鲁棒性、知识库对抗投毒、AI 系统工程安全及检索-生成协同机制。",
  );
  const { openSearch } = useSearch();
  const meta = sectionByRoute("/research")!;

  return (
    <PageShell
      meta={meta}
      lede="研究方向相对稳固，具体探索问题动态演进。下方台账保持工作真实状态 —— 坚持诚实记录，绝不编造未开展的虚假实验。"
    >
      {/* ——— 6 大研究方向列表 ——— */}
      <section aria-labelledby="research-directions">
        <h2 id="research-directions" className="t-kicker text-ink-2">
          研究方向体系 —— 共 {researchTopics.length} 个重点领域
        </h2>
        <ul className="mt-5">
          {researchTopics.map((t) => (
            <li key={t.id} id={t.id} className="scroll-mt-24 border-t border-line py-8 first:border-t-0">
              <div className="grid gap-x-8 gap-y-3 md:grid-cols-[5rem_1fr]">
                <span className="t-meta text-accent font-mono font-medium">{t.short}</span>
                <div className="max-w-[62ch]">
                  <h3 className="t-h3 text-xl font-medium text-ink">{t.name}</h3>
                  <p className="t-small text-ink-2 mt-2 leading-relaxed text-sm md:text-base">{t.blurb}</p>
                  <p className="t-meta text-ink/80 mt-2 font-mono text-xs">
                    核心论断：“{t.facetLine}”
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="t-meta text-faint text-xs font-mono" aria-hidden="true">
                      相邻交叉领域：
                    </span>
                    {t.adjoins.map((a) => {
                      const adj = researchTopics.find((x) => x.id === a);
                      if (!adj) return null;
                      return (
                        <button
                          key={a}
                          type="button"
                          className="u-chip !px-2.5 !py-0.5 text-xs"
                          onClick={() => openSearch(adj.short)}
                          aria-label={`检索 “${adj.short}”`}
                        >
                          {adj.short} <span aria-hidden="true">⌕</span>
                        </button>
                      );
                    })}
                    {t.relatedDemo ? (
                      <XRef to={DEMO_REGISTRY[t.relatedDemo].route}>
                        对应实验：{DEMO_REGISTRY[t.relatedDemo].title}
                      </XRef>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 仅在台账有实质问题时展示分布图 */}
      {researchQuestions.length > 0 ? (
        <div className="mt-12">
          <StatusDistribution />
        </div>
      ) : null}

      {/* ——— 问题台账（Question Ledger）——— */}
      <section aria-labelledby="research-ledger" className="mt-14 border-t border-line pt-10">
        <h2 id="research-ledger" className="t-kicker text-ink-2">
          问题台账 (Question Ledger) —— {researchQuestions.length} 项收录
        </h2>
        {researchQuestions.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              mark="台账状态 —— 诚实空置中"
              why="只有当一项研究具备明确的代码实现、实验环境或数据依据时，才会进入台账予以正式编号。当前阶段上方 6 个研究方向清晰公开，具体实验推进后将在此依次编录。"
              becomes="待产生具备可复现证据的明确科学设问时，将在此自动编号建档。"
            />
          </div>
        ) : (
          <>
            <ol className="mt-5">
              {researchQuestions.map((q, i) => (
                <li
                  key={q.id}
                  id={q.id}
                  className="scroll-mt-24 border-t border-line py-6 first:border-t-0 md:grid md:grid-cols-[6rem_1fr] md:gap-x-8"
                >
                  <div className="flex items-baseline gap-3 md:block">
                    <span className="t-meta text-faint font-mono" aria-hidden="true">
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="t-meta text-ink-2 md:hidden" aria-hidden="true">
                      ·
                    </span>
                    <StatusMark status={q.status} />
                  </div>
                  <div>
                    <p className="t-h4 max-w-[54ch]">{q.text}</p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs">
                      <span className="t-meta text-ink-2 font-mono">
                        领域：{researchTopics.find((t) => t.id === q.topic)?.name ?? q.topic}
                      </span>
                      {q.updated ? (
                        <span className="t-meta text-ink-2 font-mono">更新时间 {q.updated}</span>
                      ) : null}
                      {q.relatedDemo ? (
                        <XRef to={DEMO_REGISTRY[q.relatedDemo].route}>
                          运行仪器：{DEMO_REGISTRY[q.relatedDemo].title}
                        </XRef>
                      ) : null}
                      {(q.relatedNotes ?? [])
                        .map((nid) => noteById(nid))
                        .filter((n): n is (typeof notes)[number] => Boolean(n))
                        .map((n) => (
                          <XRef key={n.id} to={`/notes/${n.id}`}>
                            关联笔记：{n.id}
                          </XRef>
                        ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-4 text-xs font-mono">
              {(Object.keys(STATUS_LEGEND) as QuestionStatus[]).map((s) => (
                <span key={s} className="t-meta text-ink-2 inline-flex items-center gap-2">
                  <span className="dot" data-tone={STATUS_LEGEND[s].tone} aria-hidden="true" />
                  {STATUS_LEGEND[s].label} —— {STATUS_LEGEND[s].meaning}
                </span>
              ))}
            </div>
            <p className="t-small text-ink-2 mt-4 max-w-[58ch]">
              一个科学问题能够被一句话清晰表述时方可入账；当其被证伪、解决或有更优解发表时即标记归档。{" "}
              <Link to="/notes" className="u-link">
                查看相关工程笔记 →
              </Link>
            </p>
          </>
        )}
      </section>
    </PageShell>
  );
}
