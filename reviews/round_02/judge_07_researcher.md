# Round 2 评审报告 — Judge 07 · Academic Researcher（学术研究者视角）

> 评审人设定：AI/NLP 方向研究生，每天读论文、写论文、维护自己的主页。用真实 researcher homepage 的标准看这三案：一个同行/合作者/潜在导师 90 秒扫站，能否准确回答——这个人研究什么？用什么方法？现在在做什么问题？有没有可信的产出信号？
> 首要权重 research_presentation，其次 information_hierarchy / long_term_maintainability。Round 1 我把 D 的 research_presentation 排全场第一（1.65），并否决了 G 的 "in review" 式空态话术——本轮重点核验进化是否成功。

## 0. 证据与方法

- 官方截图：`shots/gen2/team_{a_monograph,d_offprint,h_retrieval}/`（a2/ap、d2/dp、h2/hp 系列 + console.json，三案 console 均为空数组，已逐一打开核验）。
- 注意：A 与 D 是单页长卷，官方截图工具按 `/research`、`/publications` 等 URL 截图——**A 的这些 URL 全部落回首屏 hero，D 的全部命中 404 页**（见 §2 与逐案缺点）。为了不冤枉任何一案，我用 Playwright 对三个 preview 站点（4173=A / 4174=D / 4175=H）补采了关键版块的到达后截图，存于 `reviews/round_02/_judge07_verify/`（d-research / d-ledger / d-publications / d-work / d-hero-2s / h-research-full / h-work / a-research / a-publications / a-lab，复采脚本 capture-script.mjs 同目录）。
- 源码：逐案读了 `src/content/`（types + 全部数据文件）、Research/Publications/Work/Lab/Hero/About 组件、App/路由。
- **数值验收复跑**：三案的 sandbox 验收脚本我都在本机重跑过，全部 PASS——
  - A `scripts/verify-sandbox.ts`：inject 后 d8 第 1（4.954 vs 2.459），defense 后第 5，chunk demo 7 块；
  - D `scripts/verify-sandbox.ts`（tsx 运行）：inject 后 d8 第 1（9.56 vs 5.11），defense 后第 4，语料读数 8/9；
  - H `scripts/verify-sandbox.mjs`：inject 后 d8 第 1（3.73），defense ×0.1 后第 6（0.3729）。
  三案都遵守了"调语料而非改打分器作弊"的包规则，且偏差都在 DESIGN_NOTES 与 lab.ts 注释里声明。诚实纪律满分。

## 1. 90 秒扫站核对表（同行视角）

| 问题 | A「Monograph」 | D「Offprint」 | H「检索系统」 |
|---|---|---|---|
| 研究什么？ | hero 三词方向 + 限定语 "before it breaks." + RECORDS 行，秒答 | hero stance "Grounded answers, studied where they break." + FIELDS 行 + 朱批问题，秒答 | hero "Retrieval, robustness, and the systems in between." + 4 facet 自检索，秒答 |
| 用什么方法？ | 弱：靠 demo 隐含（BM25/chunking），无逐项目方法行 | 中：项目行有 ROLE/AREAS，沙盒页写明 METHOD: BM25 (K1 1.5 · B 0.75) | **强：Work 每条证据链有 "02 — METHOD" 动词先行步骤**（`_judge07_verify/h-work.png`） |
| 现在在做什么问题？ | Q1–Q4 台账 + "1 ACTIVE · 4 IN THE LEDGER"，但 Q 与方向/demo 无链接 | **最强：朱批直答"此刻在想什么"，Q1/Q2 → "RUN IT IN THE LAB" 可运行证据，状态图例齐** | Q1–Q4 台账 + "self-descriptions, not progress claims"，但 Q 与 demo 无链接，且被 "SAMPLE ENTRIES" 标签自伤 |
| 可信产出信号？ | FIG.1（浏览器内实算排名图）+ 诚实读数 + 空态 "0 RECORDS" | 逐项目状态 chip + 真链接位 "REPO ↗ / DEMO ↗ 到位才渲染" | **证据链只列"存在的东西"（artifacts: "The sandbox on this site's Lab page"），links 缺位渲染 "—"** |

四问都能答，三案全部及格——这在 Round 1 是做不到的。差距在第三、四问的组织深度。

## 2. 逐案评语

### Team D「Offprint」— research_presentation 保住第一，且把维护负债真正还掉了

**优点**

