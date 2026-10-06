# Round 2 评审 — Judge #3：UX（用户体验）

> 评委视角：以三类真实访客（招聘者 90 秒 / 研究者同行 / 普通访客）的任务完成质量评**可达性、方向感、认知负担、失败模式**。一票否决区：**ux、information_hierarchy**。
> 视觉证据：`D:\Codex\play\portfolio\shots\gen2\{team_a_monograph,team_d_offprint,team_h_retrieval}\`。每案实看：desktop light/dark 首屏 + 整页、mobile light/dark 首屏 + 整页、tablet light 首屏；并复核 `_crops\` 中与本职责相关的切片（`d_overlap_zoom.png` 等）。
> 工程佐证：三案 `*.console.json` 均为空数组。
> 抽查过的源码：A `SearchDialog.tsx`/`useDialog.ts`/`Header.tsx`/`App.tsx`（`/` 键守卫）/`Publications.tsx`/`Connect.tsx`/`IndexOverlay.tsx`；D `chrome.tsx`（Reveal/Noted/HelpOverlay/Colophon）/`ResearchSection.tsx`/`App.tsx`（`T` 键守卫）/`Home.tsx`/`WorkSection.tsx`/`index.css` L300–317（float 边注）；H `Hero.tsx`（Self-Query 全部跳过路径）/`SearchPalette.tsx`（combobox 语义）/`App.tsx`（`/`+`?` 全局键）/`About.tsx`/`Publications.tsx`/`MobileMenu.tsx`。

---

## 0. 指定裁定（先答任务书点名的六个问题）

### 0.1 A 的站内搜索（`/`）——**加分，且是三案键盘/检索体验里完成度最高的单件**

- 实现质量：`SearchDialog.tsx` 是教科书级的 dialog——`role=dialog` + listbox/option + 方向键/Enter/Esc、`useDialog` 提供 scroll lock、初始焦点、Tab 圈闭与归还焦点（`useDialog.ts` L26–59）；空 query 时回退为章节索引（"jump to any chapter"），0 结果时有诚实空态；页脚 `N ENTRIES · LEXICAL · LOCAL · 0MS NETWORK` 读数可审计。
- 任务价值：索引由渲染页面的同一批 content 数组构建，"poison" 一步直达 Q1/Lab/Plate——在 A 这种 8000px+ 单页长卷上，搜索不是炫技而是**唯一的横向跳跃手段**，对 90 秒招聘者和同行都是实际收益。
- 入口发现性：桌面导航常驻 `SEARCH /`（kbd 徽标），移动端是文字按钮；`/` 已排除 input/textarea/contenteditable（`App.tsx` L42），Firefox quick-find 冲突有按钮兜底。无负担。

### 0.2 D 的键盘体系（`T` / `?`）——**无害的加分，但收益接近于零**

- 实现正确：`T` 全局循环主题且排除输入焦点与修饰键（`App.tsx` L23–33）；`?` 开合帮助浮层；帮助层内容诚实（就 5 个键，包括"Tab 走遍所有控件"）；页脚有 kbd 带。
- 裁定：**不是负担**——指针路径（SYS·LIGHT·DARK radiogroup）完整存在，快捷键是纯增量。**但也难成加分**：唯一的发现性入口在长卷最底部页脚（`Colophon.tsx` L486），第一屏、乃至前 6000px 里没有任何提示；会按 `?` 的人几乎必然先滚完了全站。首轮 ux（−0.45）靠它扳不回来。结论：正确、克制、低影响。

### 0.3 H 的 palette（`/`）与 Self-Query——**palette 加分；Self-Query 不再拖慢首屏理解，本轮正式销案**

- palette：完整 combobox 语义（`role=combo` + `aria-activedescendant` + listbox，`SearchPalette.tsx` L126–151）、`?q=` 深链、`LOCAL INDEX · N RECORDS · 0MS NETWORK` 读数；头部搜索按钮带 `aria-label="…press slash"` 与 kbd 徽标（≥1280px 可见）。对多路由结构而言 palette 是真实导航工具，加分。
- Self-Query 时间轴实测（`Hero.tsx`）：标题 t=0 可见且永不参与动画；facet 行 `delay 0.15 + i×0.18 + 0.4s` → 最后一条 **1.09s** 完成；状态行随之定格 `RESOLVED · 4 FACETS · 0MS NETWORK`。四重跳过（skip 按钮 t=0 占位防抖 / Esc / 等 1.5s / 回访 localStorage 直通）+ reduced-motion 静态，全部在源码属实。关键在于：**facet 行在动画期间就在 DOM 里且可点击**（每行是真链接 → `/research#id`），动画不设交互门。所以答案是：**不再拖慢**。残余成本只有一条——首帧状态词 `RESOLVING…` 语义偏"加载中"（desktop light 截图恰好捕在该态，`h.h.home.desktop.light.png`），措辞可再主动一点，但这是文案级残留，不是结构税。

