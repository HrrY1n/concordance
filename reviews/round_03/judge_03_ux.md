# Judge 03 · UX 终审报告 — CONCORDANCE (Generation 3)

- 评委：Judge 03 · UX / information_hierarchy 终审
- 评审对象：`D:\Codex\play\portfolio\generation_03\`（预览 http://localhost:4183/）
- 方法：**Playwright 交互实测**（4 个脚本，`reports/j3_ux_interact.mjs` / `j3_ux_probe.mjs` / `j3_ux_focus.mjs` / `j3_ux_confirm.mjs` / `j3_ux_skiplink.mjs`，共 58 条断言）+ 源码核对 + 截图审阅（`shots/gen3/` 全集 + 本评委补拍 5 张：`reports/j3_404_desktop.png`、`j3_palette_empty.png`、`j3_palette_query.png`、`j3_sandbox_defense.png`、`j3_mobile_menu.png`、`j3_publications_mobile.png`）
- 环境事实：`npm run test` 复跑 **5 文件 67 用例全部通过**；shoot 的 `concordance.console.json` 为空数组（无 console error）；本次交互全程 **0 pageerror / 0 console error**。

---

## 1. 关键任务流实测记录（不只看截图）

### T1 · Palette 检索 → 跳转 — **PASS**
- `/` 打开 palette（T1a）；焦点经 ~20ms 延迟落入 combobox（T1-pre PASS，注意：20ms 内键入会丢失——见 §5 备注）；键入 "corruption" → 1 条结果 `DEMO Corruption Sandbox §03`（T1b）。
- `aria-expanded=true`、`aria-controls=palette-list`（T1e）；8 条结果时 ↓↓ 后 `aria-activedescendant=palette-opt-2`，↑↑ 环绕到 opt-7（T1c + 探针 P2，环绕语义正确）。
- Enter → `url=/lab/corruption-sandbox`，h1="Corruption Sandbox"（T1d）。Esc 关闭（T1f）。
- 空查询时 palette 即目录（§00–§07 全列出，`j3_palette_empty.png`）；"poison" 查询返回 6 条跨类型结果并标注坐标（`j3_palette_query.png`）；footer 读数 "local index · 30 records · 0ms network" 与代码同构为真（`search.ts:28-137` 确由内容模块构建）。
- **"Re-ink the page" ACTION 记录**在 palette 内执行主题切换（T9c PASS）。

### T2 · Hero facet 点击 → palette 预填（M3）— **PASS**
- Hero chip "RAG ⌕" 点击 → palette 打开且输入框已预填 "RAG"，立即 4 条结果（T2a/T2b），Enter → `/research`（T2c）。
- Work 页 tags 同样是检索入口（`WorkPage.tsx:133-141`，下划线文字按钮非 chip，探针 P3：tag="RAG" → 预填 "RAG"）；Research 页 adjoins chips（`ResearchPage.tsx:105-114`）同样实测可用。
- M3 **真实落实**，不是表态链接。

### T3 · Sandbox 注入 → 排名变化 → 防御 → 重排（A1/D2）— **PASS（全套正确）**
实测序列（`/lab/corruption-sandbox`，1440×900）：
1. 初始 clean：top-5 = d1(2.17)…（T3a）。
2. **Inject**：d8 升至 **rank 1**（score 3.73），行出现 signal 左边框 + "▲ POISONED" 标记（非仅颜色，`poisonedFlags=2`）（T3b）。
3. **aria-live 分场景播报实测**：注入后 → "Poisoned document injected: it ranks 1 with score 3.73."（T3c）；**防御后** → "Toy defense on: the poisoned document is demoted to rank 6. Top result is d1."（T3e）；移除后 → "Poisoned document removed. Clean corpus restored."（T3g）。逐字来自 `CorruptionSandbox.tsx:62-69`，与界面状态一致。
4. **Defense**：d8 掉出 top-3（实测掉至 rank 6，不在 top-5 内）——**重排后再取 top-5** 的正确语义（T3d）；条宽实测 `1.00, 0.97, 0.53, 0.51, 0.35`：≤1 无溢出、≥0.02 下限（T3f）。
5. ▲▼ delta 为真实数据（防御后各行 ▲1）。
6. 页面下方 honesty 声明常驻 + 详细解释含 Q1/Q2 回链（`j3_sandbox_defense.png`）。
- 结论：Round 2 A1/D2 的全部要求**逐条为真**，且被 `sandbox-acceptance.test.ts`（inject → d8 第 1；defense → 掉出 top-3）双保险。

### T4 · 移动导航 → 深链路由 → 返回 — **PASS**
- 390×844 touch：header 汉堡（aria-label "Open site index"）→ 全屏 `role=dialog` 目录，7 行链接（T4a），**行高最小 54px**（T4b），底部含 palette 入口 + 主题 radiogroup（Sys/Light/Dark）+ corpus 读数（`j3_mobile_menu.png`）。
- 点 Research → `/research`，菜单关闭（T4c）；**刷新深链存活**（h1="Research"，T4d）；浏览器后退回首页（T4e）。
- Header 3 个按钮最小触控 44.0px（T4f）；CSS `@media (pointer: coarse)` 全局 a/button/option/summary ≥44px（`index.css:667-675`）实测生效。

### G1 复核 · 入场动画从可见态开始 — **PASS（逐项证伪未果）**
- 早期采样 `.settle` 计算样式 **opacity=1**（T5a）；全样式表扫描 settle/hero 相关规则**无任何 `opacity:0`**（T5b）——`settle-up` 仅 translateY 12px→0（`index.css:604-616`）。
- **禁用全部 animation/transition 后**：hero h1 完整渲染（733×333px、opacity 1、transform none），FIG.01 六根 rank 条立即在位（T5c/T5d）——动画从头到尾只是位移，内容任何时刻可见。
- 回访免闪：`index.html:36-39` 首帧前打 `data-settled`，实测 `html[data-settled]` 机制存在（App.tsx:109-117 + CSS `animation:none`）。
- **noscript**：禁 JS 加载 `/`，静态骨架完整可读（标语 + §01–§07 目录 + 诚实声明 "intentionally honest about what is missing"）（T5e）。打印样式全套存在（`index.css:703-745`，token 重映射纯黑白、fold 全开）。

### G4 复核 · 深链刷新与 404 — **大部分 PASS，1 个确认级 bug**
- 12 条路由（/、/research、/work、/lab、/lab/corruption-sandbox、/notes、/notes/n1-n3、/publications、/about、/connect）**逐条冷加载刷新：全部 200 + 正确 h1 + 内容完整**（每页 main 文本 552–4520 字符）。
- 未知路径 → 高质量 404（"404 · NO RECORD AT THIS ADDRESS" + 坐标语法 h1 + "query the corpus" 入口 + 返回链接 + §01–§07 地址列表，`j3_404_desktop.png`）；坏 note slug → `NotFoundPage kind="note"`（`NotePage.tsx:49`）。
- **FAIL（确认 bug）：hash 深链在冷加载/刷新时永远不滚动。**
  - 证据：全新 context 冷加载 `/research#q1` → **scrollY=0，等待 3.5 秒后仍为 0**（confirm C1）；`/work#plate-this-site` 同样 scrollY=0（C2）。
  - 机理：`App.tsx:39-51` ScrollManager 的 effect 在懒加载路由 Suspense 未 resolve 时执行，`getElementById` 落空 → 回落 `scrollTo(0,0)`，之后**不再重试**（deps 仅 [pathname, hash]）。
  - 影响面：站内所有坐标回链（sandbox 详述的 "Q1/Q2 in the ledger" `CorruptionSandbox.tsx:181-188`、FIG.W1 的 "Q2 in the ledger →" `WorkPage.tsx:81-83`、Home research 行 `/research#<topic>` `HomePage.tsx:229`）**在新标签打开/刷新/分享链接时全部失效**——落地在页顶，坐标承诺破产。
  - 对照：**客户端 SPA 导航（含 chunk 未缓存的冷跳转）实测正常**（home → "Retrieval-Augmented Generation" 行 → `/research#rag`，top=192 ✓；React transition 等 chunk resolve 后才 commit，effect 执行时元素已在）。问题仅限**初始加载带 hash**。
  - 注：这直接证伪 DESIGN_NOTES §4-G4 自查里 "hash 深链滚动（App.tsx:39-51）" 的声明——机制存在，但主用例（分享/刷新）失败。

