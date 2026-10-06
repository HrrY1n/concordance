# Round 3 终审 — Judge 07 · Academic Researcher（学术研究者）

> 评审对象：Generation 3 唯一站点 **CONCORDANCE**（`D:\Codex\play\portfolio\generation_03\`，预览 http://localhost:4183/）。
> 我的主权重：**research_presentation / long_term_maintainability**。我的评审立场：两年后要亲手维护这个站的researcher——所有维护成本都按"我能拿到源码、但我不想懂前端"实测。

## 0. 证据

- 截图：`shots/gen3/concordance.concordance.{research,notes,notesn1,publications,lab,labcorruption-sandbox,about,connect,work,home}.desktop{,.dark}.{light,dark}.png` + mobile/tablet 抽样；`shots/gen3/concordance.console.json`（空数组，0 error/0 warning）。
- 源码：`src/content/{research,projects,notes,publications,profile,links,timeline,site,lab,ids,types}.ts`、`pages/{ResearchPage,PublicationsPage,NotesPage,NotePage,WorkPage,LabPage,SandboxPage,AboutPage,HomePage}.tsx`、`lib/{sections,search}.ts`、`styles/index.css`、`lib/__tests__/content-contract.test.ts`。
- 本机复跑：`npm run test` → **5 文件 67 用例全过**；`npm run build`（tsc --noEmit + vite build）→ **零错误**，16 chunk，首屏 gzip = 77.29 + 23.94 + 0.36 + 7.96 ≈ **109.5KB**（≤140KB 预算，属实）。
- DESIGN_NOTES 自查表逐项抽查，未发现"纸面落实"——**除一处例外**（见 §3.1，publications 的"auto-numbers"承诺）。

## 1. 同行 90 秒四问复测（research_presentation 首要）

以同行 random click-through `/research`（`concordance.concordance.research.desktop.light.png`）计时复测：

| 四问 | 答案在哪 | 判定 |
|---|---|---|
| ①研究什么 | Hero lede（"noisy, conflicting, or deliberately poisoned"）+ 6 个 direction 各带 blurb + facetLine 一句钩子 | **过**，且方向间关系用 `adjoins` 显式编码而非堆词 |
| ②怎么研究 | direction 行内 `demo: Rankers, Side by Side →` / `run: Corruption Sandbox →`（relatedDemo 回链，3/6 方向覆盖）；Work 页证据链 problem→method→artifacts；Lab 方法行（BM25 k1 1.5 · b 0.75） | **过**。方法不是自述形容词，是可点开重算的仪器 |
| ③现在的问题 | Question Ledger：4 问、active/exploring/paused 三态、`updated YYYY-MM`、FIG.R1 状态分布图（从数据实时计算）、底部图例逐态给语义（"paused — kept visible on purpose"） | **全场最强**。三态枚举是 Round 2 处方的正确执行：是人能保持诚实的粒度 |
| ④产出信号 | Publications 空态（"Nothing is in review, nothing is staged"）、3 篇 notes、3 个 live demo、sandbox 页头直接写 `RE: Q1 · Q2 in the ledger` | **过**，产出信号与问题用 id 挂钩 |

**结论**：D 案的研究语法在 Gen 3 里不是被"吸收"，而是被升级——`research.ts:74-109` 的台账数据结构（status 三态 + `updated: null` 合法 + topic/relatedDemo 白名单）是三案中最可长期维护的形态。90 秒测试我给**显著通过**。

小疵（不影响判定）：
- 台账行 `topic: {q.topic}`（`ResearchPage.tsx:158`）渲染的是原始 slug（"poisoning"/"robustness"），而非 topics 表里的显示名（"Knowledge Poisoning"）——同行能懂，但属于内部 id 泄漏到版面。
- `NotePage.tsx:73` 给**每篇**笔记都硬编码 `→ /research#q1`，n3（chunking）的相关问题其实是别行——数据模型缺 `relatedQuestion` 字段，回链失准。

## 2. 维护成本实测（long_term_maintainability 首要）

没有 CONTENT_GUIDE 文件；按任务书改为评估**数据文件自解释程度**。四条路径逐一走：

### (a) 明年加一篇 preprint → **此路有陷阱（本审最大发现）**
`publications.ts` 接口自解释（title/authors/venue/year/links，均可 null），照抄一行对象毫无难度。**但 `PublicationsPage.tsx` 根本没有渲染 publications 条目的代码**——全页只有空态文案 + `[01] RESERVED` 幽灵行（grep 全站确认：publications 数组只被 `.length` 消费）。加了 preprint 之后：
- 页面继续显示 "Selected research will appear here."、"Nothing is in review, nothing is staged"（`site.ts:34-36`）——**变成谎言**；
- lede "right now, nothing."（`PublicationsPage.tsx:20`）与 meta description "Currently zero records"（:15）——**变成谎言**；
- `site.ts:37` 承诺 "RESERVED — this line auto-numbers when publications.ts grows"——**无任何代码实现**，幽灵行是写死的静态文本；
- `content-contract.test.ts:39-41` 断言 `publications` 必须为空——加数据**测试直接红**，且没有任何文件告诉维护者为什么。
这是"格式活了，内容路径没修"：学术站第一高频的未来动作（挂出第一篇论文）会静默地产出一个不诚实的页面。**这是终审必须修的一处。**

