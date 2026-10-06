# CONTENT_GUIDE — 内容维护指南

> **这份指南的目标：不懂前端也能照着改。** 网站的一切文字、项目、论文、笔记、链接都来自
> `final/src/content/` 下的数据文件——**改数据、保存，页面自动更新**。日常使用不需要打开
> 任何 `.tsx` 组件文件。
>
> 改完想看效果：在 `final/` 下运行 `npm run dev`，浏览器打开 http://localhost:5173（实时热更新）。
> 不想装环境？双击 `final/dist-single/index.html` 也能看——自包含单文件，改完内容后用 `npm run build:single` 重新生成。
> （不要双击 `final/index.html` 或 `final/dist/index.html`，那两个会白屏，原因见 README。）
> 发布前跑一遍 `npm run build`（会同时做类型检查——写错了它会告诉你错在哪一行）。

---

## 0. 三条心法

1. **改数据，不改组件。** 所有页面从 `src/content/*.ts` 读数据。你在数据里加一条，页面、
   导航、页脚读数、sitemap、站内检索会**自动**跟着变。
2. **诚实是站点的宪法。** 所有数字（"LAB 3 DEMOS"、"PUBS 0"、"7 documents"）都是从数据
   实时算出来的，没有任何地方手写数字。所以你只管改数据，网站不会说谎。
3. **`sample: true` 是"示例"标记。** 目前所有项目、笔记、时间线条目都带 `sample: true`，
   表示"这是占位示例"。填入真实内容后，**删掉这个字段或改为 `false`**。页脚有一句常驻
   声明解释这件事；当 `sample` 条目清零后，声明自动变成"无示例数据"。

## 1. 我是谁 —— `profile.ts`

```ts
export const profile: Profile = {
  name: "Zhang San",            // 现在是 null：网站不显示姓名，也不编造
  identity: ["Computer Science", "Research × Engineering"],
  about: "……一段简洁的自我介绍……",
  location: null,               // 不想公开就保持 null
};
```

- `name: null` 时导航/About/JSON-LD 全部优雅降级；填上名字立即出现。
- `about` 里可以中英文混排，站点有 `:lang(zh)` 排印适配。

## 2. 站点名字与域名 —— `site.ts`

```ts
export const site = {
  name: "Concordance",           // 站名；不想要概念名可以改成你的名字
  url: "https://hrry1n.github.io/concordance/",   // ★ 部署前必改：你的真实域名
  …
};
```

`url` 是**全站唯一的 URL 来源**：index.html 里的 canonical / og:url / og:image /
twitter:image / JSON-LD 由构建期自动注入，robots.txt 与 sitemap.xml 构建期生成——
换域名或改路径 = 只改这一行，然后 `npm run build`。

**品牌规则**：Header 字标和页面标题自动使用 `profile.name`——
- `name: null` 时：站名 "Concordance"、标题 "Concordance — Research Archive"；
- 填入真名后：字标变为 "你的名字 — Concordance"、标题以你的名字结尾。
无需改任何组件或 HTML，一次 `profile.ts` 修改全站生效。

**sample 读数**：数据里 `sample: true` 的条目会在 Work 图版元数据列、首页精选与
Notes 列表里显示一行 mono 的 `sample entry`——访客不会把示例误认成真实履历。
替换为真实内容后（删掉 sample 字段），该读数自动消失。

## 3. 研究方向与研究问题 —— `research.ts`

研究方向（topics）与研究问题（questions）是这个站的第一公民。

**加一个研究方向：**

```ts
{
  id: "agent-eval",              // 新 id —— 必须同时加进 ids.ts 的白名单（见 §3.1）
  name: "Agent Evaluation",
  short: "AGENT EVAL",
  blurb: "How to measure whether a retrieval-grounded agent actually helps.",
  order: 7,                      // 排序用
  facetLine: "agents · evals",   // 首屏可点击检索的关键词行（可选）
  adjoins: ["rag", "llm-systems"], // 相邻方向（必须也是白名单里已有的 id）
  relatedDemo: undefined,        // 若 Lab 有对应 demo，填它的 id
}
```

**加一个研究问题（Question Ledger）：**

```ts
{
  id: "q5",
  text: "Can attribution errors be detected from ranking instability alone?",
  status: "active",      // 只有三态：active / exploring / paused
  updated: "2026-10",    // 或 null（渲染时直接消失，不会留空槽）
  sample: false,
  topic: "knowledge-poisoning",    // 必须是已有 topic 的 id
  relatedDemo: "corruption-sandbox",  // 可选；写错 id 会编译报错
  relatedNotes: ["n2"],               // 可选；写错 id 会被测试拦下
}
```

台账的编号（Q01…）、状态图例、与 demo/笔记的双向链接全部自动派生。

### 3.1 白名单（为什么改错会报错——这是故意的）

`src/content/ids.ts` 里有两个列表（`TopicId`、`DemoId`）。任何地方的 `topic` /
`relatedDemo` / `adjoins` 只能填列表里存在的 id——**拼错会在 `npm run build` 时直接报错**，
而不是上线后变成一个悄悄失效的链接。加新方向/demo 时记得往白名单里加一行。

## 4. 加一个项目 —— `projects.ts`

```ts
{
  id: "rag-lab",
  title: "rag-lab — RAG pipeline experimentation toolkit",
  summary: "A small harness for measuring how corpus changes move answer quality.",
  year: 2026,
  role: "Author & maintainer",
  kind: "tool",                  // research | tool | site | demo
  tags: ["python", "bm25", "evaluation"],
  status: "active",              // active | maintained | archived | null
  links: {
    github: "https://github.com/you/rag-lab",  // 没有就 null，按钮自动隐藏
    demo: null,
    writeup: null,
  },
  featured: true,                // true = 首页精选（建议 ≤ 3 件）
  sample: false,                 // 真实内容删掉 sample 字段或设 false
  demoRef: undefined,            // 若在站内 Lab 有对应 demo，填 demo id
}
```

