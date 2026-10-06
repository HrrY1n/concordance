# Round 2 评审 — Judge 09 · Product Designer（产品设计师）

> 视角：一线设计系统团队。首要权重 `long_term_maintainability` / `technical_feasibility`，其次 `visual_quality`。
> 关注：token 体系纪律、组件边界、状态完备性、内容 ×10 演练、"设计决策是否真的被代码承载"。
> 方法：三案 index.css / types.ts / 关键组件全文精读 + DESIGN_NOTES 声称逐条抽查 + 截图证据（home 桌面/移动 × light/dark 全页 + 逐页 + sandbox 页）。

---

## 0. 一次决定性的证据事故（先说结论）

**Team D 的整页截图大部分是空白。** `shots\gen2\team_d_offprint\d2.d2.home.desktop.light.full.png` 与 `...dark.full.png` 中，首屏（朱批 + Q1 幽灵编号 + 右栏字段）之后，Directions 行、Ledger 行、Work 行、Notes 行全部缺席——只有未被 `Reveal` 包裹的标题、图例和边注可见。移动端全页截图（`d2.d2.home.mobile.light.full.png`）同样。

根因在源码：`team_d_offprint\src\components\chrome.tsx:56-70` 的 `Reveal` 用 `initial={{ opacity: 0, y: 12 }}` + `whileInView`，且 **ResearchSection 的每个 topic `<li>` 与每条 question `<li>` 都被 `<Reveal>` 包在 `<ul>` 里**（`ResearchSection.tsx:54, 152`）——这同时制造了两个问题：

1. **内容在"没滚动之前"是 opacity:0**。全页截图、打印、爬虫快照、任何不触发 IntersectionObserver 的消费方式都拿到一个空页面。Round 1 UX 评委对 H Gen 1 的判决原话可以复用："遮蔽态与渲染坏掉不可区分"——D 把 H 已被否决的失败模式用另一种形式重新发明了。
2. **`<ul><motion.div><li>` 是非法 DOM**（ul 的子元素必须是 li）。浏览器容错渲染，但列表语义树被破坏——对以"研究者长期阅读"自我定位的方案，这是自我拆台。

D 的逐页截图 `dp.dp.research/work/publications.*.png` 全部是 404 页（D 只有 `/`、`/lab/corruption-sandbox`、404 三条路由），所以 **D 进化最用力的两个维度（research 展示、work 行动线）在本轮视觉证据里几乎无法被验证**。代码里它们确实成立（见 §4 核验），但"设计决策无法被证据承载"本身就是产品设计的失分。另：`dp.dp.*` 两张特殊路由截图（sandbox / 404）上有一条 **贯穿整页的朱砂色 focus ring**（`:focus-visible` 全局 2px accent 环作用于被程序聚焦的页面容器）——A 明确用 `[tabindex="-1"]:focus { outline: none }`（`team_a_monograph\src\index.css:87-89`）处理了同一问题，D 没有。

对比：A 与 H 的全页截图内容全部在场（A 只在 hero 做一次性动画，H 的 hero 动画限于首屏 facet）。这是本轮工程纪律最刺眼的分差。

---

## 1. Token 体系对比（我的主权重项）