### (b) 把一个 question 从 exploring 改 active → **1 分钟，满分路径**
`research.ts` 改一个词 + 顺手更新 `updated: "2026-10"`（types.ts:41 注释了格式）。FIG.R1、首页 "n active" 读数、palette 的 "status: …" hint 全部自动重算（均从数组派生）。types.ts:33-35 的枚举注释（"three states a human can actually keep honest"）本身就是文档。**无陷阱。**

### (c) 新增第 4 个 lab demo → **代码路径合格，文案路径撒谎**
合格部分：`ids.ts` 的 `DEMO_IDS` + `Record<DemoId, DemoMeta>` 使漏注册即编译错误（D3 落实）；palette 索引从 DEMO_REGISTRY 自动扩。陷阱部分：**≥5 处手写死的 "three/3"**——`lab.ts:115`（"Three instruments"）、`LabPage.tsx:18`（meta）、`HomePage.tsx:291`（lede）与 `:296-297`（L-01/02/03 清单）、`sections.ts:47`（"3 DEMOS · 0MS NETWORK"）与 `:94`（"LAB 3 DEMOS"）。`sections.ts:5` 自己宣称 readings "never hand-written"，Lab 这两行恰恰违背了本站宪法。第 4 个 demo 上线当天，全站有 5 处开始说谎。

### (d) 写第 4 篇笔记 → **四条路径中第二好**
`notes.ts` 加对象即可：`NoteBlock` 联合类型（p/h/code + sidenote）自解释；FIG.N1 词数、列表排序、相关笔记、palette、NOTES n 读数全部自动；sidenote 编号唯一有测试守着。唯一坑：`public/sitemap.xml:9-11` 手工维护 `/notes/:slug`，新笔记不会自动进 sitemap，也没有任何提示。

**综合**：内容契约层（D3 字面量联合 + Record 编译期强制 + 运行时测试 + 派生读数）是三案中最接近"数据驱动档案"承诺的实现；但两条高频路径（加论文、加 demo）各埋着一个"静默说谎"陷阱，且流程性知识（改哪 5 处文案、sitemap 要同步）无处可查。**7 分**——骨架 9 分，陷阱扣到 7。

## 3. Round 2 处方复核（M4 为主，附 D1/D2/D3/G 项抽查）

| 项 | 复核结论 |
|---|---|
| **M4 SAMPLE ENTRIES 移除** | **确认**。grep 全站无 "SAMPLE ENTRIES" 类面贴；`sample: true` 只存在于数据层，唯一常设诚实声明在 colophon（`lab.ts:107` + `Footer.tsx:25`，首页整页图底部可见）。各处补充声明（sandbox "ILLUSTRATIVE TOY"、toy defense 标签、Publications 空态、Connect placeholder 注）都是 D2/M5 要求的**语境声明**，不是重复面贴——集中不重复，成立 |
| D1 边注 | `Sidenote.tsx` 三段降级 + `.sn-row` 双列 grid（`index.css:523-528`），负 margin 结构性排除。n1 desktop 截图边注与正文零叠印，dark 主题同样干净 |
| D2 sandbox | 注入→重排→防御→再重排全套在；`bm25.ts` 乘 factor 后统一 sort；"TOY HEURISTIC, NOT A REAL DEFENSE" 在控件旁；sandbox 页头 `RE: Q1 · Q2` 挂台账——但这两个 Q id 是**手写的**（`SandboxPage.tsx:26,37`），明明可以从 `researchQuestions.relatedDemo` 派生。数据模型在，情性回链没接 |
| D3 编译期防呆 | `ids.ts` as const 白名单 + `Record<ProjectId, EvidenceChain>`（`projects.ts:75`）——漏证据链即编译错误，运行时测试双保险。**核实** |
| G1/G2/G3/G4/G5/G6、A1/A2/A3、H1/H2/H3 | 抽查属实：无 opacity:0 入场（settle 仅 transform，`index.css:606-617`）；contrast.test.ts 33 用例全矩阵断言且我复跑通过；代码分割 16 chunk 我复跑验证；依赖无 lucide/motion。此项不展开（各自主责评委），未发现反证 |

## 4. 内容红线与 sample 克制度

