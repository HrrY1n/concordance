import { Link } from "react-router-dom";
import { notes } from "@/content/notes";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell, XRef, EmptyState } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";
import { useMemo } from "react";

/** 图版 N1 —— 笔记篇幅字数统计图 */
function EntryLengthFigure() {
  const wordCounts = useMemo(
    () =>
      notes
        .map((n) => ({
          id: n.id,
          title: n.title,
          words:
            n.summary.length +
            (n.body ?? []).reduce(
              (sum, b) => sum + ("text" in b ? b.text.length : 0),
              0,
            ),
        }))
        .sort((a, b) => b.words - a.words),
    [],
  );
  const max = Math.max(...wordCounts.map((w) => w.words), 1);
  return (
    <figure className="border-y border-line py-5" aria-label="图版 N1 —— 笔记篇幅统计">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="t-meta t-caps text-ink font-mono font-medium">图版 N1 —— 归档笔记篇幅（字数）</span>
        <span className="t-meta text-ink-2 font-mono text-xs">实时计算自 notes.ts · 0ms 网络开销</span>
      </figcaption>
      <ul className="mt-4 max-w-[620px] space-y-3">
        {wordCounts.map((w) => (
          <li key={w.id} className="flex items-baseline gap-3 text-xs font-mono">
            <span className="t-meta text-accent w-8 shrink-0">#01</span>
            <span className="t-small text-ink-2 min-w-0 flex-1 truncate">{w.title}</span>
            <span className="rank-track max-w-[200px] self-center" aria-hidden="true">
              <span className="rank-fill" style={{ transform: `scaleX(${Math.max(w.words / max, 0.05)})` }} />
            </span>
            <span className="t-meta text-ink w-14 shrink-0 text-right tabular-nums">{w.words} 字</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default function NotesPage() {
  useDocumentMeta(
    "工程笔记",
    "记录本档案自身的软件架构、TypeScript 类型体系与前端检索实现的工程长文 —— 供在场静读，论据直接与公开源码互相印证。",
  );
  const meta = sectionByRoute("/notes")!;
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageShell
      meta={meta}
      register="essay"
      lede="笔记专为深度静心阅读而排版：采用适宜中文阅读的字符宽度与呼吸感留白，保留旁注批注（Sidenote）与真实代码考据。"
    >
      {sorted.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            mark="笔记状态 —— 诚实空置中"
            why="暂无公开归档的随记。只有具备实质思考与技术价值的内容才会被收录于此 —— 依靠持续重构而非遮蔽保全真实性。"
            becomes="待新长文起草并通过核验后，将在此自动收录编号。"
          />
        </div>
      ) : (
        <>
          <EntryLengthFigure />
          <ul className="u-measure mt-12 space-y-8">
            {sorted.map((n) => (
              <li key={n.id} className="border-b border-line pb-8 last:border-b-0">
                <p className="t-meta text-ink-2 font-mono text-xs">
                  {n.date} · {n.kind === "engineering" ? "工程架构" : n.kind}
                </p>
                <h2 className="t-h3 mt-2 text-xl font-medium">
                  <Link to={`/notes/${n.id}`} className="u-link">
                    {n.title}
                  </Link>
                </h2>
                <p className="t-small text-ink-2 mt-3 leading-relaxed text-sm md:text-base">{n.summary}</p>
                {n.body ? (
                  <div className="mt-4">
                    <XRef to={`/notes/${n.id}`}>阅读完整笔记长文</XRef>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </PageShell>
  );
}