### 主题 / G5 抽查 — PASS
- 内联脚本在首帧前 `html.classList.toggle("dark")` + `colorScheme`（`index.html:25-45`）；设 `concordance-theme=dark` 后 domcontentloaded 采样 body 背景已是暗色 `rgb(21,19,16)`——**无 FOUC**。
- 暗色 display 字重补偿 470 + 字距回撤（`index.css:352-364`）与 `:lang(zh)` 规则（禁斜体/负字距/大写）逐条在 CSS 里；About 的中文段落确实以 `<p lang="zh">` 包裹（探针 P5：zhParagraphs=1）。

---

## 2. 三条任务路径的完成效率

| 路径 | 实测 | 结论 |
|---|---|---|
| **招聘者 90 秒** | Home 首屏即身份行 + 双语气 hero + FIG.01 论点图；右侧 index 一屏给出全部 7 章坐标与读数。脚本实测 home→work→connect 2 次点击 1.2s；Work 证据链（problem/method/artifacts）+ FIG.W1 + "unlisted until they exist" 诚实行；Connect/mailto 一步可达（含 Home §07 strip 与 404 之外每个页脚）。 | **达标**。无任何一处需要解释自己 |
| **同行 90 秒** | `/research`：6 方向（adjoins chips 可检索）+ FIG.R1 状态分布 + Question Ledger（Q01… 状态点 + updated + demo 回链 + 图例 + 退出规则一段）。Notes 三篇真排版带边注折叠。 | **达标**，且 ledger 的三态图例让状态可机读可人读 |
| **未来自己 2 分钟加内容** | 加一篇 publication = 填 `publications.ts`（Records: 0 自动变 1，ghost 行自动让位）；加 note = `notes.ts` 一条 → Notes/Home 最近两篇/FIG.N1 词数/palette 索引**全部自动派生**（`search.ts:89-99` 实证遍历内容模块）；漏写证据链是编译错误（`Record<ProjectId, EvidenceChain>`）。 | **达标**，是三代里维护成本最低的数据层 |