- **零编造履历**：`profile.name/location = null`（About 页渲染 "name — unlisted by choice of placeholder"）；`links` 六通道全 null（Connect 只显示显式 mailto 槽 `address@example.com`，且注明 "placeholder slot"）；timeline 用 "20XX / TODO — your degree" 自我暴露为 TODO；publications 为空且空态是一等页面。无姓名/学校/邮箱/论文/奖项编造。**红线通过。**
- **sample 克制度**：mock 项目 3/4（全部 links null、摘要写 "not to claim a defense" 级别的克制措辞）、3 篇笔记全部是观点性 working text 而非伪结果、aboutZh 直接写"占位段落"。唯一小疵：`profile.about`（"Graduate student in computer science…"）读起来像真实自述但 Profile 接口没有 `sample` 字段——诚实模型里 profile 文案是漏网的未标记占位（About 页的 null name 行掩护了它，属可接受边界）。
- 笔记内容质量本身值得点名：n1 的"poison 说服的是 ranker 不是 model"、n2 对自家 sandbox 玩具防御的自我批评（n2 sidenote 1）——这是同行会当真的写作，不是模板填空。

## 5. ESSAY 档作为未来论文阅读笔记载体

`/notes/n1`（两主题截图 + `NotePage.tsx` + `index.css:535-563`）：17px/29px、66ch 上限、编号边注 grid 锚定、code block token 化双主题、页尾 "A note, not a publication" 的文体自觉 + 回链台账。作为未来 paper-reading 笔记的载体，**版式已达发表级随笔标准**。一个真 bug：`.essay` 的段间距选择器（`index.css:542-546`）覆盖了 `p+p`、`sn-row+p`、`sn-row+sn-row`，**漏了 `p+sn-row`**——n1 第二/三段（普通段→带边注段）之间零间距，light/dark 截图均可见（"…it is vocabulary." 与 "The Corruption Sandbox…" 粘连）。一行修复。

## 6. 逐项验收结论汇总

Round 2 §4 的 21 项：**20 项核实落实，1 项（site.ts:37 的 publications auto-number 承诺）是有文案无实现的半落实**——它不在 §4 原清单上，是 Gen 3 自加的承诺，所以不计为"违反处方"，但计入我的维护性评分。M1–M5 全部落实（M1 三 Register 在首页整页图可辨：PLATE→LEDGER→PLATE→LEDGER→ESSAY→PLATE；M3 facets 点击即开 palette 预填词，`HomePage.tsx:170-180`）。

## 7. 如果只能改一处

**把 publications 的增长路径修通**：`PublicationsPage` 渲染 `publications.map()`（编号、venue/year、null-hidden links），空态用 `publications.length === 0` 门控，幽灵行数量从数据派生，`content-contract.test.ts:39-41` 的空断言改为对任意长度的契约断言（doi/pdf 至少其一非 null 等）。这是学术站未来两年最高频的一次编辑，现在它是全站唯一一条"照数据文件做会让网站说谎"的路径。

## 8. 评分

| 维度 | 分 | 依据 |
|---|---|---|
| visual_quality | 8.5 | 非 my axis；截图证据：克制、Register 变奏可见、无模板感 |
| originality | 8.5 | Concordance 概念 + 台账语法 + FIG 全站化，可认领 |
| typography | 8.5 | ESSAY 档优秀；p+sn-row 段距 bug 扣 0.5 |
| information_hierarchy | 9 | Research/Work/Ledger 层级清晰，读数行诚实 |
| ux | 8.5 | palette/深链/空态好；home 硬编码 "Fastest signal: email" 指向占位 mailto 略越线 |
| mobile_experience | 8.5 | 390px 单列、边注 details 折叠、44px 目标（截图+源码核实） |
| technical_feasibility | 9 | build/测试复跑全过，109.5KB 首屏，零死依赖 |
| **long_term_maintainability** | **7** | 契约层 9 分；publications 陷阱 + 5 处手写 "3" + 硬编码 Q 链接 + 无流程文档，扣到 7 |
| **research_presentation** | **9** | 90 秒四问显著通过；三态台账为全场最佳研究语法；raw slug/硬编码回链扣 1 |
| portfolio_presentation | 8.5 | Plate+证据链+活仪器；3/4 项目为 sample 且 links 全 null（有声明） |
| light_mode | 9 | — |
| dark_mode | 9 | essay/research dark 核实，470 补偿在 |
| performance | 9 | 复跑 build 证实 109.5KB / 16 chunk / 无 motion 库 |
| accessibility | 9 | contrast 测试矩阵强制、combobox 全套、aria-live 分场景 |

**Verdict：PASS**（附必修项）。站点当前渲染状态完整、诚实、可验证；我的两个发现都是**增长路径上的潜伏缺陷**而非现役缺陷，不阻碍进入 Meta Designer 打磨，但 publications 一项必须在打磨阶段或上线前修掉。