### 0.4 Publications 空态的心理感受——**H 最好，A 稳健，D 有说服力但略说教**

三案面对同一内容约束（`publications: []`、`email: null`），差异全在"如何让空不伤害访客"：

- **H（最好）**：`Nothing in print yet — this space is reserved…` + `status: call for papers` + ghost 槽之外，**给了两条向前的门**——"The research is already visible →" / "Working notes appear first →"（`sections/Publications.tsx` L38–45）。空态不终结任务，而是把能量重定向到存在的东西。这是三案中唯一把空态当"路由"而非"声明"的。
- **A（稳健）**：`0 RECORDS` + "the ledger is open, the work is still being written" + 两行 `RESERVED` + `LEDGER OPEN — LAST SET {date}`。平静、向前看、无羞耻感；缺陷是与后一章 Connect 的六行 `— unlisted` 叠在一起，页尾约 1.5 屏是连续的"空城"（`a.a.home.desktop.light.full.png` 尾段），访客在最后一个动作点上连续两次撞墙。
- **D（有说服力但说教）**：`0 PUBLICATIONS — COUNTED, NOT PROJECTED` + "Written work will appear here as it exists. Not before." + 版式契约说明。方法感最强、研究者会心；但三连否定句（"Not before / not announced / does not make"）是在对评委修辞，普通访客读到的是防御姿态而非邀请。

### 0.5 Team D 的 whileInView 门控——**确认缺陷，但要把"两种伤害"分开说**

源码事实：`chrome.tsx` L56–78 `Reveal` 用 `initial={{opacity:0, y:12}} + whileInView`（`once:true`，viewport margin −10%）包住了全部 section 主体；A/H 全站 `whileInView` 计数为 **0**（grep 实测）。四组整页截图（desktop/mobile × light/dark）一致显示 Ledger、Work、Lab、Notes、About 主体不可见，仅剩未包裹的小标签悬在空窗里。

作为 UX 评委的精确裁定：

1. **实况滚动不是重灾区**：真实用户滚动时 IntersectionObserver 触发、内容 0.32s 渐入——`once:true` 且无回滚闪烁，正常浏览路径基本无损。这一点必须说清，"60–70% 空白"不是实况浏览者的日常。
2. **真正受伤的是四类场景**：打印/存 PDF（不滚动 → 下方全透明）、整页导出与任何截图管线（本评审计分的事实依据，D 的 portfolio_presentation 证据因此自毁）、no-JS/爬虫快照（DOM 在但呈现为空）、以及"滚太快"的 fling 场景（内容追着眼球进来，感知为迟滞）。对一个身份是"长卷黄金路径"的方案，这等于在自己的主场引入了稳健性税。
3. 评级落点：记入 information_hierarchy（否决区）6.5 与 ux 7.0，确认但不独自触发否决——它与边注叠印合并构成 D 的执行塌方（见 0.6 与 §D）。