1. **Question Ledger 是三案中唯一形成"问题→证据"闭环的研究 IA**。状态图例一行讲清语义（"ACTIVE — BEING ASKED NOW · OPEN — ON THE LIST · RESTING — PARKED, HONESTLY"）；`updated: null` 确认不渲染任何痕迹（q3 已在 `_judge07_verify/d-ledger.png` 核验）；Q1/Q2 挂 "→ RUN IT IN THE LAB" 直链沙盒。首屏朱批（NOW ASKING — Q1 + 幽灵 Q1）把"此刻在想什么"提到第 5 秒，且是纯数据派生（active 问题自动上台）——记忆点是语义的，不是装饰的。
2. **SVG 研究地图的退役方式是本轮最专业的工程决策**：ADJOINS 邻接声明进 `src/content/research.ts` 数据层（`adjoins: ["robustness","poisoning"]`），派生读数（"2 QUESTIONS OPEN" / "NO OPEN QUESTIONS"）实时计算；还在页边注里公开解释退役理由（"a graph you have to re-layout by hand… is a liability, not a map"）。feasibility/maintainability 两个负分维度是真修复，不是话术。
3. **Publications 空态文本是全场标杆**（`_judge07_verify/d-publications.png`）："Written work will appear here as it exists. Not before. Unwritten papers are not announced, and 'in preparation' is a claim this page does not make."——直接回应 Round 1 研究者评委的话术否决，ghost specimen 行同时是版式契约（"第一篇论文入库时替换这两行，版式零改动"）。沙盒页的 "APPENDIX X-01 · RE: Q1 · Q2" 框架 + "QUERY … FIXED FOR THIS INSTRUMENT (EDIT SRC/CONTENT/LAB.TS)" 是真正的仪器日志写法。

**缺点**

1. **浮置边注与台账图例文字相撞**（1440px，`_judge07_verify/d-research.png` 底部与 `d-ledger.png` 顶部：边注 1 的文字横穿 "ACTIVE — BEING ASKED NOW…" 图例行）。`.sn-float` 的负 margin float 缺少对后续块级的 clear/隔离——恰好发生在全站最重要的 Research 版块。
2. **全部正文内容被 whileInView Reveal 门控**：d2 全页截图（desktop/mobile）出现大片空白段，官方 d2 hero 截图在 ~400ms 时 h1 完全不可见（我 2s 复采 `_judge07_verify/d-hero-2s.png` 才出现）。对一个"纸面档案"隐喻的站点，内容默认 opacity:0 意味着快速滚动时永远有空白屏、打印/整页存档丢内容——offprint 反而不可 offprint。
3. **URL 空间与研究 IA 脱节**：导航写 "01 RESEARCH / 03 PUBLICATIONS"，但 `/research`、`/publications` 直达 404（官方 dp 截图即 404 页；DESIGN_NOTES §1.12 只声明了 `/` + 沙盒两条路由）。404 页本身写得有礼仪，但"同行没法把'他的 research 页'链接发给导师"是学术主页的结构性损失。

**数据结构可维护性**：types.ts 全量保留包契约，扩展字段（adjoins/topic/relatedDemo/demoRef/inPageAction）全部有注释；但 WorkSection 里 `p.sample ? null : "NOT A SAMPLE ENTRY"` 把数据层行话漏进 UI——访客无从知道"sample"是什么，还反暗示另外三条是占位。删掉这行是零成本的纯收益。About 的 "[ EDUCATION — TO BE WRITTEN ]" ghost 行属于可辩护的诚实，但对应届访客是"未完成感"。

**如果只能改一处**：把 Reveal 的内容隐藏去掉（正文默认可见，动画只做 transform 不做 opacity:0 门控）——同时修复打印/存档、快滚空白、截图证据三件事，这对一个"档案/抽印本"站点是身份级的修复。

### Team H「检索系统」— 进化幅度最大：真路由 + 证据链，但被两处自我怀疑的标签拖累

**优点**

1. **唯一给研究内容真实 URL 的方案**：/research /work /lab /notes /publications /about 全部是可寻址、有独立 title 的页面（`hp.hp.research.desktop.light.png`）。hero facet 直链 `/research#topic-id`，索引右栏挂实时计数（"6 TOPICS · 4 QUESTIONS"、"0 RECORDS"）——同行可以收藏、可以转发"他的 research 页"。对学术主页这是结构性正确，Round 1 的 H 没有这个。
2. **Work 证据链是三案中最诚实的项目语法**（`_judge07_verify/h-work.png`）：problem（问题形状的句子）/ method（动词先行步骤）/ artifacts（只列存在的东西："The sandbox on this site's Lab page"）/ links（缺位渲染 "—" + sr-only 说明）。四栏回答了方法与产出两问，且零编造。
3. **Publications 空态礼仪与出口兼备**（`hp.hp.publications.desktop.light.png`）："Nothing in print yet — this space is reserved for peer-reviewed work." + "STATUS: CALL FOR PAPERS" + 两条预留槽 + **指向真实证据的重定向链接**（"The research is already visible →" / "Working notes appear first →"）。空态不只是"得体"，还给 90 秒访客指了路。