## 3. 空态质量

- **Publications**：一等公民页面——"A list of papers, not a list of promises"、RECORDS: 0、dashed ghost 行 "[01] RESERVED — this line auto-numbers"、以及 "what belongs here when it exists" 清单。行动导向上略缺一条"与此同时去哪"的交叉链接（如 → Research/Lab），但作为学术礼节的空态成立，**不显得没做完**。
- **Connect**（M5 实测核验）：全 null 时 "Fastest signal right now: *the email slot below.*"（serif 限定语）+ 显式 mailto 行 + "+ 5 slots · hidden until configured" + "placeholder slot — set `email` in src/content/links.ts"。**教科书级行动导向空态**。
- **About**：name null → "name — unlisted by choice of placeholder"；中文段自述"这是一个占位段落：替换于 src/content/profile.ts"。诚实且无编造。
- **404**：坐标语法内的失败模式 + 检索入口。四者一致，无一处假内容。

## 4. 信息层级与认知负荷（Register 体系实测观感）

- **三档 Register 在 Home 整页图上肉眼可辨**（`concordance.concordance.home.desktop.light.full.png`）：PLATE hero（display serif + caret）→ LEDGER research（紧排三行 + 读数）→ PLATE work（display 级 Plate 01）→ LEDGER lab（FIG.02）→ ESSAY notes（66ch serif）→ PLATE connect strip。相邻段无同档，密度节奏确实服务于"哪段该扫、哪段该读"。
- 坐标系统 §00–§07 贯穿 header/section/palette 坐标列/页脚/404/noscript（首页 § 记号 19 处），**是一套真正被执行的检索语法**。
- 诚实读数噪音审计：首页 "0ms network" ×2、"computed in your browser" ×2（T8b/c PASS，阈值内）；sandbox 页同款短语出现 3 次（header/方法行/honesty）——单页不吵，跨页同一措辞略有口头禅化（见 top_issues #5）。
- PageShell 的 register prop 是**死代码**（见 top_issues #2），但 Notes/About 的 ESSAY 观感由 `u-measure`/`.essay` 子元素类达成——**用户看到的层级是对的，只是自查表的归因不精确**。