### 0.6 Team D 的边注 float 叠印 bug——**确认，这是发生在"可见区"的更严重缺陷**

`_crops\d_overlap_zoom.png` 与整页 light/dark 一致可复现：Research 区脚注¹（"…retired on purpose: a graph you have to re-layout by hand… liability, not a map."）与 Ledger 图例行 `ACTIVE — BEING ASKED NOW · OPEN — ON THE LIST · RESTING — PARKED, HONESTLY` **逐字叠印、不可读**。根因在源码可指认：`ResearchSection.tsx` L101–114 把 `Noted`（`.sn-float: float:right; margin-right:-26ch`）放在块尾，float 高度远超宿主段落，`.measure` 只有 `max-width:60ch` 不建立 BFC，float 垂直溢出侵入下一个兄弟块的全宽图例行（`index.css` L209 注释自己写了"measure 是承重墙"，但只承了水平方向）。

UX 定性：这不是截图伪影——1440px 实况访客在**研究主阅读路径的正中**看到两层文字互相穿透，且恰好压在 D 最自豪的状态图例上。与 0.5 相比，这个 bug 是"实况可见"的，单点可修（`flow-root`/`clear`），但在修复前它持续污染全站最核心的区段。

---

## 1. 三类访客走查

### 招聘者 90 秒（方向 / 作品 / 联系三层是否可达）

- **A —— 三层最快可达**：方向 2 秒（三行 display + kicker + RECORDS 行）；作品 = 首屏 `Selected Work ↘` 或常驻导航 `03`，PLATE 版式 + 状态灯 + meta 一屏一项目；联系 = 常驻导航 `07 CONNECT` 一步直达。唯一的坑在最后一层：6 渠道台账全部 `— unlisted`，任务终点是一堵诚实的空墙（内容包约束，非设计之罪，但 A 的"六行表格"式呈现放大了墙的面积）。加分项：`/` 搜索让"找邮箱/找 GitHub"至少有一次有尊严的尝试。
- **D —— 前两层好，第三层只有一句礼貌**：方向 2 秒；作品 = 首屏 `→ 02 — SELECTED WORK`，行内常驻 `▶ TRY IT NOW — CORRUPTION SANDBOX` 是三案中唯一"在作品行内直接给可玩 Demo"的设计，招聘者 90 秒内真的能摸到东西；联系 = Hero 右栏 `CONTACT — AVAILABLE ON REQUEST.`——措辞是三案中对 null 邮箱最体面的翻译（暗示渠道存在），但也仅止于此。
- **H —— 方向感最好，联系最冷**：方向 2 秒；右栏 `INDEX OF ONE PERSON` 首屏给出全部 6 站 + 诚实计数（`4 CHAINS` / `0 RECORDS`），三层各自一击可达；联系 = `§06` 后 "Ways to reach me will appear here. / status: 0 channels configured"——机器式诚实，对人类访客是最冷的收尾。
- **裁定**：可达性 A ≈ H > D（A 的常驻章节导航 + D/H 同样显式的索引）；**终点体验** D（体面）> A（结构化空墙）> H（纯空）。三家都受制于内容包，差距在翻译质量。

### 研究者同行（方向与问题是否可信 / Lab demo 是否帮助理解）

- **D 仍是研究展示天花板**：Question Ledger 的编号/状态/日期/UPD、图例行、`ADJOINS` 交叉引用按钮、点击方向名过滤并 `aria-live` 播报、`→ RUN IT IN THE LAB` 用稳定 id 把问题缝到可运行证据——同行视角的每一步都有下一站（实况浏览时；叠印 bug 修复前，图例行这段的阅读体验是坏的）。
- **H 第二**：§01 六方向 + 四问题台账（状态/日期文字化）+ Lab 段落直接内嵌真实 BM25 排名预览 + `Open the sandbox →`；palette 可横查全部主题。比 D 干一点，但可信度不打折。
- **A 第三**：方向台账 + 四问题（状态灯语义在 colophon 有图例）+ Lab 双 demo 诚实声明 + FIG.1 把"clean corpus 的低确定性"画成论证。可信，但问题之间没有 D/H 那种"问题↔证据"的缝线。

