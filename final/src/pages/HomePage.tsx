import { useMemo } from "react";
import { Link } from "react-router-dom";
import { bm25Rank } from "@/lib/bm25";
import { budgetChunks, sandboxCorpus, sandboxQuery, budgetDefault } from "@/content/lab";
import { links } from "@/content/links";
import { notes } from "@/content/notes";
import { projects } from "@/content/projects";
import { publications } from "@/content/publications";
import { researchQuestions, researchTopics } from "@/content/research";
import { profile } from "@/content/profile";
import { site, heroIdentity } from "@/content/site";
import { DEMO_REGISTRY } from "@/content/ids";
import { DEMO_COUNT, sections } from "@/lib/sections";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";
import { Figure, Section, XRef } from "@/components/structure";
import { RankList } from "@/components/RankList";

/**
 * §00 前扉 HOME —— 中文优先与视觉强化版。
 * 律动体系（Register）：PLATE 封面首屏 → LEDGER 研究方向 → PLATE 精选作品重度图版 → 档案编目 → LEDGER 实验室 → ESSAY 笔记 → PLATE 联系。
 */

const FACET_COUNT = 5;

/* FIG. 01 —— 检索对比图版：同一查询词在注入投毒文档前后的排名剧变（浏览器本地实时计算） */
function DeltaFigure() {
  const clean = useMemo(
    () => bm25Rank(sandboxCorpus.filter((d) => !d.poisoned), sandboxQuery),
    [],
  );
  const poisoned = useMemo(() => bm25Rank(sandboxCorpus, sandboxQuery), []);
  return (
    <Figure
      id="图版 01"
      title="同一检索查询下，投毒前后的 Top 3 文档排序对比"
      method="基于 BM25 算法（k1 1.5 · b 0.75）· 在本页面内由浏览器纯本地即时计算 · 0 网络请求"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="t-meta t-caps text-ink-2 font-mono">原始干净语料库 —— 共 {clean.length} 篇文档</p>
          <div className="mt-3">
            <RankList ranked={clean} top={3} ariaLabel="干净语料库下的 Top 3 排序" />
          </div>
        </div>
        <div>
          <p className="t-meta t-caps text-ink-2 font-mono">
            注入对抗性文档 d8 之后 <span className="text-signal font-medium">▲ 排名被恶意篡改</span>
          </p>
          <div className="mt-3">
            <RankList ranked={poisoned} top={3} ariaLabel="注入恶意文档后的 Top 3 排序" />
          </div>
        </div>
      </div>
      <p className="t-small text-ink-2 mt-4 max-w-[64ch] leading-relaxed">
        对抗性文档通过精心堆叠检索词的高频词元，在纯词法相关度上强行夺取了首位推荐权，将真正切题的事实文档挤出可见窗口。{" "}
        <Link
          to="/lab/corruption-sandbox"
          className="u-link inline-flex min-h-[44px] items-center -my-2 font-medium"
        >
          在实验室中亲手重现此过程 →
        </Link>
      </p>
    </Figure>
  );
}

