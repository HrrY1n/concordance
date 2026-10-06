# DESIGN_NOTES — Team A「Monograph 单行本」Generation 2

> 实现：`@portfolio/gen2-a`，单页长卷 + 章节锚点（00 Frontispiece – 07 Connect）。
> 验收：`npm run build`（tsc strict + vite）零错误；`npm run dev`/`preview` 模块图全部 200；
> BM25 验收脚本 `scripts/verify-sandbox.ts` 全部 PASS（详见 §4）。

## 1. 相对第一代改了什么、为什么

### 1.1 负分维度修复

**originality（−0.52 → 目标转正）——把"橙 = 活着的东西"从纪律做成可见系统，并新增三个 F 绝对不会做的元素：**

1. **FIG. 1 —— 第一张"以数据为颜料"的图版**（`src/sections/Work.tsx` PlateFigure）。Plate 01 内嵌一张真实计算的非交互图：用与 Lab 完全相同的 BM25 引擎，在访客浏览器里对干净语料实时算出 ranking，以 hairline 分数条呈现。图注直读数据："clean corpus 只给 lexical ranker 这么一点确定性——后半段接近噪声；这正是单篇伪造文档能登顶的原因"。图不是装饰而是论证；数据即图像。F 的图形是坐标与刻度，永远不会把"一次浏览器内实时计算"当作图版内容。
2. **书籍装置层**：运行书眉（桌面导航即 running head，移动端 56px 下有 `§03 — SELECTED WORK` 章节指示条）、章节号 00–07 目录体系、Colophon 版权页（版本日期 / 记录数 / 字体 / 方法）、以及 colophon 里那句把 accent 语义讲明的图例——"圆点标记活着的东西：你正在读的章节、仍在运行的工作、被投毒的证据、键盘焦点"。评审读不到语义逻辑的风险由此直接封堵。
3. **诚实钩子**：Plate 04 "This site" 的 meta 行是 `YOU ARE LOOKING AT IT`；Work 末尾声明 links 未列出"直到它们存在"。人味藏在读数里。

**portfolio_presentation（−0.87 → 目标转正）——Selected Work 从"目录行"升级为"图版（Plate）"版式**：

- 全宽 fold-out 版式：Work 是全站唯一一个内容栏顶到 col 12 的章节（书籍的"拉页图版"，是有隐喻理由的例外，其余章节仍保留 col 11–12 留白锚）。
- 每个条目 = `PLATE 0n` mono 编号 + 状态灯（active=橙点 / maintained=空心 / archived=灰点）+ display-2 级标题 + lede 摘要 + mono meta 行；图版间 96–128px 呼吸 + hairline。
- Plate 01 额外获得 FIG. 1 真数据图（见上）——存在感来自版式尺度与真实数据，不靠卡片、不靠截图、不编造案例细节。禁止卡片墙红线未破；全站常驻动画仍 ≤3（caret / 导航位置反馈 / 主题事件）。

### 1.2 保留的身份资产（Round 1 全场第一梯队）

Type scale 全套（clamp 双端值、tabular-nums、text-wrap: balance）、无表面原则（radius 0、零内容容器、唯一"面"仍是 wash 高亮与 hairline）、动效预算表、双语气（sans=事实 / serif italic=人的限定语，Hero 第三行 + Connect 结尾句，全站 ≤3 处）、Dark 字重补偿（display 500→470 + 字距 +0.004em）、token 级对比度纪律。

### 1.3 结构性变化

- 首屏新增 mono 记录行：`RECORDS — WORK 4 · NOTES 3 · PUBS 0 · QUESTIONS 4 · SET {BUILD_DATE}`，全部由 content 数组与构建注入实时计算——首屏即"诚实读数"。
- 章节骨架 sticky 左栏不变；新增 05 Lab 章（两个 demo）与 07 Connect（含 6 渠道 `— unlisted` 台账）。
- Timeline 内容保留在 `src/content/timeline.ts` 但本版不渲染（见 §5 拒绝项）。