### 普通访客（首屏钩子 → 深入）

- **H 顺滑度第一**：钩子（76px 衬线 + 1.1s 内 self-complete 的 facet）→ 右栏索引任选深处 → 迷路了有 palette。整页七段完整渲染（`h.h.home.desktop.*.full.png`），扫到哪都有内容，页尾 Publications 还有 redirect。唯一干段是 Work 链的 `04 — LINKS` 四连 "—"。
- **A 第二**：钩子同样强（橙 caret 是全站最醒目的"活"记号），sticky 章节骨架让长卷不迷路；但页尾 Publications→Connect 的连续空城让"深入"的最后 1.5 屏在情绪上泄气，长页节奏单一（同构台账行 × 全站）放大了疲劳。
- **D 第三（仅因失败模式）**：首屏记忆点三案最佳（朱批 + 幽灵 Q1），实况滚动也能读完；但 fling 滚动的迟滞感、打印/导出的空窗、以及 Research 区的叠印，都是普通访客可能真实撞上的三处坑。

---

## 2. 逐案评语

### Team A「Monograph」

**优点**
1. **常驻章节导航 + `/` 搜索 + sticky 骨架 = 三案最强的任务可达性系统**：7 个编号章节永远在导航栏可见（`a.a.home.desktop.light.png`），任何滚动位置都保有全局方位；搜索对话框（`SearchDialog.tsx`）完成度全场最高，是长卷结构的必要补偿而非装饰。
2. **交互细节普遍体面**：主题三态循环按钮 aria-label 报告当前态与下一态（`Header.tsx` L107）；Index overlay（移动端）是真正的目录页而非汉堡菜单填充物；RECORDS 行首屏即诚实读数；`ESC` kbd 徽标常驻搜索框。
3. **动效不设内容门**：全站无 whileInView（grep = 0），整页截图四组完整（`a.a.home.desktop.*.full.png`）——评委与搜索引擎看到的和用户看到的是同一页。

**缺点**
1. **首屏右半屏（约 45% 面积）零信息职责**：方向感全押在顶部导航一行小字上；1440 首屏的右栏既无索引也无读数（`a.a.home.desktop.light.png`）。任务不受阻，但第一眼方位感三案最弱。
2. **页尾双空城**：Publications（2 行 RESERVED）→ Connect（6 行 `— unlisted` + "No channels are configured yet."）连续约 1.5 屏空态（`a.a.home.desktop.light.full.png` 尾段）——招聘者最后 10 秒的体验是连续两次撞墙。
3. **长卷节奏单一**：全站"mono 编号 + hairline 行"一种句式贯穿 Research/Ledger/Lab/Notes/Connect，扫读 8000px 后区段间辨识度下降；Lab 与 FIG.1 两处几乎同构的分数条轻微自我重复。

**如果只能改一处**：把首屏右半屏交给一个常驻方位物——用 Monograph 的语言放"章节索引 + RECORDS 读数"纵排批注（目录即导航、读数即诚实），一次同时修掉首屏死空间与长卷方位感。

### Team D「Offprint」