/* FIG. 02 —— 上下文预算填充图版：根据 Token 容量预算评估文本块截断 */
function ContextFillFigure() {
  const budget = budgetDefault;
  const states = budgetChunks.reduce<{ id: string; tokens: number; fits: boolean; used: number }[]>(
    (acc, chunk) => {
      const tokens = Math.ceil(chunk.text.length / 4);
      const usedBefore = acc.length > 0 ? acc[acc.length - 1].used : 0;
      const fits = usedBefore + tokens <= budget;
      acc.push({ id: chunk.id, tokens, fits, used: fits ? usedBefore + tokens : usedBefore });
      return acc;
    },
    [],
  );
  const fitCount = states.filter((s) => s.fits).length;
  const used = states.length > 0 ? states[states.length - 1].used : 0;
  const totalTokens = states.reduce((sum, s) => sum + s.tokens, 0);
  return (
    <Figure
      id="图版 02"
      title={`在 ${budget} Token 严格预算下的证据容纳与截断情况`}
      method="按 字符 ÷ 4 规则估算 · 纯本地即时重排计算 · 0 网络请求"
    >
      <div
        className="u-figure flex h-8 w-full border border-line bg-raised overflow-hidden"
        role="img"
        aria-label={`上下文预算：${states.length} 个文本块中仅有 ${fitCount} 个能容纳进 ${budget} Token 窗口；${totalTokens - used} Token 的证据需求被硬性截断。`}
      >
        {states.map(({ id, tokens, fits }) => (
          <span
            key={id}
            className={fits ? "border-r border-line bg-ink-2/70" : "border-r border-line bg-signal/40"}
            style={{ width: `${(tokens / totalTokens) * 100}%` }}
            title={`${id} —— 约 ${tokens} Token —— ${fits ? "完全容纳 (fits)" : "硬性截断 (truncated)"}`}
          />
        ))}
      </div>
      <p className="t-meta text-ink-2 mt-3 font-mono text-xs">
        容纳 {fitCount}/{states.length} 个文本块 · 已占用 {used} Token · 丢弃 {totalTokens - used} Token (估算值)
      </p>
      <p className="t-small text-ink-2 mt-2 max-w-[64ch] leading-relaxed">
        检索排序的次序决定了哪些上下文能留在窗口内 —— 重排序本质上是在决断哪些事实被允许存在。{" "}
        <Link to="/lab" className="u-link inline-flex min-h-[44px] items-center -my-2 font-medium">
          前往实验室自由调整预算与顺序 →
        </Link>
      </p>
    </Figure>
  );
}

