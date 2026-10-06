# Round 3 终审 — Judge 01 · Visual Design（视觉设计）

> 评审对象：Generation 3 唯一站点 **CONCORDANCE**（`generation_03/`）
> 权重：visual_quality 首要，originality / M1-M2 落实其次。
> 证据：`shots/gen3/` 54 张路由截图 + 6 张整页图（本评委抽看 ~20 张，含桌面/平板/手机 × 双主题）；源码 `src/`；自查表 `DESIGN_NOTES.md`；对照 `shots/gen2/`（A / H 整页）。复跑 `npm run test`：5 文件 67 用例全过。

---

## 1. 核心问题一：H 骨架 + A 工艺 + D 语法是一个语言吗？

**是，而且融合度高于两位亲本。** 判断依据不是概念，而是 54 张截图里反复出现的同一套造句法：

- **一种声音的三个人称**：serif display（Newsreader，陈述与图版标题）→ sans 正文（Inter，解释与 UI）→ mono 元数据（坐标/读数/方法注）。三档在每一页都各就其位，没有越权：serif 从不做元数据，mono 从不写散文。这比 Gen2 的 A（serif/sans 边界偶尔含糊）和 H（mono 通吃）都更干净。
- **一个坐标系统**：§01–§07 + L-01/02/03 + FIG.01/02/R1/W1/N1 + Q01… + PLATE 01…，编号语法全站唯一（`src/lib/sections.ts` 单一来源）。Header 当前项的 accent 下划线 + 页脚 § 地址，首尾呼应。
- **一条 hairline 纪律**：所有分隔都是 1px `--line`，所有 FIG 都是上下 hairline 夹图（`structure.tsx:124`）。没有一处阴影卡片、圆角卡或截图墙——"一本书"的物性从未破功。
- **单 accent 语义**（grep 全量核查 `text-accent|bg-accent|border-accent`）：只出现在坐标编号、边注编号、当前导航下划线、hover、active 圆点、时间线年份——即"活着/当前/可操作"。signal 专司投毒/截断（FIG.01 的 ▲ POISONED 条 + 左边框 + 文字标签，非仅色编码，`RankList.tsx:36-39`）。两套主题各自成立：light 是"白天的纸"（#f7f4ed 暖纸 + 钴蓝），dark 是"阅览室"（#151310 暖黑 + #97acff 长春花蓝，accent 是重调而非反色，display 500→470 的 halation 补偿真实生效，见 work/notes 暗色截图的 serif 重量）。

**结论**：不是三张皮。CONCORDANCE 最好的证据是：你无法从任何一张截图指出"这块来自 A、那块来自 H"——它读起来是一位作者写的。

## 2. 核心问题二：M1「第二次变奏」成立吗？

**效果成立，系统欠账。** 两面都说清楚。

**成立的一面（渲染层）**：Home 六段 PLATE→LEDGER→PLATE→LEDGER→ESSAY→PLATE 在整页截图里确实读出三档密度——
- §01 Research / §03 Lab（LEDGER）：紧排行、mono 先行、hairline 密；
- §02 Work / §07 Connect（PLATE）：大 serif、大留白（Plate 01 的 t-h1 尺度与上下段的 mono 行形成真实对比）；
- §04 Notes（ESSAY）：66ch 收窄 + 行距放松，与相邻 Lab 段的通栏 FIG 明显不同。
相邻段无一同档，单调鼓点被打破——对照 Gen2 H 的 home（§01–§07 全是同一种 mono+hairline 组合拳），这是本轮最大的视觉进化。ESSAY 段质感的完全体在 `/notes/n1`：66ch 行宽 + 行高 29 + 编号边注（`NotePage.tsx:63`），双栏 margin apparatus 在桌面端是全站最"书"的一页。

**欠账的一面（系统层，防"纸面落实"抽查发现）**：
1. `structure.tsx:94` —— `PageShell` 的 register prop 是**死代码**：`${register === "plate" ? "" : ""}` 两个分支同为空串。也就是说 Work=PLATE、Notes/About=ESSAY 的"整页 register"在机制上不存在，视觉差异全部由各页内容类名偶然达成。register 系统的全部机械内容 = `REGISTER_PAD`（三档 padding，`structure.tsx:14-18`）+ 一个 `.essay` 类。作为"处方"它是 20% 系统 + 80% 自觉。
2. `.essay`（`index.css:535-541`）**没有设 font-family**：CSS 头注与 DESIGN_NOTES §1.3 都写"ESSAY — 66ch **serif** measure"，实际文章正文渲染为 sans（见 notesn1 截图正文）。渲染结果并不难看（serif 标题 + sans 正文 + mono 注是全站语法），但自述与产物漂移。
3. `site.ts:19` 自述双语气 Hero 为"sans 陈述 + serif italic 限定语"，实际两行都是 t-display serif（roman + italic 对比）。roman/italic 的 Newsreader 内对比反而更统一——但这是"做对了别的事"，不是"做了文档里的事"。