**优点**
1. **首屏是三案中"最想让你留下来"的**：76px 衬线 display + 右栏朱批（NOW ASKING — Q1 + 问题原文）+ 幽灵 Q1，方向/问题/联系三语全在第一屏（`d.d.home.desktop.light.png`）；`CONTACT — AVAILABLE ON REQUEST.` 是对空邮箱的最体面翻译。
2. **研究展示的缝线最密**：Ledger 状态图例、ADJOINS 过滤 + aria-live、`relatedDemo` 用稳定 id 把 Q1/Q2 缝到沙盒（`ResearchSection.tsx` L146–185）、demo 页回链 `RE: Q1 · Q2`——同行的每一站都有下一站。
3. **行内常驻行动线**：作品行内直接给 `▶ TRY IT NOW — CORRUPTION SANDBOX` 真链接（`WorkSection.tsx` L46），招聘者 90 秒内可玩；"links 到位时代码路径已备好"的空位策略诚实。

**缺点**
1. **边注 float 叠印（实况可见，最优先）**：Research 主路径上两层文字互相穿透（见 0.6 / `_crops\d_overlap_zoom.png`），压的恰是最需要清晰的状态图例行。单点可修，修复前持续污染核心区段。
2. **whileInView 门控的稳健性税（否决区内）**：打印/整页导出/快照/快滚四类场景下内容不可见（见 0.5）；四组整页证据 60–70% 空白，portfolio_presentation 的证据自毁。`rm` 降级只救了 reduced-motion 用户，救不了上述场景。
3. **键盘层与空态的说教腔**：`T`/`?` 只在页脚可发现（0.2）；Publications 空态三连否定句是对评委的修辞而非对访客的邀请（0.4）。

**如果只能改一处**：去掉 `Reveal` 的 initial-hidden（内容首帧可见，动画只做 transform/渐入）——一行改动同时修复整页空窗、打印/导出、快照与快滚四类伤害，且让评委第一次能审计 D 引以为傲的 4px 基线在 60% 页面上的真实落格；紧随其后的第二刀必须是 `.measure{display:flow-root}` 修叠印。

### Team H「Retrieval」

**优点**
1. **三案中唯一"零摩擦首屏 + 全程可审计整页"**：标题 t=0、facet 1.09s self-complete 且不设交互门、四重跳过路径全部属实（0.3）；七段整页 light/dark 完整渲染（`h.h.home.*.full.png`）——普通访客、评委、打印、爬虫看到同一页。
2. **方位感系统全场最佳**：右栏 `INDEX OF ONE PERSON` 首屏给出全部站点 + 诚实计数；palette（完整 combobox + `?q=` 深链）+ `?` 帮助层 + 页头 kbd 徽标构成三案最完整的键盘/检索发现性链条。
3. **空态会路由**：Publications 给两条向前链接（0.4），Connect 缺渠道时如实说 "status: 0 channels configured" 并把版面让给 colophon 的方法说明——空而不僵。

**缺点**
1. **Work 证据链是全站最干的一段**：`01—PROBLEM / 02—METHOD / 03—ARTIFACTS / 04—LINKS` 四栏并排，LINKS 四连 "—"（`h.h.home.desktop.light.full.png` Work 段）——mono 方法清单读起来像表单，作品的存在感三案最弱（与 D 的行内 TRY IT NOW、A 的 PLATE 尺度对比明显）。
2. **联系层最冷**：`Ways to reach me will appear here.` 对普通访客不是邀请是封条；hero/palette/lab 之外的段落（尤其 Work）几乎没有"人味"触点来平衡机器声部。
3. **首帧状态词残留**：`RESOLVING…` 在首访第一秒语义偏"加载中"（light 首屏截图恰好捕中）；措辞应主动化（如 `QUERYING SELF — 0MS NETWORK`），避免慢设备上的第一印象被误读为网络等待。

**如果只能改一处**：重排 Work 链四栏——LINKS 死柱并入行尾 mono meta，腾出的栏位放"该工作回答了哪个问题"的 Q× 回链（H 已有 Question Ledger 数据，缝线成本低）：同时修掉表单感、让证据与问题互通，同行和招聘者各得一分。

---

## 3. 14 维评分（1–10，可 0.5）