export default function HomePage() {
  useDocumentMeta("", site.description);
  const { openSearch } = useSearch();

  const facets = researchTopics.slice(0, FACET_COUNT);
  const recentNotes = [...notes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);

  const email = links.email;
  const firstChannel = (["email", "github", "scholar", "orcid", "linkedin", "rss"] as const).find(
    (k) => links[k],
  );

  const readings = [
    `精选作品 ${projects.length}`,
    `研究方向 ${researchTopics.length}`,
    `问题台账 ${researchQuestions.length}`,
    `工程笔记 ${notes.length}`,
    `论文收录 ${publications.length}`,
  ].join(" · ");

  return (
    <>
      {/* ——— REGISTER PLATE —— 首页首屏：强化个人主理身份与研究/工程双重视角 */}
      <section
        aria-labelledby="hero-title"
        data-live="true"
        data-section="home"
        className="wrap flex min-h-[calc(100svh-4rem)] flex-col justify-center pb-14 pt-10 md:pt-16"
      >
        <div className="max-w-[58rem]">
          {/* 主理人与定位标签 */}
          <div className="settle flex flex-wrap items-center gap-x-3 gap-y-1.5" style={{ "--settle-i": 0 } as React.CSSProperties}>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-accent/15 text-accent border border-accent/20">
              主理人 @{profile.handle}
            </span>
            <p className="t-meta text-ink-2 font-mono text-xs md:text-sm">
              {heroIdentity}
            </p>
          </div>

          {/* 双声部大标题：中文优先，具有古典学术文献与现代软件美感的排版 */}
          <h1 id="hero-title" className="t-display settle mt-6 max-w-[26ch] tracking-tight leading-[1.15]" style={{ "--settle-i": 1 } as React.CSSProperties}>
            <span className="block text-ink">
              {site.heroSans[0]}
            </span>
            <span className="block text-ink mt-1">
              {site.heroSans[1]}
            </span>
            <span className="t-serif-voice block text-accent font-normal mt-2">
              {site.heroSerif}
              <span aria-hidden="true" className="caret ml-1" />
            </span>
          </h1>

          {/* 阐述副标题 */}
          <p
            className="t-lede text-ink-2 settle mt-7 max-w-[56ch] leading-relaxed"
            style={{ "--settle-i": 2 } as React.CSSProperties}
          >
            {site.heroLede}
          </p>

          {/* 核心检索词汇快捷入口（Facets Chips） */}
          <div
            className="mt-8 flex flex-wrap items-center gap-2.5"
            role="group"
            aria-label="快速检索建议词 —— 点击直接唤出检索面板"
          >
            <span className="t-meta text-faint text-xs font-mono mr-1">快速检索：</span>
            {facets.map((f) => (
              <button
                key={f.id}
                type="button"
                className="u-chip text-xs"
                onClick={() => openSearch(f.short)}
              >
                {f.short}
                <span aria-hidden="true"> ⌕</span>
              </button>
            ))}
          </div>

          {/* 关键行动入口按钮组 */}
          <div className="settle mt-10 flex flex-wrap items-center gap-4" style={{ "--settle-i": 3 } as React.CSSProperties}>
            <Link
              to="/work"
              className="inline-flex min-h-[48px] items-center justify-center px-6 rounded border border-line-strong bg-ink text-bg font-medium text-sm transition-all hover:opacity-90 hover:shadow-md"
            >
              浏览精选作品 (View Work) →
            </Link>
            <Link
              to="/research"
              className="inline-flex min-h-[48px] items-center justify-center px-5 rounded border border-line bg-raised text-ink text-sm font-medium transition-colors hover:bg-inset"
            >
              §01 研究方向
            </Link>
            <Link
              to="/lab"
              className="inline-flex min-h-[48px] items-center justify-center px-5 rounded border border-line bg-raised text-ink text-sm font-medium transition-colors hover:bg-inset"
            >
              §03 实验仪器
            </Link>
            <Link
              to="/about"
              className="u-link t-small inline-flex min-h-[48px] items-center px-3"
            >
              关于档案与我 →
            </Link>
          </div>
        </div>
      </section>

      {/* ——— REGISTER PLATE —— 精选作品展示（Selected Work）：重度视觉增强图版 */}
      <Section
        meta={sections.find((s) => s.id === "work")!}
        register="plate"
        lede="拒绝千篇一律的卡片瀑布流。每一件作品均配备直观的真实运行图版、可核验的公开代码仓库与完整的工程证据链。"
      >
        <div className="space-y-16 md:space-y-24">
          {/* 旗舰作品 1: Private Item Library */}
          <article className="border border-line bg-raised/50 p-6 md:p-10 rounded-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <span className="t-meta t-caps text-accent font-mono font-medium">
                PLATE 01 · 旗舰作品 · 本地优先物资归置 PWA
              </span>
              <span className="t-meta text-ink-2 font-mono text-xs">
                2026 · 持续维护 (v0.1.0)
              </span>
            </div>

            <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <h3 className="t-h1 text-2xl md:text-3xl font-medium tracking-tight">
                  <Link to="/work/item-storage-app" className="hover:text-accent transition-colors">
                    Private Item Library
                  </Link>
                </h3>
                <p className="t-lede text-ink-2 mt-4 text-sm md:text-base leading-relaxed">
                  本地优先的个人私密物资与资产管理应用。数据完全驻留设备端 IndexedDB，
                  支持物品全生命周期追踪、持有成本与日均折算、点阵保修倒计时、校验 ZIP 备份恢复及配对码增量同步。
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["React 19", "TypeScript", "Dexie 4", "IndexedDB", "PWA", "Local-first"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs font-mono border border-line rounded bg-inset text-ink-2">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 border-l-2 border-accent/40 pl-4 space-y-1.5 text-xs text-ink-2">
                  <p className="font-mono text-ink font-medium">核心事实证据：</p>
                  <p>· 10+ 单元测试覆盖 Schema 迁移与 fake-indexeddb 仓库</p>
                  <p>· 220 套高清透明立体插画图标体系，浅深双色共用</p>
                  <p>· 14 张真实界面无损截图留档，零私人隐私侵入</p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    to="/work/item-storage-app"
                    className="inline-flex min-h-[44px] items-center px-4 rounded bg-ink text-bg font-medium text-sm transition-opacity hover:opacity-90"
                  >
                    深入阅读完整案例复盘 →
                  </Link>
                  <XRef to="https://github.com/HrrY1n/item-storage-app">
                    GitHub 源码 ↗
                  </XRef>
                </div>
              </div>

              {/* 真实界面图版 */}
              <div className="lg:col-span-7">
                <Link to="/work/item-storage-app" className="group block overflow-hidden border border-line bg-raised rounded shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={`${import.meta.env.BASE_URL}cases/item-storage-app/09-desktop-home-light.png`}
                    alt="Private Item Library 桌面端资产看板：侧栏导航、宽屏资产与成本看板、物品网格与保修提醒"
                    width={1440}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="p-3 bg-inset/70 border-t border-line flex items-baseline justify-between text-xs text-ink-2 font-mono">
                    <span>桌面端完整看板（1440×1000 真实实测截图）</span>
                    <span className="text-accent group-hover:underline">点击查看案例详情 →</span>
                  </div>
                </Link>
              </div>
            </div>
          </article>

          {/* 旗舰作品 2: SoundIsle · 声屿 */}
          <article className="border border-line bg-raised/50 p-6 md:p-10 rounded-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <span className="t-meta t-caps text-accent font-mono font-medium">
                PLATE 02 · 创意编程 · 纯算法合成 Web Audio 工作台
              </span>
              <span className="t-meta text-ink-2 font-mono text-xs">
                2026 · 持续维护 (7 轮工程迭代)
              </span>
            </div>

            <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <h3 className="t-h1 text-2xl md:text-3xl font-medium tracking-tight">
                  <Link to="/work/soundisle" className="hover:text-accent transition-colors">
                    SoundIsle · 声屿
                  </Link>
                </h3>
                <p className="t-lede text-ink-2 mt-4 text-sm md:text-base leading-relaxed">
                  纯前端程序化合成的声音专注空间。零外部音频素材依赖，基于 Web Audio 节点网络实时合成 6 组环境音景，
                  配合随实时频谱律动的 Canvas 夜海交互场景与防后台漂移专注计时器。打包体积仅 35 KB JavaScript。
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Web Audio API", "Canvas 2D", "TypeScript", "音频算法", "零资源依赖"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs font-mono border border-line rounded bg-inset text-ink-2">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 border-l-2 border-accent/40 pl-4 space-y-1.5 text-xs text-ink-2">
                  <p className="font-mono text-ink font-medium">核心事实证据：</p>
                  <p>· 零 MP3/WAV 采样下载，代码体积仅 35 KB</p>
                  <p>· 波浪物理振幅与月径碎光直接绑定各声道实时频谱数据</p>
                  <p>· 7 轮抗削波失真与时钟防漂移调校记录公开可核查</p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    to="/work/soundisle"
                    className="inline-flex min-h-[44px] items-center px-4 rounded bg-ink text-bg font-medium text-sm transition-opacity hover:opacity-90"
                  >
                    深入阅读完整案例复盘 →
                  </Link>
                  <XRef to="https://github.com/HrrY1n/soundisle">
                    GitHub 源码 ↗
                  </XRef>
                </div>
              </div>

              {/* 真实界面图版 */}
              <div className="lg:col-span-7">
                <Link to="/work/soundisle" className="group block overflow-hidden border border-line bg-raised rounded shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={`${import.meta.env.BASE_URL}cases/soundisle/hero-night-sea.png`}
                    alt="SoundIsle 默认夜海全景视图：明月与星空、波浪、中央极简计时器与 6 轨混音台"
                    width={1280}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="p-3 bg-inset/70 border-t border-line flex items-baseline justify-between text-xs text-ink-2 font-mono">
                    <span>静谧夜海全景（1280×800 纯代码无损实拍）</span>
                    <span className="text-accent group-hover:underline">点击查看案例详情 →</span>
                  </div>
                </Link>
              </div>
            </div>
          </article>

          {/* 元项目: Concordance */}
          <article className="border-t border-line pt-8 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="t-meta text-accent font-mono">PLATE 03 · 档案本体</p>
              <h4 className="t-h3 mt-1 font-medium">Concordance · 个人研究与作品档案</h4>
              <p className="t-small text-ink-2 mt-2 max-w-[54ch]">
                以书籍索引为隐喻构建的数据驱动型个人网站。全站内容皆为类型化 TypeScript 数据，所有统计与图版皆为纯前端运算。
              </p>
            </div>
            <div className="flex items-center gap-4">
              <XRef to="https://github.com/HrrY1n/concordance">查看开源代码 ↗</XRef>
              <Link to="/work" className="u-link t-small font-medium">
                查看全部 3 项图版与证据链 →
              </Link>
            </div>
          </article>
        </div>
      </Section>

      {/* ——— REGISTER LEDGER —— 研究方向预览：6 大方向与核心论断图版 */}
      <Section
        meta={sections.find((s) => s.id === "research")!}
        register="ledger"
        lede="六大稳定方向，秉持同一种工程方法：按语料、检索、生成严格审视流水线，并在每个阶段架设可观测的测量仪器。"
      >
        <ul>
          {researchTopics.slice(0, 3).map((t) => (
            <li key={t.id} className="border-b border-line">
              <Link
                to={`/research#${t.id}`}
                className="group grid min-h-[56px] grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-4 md:grid-cols-[5rem_16rem_1fr]"
              >
                <span className="t-meta text-accent font-mono">{t.short}</span>
                <span className="t-entry text-ink transition-colors group-hover:text-accent font-medium">
                  {t.name}
                </span>
                <span className="t-small text-ink-2 max-md:col-start-2">{t.facetLine}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="settle mt-10">
          <DeltaFigure />
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="t-meta text-ink-2 font-mono text-xs">
            台账状态 —— 方向已公开，待有明确代码或实验支撑的研究问题时再行编号收录
          </p>
          <XRef to="/research">查看全部 6 大研究方向详情</XRef>
        </div>
      </Section>

      {/* ——— 全站章节总览索引带（The Concordance At a Glance）——— */}
      <section aria-label="全站架构索引" className="border-y border-line bg-inset/40">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="t-kicker text-ink-2">全站章节坐标索引</p>
            <ul className="mt-4">
              {sections.map((s) => (
                <li key={s.id} className="border-b border-line last:border-b-0">
                  <Link
                    to={s.route}
                    className="group flex min-h-[48px] items-baseline gap-3 py-3 transition-colors hover:bg-raised px-2 -mx-2 rounded"
                  >
                    <span className="t-meta text-accent font-mono" aria-hidden="true">
                      §{s.num}
                    </span>
                    <span className="t-small text-ink transition-colors group-hover:text-accent font-medium">
                      {s.title}
                    </span>
                    <span className="t-meta text-ink-2 text-xs font-mono ml-2 hidden sm:inline">
                      / {s.titleEn}
                    </span>
                    {s.reading ? (
                      <span className="t-meta text-ink-2 ml-auto text-right font-mono text-xs">
                        {s.reading}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 border-t lg:border-t-0 lg:border-l border-line pt-6 lg:pt-0 lg:pl-10 flex flex-col justify-between">
            <div>
              <p className="t-kicker text-ink-2">数据盘点读数</p>
              <p className="t-meta text-ink mt-3 font-mono leading-relaxed text-xs">{readings}</p>
              <p className="t-small text-ink-2 mt-4 max-w-[44ch] leading-relaxed">
                语录索引（Concordance）是一部特殊的典籍 —— 它既是书籍本体，又是一套严谨的全文检索机制。
                本站的所有统计与图版皆直接从数据模块计算而来，绝无虚伪的手写数字。
              </p>
            </div>
            <div className="mt-6">
              <XRef to="/lab">前往探索实验室仪器 →</XRef>
            </div>
          </div>
        </div>
      </section>

      {/* ——— REGISTER LEDGER —— 实验室预览：可交互的纯前端演示 ——— */}
      <Section
        meta={sections.find((s) => s.id === "lab")!}
        register="ledger"
        lede={`${DEMO_COUNT} 项纯前端计算仪器。全部算法与数据直接在你的浏览器内运行，绝不向任何外部服务器发送请求。`}
      >
        <div className="max-w-[56rem]">
          <ContextFillFigure />
          <p className="t-meta text-ink-2 mt-6 font-mono text-xs">
            当前收录仪器 ——{" "}
            {Object.values(DEMO_REGISTRY)
              .map((d) => `${d.index} ${d.title}`)
              .join(" · ")}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            <XRef to="/lab/corruption-sandbox">运行投毒模拟沙盒 (Corruption Sandbox)</XRef>
            <XRef to="/lab">打开全部实验仪器</XRef>
          </div>
        </div>
      </Section>

      {/* ——— REGISTER ESSAY —— 笔记预览 ——— */}
      <Section
        meta={sections.find((s) => s.id === "notes")!}
        register="essay"
        lede="笔记专为深度阅读而排版：选用适宜沉浸阅读的字宽与留白，保留侧栏旁注与真实代码考证。"
      >
        <div className="u-measure">
          <ul>
            {recentNotes.map((n) => (
              <li key={n.id} className="border-b border-line py-6 last:border-b-0">
                <p className="t-meta text-ink-2 font-mono text-xs">
                  {n.date} · {n.kind === "engineering" ? "工程架构" : n.kind}
                </p>
                <h3 className="t-h3 mt-2 font-medium">
                  <Link to={`/notes/${n.id}`} className="u-link">
                    {n.title}
                  </Link>
                </h3>
                <p className="t-small text-ink-2 mt-3 leading-relaxed">{n.summary}</p>
                <div className="mt-4">
                  <XRef to={`/notes/${n.id}`}>阅读全文并查看代码实现</XRef>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <XRef to="/notes">浏览全部笔记归档</XRef>
          </div>
        </div>
      </Section>

      {/* ——— REGISTER PLATE —— 联络通讯通道 ——— */}
      <Section meta={sections.find((s) => s.id === "connect")!} register="plate">
        <div className="max-w-[54rem]">
          {firstChannel ? (
            <>
              <h3 className="t-h2 font-medium">
                {site.connectFastest}{" "}
                <span className="t-serif-voice text-accent">
                  {firstChannel === "github" ? "GitHub 公开主页" : firstChannel === "email" ? "电子邮箱" : `${firstChannel}`}
                </span>
              </h3>
              <p className="t-lede text-ink-2 mt-4 max-w-[54ch] leading-relaxed">{site.connectIntro}</p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 items-center">
                {firstChannel === "github" && links.github ? (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center px-4 rounded bg-ink text-bg font-medium text-sm transition-opacity hover:opacity-90"
                  >
                    github.com/{profile.handle ?? ""} <span aria-hidden="true" className="ml-1">↗</span>
                  </a>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="u-link t-small inline-flex min-h-[44px] items-center"
                  >
                    {email} <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                <XRef to="/connect">查看所有渠道与说明</XRef>
              </div>
            </>
          ) : (
            <>
              <h3 className="t-h2 max-w-[30ch] font-medium">{site.connectEmptyTitle}</h3>
              <p className="t-lede text-ink-2 mt-4 max-w-[52ch] leading-relaxed">{site.connectIntro}</p>
              <div className="mt-6">
                <XRef to="/connect">前往联络页面</XRef>
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
