import { Link, useParams } from "react-router-dom";
import { noteById, notes } from "@/content/notes";
import { researchQuestions } from "@/content/research";
import type { NoteBlock } from "@/content/types";
import { useDocumentMeta } from "@/lib/seo";
import { SidenoteRow } from "@/components/Sidenote";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * /notes/:slug —— 散文与长文版式（ESSAY Register）。
 * 优美的大字号正文、66ch 严格中文行宽、侧栏对齐旁注（Sidenote）与语法高亮代码块。
 */

function renderBlock(block: NoteBlock, key: number) {
  switch (block.type) {
    case "h":
      return <h2 key={key} className="text-xl md:text-2xl font-medium mt-8 mb-4 text-ink">{block.text}</h2>;
    case "p":
      return block.sidenote ? (
        <SidenoteRow key={key} note={block.sidenote}>
          {block.text}
        </SidenoteRow>
      ) : (
        <p key={key} className="leading-relaxed text-base md:text-lg">{block.text}</p>
      );
    case "code":
      return (
        <figure key={key} className="my-6">
          {block.caption ? (
            <figcaption className="t-meta text-ink-2 mb-2 font-mono text-xs">{block.caption}</figcaption>
          ) : null}
          <pre className="codeblock p-4 rounded border border-line bg-inset/70 text-xs md:text-sm font-mono overflow-x-auto" data-lang={block.lang}>
            <code>{block.text}</code>
          </pre>
        </figure>
      );
  }
}

export default function NotePage() {
  const { slug } = useParams();
  const note = slug ? noteById(slug) : undefined;

  useDocumentMeta(
    note ? note.title : "未找到对应笔记",
    note ? note.summary : "该地址下暂无收录笔记。",
  );

  if (!note) return <NotFoundPage kind="note" />;

  const related = notes.filter((n) => n.id !== note.id).slice(0, 2);
  const feeding = researchQuestions.filter((q) => q.relatedNotes?.includes(note.id));

  return (
    <article className="wrap pb-24 pt-10 md:pt-16">
      <nav aria-label="笔记导航" className="flex items-center gap-2 t-meta text-ink-2 text-xs font-mono">
        <Link to="/" className="hover:text-ink transition-colors">前扉</Link>
        <span>/</span>
        <Link to="/notes" className="hover:text-ink transition-colors">笔记归档</Link>
        <span>/</span>
        <span className="text-accent">{note.id}</span>
      </nav>

      <header className="u-measure mt-6">
        <p className="t-meta text-ink-2 font-mono text-xs">
          §04 · {note.date} · {note.kind === "engineering" ? "工程架构" : note.kind}
        </p>
        <h1 className="t-h1 mt-4 text-3xl md:text-4xl font-medium tracking-tight leading-snug">
          {note.title}
        </h1>
        <p className="t-lede text-ink-2 mt-5 text-base md:text-lg leading-relaxed">
          {note.summary}
        </p>
      </header>

      <div className="essay u-note-spread mt-12 space-y-6">
        {note.body?.map((block, i) => renderBlock(block, i))}
      </div>

      <footer className="u-measure mt-16 border-t border-line pt-8">
        <p className="t-meta text-ink-2 max-w-[58ch] text-xs leading-relaxed">
          此处收录的是扎实的工程实录与思考，而非包装出来的宣传稿。所有涉及的代码逻辑均与本站真实开源仓库保持同步。
        </p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs">
          {feeding.map((q) => (
            <Link key={q.id} to={`/research#${q.id}`} className="u-link t-small inline-flex min-h-[44px] items-center">
              回溯台账问题 {q.id.toUpperCase()} →
            </Link>
          ))}
          {related.map((r) => (
            <Link
              key={r.id}
              to={`/notes/${r.id}`}
              className="u-link t-small inline-flex min-h-[44px] items-center"
            >
              下一篇：{r.title.length > 24 ? `${r.title.slice(0, 24)}…` : r.title} →
            </Link>
          ))}
          <Link to="/notes" className="u-link t-small inline-flex min-h-[44px] items-center">
            查看全部笔记目录 →
          </Link>
        </div>
      </footer>
    </article>
  );
}