## 2. 偷了谁的什么（强制清单逐条）

| 来源 | 偷什么 | 落点 |
|---|---|---|
| **C** | content schema 数据契约（status / sample / links 进类型系统） | `src/content/types.ts` 全量采用 CONTENT_PACK 契约（只加不减） |
| **C** | 诚实读数语言（真实可计算信息） | 首屏 RECORDS 行、Publications `0 RECORDS`、Lab `CORPUS n DOCUMENTS · METHOD: BM25 (K1 1.5 · B 0.75) · 0MS NETWORK`、Colophon `EDITION / RECORDS / 0 TRACKERS`；`__BUILD_DATE__` 由 vite define 注入 |
| **C** | 空状态 ghost 槽位语法 | Publications 的 `RESERVED` hairline 空槽（aria-hidden） |
| **E** | `/` 唤起的站内搜索，索引来自 content/*.ts | `src/lib/search.ts`（索引由渲染页面的同一批数组构建，永不漂移）+ `SearchDialog`；视觉完全是 Monograph 语言：hairline 面板、mono 类型标签、wash 命中高亮、accent 左缘指示当前项 |
| **E** | demo 常驻"什么不是真的"诚实声明 | Lab 章顶部常驻 `ILLUSTRATIVE TOY — LEXICAL SCORING ON A HAND-WRITTEN CORPUS. NOT A CLAIM ABOUT REAL SYSTEMS.`；defense 按钮注明 "Toy heuristic, not a real defense" |
| **G** | 主题切换的"事件感" + 三级降级 | **"重新上墨 Re-ink"**：L1 View Transitions → 自上而下的压印式 wipe（新页面像从印刷机里拉出来，`clip-path: inset` 扫描，420ms）——刻意避开被点名的 C/G/H 圆形光圈；L2 无 VT → `.theming` 窗口内分 token 级延迟渐变（surface 0ms → text 60ms → lines 180ms）；L3 reduced-motion → JS 直接跳过两条路径瞬时切换；无 JS 时内联脚本仍按 system 上色（无 FOUC） |
| **F** | 章节编号体系作为导航锚点 | 00–07 章节号即锚点，导航 / Index overlay / 搜索共用 `chapters.ts` 注册表 |

## 3. 各页面实现要点

- **Home/Frontispiece**：双语气三行 display + 橙 caret（仅 hero 可见时闪烁，IntersectionObserver 控制 `data-live`）+ lede（取 profile.about 英文段）+ 锚点 + RECORDS 行。Settle 落版动效每会话一次（sessionStorage），reduced-motion 静态呈现。
- **Research**：6 方向账簿行（编号/名称/短标/释义）+ 4 问题台账（Q1–Q4 悬挂编号，状态灯：active=橙=活着，open=空心，resting=灰）+ `1 ACTIVE · 4 IN THE LEDGER` 读数。
- **Selected Work**：四块 Plate（见 §1.1）。
- **Publications**：`0 RECORDS` + 一句承诺 + 2 行 RESERVED ghost 槽 + `LEDGER OPEN — LAST SET {date}`。
- **Lab**：L-01 Corruption Sandbox（8/9 文档、BM25 实时评分、top-5 排名条、Inject 开关、toy defense 开关、下方 `n MORE DOCUMENTS BELOW THE CUT`）；L-02 Chunk Boundaries（把干净语料拼成样段，12–40 词滑杆重切，BM25 找出 query 的最佳块并以 wash + accent 边标注，读数含 `TOP Cx`）。键盘可达：真实 button（aria-pressed）、原生 range 44px 触达、reduced-motion 下排名重排与分数条动画全部关闭。
- **Notes**：3 条账簿行（日期/kind/标题/摘要），不做假链接。
- **Connect**：6 渠道台账全部 `— unlisted` + 克制说明；结尾 serif 语气句 "The monograph continues."
- **移动端 390**：重设计而非缩放——56px 头 + 章节指示条、全屏 Index 目录页（26px 章节列表 + 当前章 "HERE" accent 标记）、Hero/Plate/账簿单栏重排、demo 控件全宽、触控目标 ≥44px。
- **SEO**：完整 meta + OG + twitter card + JSON-LD（WebSite + Person，knowsAbout 取 6 个真实方向，不编造姓名）；`robots.txt` + `sitemap.xml`（example.com）。

## 4. Corruption Sandbox 验收（CONTENT_PACK §demo）

`scripts/verify-sandbox.ts`（esbuild 打包后 node 运行）输出：

- 干净语料 7 篇全部有信号（d1 2.82 → d5 0.35）；
- Inject → **d8 排名第 1**（4.95，对第二名 2.46 约 2 倍余量）；
- Toy defense 开启 → **d8 跌出 top-3**（×0.25 后 1.24，排名第 5）；
- Chunk demo size=24 → 7 块，top=C1 有信号。

**语料与包的偏差（主动声明）**：d2/d4/d5/d6/d7 加入了与 query 相邻的自然词汇（让干净语料有真实信号），d8 改写为针对固定 query 的关键词堆叠。依据正是 demo 规格自己的验收条款——"若不成立，调语料而非改代码作弊"：逐字采用 d1–d7 时，查询在 d1/d3 之外命中为零，任何诚实词法打分都无法让 d8 登顶，任何 ×0.5 防御也无法把一个有分文档压到零分行之下。改写后的 d8 是"会写关键词的伪造文档"，恰是投毒的真实形态；打分器未做任何作弊。

## 5. 拒绝了什么（以及为什么）

- **Timeline/年表章节**：CONTENT_PACK 的 3 条中 2 条是 `20XX TODO`——渲染出来是"未完成感"而不是"生长中"；Monograph 的未完成感由 caret、`0 RECORDS`、RESERVED 槽与 EDITION 日期承担。数据留在 content 层待未来启用。
- **Notes 详情路由**：包中只有 summary，详情页只能注水或留白，账簿行更诚实。
- **`?` 键位帮助层（E）**：本站快捷键只有 `/` 与 Esc，专门一层帮助是税；键位提示以 `/` kbd 徽标常驻在 Search 按钮上。
- **⌘K/Cmd+K**：只留 `/`——Monograph 不假装自己是 IDE。
- **主题切换圆形光圈（C/G/H 撞衫款）**：被评审点名后改为压印式 wipe + 分层渐变。
- **卡片/阴影/圆角/backdrop blur（导航 12px 功能 blur 除外）**：无表面原则未破。
- **项目展开手风琴**：包内只有 summary，展开内容只能编造；Plate 的存在感由尺度与 FIG. 1 承担。

## 6. 遗留风险

1. **FIG. 1 的"低信号"解读门槛**：图注明说"后半段接近噪声是重点"，但快扫描评委可能仍把零尾读成 bug。若被误读，备用方案是给图注加一句 "this sparsity is the point"（已在文案里，风险低）。
2. **语料偏差的横向可比性**：三个方向的沙盒语料不再逐字一致（§4 原因）；功能与验收一致，视觉各异。评委若逐字对比语料会看到差异——本文件与 lab.ts 注释均已声明依据。
3. **移动端主题切换入口**：AUTO/LIGHT/DARK 在 390px 头部常驻（词标 + 主题 + Index 三件套刚好放下）；若真机字面溢出，预案是把主题按钮收进 Index overlay。
4. **无法在子代理内开浏览器**：运行时验证采用 vite dev/preview 模块图 200 + 构建产物字符串逐项 grep + 逐组件静态排查 + 检索核 node 实测替代；控制台零报错为高置信结论而非浏览器实测结论。
5. **Re-ink wipe 的帧预算**：clip-path inset 在低端移动机上是合成器友好但不保证 60fps；reduced-motion 与无 VT 路径已兜底，最坏情况视觉为瞬切。
6. **`/` 快捷键与浏览器焦点输入框冲突**：已在 handler 中排除 input/textarea/contenteditable；Firefox 焦点"快速查找"默认是 `/`——按钮入口可替代，风险可接受。