| 维度 | A「Monograph」 | D「Offprint」 | H「Retrieval」 |
|---|---|---|---|
| 分层架构 | Tailwind `@theme` 单层：`bg / ink-1..4 / line-1..2 / accent / accent-ink / wash`，`.dark` 同名覆盖（`team_a_monograph\src\index.css:11-47`） | **三层最规范**：`:root` 原始语义层 → `@theme inline` 绑定层（`team_d_offprint\src\index.css:13-93`），另派生 `--prose-ink`（dark 降灰） | `:root` 原始层 → `@theme inline` 绑定层（`team_h_retrieval\src\index.css:29-48`） |
| Light/Dark 同构 | 完全同名映射；**例外**：dark 的 wash 与 selection 硬编码 `rgb(255 90 31 / …)`（index.css:46,75-78），accent 改值不会跟随——同构性破了一个小洞 | 完全同名映射，`--wght-display 500→470` 一起进 token（index.css:36,68），是唯一把字重补偿 token 化的方案 | 完全同名映射 + **独有的 `prefers-contrast: more` 覆盖**（index.css:89-98） |
| 死 token（定义未使用） | 1 个（`--color-bg-inset`） | **10 个**：`--tok-key/str/num/com` ×2 主题共 8 个定义全站零使用（grep 证实），`--surface`、`--shadow-panel` 亦无 TSX 引用——一个自称"无表面原则"的系统里躺着 shadow token | 1 个（`--ok/--color-ok`） |
| Type scale | 角色制 `.t-display/-2/.t-title/.t-lede/.t-body/-sm/.t-label/.t-mono/-sm/.t-serif-voice`；**但 6 处 `text-[..]` 绕过**：`text-[17px]` 行标题在 `Research.tsx:33` 与 `Lab.tsx:227` 逐字复制两份（同一角色两套实现 = 下一任设计师的陷阱） | 角色制 `.type-*` 带精确 px 注释与 4px 基线行高（16/20/28/32/36/44）；**但 chrome.tsx 5 处内联重写 `.type-label` 配方**（`text-[11px] + font-mono + uppercase + tracking-[0.08em]`，chrome.tsx:196,216,315,337,398,439） | 唯一声明比例的字阶（×1.25，12/15/19/24/30/38/48/60/76）且逐档注释职责；**但 2 处 off-ladder**：`About.tsx:24` `text-[13px]`（恰恰是 Gen 1 被判刑的"13px"）、`Header.tsx:80` `text-[22px]` |
| Spacing | 无任意 px（全走 Tailwind 4px 系）| 无任意 px；`--breakpoint-lg: 70rem` 改注释说明（边注断点），文档意识好 | 无任意 px |
| 注释/验收 | accent 语义写在注释里，colophon 有可见图例（聪明） | 对比度逐对验收表进 DESIGN_NOTES，CSS 注释标装饰色 ≥3:1 门槛 | **每个 token 注释带实测对比度**（"ink 15.2:1 on bg"），全场最佳 |

小结：D 的 token 架构分层最正规、H 的 token 文档最严谨、A 的 token 表最小最干净。但三家都存在"绕过自家系统"的口子，且 D 的死 token 量（10 个定义）说明其 token 表已开始与现实脱节——这正是长期维护要抓的早期症状。

---

## 2. 组件化质量

**A（1511 LOC，三案最精干）**：`Section`（章节骨架）/ `Dot`（状态灯）/ `RankRow`（Lab 与 Work 的 FIG.1 **真实复用**，`Work.tsx:45` 直接喂同一引擎的输出）三原语 + 8 个 section 文件全部 <250 行。`chapters.ts` 注册表同时喂导航、Index overlay、搜索（DESIGN_NOTES §2 声称，`Header.tsx:2`、`IndexOverlay.tsx`、`search.ts` 证实）——单一事实来源做得很到位。`hooks/` 三个小 hook 职责清楚。最弱一环：Lab 245 行里两个 demo 硬编码在同一个 section 文件里，加第 3 个 demo 要改 section 本体。

**D（1851 LOC）**：`bm25.ts` / `hooks.ts` / `theme.tsx` 分层清楚，`Noted` 边注组件是三案中最好的单组件设计（一个组件、三种断点结构、float 锚定 `.measure` 的原因写成注释，chrome.tsx:96-126）。但 **`chrome.tsx` 是 514 行的杂物抽屉**：SkipLink、Reveal、Noted、NoteMark、SectionHead、ThemeRadiogroup、ThemeCycleButton、ThemeControl、useScrolled、ReadingProgress、Header、Overlay、ContentsOverlay、HelpOverlay、Colophon、ScrollManager 共 15+ 导出挤在一个文件——header/主题/覆盖层/colophon 四种职责没有边界，下一任要在这个文件里考古。页级组件倒是干净（SandboxPage 257 行内聚）。