## 5. 其他实测备注（不计入 top_issues）

- Skip link（App.tsx:121）：加载后焦点起点是 `<main>`（ScrollManager 主动 focus，App.tsx:50），故 **首个 Tab 落在 hero 内容（"RAG ⌕"），skip link 与整个 header 位于起点之前**；Shift+Tab 反向遍历可达（实测 "A:Skip to content"），随后正向 Tab → logo，DOM 序正确。这是"路由切换 focus main"模式的已知副作用——首次加载时 skip link 形同虚设但无害。
- Palette 打开后 ~20ms 内的键入会丢（focus 经 setTimeout 落入输入框，`SearchPalette.tsx:64`）；人类速率下无感。
- 移动菜单 ThemeToggle compact 截断为 **"syst"**（`Header.tsx:34` `choice.slice(0, 4)`），与同屏 radiogroup 的 "Sys" 并排时像个断词。
- sandbox 防御后 top-5 各行同时显示 ▲1（都因 d8 沉底而 +1）——数据诚实但信息量低，一次微小的 delta 归一化可改善。
- 首屏体积复测：index.js 74.7KB gz + css 7.7KB gz ≈ **82.5KB**（无独立 vendor chunk，与 DESIGN_NOTES 写的 109KB 分账不一致但**优于**声明且优于 140KB 预算）。

---

## 6. Round 2 §4 逐项验收结论（本评委职权内重点复核）

| 项 | 结论 | 证据 |
|---|---|---|
| G1 入场可见性/noscript/打印 | **落实** | T5a-e 全过；`index.css:604-616, 703-745` |
| G2 对比度 token 契约 | **落实**（代码+测试复核） | `contrast.test.ts` 33 用例实跑通过；faint 仅 aria-hidden 装饰（structure.tsx:38-41、RankList.tsx:30-32） |
| G3 44px 触控 + safe-area | **落实** | T4b/f 实测 44-60px；Header/MobileMenu/Footer safe-area 内联 |
| G4 深链 + 404 | **部分落实** | 12 路由刷新 200 ✓、404 优质 ✓；**hash 冷加载不滚动 = 确认 bug** |
| M1 三档 Register | **视觉落实、代码半落实** | Home 六段节奏实测成立；PageShell register prop 死代码 |
| M2 FIG 全站语法 | **落实** | FIG.01/02/R1/W1/N1 + L-01/02/03 均为浏览器内实算 |
| M3 facet→真检索入口 | **落实** | T2a-d |
| M4 无自伤型标签 | **落实** | 全站唯一 sample 声明在 colophon（Footer.tsx）+ Lab "illustrative toy" |
| M5 Connect 行动导向 | **落实** | 实测截图 + `site.ts:26-32` |
| 内容红线 | **无违规** | profile.name/location=null、邮箱为显式占位槽、publications 空、无编造履历/论文/奖项 |

## 7. 评分（14 维度）