**缺点**

1. **Question Ledger 头上挂着 "SAMPLE ENTRIES" 标签**（home 与 /research 都渲染；`_judge07_verify/h-research-full.png` 右上角；代码 `src/sections/Research.tsx:56`）。这是三案中唯一的"把研究问题标注为示例"的方案——研究问题是全站最核心的可信度信号，给它盖"样例"章等于告诉访客"这个人此刻的思考是占位内容"，直接削弱 primary 维度；且与 DESIGN_NOTES §1.3/§4 "sample 角标已自弃、sample: true 只活在数据层"的声明**不符**（声明核验不通过）。
2. **/research 的导语自我重复**：serif 斜体 standfirst "Six directions and four live questions. Status words are self-descriptions, not progress claims." 之后，正文又用 sans 原样复述一遍（截图与代码均确认：ResearchPage 的 lede 与 ResearchContent 自带的 intro `<p>` 同句）。全站扫描率最高的页面上最显眼的复制粘贴事故。
3. **台账深度与联动不及 D/A**：Q3 渲染 "UPDATED —"（em-dash 占位 vs D 的不渲染）；问题无 topic 标签、无方向↔问题过滤、Q1/Q2 与回答它们的沙盒之间没有链接（研究页看不到 "run it" 出口）。研究页信息密度足够，但"问题有可运行证据"这最后一环是断的。

**数据结构可维护性**：扩展（facetLine/chain/ToyDefense）注释清楚，audit-console/audit-ux/verify 三套脚本对长期维护是真实资产；但 `links` 竟然住在 `src/content/publications.ts` 里（无 links.ts，About 里 `import { links } from "@/content/publications"`）——研究者两年后回来改联系方式，没人会在 publications 文件里找链接。facetLine 只给 6 个方向中的 4 个写了（可选字段有兜底，可接受）。

**如果只能改一处**：删掉 Question Ledger 的 "SAMPLE ENTRIES" 标签（顺手去掉重复导语）——一行删除，换回研究问题的全额可信度。

### Team A「Monograph」— 全场最干净的内容纪律，但 Research 版块是三案中最薄的台账

**优点**

1. **内容诚实做到了句子级**：About 处理 name:null 的那句 "No name, no portrait, no affiliation line yet — this monograph is filed under its subject, not its author."（`src/sections/About.tsx`）是三案中对"未提供字段"最优雅的学术处理；Work 末尾 "LINKS (REPO / DEMO / WRITEUP) ARE INTENTIONALLY UNLISTED UNTIL THEY EXIST." 同级。hero lede 从 `profile.about` 派生（`aboutEn = about.split(" / ")[0]`），单一数据源，改 about 即改 hero——长期维护的正确结构。
2. **FIG. 1 是"以数据为论证"的研究者动作**（`src/sections/Work.tsx` PlateFigure）：用与 Lab 同一 BM25 引擎在访客浏览器实算干净语料排名，图注把"后半段接近噪声"读成投毒可行的论证，并挂 "Inject it in the Lab ↘" 出口。作品版块因此有了研究表达（图是论证不是装饰），portfolio_presentation 的进化货真价实。
3. **沙盒语料偏差的声明方式就是学术写法**：`src/content/lab.ts` 头注释引用包自己的验收条款（"若不成立，调语料而非改代码作弊"）论证改写依据，且我复跑验收全 PASS。三个方案中 A 的 corpus 注释最像 commit message 里的方法学声明。

**缺点**

1. **Research 版块只有"目录级"组织**：6 方向行 + Q1–Q4 简单列出，缺三样东西——方向与问题之间无 topic 关联/过滤（D 有）、问题与 Lab 之间无链接（D 有 "RUN IT IN THE LAB"）、状态语义无图例（active/open/resting 的点色语义藏在 Colophon 图例里，研究现场读不懂）。Round 1 D 凭台账夺冠的那层信息密度，A 只吸收了形状没吸收连接。
2. **单页架构无章节地址**：无路由，`/research` 等一切 URL 都渲染整页顶部（官方 ap 系列截图全部是 hero，即此问题的直接证据）。同行无法分享"研究版块"链接；Anchor 点击后 URL 永远是 `/`。学术主页的可链接性（linkable sections）不是奢侈品——它是被人引用的方式。
3. **方法信号弱**：4 个 Plate 只有 kind/tags/role 元行，没有 H 式 method 行或 D 式 RE: Q1·Q2 关联；FIG.1 补上了论证，但 Plate 02–04 的研究表达退回"摘要 + 标签"。

