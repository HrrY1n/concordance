# Portfolio — CONCORDANCE

> 一部会回应检索的研究档案。Awwwards 级视觉标准 × 研究者长期主义的内容系统。

这是一个从零开始的个人主页 / Portfolio 项目，面向 **Computer Science Graduate Student / AI Researcher / Developer** 的身份定位（研究兴趣：Retrieval-Augmented Generation、RAG Robustness、Knowledge Poisoning、AI Security、LLM Systems）。

**当前阶段：网站本体已完整建成，内容为 placeholder / sample 数据。** 真实内容（姓名、论文、项目、联系方式）由你逐步填入——改数据文件即可，全程不需要碰组件代码。

---

## 快速开始（三种打开方式）

**方式一 · 开发服务器（推荐，改内容实时热更新）：**

```bash
cd final
npm install        # 或在项目根目录 npm install（workspace 自动覆盖 final/）
npm run dev        # 浏览器打开 http://localhost:5173
```

**方式二 · 双击直接看（无需安装任何东西）：**

用浏览器打开 `final/dist-single/index.html`——一个把全部代码与字体内嵌的自包含文件，双击即可完整浏览（file:// 下自动切换 hash 路由）。改完内容后用 `npm run build:single` 重新生成。

**方式三 · 生产构建预览：**

```bash
npm run build && npm run preview   # http://localhost:4173
```

> 注意：直接双击 `final/index.html`（源码模板）或 `final/dist/index.html`（生产构建）都会白屏——
> 前者是给构建工具的输入，后者的 ES Module 在 file:// 下被浏览器 CORS 策略拦截。请用上面三种方式。

**线上地址与 URL 单源**：正式站点 https://hrry1n.github.io/concordance/ 。域名/子路径只存在
于 `final/src/content/site.ts` 的 `url` 一处——index.html 的 canonical/OG/JSON-LD 由构建期
注入（`__SITE_URL__` token），robots.txt 与 sitemap.xml 构建期生成。换域名 = 改一行。

**GitHub Pages 深链事实**：`/` 为真 200；`/research` 等深链是 **HTTP 404 + 404.html SPA 接管**
（浏览器中全部正常渲染）。这是 GitHub Pages 托管 BrowserRouter SPA 的固有行为；首页可正常
索引，深链有 soft-404 风险——若未来需要单篇笔记被搜索索引，再加构建期 prerender。

**质量门禁**：`npm run test`（76 用例：sandbox 数学 / 内容契约 / 对比度 / sitemap）·
`npm run test:a11y`（axe 五页，零 critical/serious）· `npm run lint`（0/0）。

其他命令（均在 `final/` 下）：

```bash
npm run build      # tsc --noEmit && vite build
npm run preview    # 预览生产构建
npm run test       # vitest（sandbox 数学 / 内容契约 / 对比度 / 主题）
npm run lint       # eslint（0 error 0 warning 门槛）
```

部署：`final/dist/` 是纯静态产物，GitHub Pages / Vercel / Netlify / Cloudflare Pages 均可直接托管（SPA 回退：所有路由指向 index.html）。

## 它长什么样

- **概念**：Concordance（语词索引）——真实存在的书籍物种：按词编排、标注页码的印刷检索工具。这个站既是一本排印精确的"书"，又是一套可操作的检索系统：⌘K（或 `/`）唤起全站检索，命中以 KWIC 引文行呈现；首页每个关键词都可点击检索。
- **三档 Register 排印系统**：LEDGER（台账密度）/ PLATE（图版呼吸）/ ESSAY（长文 serif），全站页面与段落按档位取得节奏，杜绝"从头到尾一种组合拳"。
- **诚实系统**：所有读数（文档数、demo 数、0 RECORDS）均从 `src/content/*.ts` 实时派生，绝不手写；Publications 空态、Connect 空槽、sample 标记都是一等公民——内容少时依然是一个完整的网站。
- **Corruption Sandbox**：旗舰 Lab demo——玩具语料 + 浏览器内实算 BM25，注入一篇投毒文档看它爬到第 1 名，打开防御看排名重写。全部前端离线运行，无任何伪造数据。
- **双主题**：暖纸 Light / 阅读室 Dark（500→470 字重 halation 补偿），System/Light/Dark 三态记忆；token 级对比度契约有测试守卫（可读文本 ≥ 4.5:1）。

## 项目结构

```
portfolio/
├── README.md                 ← 本文件
├── CONTENT_GUIDE.md          ← ★ 内容维护指南（最重要：不懂前端也能改）
├── DESIGN_SYSTEM.md          ← 设计系统（token / 字阶 / Register / 动效契约）
├── PROJECT_STRUCTURE.md      ← 文件结构与设计流程档案
├── design_review_round_01/02/03.md   ← 三轮评审报告（30 份评委报告在 reviews/）
├── generation_01/            ← Round 1：8 个设计团队的提案（A–H）
├── generation_02/            ← Round 2：Top 3 的可运行实现
├── generation_03/            ← Round 3：融合实现 CONCORDANCE
└── final/                    ← ★ 最终交付应用（从这里运行）
    ├── src/content/          ← ★ 所有内容数据（profile / projects / research / notes / publications / links / timeline / lab / site）
    ├── src/pages/ src/components/ src/demos/ src/lib/
    ├── CONTENT_GUIDE.md / DESIGN_SYSTEM.md（与根目录同文）
    └── dist/                 ← 构建产物
```

## 内容红线（本项目的设计前提）

网站内**没有任何编造的个人履历**：没有假论文、假学校、假邮箱、假 GitHub ID。所有未提供的信息都是诚实的 placeholder / 空态，替换入口集中在 `final/src/content/`。详见 [CONTENT_GUIDE.md](CONTENT_GUIDE.md)。

## 设计流程档案

本项目采用多方案竞争 + 多评委独立评审流程：

1. **Round 1**：8 个独立设计团队（极简 / 编辑期刊 / 精密仪器 / 学术 / 创意开发者 / 瑞士 / 暗色高级 / 实验交互）各提交完整设计提案，10 位评委（视觉/排印/UX/工程/无障碍/移动/研究者/招聘者/产品/原创性）× 14 维度独立评分 → Top 3（Monograph / Offprint / Retrieval）。
2. **Round 2**：三案实现为可运行应用，10 评委复审 + Playwright 实测 → 提出全部修复项。
3. **Round 3**：三案融合为 CONCORDANCE，10 评委终审（9 PASS / 1 NEEDS_WORK，均分 8.56/10）。
4. **Meta Pass**：终审 26 项修复清单全部落实于 `final/`。

评审细节见 `design_review_round_0{1,2,3}.md` 与 `reviews/`。