| 维度 | 分 | 一句话依据 |
|---|---|---|
| visual_quality | 8.5 | 非主责维度；PLATE 语法与整页节奏观感扎实（详见 Judge 01） |
| originality | 8.5 | concordance 概念贯穿到坐标/404/noscript，非贴皮 |
| typography | 9 | register 系统 + 双语气 hero + 470 补偿 + :lang(zh) 全部实证 |
| **information_hierarchy** | **9** | 坐标 + register + index 侧栏 + 诚实读数共同服务扫读；扣 1 分给 PageShell 空档与读数措辞重复 |
| **ux** | **8** | 五条关键流全通、空态优秀；唯一功能性 bug（hash 冷加载深链）恰好打在站点的核心承诺上 |
| mobile_experience | 8.5 | 真重设计、60px 行、全屏目录、边注折叠、触控实测达标 |
| technical_feasibility | 9 | 静态可部署、0 console error、67 测试过、预算内 |
| long_term_maintainability | 9 | 内容文件 + 编译期契约 + 派生索引/图，加内容成本全场最低 |
| research_presentation | 9 | ledger/证据链/sandbox 验收测试/回链语法完整 |
| portfolio_presentation | 8.5 | 诚实空态 + 无编造 + 作品与站点互证（"you are standing in it"） |
| light_mode | 9 | 暖纸底 + 全 token 实测矩阵 |
| dark_mode | 8.5 | halation 补偿真实存在；个别暗色读数行密度偏高 |
| performance | 9 | 实测首屏 ≈82.5KB gz、路由分割、无动画库、settle 仅 transform |
| accessibility | 8.5 | combobox/aria-live/focus trap/skip link/44px 实测；hash 焦点竞态与 skip-link 边缘问题小扣 |

## 8. Top Issues（按严重度）

1. **hash 深链冷加载永不滚动** — `App.tsx:39-51`：Suspense 未 resolve 时 `getElementById` 落空后不重试；实测 `/research#q1` 刷新后 3.5s 仍 scrollY=0（`reports/j3_ux_confirm.mjs` C1/C2）。站内 Q1/Q2/plate 回链的分享/刷新场景全数失效，且 DESIGN_NOTES 将其声明为已落实（纸面落实）。
2. **PageShell register prop 无效** — `structure.tsx:94`：`register === "plate" ? "" : ""` 两个分支同为空串，Notes/About/Work/Connect 传入的 register 不产生任何效果；M1 自查把整页 ESSAY/PLATE 归因于该 prop，归因不实（视觉结果碰巧由子元素类达成）。
3. **首次加载焦点起点在 `<main>`** — `App.tsx:50`：首个 Tab 直接落在 hero 内容，skip link 与 header 导航在起点之前，skip link 实际不可正向达（Shift+Tab 反向可达，实测）。保留 route-change 时 focus main、去掉首次加载的 focus 即可两全。
4. **"syst" 断词** — `Header.tsx:34`：compact 主题按钮 `choice.slice(0,4)` 在移动菜单里渲染出 "syst"，与同屏 "Sys/Light/Dark" radiogroup 并排刺眼。
5. **"0ms network" 措辞重复** — FIG 方法行/palette footer/sandbox header 跨页复用同一短语（首页 ×2、sandbox 页 ×3）：诚实语法成立，但同一句口号式的重复开始出现口头禅化，一处改写为变体即可。

## 9. 如果只能改一处

**修 ScrollManager 的 hash 竞态**：在 `App.tsx:39-51` 中，当带 hash 且目标元素尚未存在时，用 `requestAnimationFrame`/短轮询重试（或在路由元素挂载后补一次 `scrollIntoView`），并为目标加 `scroll-mt` 对齐固定头。一行级的修复，恢复的却是整座站点"坐标即地址"的核心承诺——§ 语法被 palette、404、页脚、noscript 讲了一整遍，不能只在刷新时失灵。

## 10. Verdict

**PASS**（进入 Meta Designer 打磨阶段）。五条关键任务流、G1/G3、空态、移动端、维护成本全部实测达标且多处超出承诺；唯 hash 冷加载深链一个功能性 bug 与两处自查表归因失真，均为小时级修复，不动架构。
