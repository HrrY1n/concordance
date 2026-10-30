import { Link, useParams } from "react-router-dom";
import { caseBySlug, cases, type CaseFigure } from "@/content/cases";
import { useDocumentMeta } from "@/lib/seo";
import { XRef } from "@/components/structure";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * /work/:slug —— 案例深度复盘页（Case Study Template，中文优先与视觉强化版）。
 * 律动体系（Register）：PLATE（开篇大图与元数据）→ ESSAY（叙述与多图实拍）→ LEDGER（核验证据出处）→ PLATE（下一案例引导）。
 */

function FigureRow({ slug, figure }: { slug: string; figure: CaseFigure }) {
  const src = `${import.meta.env.BASE_URL}cases/${slug}/${figure.file}`;
  return (
    <figure className="mt-8 group">
      <div className="overflow-hidden border border-line bg-raised rounded shadow-sm">
        <img
          src={src}
          alt={figure.alt}
          width={figure.w}
          height={figure.h}
          loading="lazy"
          decoding="async"
          className="block h-auto max-w-full transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>
      <figcaption className="t-meta text-ink-2 mt-3 max-w-[64ch] text-xs leading-relaxed flex items-baseline gap-2">
        <span className="text-accent font-mono shrink-0">▲ 实拍图版</span>
        <span>{figure.caption}</span>
      </figcaption>
    </figure>
  );
}

