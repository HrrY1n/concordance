# PROJECT_STRUCTURE — 项目文件结构与流程档案

## 1. 顶层结构

```
D:\Codex\play\portfolio\
├── README.md                        # 项目入口：快速开始 / 概念 / 流程摘要
├── CONTENT_GUIDE.md                 # ★ 内容维护指南（日常只看这个）
├── DESIGN_SYSTEM.md                 # ★ 设计系统文档
├── PROJECT_STRUCTURE.md             # 本文件
│
├── package.json                     # npm workspace 根（_template / generation_02/* / generation_03 / final）
├── node_modules/                    # 共享依赖（各应用版本一致，一次安装）
│
├── final/                           # ★ 最终交付应用（生产用这个）
│   ├── package.json / vite.config.ts / tsconfig.json / eslint.config.js
│   ├── index.html                   # SEO/OG/JSON-LD/noscript 骨架
│   ├── public/                      # favicon / fonts / og 图 / robots.txt / sitemap.xml
│   ├── scripts/                     # 字体同步等构建辅助脚本
│   ├── DESIGN_NOTES.md              # 设计决策 + 三轮验收自查记录（META PASS 章节）
│   ├── CONTENT_GUIDE.md / DESIGN_SYSTEM.md
│   ├── src/
│   │   ├── main.tsx / App.tsx       # 路由表 / ScrollManager / Shell
│   │   ├── content/                 # ★ 内容数据（唯一需要日常修改的地方）
│   │   │   ├── site.ts              # 站名 / 导航坐标 §00–§07 / 全站读数
│   │   │   ├── profile.ts           # 身份（placeholder）
│   │   │   ├── research.ts          # 研究方向 + Question Ledger（active/exploring/paused）
│   │   │   ├── projects.ts          # 项目 + 证据链（sample: true 标记）
│   │   │   ├── publications.ts      # 论文（空数组 → 优雅空态）
│   │   │   ├── notes.ts             # 笔记（2–3 篇 sample）
│   │   │   ├── lab.ts               # Lab demo 注册表（Corruption Sandbox 等）
│   │   │   ├── timeline.ts          # Now/Log 条目（placeholder）
│   │   │   ├── links.ts             # Email/GitHub/Scholar/ORCID/LinkedIn（null = 隐藏）
│   │   │   └── types.ts / ids.ts    # 编译期白名单契约（DemoId/TopicId/ProjectId）
│   │   ├── lib/                     # bm25 / search+palette / theme / seo / focus / flip / sections
│   │   ├── pages/                   # 11 个路由页
│   │   ├── components/              # Header / Footer / PageShell / Register 组件等
│   │   ├── demos/                   # CorruptionSandbox / ContextBudget / RankersSideBySide
│   │   └── styles/index.css         # 全部设计 token（双主题）/ 字阶 / Register / 动效
│   └── dist/                        # 构建产物（静态托管）
│
├── generation_01/                   # Round 1：8 团队设计提案（BRIEF.md + team_a–h.md）
├── generation_02/                   # Round 2：Top 3 可运行实现（CONTENT_PACK.md 共享数据）
├── generation_03/                   # Round 3：融合实现（= final 的前身，含完整 DESIGN_NOTES）
├── _template/                       # 共享 Vite+React+TS+Tailwind 基线模板
├── _tools/shot/                     # Playwright 截图/验证工具（shoot.mjs）
│
├── design_review_round_01.md        # Round 1 评审汇总（8 案 × 10 评委 → Top 3）
├── design_review_round_02.md        # Round 2 评审汇总（修复清单 + Gen 3 指令）
├── design_review_round_03.md        # Round 3 终审（9 PASS/1 NEEDS_WORK + 26 项 Meta 清单）
├── reviews/                         # 30 份评委报告（round_01/02/03 各 10 份）
├── reports/                         # 分数 JSON、聚合脚本、各评委实测脚本
└── shots/                           # 渲染截图证据（gen2 / gen3：6 视口主题 × 全路由）
```