页面呈现是"图版（Plate）"版式，不是三列卡片；`featured` 的项目会出现在首页。

## 5. 加一篇论文 —— `publications.ts` ★ 当前为空，路径已修通

```ts
export const publications: Publication[] = [
  {
    id: "pub-2027-poisoning",
    title: "Knowledge Poisoning in Retrieval-Augmented Generation: …",
    authors: ["Zhang San", "Co-author"],
    venue: "arXiv preprint arXiv:2701.xxxxx",
    year: 2027,
    links: { pdf: "https://…", code: null, doi: null },  // 没有的写 null
  },
];
```

- **数组为空时**：页面显示优雅的空态（"Selected research will appear here."）+ 幽灵行，
  不伪造任何"投稿中/在审"进度。
- **加入第一篇后**：页面自动变成完整列表（编号自动、链接缺失自动隐藏），
  页脚读数从 `PUBS 0` 变成 `PUBS 1`，检索里能搜到这篇论文，sitemap 也包含它。
  不需要改任何页面代码。

## 6. 写一篇笔记 —— `notes.ts`

```ts
{
  id: "n4",                       // 递增即可
  title: "Notes on evaluating retrieval under corpus shift",
  date: "2026-10-07",             // ISO 日期
  kind: "paper-reading",          // note | paper-reading | engineering
  summary: "What moves and what holds when the corpus distribution moves.",
  sample: false,
  body: [                         // 没有 body 就是"仅列表"条目；有 body 才有文章页
    { type: "p", text: "开头一段……",
      sidenote: { n: 1, text: "页边注：桌面端显示在旁边，手机端折叠。" } },
    { type: "h", text: "小标题" },
    { type: "code", caption: "一段伪代码", lang: "python",
      text: "def score(docs):\n    return bm25(docs)" },
    { type: "p", text: "继续正文……" },
  ],
}
```

- 文章页是 ESSAY 档：严格行宽、serif 正文、编号边注、双主题代码块。
- **新笔记自动**获得：列表条目、文章页 `/notes/n4`、站内检索（正文全文索引）、
  sitemap 条目。什么都不用再改。
- 研究问题想回链这篇笔记：在 `research.ts` 对应问题的 `relatedNotes` 里加 `"n4"`。

## 7. 时间线（Now / Log）—— `timeline.ts`

```ts
{ year: "2026", kind: "education", title: "Ph.D. in Computer Science — 你的学校",
  detail: "方向：检索增强生成的鲁棒性。", sample: false }
```

`kind` 四选一：`education | research | milestone | elsewhere`。倒序排列（新的在上）。
它刻意不是"传统简历时间轴"，而是日志式条目。

## 8. 联系方式 —— `links.ts`

```ts
export const links: Links = {
  email: "you@example.com",      // null = 整个入口隐藏，不显示假邮箱
  github: "https://github.com/you",
  scholar: null,                 // 没配置的槽位自动消失
  orcid: null,
  linkedin: null,
  rss: null,
};
```

`email: null` 时 Connect 页显示行动导向空态；填入后自动出现 mailto 与复制按钮。
**全站没有任何"假联系方式"**——所有槽位都是"配置即出现，不配置即隐藏"。

## 9. Lab 语料与 demo —— `lab.ts`

三个 demo（Corruption Sandbox / Context Budget / Rankers Side-by-Side）是站内组件，
**不建议**非前端使用者新写第四个 demo。可以安全修改的：

- `sandboxDocs`：投毒沙盒的语料句子（保持短句、英文；`poisoned: true` 标记投毒文档）；
- `toyDefense.patterns / factor`：玩具防御的降权规则（页面上永远标注"toy heuristic"）；
- `paletteSuggestions`：palette 空态的推荐检索词。

demo 数量读数（"LAB 3 DEMOS"）是派生的——加一个真的 demo 后读数自动变 4。

## 10. 常见错误速查

| 症状 | 原因 | 解法 |
|---|---|---|
| `npm run build` 报 `TopicId` / `DemoId` 类型错误 | `topic`/`relatedDemo`/`adjoins` 填了白名单外的 id | 加进 `ids.ts` 白名单，或改用已有 id |
| 测试 `content-contract` 变红 | `relatedNotes` 指向不存在的笔记 id / 缺 `sample` 字段 | 按报错信息补齐 |
| 页面出现多余空槽 | 该字段用了 `""` 空字符串而不是 `null` | 没有的信息一律写 `null`，渲染层自动隐藏 |
| 日期显示怪 | 不是 `YYYY-MM` / `YYYY-MM-DD` 格式 | 按格式写 |
| 加了项目但首页不显示 | `featured` 不是 `true` | 首页精选只取 `featured` 项目 |

## 11. 发布前 checklist

1. `site.ts` 的 `url` 改成真实域名（影响 OG / sitemap / canonical）。
2. `profile.ts` 填 `name`（或继续匿名——站点的降级是设计过的）。
3. `links.ts` 配置联系方式（其余保持 null）。
4. 全局搜索 `sample: true`，真实内容全部替换完毕。
5. （可选）用 `scripts/og.html` 重新生成分享卡 `public/og.png`（1200×630 截图）。
6. `npm run build && npm run test && npm run lint` 三关全绿。
7. 把 `final/dist/` 部署到任意静态托管（GitHub Pages / Vercel / Netlify / Cloudflare Pages）。