**H（2179 LOC，三案最大但最有秩序）**：`lib/` 六个小模块（bm25/focus/search/sections/seo/theme）各司其职，`structure.tsx` 提供 PageShell/Section 原语，六个 section 路由页复用同一骨架。`RankRow` 在 Lab 内复用于 teaser 与 Sandbox。`SearchPalette` 是三案唯一完整 combobox 语义（`role="combobox" + aria-expanded + aria-activedescendant`，SearchPalette.tsx:126-129）。最弱一环：`Lab.tsx` 372 行装了 Sandbox + ContextBudget + teaser + LabPage 四个组件，该拆。

---

## 3. 状态完备性（hover / focus / active / disabled / empty / loading）

| 状态 | A | D | H |
|---|---|---|---|
| hover | 11 处，全部 token 化（decoration-line-2 → ink-1） | 16 处，`row-hover` 的左缘 scaleY 竖线 + wash 背景（index.css:388-411）是最精致的一处 | 12 处，克制（颜色+下划线 160ms） |
| focus | 全局 accent 环 + **正确抑制程序焦点 `[tabindex="-1"]`** + range 独立补环 | 全局 accent 环，但**无程序焦点抑制**（证据：dp.dp.* 两张整页朱砂描边截图） | 全局 accent 环 + skip-link 专属态 |
| active | 1 处 | 2 处（row-hover:active） | 0 处显式（按钮用 pressed/aria-pressed 区分） |
| disabled | 无 disabled 控件（设计上回避了） | 无 disabled 控件 | **唯一有真实 disabled 态**：ContextBudget 排序箭头 `disabled={i===0}` + `disabled:opacity-30`（Lab.tsx:271-282） |
| empty | Publications `0 RECORDS` + 2 条 RESERVED ghost 槽；Work 链接位声明"unlisted until they exist" | Publications ghost specimen 行 + 版式契约说明（"第一篇入库时替换这两行，版式零改动"——把空态写成组件文档，好设计）；`updated: null` 渲染**零痕迹**（ResearchSection.tsx:166-168 证实）；`NO OPEN QUESTIONS` 派生态 | Publications reserved 槽 + call-for-papers 礼仪；Connect 占位句；palette 因 email 为 null **不提供会失败的 copy 动作**——三案中最彻底的"缺项即不渲染入口" |
| loading | 无异步数据（诚实：0MS NETWORK） | 同 | 同 |
| aria-live | 2 处（搜索/主题） | 2 处（过滤/沙盒播报） | 4 处（含沙盒 sr-only 全语句播报，Lab.tsx:110-114,183-185——播报内容随状态三态变化，最佳） |

---

## 4. DESIGN_NOTES 声称核验（抽查记录）

**A — 4 抽 4 实：**
1. "FIG.1 用与 Lab 完全相同的 BM25 引擎实时计算" → `Work.tsx:32` `bm25Rank(sandboxQuery, cleanCorpus)`，与 `Lab.tsx` 同源。实。
2. "RECORDS 行由 content 数组实时计算 + 构建注入" → `Hero.tsx:61-64`，截图 `a2.a2.home.desktop.light.png` 显示 `RECORDS — WORK 4 · NOTES 3 · PUBS 0 · QUESTIONS 4 · SET 2026-10-04`。实。
3. "Re-ink 三级降级" → `useTheme.ts:60-85`：VT wipe / `.theming` 分层渐变 / reduced-motion 瞬切，三路径俱全。实。
4. "无 FOUC" → `index.html` 内联脚本 + `useTheme.ts` 注释互证。实。