**评分含义**：变奏作为**结果**成立（这是评委该看的），作为**系统**未闭合（这是 Meta Designer 该接手的）。不否决，但记录在案。

## 3. 核心问题三：M2 FIG「数据即颜料」全站语法

**达到签名水准，形态谱系略窄。**

- 五图全部是渲染时从 content 实算的真数据（我核了调用链：FIG.01/FIG.W1 走 `bm25Rank`，FIG.02 从 `lab.ts` chunk 数据 reduce，FIG.R1 从台账 count，FIG.N1 从笔记正文词数），"computed in your browser · 0ms network" 方法注不是口号而是事实。A1 防御语义在引擎层修复：`bm25.ts:73-90` 乘 factor 后统一 re-sort，top-5 永远取自防御后排序；验收测试通过。
- 视觉品质：FIG.01（home 首屏）是全站论点图——clean/poisoned 双栏同 query 对排，d8 的 signal 条 + ▲ POISONED 标签 + 左边框在 light/dark 都一眼可读；FIG.W1 的"两档 regime 下 d8 分数与名次"是 Work 页最有说服力的一块。条形用 scaleX transform + 0.02 可见下限 + overflow clamp，工程与视觉同源。
- 双主题表现：条形 `--ink-2`/`--signal` 随 token re-ink，dark 下是奶油条对暗轨，无一处发光或糊掉（lab dark 截图验证）。
- 扣分点：FIG.02（home）与 FIG.R1（research）是**同一种单条堆叠条**（`HomePage.tsx:87-99` vs `ResearchPage.tsx:43-66`），形制几乎复写。五图里三种是横条/堆叠条的近亲。"语法统一"与"形态单调"在 M2 这里只有一线之隔——目前在线内，但内容翻倍后会贴线。

## 4. 双语气 Hero 最终形态

首帧（1440×900 desktop light）：identity 行 + t-display 双行 + lede + 四枚检索 chip + FIG.01 前三行全部在折叠线以上，LCP 是真实的 serif 文本。settle 动画 transform-only、无 opacity:0，回访经 `index.html:36-39` 在首帧前打 `data-settled`——首帧可见性无懈可击（G1 核查通过）。
Roman "Retrieval-augmented generation," 与 italic "read at the level of the ranking." 的对比修辞在 light/dark 都成立；dark 下 italic 行用 `--ink-2`（7.1:1）配 470 字重，无 halation。accent caret 是全站唯一常驻动画：0.12em 宽的方块，1.1s steps 闪烁，`data-live` 门控 + reduced-motion 禁用——克制度满分，是"光标在等输入"的语义而非装饰。

## 5. 验收清单复核（视觉视角抽查）

| 项 | 结论 | 证据 |
|---|---|---|
| G1 默认可见/无 opacity:0 | ✅ | `index.css:602-620`（settle 仅 transform，注释与实现一致）；noscript 骨架 `index.html:73-97`；print 全套 `index.css:703-748` |
| G2 对比度 ≥4.5:1 | ✅ | `contrast.test.ts` 33 用例实算双主题×token×三底色全矩阵，本机复跑通过；faint 被测试钉死在装饰级 |
| G3 44px / safe-area | ✅ | `index.css:669-676` coarse pointer 全量；`.u-btn/.u-chip` min-height 44 |
| G4 真实 URL/404 | ✅ | 54 张截图即 9 路由深链渲染成功的直接证据 |
| G5 三态主题无 FOUC | ✅ | `index.html:27-45` 首帧前解析；dark 截图无闪烁伪影 |
| G6 图表双主题规范 | ✅ | 无位图；全图形走 token；favicon SVG 内嵌 prefers-color-scheme |
| A1 防御重排 | ✅ | `bm25.ts:73-90` + sandbox-acceptance 测试 |
| D1 边注不叠印 | ✅ | `Sidenote.tsx` 三段降级，grid 行定位结构上不可能逃逸；notesn1 移动端折叠为 details |
| M3 facet=真检索 | ✅ | `HomePage.tsx:170-180, 262-271` → `openSearch(term)` 预填 |
| M4 无自伤标签 | ✅ | 全站唯一 sample 声明在 colophon（`Footer.tsx:25`）；sandbox "ILLUSTRATIVE TOY" 一处 |
| M5 Connect 行动导向 | ✅ | "Fastest signal right now: *the email slot below.*" + mailto 槽 + 5 个诚实隐藏槽 |
| **M1** | ⚠️ 效果成立/系统欠账 | 见 §2；`structure.tsx:94` 死 ternary |
| **M2** | ✅（形态谱系备注） | 见 §3 |

