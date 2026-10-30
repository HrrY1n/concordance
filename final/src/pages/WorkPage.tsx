import { Link } from "react-router-dom";
import { chains, projects } from "@/content/projects";
import { caseByProjectId } from "@/content/cases";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";
import { PageShell, XRef } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";

/**
 * §02 作品 Selected Work —— 典籍图版与完整案例展厅（中文优先与视觉强化版）。
 * 旗舰项目（大图版）、次级项目（中图版）与元项目分层呈现，
 * 每项均配备严谨的真实证据链与开源仓库指引。
 */

function StatusMark({ status }: { status: "active" | "maintained" | "archived" | null }) {
  if (status === null) return null;
  const tone = status === "active" ? "alive" : status === "maintained" ? "alive" : "quiet";
  const labelMap = { active: "持续迭代", maintained: "稳定维护", archived: "已归档" };
  return (
    <span className="t-meta inline-flex items-center gap-1.5 text-ink-2 font-mono text-xs">
      <span className="dot" data-tone={tone} aria-hidden="true" />
      {labelMap[status] ?? status}
    </span>
  );
}

export default function WorkPage() {
  useDocumentMeta(
    "精选作品",
    "带着真实证据链的软件作品：本地优先个人物资管理 PWA、纯前端声学合成专注工作台与本站自身 —— 所有图版直链公开开源仓库与深度案例复盘。",
  );
  const { openSearch } = useSearch();
  const meta = sectionByRoute("/work")!;

  return (
    <PageShell
      meta={meta}
      register="plate"
      lede="拒绝模板化卡片墙。每一件作品均配备完整且可核验的证据链（核心问题 → 实现步骤 → 真实存在交付物），并提供详尽的深度案例复盘与开源代码。"
    >
      <ol className="space-y-16 md:space-y-24">
        {projects.map((p, i) => {
          const chain = chains[p.id];
          const cs = caseByProjectId(p.id);
          const isLead = i === 0;

          return (
            <li
              key={p.id}
              id={`plate-${p.id}`}
              className="scroll-mt-24 border-t border-line pt-12 first:border-t-0 first:pt-0"
            >
              <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-12">
                {/* 左侧图版元数据列 */}
                <div className="flex items-baseline gap-4 lg:col-span-3 lg:flex-col lg:items-start lg:gap-2.5 lg:pt-2">
                  <span className="t-meta t-caps text-accent font-mono font-medium text-sm">
                    PLATE {String(i + 1).padStart(2, "0")}
                  </span>
                  <StatusMark status={p.status} />
                  <span className="t-meta text-ink-2 font-mono text-xs">{p.year}</span>
                  {cs ? (
                    <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-mono bg-accent/15 text-accent border border-accent/20">
                      含完整案例
                    </span>
                  ) : null}
                </div>

                {/* 右侧作品主体与图版 */}
                <div className="lg:col-span-9 space-y-6">
                  <div>
                    <h2 className="t-h1 text-2xl md:text-3xl font-medium tracking-tight">
                      {cs ? (
                        <Link to={`/work/${cs.slug}`} className="hover:text-accent transition-colors">
                          {p.title}
                        </Link>
                      ) : (
                        p.title
                      )}
                    </h2>
                    <p className="t-lede text-ink-2 mt-3 max-w-[56ch] text-base md:text-lg leading-relaxed">
                      {p.summary}
                    </p>
                  </div>

                  {/* 真实界面图版预览（旗舰与次级项目） */}
                  {cs ? (
                    <div className="border border-line bg-raised rounded overflow-hidden shadow-sm group">
                      <Link to={`/work/${cs.slug}`} className="block">
                        <img
                          src={`${import.meta.env.BASE_URL}cases/${cs.slug}/${cs.hero.file}`}
                          alt={cs.hero.alt}
                          width={cs.hero.w}
                          height={cs.hero.h}
                          loading="lazy"
                          decoding="async"
                          className={`block w-full h-auto transition-transform duration-300 group-hover:scale-[1.01] ${isLead ? "max-h-[480px] object-cover object-top" : "max-h-[400px] object-cover object-top"}`}
                        />
                        <div className="p-3 bg-inset/70 border-t border-line flex items-baseline justify-between text-xs text-ink-2 font-mono">
                          <span>{cs.hero.caption}</span>
                          <span className="text-accent group-hover:underline">阅读完整复盘文章 →</span>
                        </div>
                      </Link>
                    </div>
                  ) : null}

                  {/* 规格元数据列表 */}
                  <dl className="t-meta grid max-w-[62ch] gap-x-8 gap-y-2.5 sm:grid-cols-[6rem_1fr] font-mono text-xs border-y border-line py-4">
                    <dt className="text-ink-2 font-medium">负责职责</dt>
                    <dd className="text-ink">{p.role}</dd>

                    <dt className="text-ink-2 font-medium">技术标签</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => openSearch(tag)}
                          className="u-chip !px-2 !py-0.5 text-xs"
                          aria-label={`在全站检索 “${tag}”`}
                        >
                          {tag} <span aria-hidden="true">⌕</span>
                        </button>
                      ))}
                    </dd>

                    <dt className="text-ink-2 font-medium">公开链接</dt>
                    <dd className="text-ink">
                      {p.links.github ? (
                        <a className="u-link inline-flex items-center gap-1" href={p.links.github} target="_blank" rel="noreferrer">
                          GitHub 开源仓库 <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <span className="text-ink-2">暂无公开链接</span>
                      )}
                    </dd>

                    <dt className="text-ink-2 font-medium">深度案例</dt>
                    <dd>
                      {cs ? (
                        <XRef to={`/work/${cs.slug}`}>阅读完整案例复盘 ({cs.title})</XRef>
                      ) : p.id === "this-site" ? (
                        <span className="text-ink-2">您当前正浏览本站本体</span>
                      ) : (
                        <span className="text-ink-2">暂未编入案例</span>
                      )}
                    </dd>
                  </dl>

                  {/* 证据链条目（Evidence Chain） */}
                  <div className="border-l-2 border-accent/40 pl-5 py-1 space-y-3">
                    <p className="t-meta text-accent font-mono text-xs font-medium">
                      EVIDENCE CHAIN · 核心事实证据链
                    </p>
                    <div>
                      <p className="t-meta text-ink-2 text-xs font-mono">核心工程命题：</p>
                      <p className="t-small text-ink mt-1 font-medium">{chain.problem}</p>
                    </div>
                    <div>
                      <p className="t-meta text-ink-2 text-xs font-mono">关键解法步骤：</p>
                      <ul className="t-small text-ink-2 mt-1 space-y-1 font-mono text-xs">
                        {chain.method.map((m) => (
                          <li key={m}>· {m}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="t-meta text-ink-2 text-xs font-mono">公开可核验证据物：</p>
                      <ul className="t-small text-ink-2 mt-1 space-y-1 font-mono text-xs">
                        {chain.artifacts.map((a) => (
                          <li key={a}>— {a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