**D — 4 抽 4 实（但 §0 的 Reveal 后果未被声明）：**
1. "Directions Ledger 派生读数、零坐标" → `ResearchSection.tsx:51-53` `openCount` 实时过滤计算；`ADJOINS` 来自 `research.ts` 数据（types.ts:30 `adjoins` 字段）。实。
2. "`updated: null` 什么都不渲染" → `ResearchSection.tsx:166-168` `{q.updated ? … : null}`。实。
3. "边注三段降级、float 方案" → index.css:308-363 三套类 + `Noted` 组件 `useMediaQuery` 分支单 DOM。实。
4. "dark 字重补偿 + 长文降灰" → index.css:36,68（`--wght-display 500→470`）、:96-100（`--prose-ink`）。实。
5. 未声明项：每个 section/每行包 `Reveal`（whileInView）的整页不可见后果（§0）；`tok-*` 死 token；`.type-label` 配方 5 处内联复制。

**H — 3 抽 3 实：**
1. "自述装置四重跳过 + resolved 态定格" → `Hero.tsx`：skip 按钮 t=0 可见且占位防抖（:148-158）、Esc 且有 overlay 仲裁（:55-62）、localStorage 回访直通（:29-35）、reduced-motion 静态（:64-67）；零 blur。实。
2. "字阶 ×1.25 + 4px 基线" → index.css:153-237 逐档核对（80/56/44/32/28/24/16 全 4 倍数）；但 About 13px / Header 22px 两处越阶（§1）。
3. "headless 审计" → 脚本目录 + `hp.*` 截图与空 console.json 相符（所有 console 报告三案均为 `[]`）。实。
4. 附加发现（非声称、是 bug）：路由页 standfirst 与 lede 渲染了**同一句话两遍**（`hp.hp.research.desktop.light.png`："Six directions and four live questions. Status words are self-descriptions, not progress claims." 斜体一遍、正文一遍）——内容契约里两个字段被喂了同一个源。

---

## 5. 可扩展性演练：内容 ×10（20 项目 / 30 笔记 / 5 demo）

**A**：结构最扛——章节注册表、plate 自动编号 `pad2(i+1)`、RECORDS/Colophon 计数全部派生，20 个项目时版式语法（col 3/9 网格 + hairline）不变。**先崩的两个点**：① Lab——demo 是硬编码组件而非注册表，第 3 个 demo 必须改 section 文件；② 单页无路由拆分，×10 后整页极长（搜索 + Index overlay 缓解，但"书"会真的变成一卷）。`p.id === "poison-sandbox"` 的 FIG.1 挂接是 id 耦合，换内容需改代码——可接受的例外，但应注释。

**D**：数据派生层最扛——`openCount`/`ADJOINS`/`N OF M QUESTIONS SHOWN` 全部从数组计算，加内容零改码，这是三案里最好的"增长只加数据"设计。**先崩的两个点**：① Reveal 包裹层——每行一个 motion.div + observer，30 笔记 + 20 项目 ≈ 60 个包裹节点，§0 失败模式随内容量放大，且非法 ul>div>li 数量同步放大；② `chrome.tsx` 抽屉随新组件继续膨胀。另有隐性内容约束未进类型系统：朱批/幽灵编号假设**恰好一个 active 问题**（status 类型允许多个，无断言）——内容 ×10 后第一个"设计决定与数据契约不同步"的爆点。

**H**：唯一具备真路由架构（`App.tsx:113-122` 六条 section 路由 + Home 全渲染），其 DESIGN_NOTES 风险 #5 自己写明"笔记 >10 篇时 Home 应只保留摘要行——结构与组件已就位"：这是三案中唯一一份可执行的扩容预案，且我核验属实（`sections.ts` 注册表 + PageShell 使该改造确实只是换 Home 的 section 调用）。5 个 demo：LabPage 的 section 模式可平加。**先崩的两个点**：① Home 全量渲染（已自我申报）；② `t-h1/h2/h4` 命名断档（无 h3，h4 实际承担"问题句"角色）——20 个页面之后按元素级别命名的 token 会误导下一任（问题句不是"四级标题"，是角色）。

---

## 6. 双主题一致性抽查结论