**数据结构可维护性**：三案最佳。types.ts 即包契约；chapters.ts 注册表统一导航/搜索/Index；全站计数派生（Colophon "Records" 行从 content 数组实时求和）；拒绝渲染 timeline 的理由在 NOTES 里写明且数据保留在 content 层待启用。挑不出骨头。

**如果只能改一处**：让章节锚点成为真实 URL（点击导航/滚动时 pushState，`/research`、`/publications` 刷新后仍落在对应章节）——一次改动同时修复可分享性、深链、和"整站只有一页"的学术主页短板。

## 3. 声明核验表（DESIGN_NOTES vs 代码/实测）

| 声明 | 结果 |
|---|---|
| D：`updated: null` 什么都不渲染 | ✅ 核验通过（q3 行无日期痕迹，`d-ledger.png`） |
| D：删除 "Manuscripts in preparation."，换诚实版 | ✅ 空态文案如实渲染 |
| D：沙盒验收数值（9.56/第1；defense 后第4；8/9） | ✅ 复跑 PASS |
| A：RECORDS 行实时计算、RESERVED ghost aria-hidden、空态 0 RECORDS | ✅ 代码+截图核验 |
| A：沙盒验收（4.954 第1；×0.25 后第5） | ✅ 复跑 PASS |
| A：hero lede 单一来源派生 | ✅ `profile.ts` aboutEn/aboutNote |
| H：字阶 1.25 全落 4px 基线、诚实读数、verify 脚本 | ✅ 复跑 PASS（d8 3.73→第1；defense 后第6） |
| **H：sample 角标只活在数据层、展示层沉默** | ❌ **不成立**——Research 台账渲染 "SAMPLE ENTRIES"（Research.tsx:56） |
| H：palette/路由/title 全就位 | ✅ 路由页均有 usePageMeta |

三案 console.json 均为空（a2/d2/h2 逐一查看），build 产物与验收脚本齐备。

## 4. 14 维度评分（研究者视角加权）

| 维度 | A | D | H |
|---|---|---|---|
| visual_quality | 8.5 | 8.5 | 8.0 |
| originality | 8.0 | 8.5 | 9.0 |
| typography | 9.0 | 9.0 | 8.5 |
| information_hierarchy | 8.5 | 8.5 | 8.0 |
| ux | 8.5 | 8.0 | 8.5 |
| mobile_experience | 8.5 | 8.5 | 8.5 |
| technical_feasibility | 9.0 | 8.5 | 8.5 |
| long_term_maintainability | 8.5 | 8.0 | 7.5 |
| **research_presentation** | **8.0** | **9.0** | **8.5** |
| portfolio_presentation | 8.5 | 8.0 | 8.5 |
| light_mode | 9.0 | 9.0 | 8.5 |
| dark_mode | 8.5 | 8.5 | 8.0 |
| performance | 9.0 | 8.5 | 8.0 |
| accessibility | 8.5 | 8.5 | 9.0 |

评分理由浓缩：D 的 research_presentation 9.0 来自"问题→证据"闭环与台账深度，扣 1 分在边注相撞与 Reveal 空白伤害了研究内容的可靠性；H 8.5 来自真路由与证据链，扣在 SAMPLE ENTRIES 自伤与断掉的 question→demo 链；A 8.0 是干净但薄的台账，扣在缺关联/缺图例/无章节地址。maintainability A 最高（单一来源派生 + 注册表 + 拒绝渲染的自觉），H 最低（links 寄居 publications.ts）。

## 5. 排名（研究者视角）

1. **D「Offprint」** — 研究展示仍是第一：台账深度、问题→证据闭环、空态文本、维护负债的真实偿还，全部对准"研究者长期使用"这个目标。它的三个缺点都是可一次修复的执行伤，不伤结构。
2. **H「检索系统」** — 本轮进化幅度最大（真路由 + 证据链 = 学术主页的结构性正确），但两个自我怀疑的标签（SAMPLE ENTRIES / 重复导语）恰好落在最核心的研究可信度上。
3. **A「Monograph」** — 工艺与内容纪律全场最干净，FIG.1 是好研究表达；但 Research 版块是三案中最薄的台账，且单页架构牺牲了学术主页的可链接性。

（证据补充目录：`reviews/round_02/_judge07_verify/`，含复采截图与 capture-script.mjs。）