| 维度 | A | D | H | 评注（UX 视角） |
|---|---|---|---|---|
| visual_quality | 8.5 | 8.0 | 8.5 | D 首屏最佳但叠印发生在可见区 |
| originality | 8.0 | 8.0 | 8.5 | H 的"自述→检索语言"贯穿行为而非装饰 |
| typography | 8.5 | 7.5 | 8.5 | D token 最强但渲染层压字是排印的实然失败 |
| information_hierarchy | 8.5 | **6.5** | **9.0** | **否决区**：D 的层级在非滚动管线上坍缩；H 的索引+计数+主线是范本 |
| ux | 8.5 | 7.0 | 8.5 | **否决区**：D 叠印+门控 vs H 的零门控+palette；A 靠导航/搜索撑住 |
| mobile_experience | 8.5 | 8.0 | 8.5 | A 章节指示条+Index 层；D 原生 details 边注；H resolved 直通 |
| technical_feasibility | 9.0 | 8.0 | 9.0 | A/H 无滚动依赖；D 的 IO 门控与 float 负 margin 是两处已爆失败面 |
| long_term_maintainability | 8.5 | 8.5 | 8.5 | 三案 content 契约同级；D 的 Reveal 包裹是维护暗面 |
| research_presentation | 8.0 | 9.0 | 8.5 | D 的 Ledger 缝线仍是天花板 |
| portfolio_presentation | 8.5 | 7.5 | 8.0 | A 的 Plate 全程在场；D 的 Case 在证据中不可见；H 的链偏干 |
| light_mode | 8.5 | 8.5 | 8.5 | |
| dark_mode | 8.5 | 8.0 | 8.5 | D 的 dark 略平 |
| performance | 8.5 | 8.0 | 8.5 | D 变量衬线 + framer-motion 是最重账单（已自报） |
| accessibility | 8.5 | 8.0 | 9.0 | H 的 combobox/focus/reduced-motion/noscript 链最完整 |
| **均值** | **8.46** | **7.89** | **8.57** | |

## 4. 一票否决区复核（ux / information_hierarchy）

- **A**：ux 8.5、information_hierarchy 8.5 —— 远离否决线。
- **H**：ux 8.5、information_hierarchy 9.0 —— 远离否决线。
- **D**：information_hierarchy **6.5**（whileInView 使层级在整页/打印/快照管线坍缩——与排版评委的独立裁定一致）；ux **7.0**（叠印在实况可见区、门控在四类场景可见）。两项均确认失分但均未越过否决线：叠印是单点可修（`flow-root`），门控是一行可修（去 initial-hidden）——否决留给"不可修复的品质塌方"，D 的两处缺陷都在一行修复射程内，判"带病存活、限期修复"。

## 5. Top 3 排名（UX 评委）

1. **Team H「Retrieval」** — 唯一在"首屏零摩擦、整页全程可审计、空态会路由、键盘链完整"四个 UX 面同时无伤的方案。与另两位评委的排序分歧（他们列 A 第一）来自职责差异：在我的两个否决区维度上 H 是三案唯一满分级，而 A 的首屏死空间与页尾双空城是真实但非致命的体验磨损。
2. **Team A「Monograph」** — 任务可达性系统（常驻章节导航 + 搜索 + sticky 骨架）三案最强，招聘者 90 秒路径最快；首屏方位感与页尾情绪收尾是输给 H 的两分。
3. **Team D「Offprint」** — 拥有最佳首屏记忆点与研究缝线，但边注叠印（实况）与 whileInView 门控（管线）是三案仅有的两处"用户真实可见的失败"，且都落在我的否决区邻近。两处都是一行修复——修完即回到第一梯队竞争。

## 6. 给 Round 3 的一句话（UX）

下一轮的分水岭不再是"有没有装置"，而是**谁敢让内容在任何管线（滚动/打印/快照/慢机）里都以同一张脸出现**——把"诚实读数"的纪律从数据层推进到"呈现可靠性"层，才是这套共同语言真正的成年礼。