- 三案的 dark 都是**同名 token 重新赋值**（同构映射成立），无一套走"dark 另起类名"的歧路。
- 工艺排序：D（字重补偿进 token + prose-ink 派生层）≥ H（逐 token 对比度注释 + prefers-contrast）> A（最简，但 dark wash/selection 硬编码 rgb 破坏衍生关系）。
- 截图证据：A 的 dark 全页（`a2.a2.home.desktop.dark.full.png`）与 light 完全同构、层级不变；H 的 dark（`h2.h2.home.desktop.dark.full.png`、`hp.hp.publications.desktop.dark.png`）成立；D 的 dark 沙盒页（`dp.dp.labcorruption-sandbox.desktop.dark.png`）成立但带整页 focus ring 噪音。

---

## 7. 逐案评语

### Team A「Monograph」— 8.6，排名 1
**优点**
1. **全场最高的"决策→代码"转化率**：4 项声称全部在源码找到且无一处注水；1511 LOC 承载了三案同等的功能面，`chapters.ts` 单一注册表喂导航/索引/搜索是教科书式的单一事实来源。
2. **FIG.1（Work.tsx:31-67）是三案中唯一"数据即图像"的作品展示**——用 Lab 同引擎在访客浏览器里现算排名，作品存在感来自真实计算而非文案；portfolio_presentation 的负分修得最实。
3. 整页完整性：全页截图 light/dark/移动全部内容在场——在 D 出现证据事故的衬托下，这种"任何消费方式都拿到全部内容"的纪律就是长期可维护性的具象。

**缺点**
1. `text-[17px]` 行标题在 `Research.tsx:33` / `Lab.tsx:227` 逐字重复，未进 type token；加上 `Notes.tsx:29` 的 `text-[19px]`——行标题这个角色缺少一个正式 token，三处三种写法。
2. dark 的 wash/selection 硬编码 `rgb(255 90 31 / …)`（index.css:46,75-78），accent 换色时 dark 主题衍生色不会跟随——token 体系的一个孤岛。
3. Lab 两个 demo 硬编码在同一个 section 文件（245 行），demo 增长没有注册表语法；`p.id === "poison-sandbox"` 的 id 耦合无注释声明。

**如果只能改一处**：给"行标题"一个正式 token（`.t-row` 或映射既有阶梯），把 Research/Lab/Notes 三处 `text-[17px]/[19px]` 收编——三案中最小的改动量，消灭的是未来每一次行样式调整都要改三处的债。

### Team H「Retrieval」— 8.4，排名 2
**优点**
1. **唯一可扩容的架构**：六条真路由 + PageShell + sections 注册表，DESIGN_NOTES 风险 #5 的扩容预案经核验属实；`lib/` 模块化（focus/seo/theme/sections 各一职）是三案最健康的文件边界。
2. 无障碍工程化最全：完整 combobox 语义、`prefers-contrast` token 覆盖（全场唯一）、ContextBudget 真实 disabled 态、沙盒 sr-only 三态播报；自述装置的四重跳过在代码里逐条兑现。
3. token 注释逐个标注实测对比度（index.css:55-84），这是"设计决策可被代码审计"的最佳样本。

**缺点**
1. 字阶自contracts有小裂缝：`About.tsx:24` 的 `text-[13px]`（恰是 Gen 1 被判的 13px）与 `Header.tsx:80` 的 `text-[22px]` 越阶；`t-h3` 缺位、`t-h4` 名不副实（实为"问题句"角色）。
2. 路由页 standfirst 与 lede 重复渲染同一句话（`hp.hp.research.desktop.light.png`）——内容契约两个字段同源，首屏文案纪律事故。
3. `--ok` token 死代码；`Lab.tsx` 372 行四个组件该拆未拆。

**如果只能改一处**：把字阶命名从"元素级别"改为"角色"（t-h4 → t-question，补齐 t-h3 或显式说明），并把 About/Header 两处越阶尺寸收编——H 的字阶是它的进化主张，主张不能有裂缝。