## 2. 技术栈

| 层 | 选择 | 说明 |
|---|---|---|
| 构建 | Vite 8 | 纯静态 SPA，路由级代码分割 |
| UI | React 19 + TypeScript（严格模式） | 编译期内容契约（`satisfies` / 字面量联合白名单） |
| 样式 | Tailwind CSS v4 | `@theme` token 全站语义化；对比度有 vitest 守卫 |
| 动效 | CSS transitions + 手写 FLIP（~40 行） | 刻意不引入 framer-motion：transform-only、reduced-motion 禁用、bundle 更小 |
| 字体 | Inter（可变）+ Newsreader（display serif）+ 系统 mono 栈 | 2 族 6 文件 latin/latin-ext 子集，preload + 度量对齐 |
| 测试 | Vitest | BM25 数学 / 内容契约 / 对比度矩阵 / 主题解析 / sandbox 验收门 |
| 检索 | 自研 palette（BM25 + KWIC 引文行） | 索引自 content/*.ts 构建期+运行期，0 网络 |

## 3. 路由表

| 路由 | Register | 内容 |
|---|---|---|
| `/` | 混合（PLATE→LEDGER→…→ESSAY→PLATE） | 双语气 Hero（facets 可点击检索）→ Research 预览 → Work 精选 → Lab 预览 → Notes → Connect |
| `/research` | LEDGER | 研究方向 + Question Ledger + FIG.R1 |
| `/work` | PLATE | 项目图版 + 证据链（Role/Stack/Year/Links） |
| `/lab` | LEDGER | demo 索引 + 实时读数 |
| `/lab/corruption-sandbox` | — | 旗舰 demo：投毒注入 → BM25 重排 → 防御重写 |
| `/notes` · `/notes/:slug` | ESSAY | 笔记列表 + 长文版式（边注/代码块双主题） |
| `/publications` | LEDGER | 空态（RESERVED 幽灵行）→ 有数据后自动列表 |
| `/about` | ESSAY | 极简 About + Now/Log |
| `/connect` | LEDGER | 联系槽位（null 隐藏）+ 行动导向空态 |
| 404 | — | 「查无此址」坐标系统彩蛋 |

## 4. 设计流程档案（多 Agent 竞争制）

| 阶段 | 产出 | 结论 |
|---|---|---|
| Round 1 | 8 份独立提案（A–H，各 14 章） | 10 评委 × 14 维 z-score 归一化 → Top 3：A Monograph / D Offprint / H Retrieval |
| Round 2 | 3 个可运行应用 + 60 张截图 + 交互脚本 | 评委复审：A 最完整 / H 最原创+UX 最佳 / D 研究最强但有渲染缺陷 → 融合指令 |
| Round 3 | CONCORDANCE 融合实现 | 10 评委终审：9 PASS + 1 NEEDS_WORK，均分 8.56/10，26 项 Meta 清单 |
| Meta Pass | `final/` | 26 项修复全落实（P0 缺陷 / P1 诚实自洽 / P2 升级），DESIGN_NOTES 有逐项记录 |

评委构成（每轮 10 位独立 Agent）：视觉 / 排印 / UX / 前端工程 / 无障碍 / 移动端 / 学术研究者 / 招聘者 / 产品设计师 / 原创性。评分维度 14 项，报告在 `reviews/`，分数与聚合在 `reports/`。

## 5. 约定

- **内容与表现分离**：组件零硬编码内容；所有用户可见文案来自 `src/content/`。
- **诚实读数**：数量/状态类文案必须数据派生（"never hand-written" 有头注与测试守卫）。
- **sample 标记**：mock 数据带 `sample: true`，页面诚实呈现为示例；替换真实内容后标记即消失。
- **空态一等公民**：publications/links/timeline 为空时渲染设计过的空态，而非空白或假数据。
- **红线**：不编造论文/学校/邮箱/GitHub ID/奖项——placeholder 全部集中在 content/ 等待替换。