export default function CasePage() {
  const { slug } = useParams();
  const cs = caseBySlug(slug);

  useDocumentMeta(
    cs ? `${cs.title} — 深度案例复盘` : "案例未找到",
    cs ? cs.summary : "该地址下暂无案例档案。",
  );

  if (!cs) return <NotFoundPage kind="case" />;

  const idx = cases.findIndex((c) => c.slug === cs.slug);
  const next = cases[(idx + 1) % cases.length];
  const isSoleCase = cases.length < 2;

  return (
    <article className="wrap pb-24 pt-10 md:pt-16" data-register="plate">
      {/* 顶部面包屑与返回导航 */}
      <nav aria-label="案例导航" className="flex items-center gap-2 t-meta text-ink-2 text-xs font-mono">
        <Link to="/" className="hover:text-ink transition-colors">前扉</Link>
        <span>/</span>
        <Link to="/work" className="hover:text-ink transition-colors">精选作品</Link>
        <span>/</span>
        <span className="text-accent">案例复盘</span>
      </nav>

      {/* ——— PLATE —— 头部信息 */}
      <header className="mt-6 max-w-[58rem]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-accent/15 text-accent border border-accent/20">
            §02 深度复盘
          </span>
          <span className="t-meta text-ink-2 font-mono text-xs tracking-wider">
            {cs.kicker}
          </span>
        </div>

        <h1 className="t-h1 mt-4 text-3xl md:text-5xl font-medium tracking-tight">
          {cs.title}
        </h1>
        {cs.subtitle ? (
          <p className="t-h3 mt-2 text-ink-2 font-normal text-lg md:text-xl">
            {cs.subtitle}
          </p>
        ) : null}

        <p className="t-lede text-ink-2 mt-4 max-w-[56ch] leading-relaxed text-base md:text-lg">
          {cs.summary}
        </p>
      </header>

      {/* 核心主视觉图版（Hero Plate）—— 尽早见图，优先呈现实际产品画面 */}
      <figure className="mt-8 border border-line bg-raised rounded overflow-hidden shadow-sm">
        <img
          src={`${import.meta.env.BASE_URL}cases/${cs.slug}/${cs.hero.file}`}
          alt={cs.hero.alt}
          width={cs.hero.w}
          height={cs.hero.h}
          decoding="async"
          className="block h-auto max-w-full w-full"
        />
        <figcaption className="p-3.5 bg-inset/70 border-t border-line text-xs">
          <p className="t-meta text-ink font-medium font-mono">主视觉图版 —— {cs.hero.caption}</p>
          <p className="t-meta text-ink-2 mt-1 leading-relaxed">{cs.provenance}</p>
        </figcaption>
      </figure>

      {/* 关键工程事实元数据表格 —— 位于大图下方作为数据规格栏 */}
      <dl className="t-meta mt-8 grid max-w-[64rem] gap-x-8 gap-y-2.5 sm:grid-cols-[6rem_1fr] border-y border-line py-5 font-mono text-xs">
        <dt className="text-ink-2 font-medium">研发年份</dt>
        <dd className="text-ink">{cs.year}</dd>

        <dt className="text-ink-2 font-medium">当前状态</dt>
        <dd className="text-ink">{cs.status}</dd>

        <dt className="text-ink-2 font-medium">角色分工</dt>
        <dd className="text-ink">{cs.role}</dd>

        <dt className="text-ink-2 font-medium">技术选型</dt>
        <dd className="flex flex-wrap gap-1.5 text-ink">
          {cs.stack.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded bg-inset border border-line">
              {s}
            </span>
          ))}
        </dd>

        <dt className="text-ink-2 font-medium">开源代码</dt>
        <dd>
          <XRef to={cs.repoUrl}>GitHub 源码仓库 ↗</XRef>
        </dd>
      </dl>

      {/* ——— ESSAY —— 正文深度长文复盘与真实截图穿插 ——— */}
      <div className="mt-16 max-w-[64rem]" data-register="essay">
        {cs.sections.map((section, sIdx) => (
          <section key={section.heading} className="border-t border-line py-12 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="t-meta text-accent font-mono text-xs">
                0{sIdx + 1}
              </span>
              <h2 className="t-h2 font-medium text-xl md:text-2xl text-ink">
                {section.heading}
              </h2>
              {section.headingEn ? (
                <span className="text-xs font-mono text-ink-2 uppercase tracking-widest hidden sm:inline">
                  / {section.headingEn}
                </span>
              ) : null}
            </div>

            {/* 亮点 Callout 卡片（打破沉闷文字） */}
            {section.callout ? (
              <div className="mt-6 p-4 md:p-5 rounded border-l-2 border-accent bg-inset/60">
                <p className="t-meta font-mono font-medium text-accent text-xs">
                  {section.callout.label}
                </p>
                <p className="t-small text-ink mt-1.5 leading-relaxed font-medium">
                  {section.callout.text}
                </p>
              </div>
            ) : null}

            {/* 正文段落 */}
            <div className="u-measure mt-6 space-y-4">
              {section.body.map((para, i) => (
                <p key={i} className="t-body text-ink leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>

            {/* 章节附属真实截图排版（支持双列并排与单列大图） */}
            {section.figures && section.figures.length > 0 ? (
              <div className={section.figures.some((f) => f.variant === "half") ? "mt-8 grid gap-6 md:grid-cols-2" : "mt-8 max-w-[56rem]"}>
                {section.figures.map((f) => (
                  <FigureRow key={f.file} slug={cs.slug} figure={f} />
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      {/* ——— LEDGER —— 严谨可核验出处列表 ——— */}
      <section className="mt-14 border-t border-line pt-10" data-register="ledger" aria-label="相关开源出处与参考">
        <h2 className="t-kicker text-ink-2">可核验出处与参考资料 (References)</h2>
        <p className="t-small text-ink-2 mt-2 max-w-[58ch]">
          本案例所述所有架构设计、测试指标与工程记录均可在以下公开资料中逐一验证：
        </p>
        <ul className="mt-6 max-w-[62ch] space-y-3 font-mono text-xs">
          {cs.references.map((r) => (
            <li key={r.href} className="border-b border-line pb-3 last:border-b-0 flex flex-wrap items-baseline justify-between gap-2">
              <XRef to={r.href}>{r.label}</XRef>
              {r.note ? <span className="text-ink-2">{r.note}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      {/* ——— PLATE —— 下一个案例导航卡片（视觉增强） ——— */}
      {!isSoleCase ? (
        <section className="mt-16 border-t border-line pt-12" data-register="plate" aria-label="下一项案例">
          <p className="t-meta t-caps text-accent font-mono text-xs">NEXT CASE STUDY · 下一项精选案例</p>
          <div className="mt-4 p-6 md:p-8 border border-line bg-raised/70 rounded-sm hover:border-accent/40 transition-colors">
            <h2 className="t-h2 text-2xl font-medium">
              <Link to={`/work/${next.slug}`} className="hover:text-accent transition-colors flex items-center justify-between">
                <span>{next.title}</span>
                <span className="text-base text-accent font-normal font-mono">阅读案例 →</span>
              </Link>
            </h2>
            <p className="t-small text-ink-2 mt-2 max-w-[58ch] leading-relaxed">
              {next.subtitle || next.summary}
            </p>
          </div>
        </section>
      ) : null}
    </article>
  );
}