### Team D「Offprint」— 7.9，排名 3
**优点**
1. **数据派生设计三案最佳**：openCount / ADJOINS / `N OF M SHOWN` / `updated:null` 零痕迹，全部从 `content/research.ts` 计算，增长只加数据——Round 1 的 maintainability −1.15 修在了正确的地方（types.ts 的 `topic`/`adjoins`/`relatedDemo` 扩展字段是为此服务的真契约）。
2. 排印工程最扎实：4px 基线逐档落格（16/20/28/32/36/44 全倍数）、字重补偿进 token、`.prose`/`.measure`/边注 float 锚定的因果都写成注释；`Noted` 是全场最好的单个组件设计。
3. 朱批 + Q1 幽灵编号是语义记忆点的正确解法（首屏截图 `d2.d2.home.desktop.light.png` 成立），accent 白名单"违反即 bug"的纪律可执行。

**缺点**
1. **§0 证据事故**：逐行 `Reveal`（whileInView + opacity:0 初始态）使整页截图/打印/无滚动场景下内容不可见，且 `ul > motion.div > li` 非法 DOM——一个以"研究者长期阅读"立身的方案不能接受"不滚动就没有正文"。
2. `chrome.tsx` 514 行 15+ 导出的杂物抽屉（header/主题/覆盖层/colophon 四职责无边界）；5 处内联复制 `.type-label` 配方。
3. token 表与现实脱节的早期症状：10 个死 token 定义（tok-*×8 + surface + shadow-panel，一个"无表面"系统里躺着 shadow token）；特殊路由整页 focus ring 未抑制（对比 A 的 `[tabindex="-1"]` 处理）。

**如果只能改一处**：移除逐行/逐 section 的 `Reveal` 包裹（保留 hero 级或改为 CSS-only），同一刀修好整页空白证据、非法列表 DOM 和 ~60 个 observer 的增长负担——这是 D 唯一一个"不改则其他所有优点都无法被验证"的点。

---

## 8. 评分（14 维度，1–10，0.5 步进；权重：maint/feas 加重）

| 维度 | A | D | H |
|---|---|---|---|
| visual_quality | 8.5 | 7.0 | 8.0 |
| originality | 7.5 | 7.5 | 8.5 |
| typography | 8.5 | 9.0 | 8.5 |
| information_hierarchy | 9.0 | 8.5 | 8.5 |
| ux | 8.5 | 7.5 | 8.5 |
| mobile_experience | 8.5 | 8.0 | 8.5 |
| technical_feasibility | 9.0 | 8.0 | 8.5 |
| long_term_maintainability | 9.0 | 7.5 | 8.0 |
| research_presentation | 8.0 | 9.0 | 8.5 |
| portfolio_presentation | 8.5 | 7.0 | 8.0 |
| light_mode | 9.0 | 8.5 | 8.5 |
| dark_mode | 9.0 | 8.5 | 8.5 |
| performance | 8.5 | 7.5 | 8.0 |
| accessibility | 8.5 | 8.0 | 9.0 |
| **均分** | **8.57** | **7.93** | **8.41** |

评分理由锚点：D 的 visual_quality 7.0 与 portfolio_presentation 7.0 直接由 §0 证据事故压制（设计成立但无法被任何静态方式承载/验证）；D 的 ux 7.5 计入整页 focus ring 噪音与深链 404；A 的 originality 7.5 保守（ dialect 仍是 hairline+单 accent 谱系，FIG.1 加回的是论证深度）；H 的 maintainability 8.0 而非 8.5（t-h3 断档 + Lab.tsx 372 行）。

## 9. Top 3

1. **A「Monograph」**——决策→代码转化率与整页完整性双第一，唯一在 ×10 演练中不需要先"还债"再扩容的方案。
2. **H「Retrieval」**——唯一自带可执行扩容预案与真路由架构，token 审计文化最佳；字阶命名裂缝是小事但必须修。
3. **D「Offprint」**——数据派生与排印工程仍是三案天花板，但 Reveal 证据事故、chrome.tsx 抽屉与 10 个死 token 让"工程负分转正"的主张打了折扣。