**新发现的用户可见缺陷（本轮 54 图中我找到的唯一一处）**：
**平板宽度页脚塌陷** —— `Footer.tsx:18` 的 `md:grid-cols-[minmax(0,1fr)_auto]` 在 768px（md 断点刚生效）时，右侧 `auto` 宽的 7 项 mono 导航占掉 ~610px，左栏被 `minmax(0,1fr)` 压到 ~10 字符宽：tagline 与诚实声明一行一词竖排成瘦长条，且与右栏基线错位。证据：`shots/_crops/gen3_tablet_footer.png`（裁自 `concordance.concordance.home.tablet.light.full.png`）。页脚是全站共享组件，9 路由 × 2 主题 × tablet 共 18 张截图全部带病；桌面（≥~1000px）与移动（<md 单列堆叠）均正常，病灶集中在 768–~1024 区间。

## 6. 对照 Gen2 的进化幅度

- 对 A（`gen2/team_a_monograph/a.home.*.full.png`）：A 的 PLATE/FIG 语法被继承，但 Gen3 换上了真路由、编号坐标和检索入口——A 的"single-page 无真路由"否决性短板消失；FIG 从特例（一处 FIG.1）变成五处语法。
- 对 H（`gen2/team_h_retrieval/h.home.*.full.png`）：H 的 index 地图、§坐标、诚实读数全部在场，但注入了字阶与温度——H 的"Work 段偏干/全站一种质感"短板被 M1 变奏针对性治愈。
- 结论：Gen3 不是三案拼接，是三者各自最值钱资产的相互成就。进化幅度在三轮里最大。

## 7. 14 维评分与裁决

| 维度 | 分 | 简注 |
|---|---|---|
| visual_quality | **8.5** | 工艺全面在线；平板页脚塌陷是唯一用户可见缺陷；FIG 形态谱系略窄 |
| originality | **8.5** | Concordance（书即检索系统）是可认领的概念；register/诚实读数/真数据图构成签名三件套；扣分在 M1 系统层欠账与亲本可辨识度 |
| typography | **9** | 2 族 6 文件、单字阶、tabular mono、470 暗补偿、:lang(zh) 守卫；ESSAY"serif measure"名实不符扣 0.5 不止于此——是自述精度问题 |
| information_hierarchy | **9** | 坐标系统 + kicker + honest reading + 图版层级，全站无一处层级含糊 |
| ux | 8.5 | 真路由 + combobox + 检索 chip + 优雅空态（非本评委首要维度） |
| mobile_experience | 8.5 | 390 单列重构、边注折叠、44px；FIG.01 双栏在 390 拥挤但可读 |
| technical_feasibility | 9 | 测试复跑 67/67，构建产物与自述一致 |
| long_term_maintainability | 9 | content 契约 + 编译期白名单 + 对比度守卫测试；加论文/加 demo 均为单文件操作 |
| research_presentation | 9 | Ledger + evidence chain + FIG.R1/W1 + sandbox 回链 Q1/Q2 |
| portfolio_presentation | 8.5 | 图版语法 + 诚实槽位；About 的裸 TODO 行比 Publications/Connect 的设计过的空态粗糙半档 |
| light_mode | 9 | 暖纸+钴蓝，"day paper"情绪完整 |
| dark_mode | 9 | 阅览室情绪、accent 重调、halation 补偿，54 图中无一处发灰 |
| performance | 9 | 109KB gzip 首屏、路由分割、transform-only（非本评委首要维度） |
| accessibility | 9 | 对比度守卫测试是全场最佳实践（非本评委首要维度） |

**Verdict：PASS** —— 进入 Meta Designer 打磨阶段。条件：§5 的平板页脚塌陷应在 Meta 阶段必修（一处 grid 改动），M1 系统层（PageShell 死 prop、.essay 字族名实不符）建议顺手闭合。

## 8. 如果只能改一处

**修 `Footer.tsx:18` 的塌陷**：`md:grid-cols-[minmax(0,1fr)_auto]` 改为 `md:grid-cols-[minmax(0,1fr)_minmax(0,auto)]` 并给 nav 加 `md:max-w-[50%]`（或直接把断点抬到 `lg`、768px 走单列堆叠）。理由：它是全部 54 张证据截图中唯一一处"普通人无需训练就会说难看"的渲染失败，且波及每一条路由的每一个主题；其余问题（register 死代码、FIG 形态、About 空态）都是打磨项，这一处是缺陷。
