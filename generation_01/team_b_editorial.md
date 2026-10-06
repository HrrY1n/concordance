# Team B — Editorial / Magazine：「Field & Retrieval — 一份持续出版的个人学刊」

> 方向：强排版、杂志感、研究者-写作者气质、内容优先。整个网站不是"个人主页"，而是一本**以 Volume / Issue 编号、按期出版、长期续刊的个人学术刊物**——高水准独立杂志的排印纪律 + 学术期刊的栏目结构，但彻底 web 原生（可滚动、可链接、可切换明暗、有真交互），绝不模仿 PDF。
>
> 本文档遵守 `BRIEF.md` 全部约束：§3 内容策略（零编造、sample 标记、空状态一等公民）、§5 禁止清单、§6 工程基线（Vite 7 + React 19 + TS 严格模式 + Tailwind v4 + motion + 数据驱动内容）、§7 十四章交付结构。

**种子约束落点索引**（评委快速核对）：

| 种子约束 | 落点 |
|---|---|
| Serif display 视觉签名 / Sans 正文界面 / Mono 元数据 | §3（Fraunces / Instrument Sans / IBM Plex Mono，选型理由与字重全表） |
| Volume/Issue 编号、Contents 目录、standfirst/deck、跨栏标题、hairline 规则线 | §2、§6（编号推导规则、规则线三级体系） |
| Baseline grid / 垂直节奏（具体数值） | §6.2（4px 基线，全表） |
| Research = 期刊 feature story | §9 |
| Publications 空状态 = "征稿中" | §12 |
| Playground 融入刊物隐喻 | §10（Lab Notes 实验专栏 + 3 个离线 demo） |
| 1 处编辑感"大动作" + 节制理由 | §2.1（Nameplate 跨栏刊名 hero） |

---

## 1. 设计理念

**一段话灵魂**：研究者最重要的产出之一是"把事情讲清楚"，而期刊是人类为"把事情讲清楚"发明的最高排印纪律。这位主人公研究 RAG——检索如何喂给生成——那么他的主页最诚实的形态就是一本**自己当编辑、自己当作者的学刊**：每一篇研究是一条 feature story，每一个项目是一份 dossier，每一条笔记有连续编号，每一个空栏目用"征稿中"体面地留白。视觉上，我们信任排印本身的力量：Serif display 字体签名、standfirst 导语、hairline 规则线、不对称栏式——没有任何渐变、光效、卡片墙，纸面的 flatness 就是身份。

**三条设计原则**：

1. **排印即界面（Typography is the interface）**：层级、分隔、导航反馈全部由字号阶梯、规则线粗细、留白节奏承担，不靠阴影、圆角、色块。一个元素"重要"是因为它更大、更靠前、被一条 strong rule 压顶，而不是因为它浮在阴影里。
2. **栏目化生长（Sections grow like a journal）**：所有内容由 Volume/Issue/编号系统编目，新增内容 = 新一期出版，旧内容进入 Archive。空栏目不是"没做完"，而是"该栏目征稿中"——空状态与满状态是同一套版式的两个排期。
3. **写作者的诚实（The editor's honesty）**：mock 内容全部 `sample: true`；Lab demo 标注 Methods & Limitations；刊名、姓名、邮箱全部是 config placeholder。一本学刊最大的失格是造假——这与任务书的内容红线完全同构。

---

## 2. 首页信息架构

### 2.1 首屏：Nameplate 刊名跨栏 hero（本方案的唯一"大动作"）

首页首屏 = 一本学刊的**刊头页（nameplate page）**，桌面端高约 78vh（min 640px），构成如下（12 列网格）：

| 元素 | 规格 |
|---|---|
| 顶部 folio bar（sticky，56px） | 左：小型 wordmark（Fraunces 18px）；中：栏目导航（Instrument Sans 14px）；右：`VOL. I — NO. 4`（mono 12px）+ 主题开关。下缘 1px hairline |
| 日期行 | mono 12px / tracking 0.08em 大写：左 `VOL. I · NO. 4 — OCTOBER 2026`，右 `DAY EDITION`（随主题变 NIGHT EDITION） |
| **刊名（视觉签名）** | `Field & Retrieval`（config placeholder，可整体替换为姓名缩写刊名），Fraunces 变量字体 opsz 144 / wght 540 / WONK 1，`clamp(64px, 10vw, 152px) / 0.98`，tracking −0.02em，**跨全 12 栏**；其中 `&` 用 Fraunces italic——一个字符的斜体是整版唯一的"表演" |
| 刊名下双规则线 | 经典报头 double rule：3px solid `--rule-strong` + 间距 6px + 1px hairline，全宽 |
| Standfirst（导语） | Newsreader italic 22px/32，`--ink-soft`，跨 1–8 栏，max-width 56ch："A working journal on retrieval-augmented generation, its failure modes, and the systems built around it." |
| Dateline 行 | 双线下方 mono 12px：左 `COMPUTER SCIENCE — RESEARCH × ENGINEERING`；右 `PUBLISHED WHEN THERE IS SOMETHING TO SAY`（出版诚实的自我声明，同时回答"内容少怎么办"） |

**为什么这是唯一的大动作、且节制**：它只在首页出现一次；纯排印构成——没有动效、没有图片、没有光效，全部"动作"预算花在字号（152px）与一根双规则线上；进入任何内页后版面立刻安静（内页开头一律是 §6.4 的 section opener，无巨字）。一本刊物每期只有一处刊头，其余是阅读——这个比例就是节制的定义。移动端它降级为叠放的字号缩小的刊名 + 单规则线（见 §11）。

另外：**正文级 drop cap（首字下沉）** 仅出现在 feature 长文首段，2 行高、Newsreader、`--ink` 色、随文字流内嵌——这是文本尺度上的阅读装置（类似段首缩进），不属于展示性"大动作"，且每页最多一处。

### 2.2 Section 顺序与理由

首页即"本期目录 + 精选"，顺序：

1. **Cover Story**（跨栏特稿，占首屏下方至第二屏）：本期精选的一条研究方向（如 RAG Robustness），跨 1–9 栏的 Fraunces 大标题 + standfirst + mono 元信息行（`RESEARCH — PART II — 6 MIN READ — UPDATED OCT 2026`）。理由：研究者主页的第一记忆点应是"他在想什么"，不是"他会什么"。
2. **Contents（目录）**：本刊全部栏目的目录块，7 行（见下表）。理由：目录是刊物隐喻的骨架，也天然是导航冗余——招聘者 30 秒路径、研究者深读路径都能从目录出发。**Publications 以一行"call for papers"出现在目录中**（斜体标注），空栏目获得体面存在感。
3. **In This Issue**（不对称三栏编排，非卡片墙）：左 5 栏 = Latest from the Lab（2 条 Lab Notes 摘要行）；右 4 栏 = Recent Notes（3 条标题 + 日期列表）；底部横带 = Selected Work 预览（3 行 index，见 §8）。各块之间 hairline 分隔，无任何卡片容器。
4. **Colophon（版权页 footer）**：双规则线下，mono 12px 三行：`SET IN FRAUNCES, NEWSREADER, INSTRUMENT SANS & IBM PLEX MONO`；`PUBLISHED FROM [CITY] — EST. 2026`（placeholder）；`© 2026 [NAME] — CONTENT CC BY 4.0, CODE MIT`（placeholder）。学刊 colophon 顺带完成了字体署名与版权声明，是杂志感的收束句。

**Contents 表**（同时是全站路由表）：

| № | 栏目 | 路由 | 状态标注（目录右端，mono） |
|---|---|---|---|
| 01 | Research | `/research` | `PART I–IV` |
| 02 | Selected Work | `/work` | `6 DOSSIERS` |
| 03 | Lab Notes | `/lab` | `3 PROTOTYPES` |
| 04 | Writing | `/notes` | `3 NOTES` |
| 05 | Open Source | `/open-source` | `REPOS` |
| 06 | Publications | `/publications` | `— CALL FOR PAPERS`（斜体） |
| 07 | Chronicle | `/archive` | `VOL. I —` |
| 08 | Correspondence | `/contact` | `LETTERS` |
| — | Editor's Letter | `/about` | `ABOUT`（不入编号，作为刊物前页） |

---

## 3. Typography

### 3.1 三层字体签名与选型理由

| 层 | 字体 | 变量轴 / 字重 | 理由 |
|---|---|---|---|
| **Display Serif（视觉签名）** | **Fraunces**（Google Fonts，可变：opsz 9–144, wght 100–900, SOFT, WONK, 含真斜体） | 刊名 wght 540 / opsz 144 / WONK 1；标题 wght 500 / opsz auto；强调词用 italic | 对 Windsor/Goudy 一脉美式杂志刊头的当代重绘：opsz 144 时对比锋利、"a/g" 带轻微 WONK 歪斜，有独立杂志的脾气而非 Playfair 式模板味；一个变量文件同时服务刊头（opsz 144）与安静标题（opsz 72），工程上省一个字重族 |
| **Text Serif（长文正文）** | **Newsreader**（可变：opsz 6–72, wght 200–800 + 斜体） | 正文 400；导语/引文 italic 420；lede 400 opsz auto | 为"屏幕上的长篇新闻阅读"而设计（Production Type 出品），小字号灰度均匀、斜体极具表现力——standfirst、pull quote 全靠它 |
| **Sans（界面/说明文）** | **Instrument Sans**（可变：wght 400–700, wdth 75–100） | 400/500/600；wdth 92 用于窄版标签 | 有编辑设计血统的当代 grotesk；宽度轴可做 condensed 小标签；比 Inter 的"默认感"更有态度又不抢戏 |
| **Mono（元数据）** | **IBM Plex Mono** | 400 / 500（500 用于 kicker） | 工程血统 + 真斜体 + 小字号下极稳的表格数字；承担日期、编号、kicker、图注标签、代码——刊物的"机读层" |

### 3.2 完整字号阶梯（桌面 / 移动，行高全部为 4px 倍数以贴合基线网格）

| Token | 字体 | 字号/行高（桌面） | 移动端 | 字距 | 字重/轴 | 用途 |
|---|---|---|---|---|---|---|
| `display-masthead` | Fraunces | clamp(64→152px)/0.98 | clamp(44→72px)/1.0 | −0.02em | 540, opsz 144, WONK 1 | 刊名 |
| `display-hero` | Fraunces | clamp(40→88px)/1.04 | clamp(32→44px)/1.08 | −0.015em | 500 | Cover story / 栏目 hero |
| `title-xl` | Fraunces | clamp(34→60px)/1.08 | 30/36 | −0.012em | 500 | 页面 H1 |
| `title-l` | Fraunces | clamp(30→48px)/1.12 | 26/32 | −0.01em | 500 | 文章标题 |
| `title-m`（crosshead） | Fraunces | 26/32 | 22/28 | −0.008em | 520 | 文内 H2 小节题 |
| `title-s` | Fraunces | 20/24 | 19/24 | 0 | 560 | H3 |
| `deck`（standfirst） | Newsreader italic | 22/32 | 19/28 | 0 | 420 | 每篇 feature/项目的导语 |
| `lede` | Newsreader | 20/32 | 18/28 | 0 | 400 | 首段 |
| `body-serif` | Newsreader | **18/28** | **17/28** | 0（CJK +0.01em） | 400 | feature 正文 |
| `body-sans` | Instrument Sans | 15/24 | 15/24 | 0 | 400 | UI 说明文、项目 meta 描述 |
| `list-title` | Newsreader | 19/24 | 18/24 | 0 | 500 | index 行标题（hover 切斜体） |
| `caption` | Instrument Sans | 13/20 | 13/20 | 0.005em | 400 | 图注正文 |
| `fig-label` | IBM Plex Mono | 11/16 | 11/16 | +0.08em, 大写 | 500 | `FIG. 01` / kicker |
| `meta` | IBM Plex Mono | 12/16 | 12/16 | +0.04em | 400 | folio、日期、编号、状态戳 |
| `kicker` | IBM Plex Mono | 11/16 | 11/16 | +0.12em, 大写 | 500 | 栏眉（`RESEARCH · PART II`） |
| `quote` | Newsreader italic | 34/44 | 26/36 | 0 | 400 | 文内 pull quote |
| `code` | IBM Plex Mono | 14/24 | 13/20 | 0 | 400 | 行内与代码块 |

**行宽控制**：body-serif 测量宽度 66ch（≈640–680px，落在桌面 3–9 栏）；deck ≤ 56ch；caption ≤ 45ch；目录行全宽。**中英文兼容**：Latin 字体置于 font-stack 首位，中文回退 serif 栈 `Fraunces/Newsreader → "Noto Serif SC"（按需子集 webfont）→ Songti SC → SimSun`；sans 栈 `→ "Noto Sans SC" → PingFang SC → Microsoft YaHei`；中文正文一律 ≥17px 且行高 28（CJK 需更大 x-height 缓冲）；CJK 段落 letter-spacing +0.01em；**CJK 段落禁用 drop cap**（下沉首字仅限 Latin 段落）；中英混排的 mono 标签全大写仅施于 Latin（`text-transform` 天然安全）。

---

## 4. 颜色体系

纸面逻辑：Light 是**日间印刷版（Day Edition）**——暖白纸、墨黑、一支朱砂红（编辑批注色）；Dark 不是黑白反转，而是**深夜校样（Night Edition）**——暖调墨色纸面、奶油色文字、提亮的同一支朱砂。全部 flat，无渐变无阴影。

| Token | Light (Day) | Dark (Night) | 用途 |
|---|---|---|---|
| `--paper` | `#FAF7F1` | `#161310` | 页面背景（暖纸 / 暖墨） |
| `--paper-deep` | `#F3EEE4` | `#1D1915` | aside、代码块、demo 画布内衬 |
| `--surface` | `#FFFFFF` | `#211C17` | 唯一"抬起"层：demo iframe 外框 |
| `--ink` | `#1C1917` | `#ECE4D3` | 主文字 / strong rule |
| `--ink-soft` | `#4A443C` | `#C4BAA6` | 次级文字、deck |
| `--ink-mute` | `#7A7264` | `#948A76` | 图注、mono 元数据（对比度 ≥4.5:1） |
| `--ink-faint` | `#A79D8C` | `#6B6252` | folio、禁用、leader dots |
| `--rule` | `#E2DACB` | `#332D24` | hairline 1px 规则线 |
| `--rule-strong` | `#1C1917` | `#ECE4D3` | 2–3px 版式规则线 |
| `--accent` | `#A8341C` | `#E06A4B` | 朱砂：kicker、链接、当前项、focus |
| `--accent-deep` | `#7E2814` | `#EE8663` | accent 的 hover 态 |
| `--accent-wash` | `#F5E7E0` | `#2A1D16` | 行 hover 底色、选中标注 |
| `--code-bg` | `#F3EEE4` | `#1D1915` | 代码块 |
| `--code-text` | `#33302A` | `#D8CFBD` | 代码默认色 |
| `--code-keyword` | `#A8341C` | `#E06A4B` | 语法高亮（与 accent 同源） |
| `--code-string` | `#4F6152` | `#9CAF88` | 字符串（灰苔绿，全站唯一副色） |
| `--code-comment` | `#A79D8C` | `#6B6252` | 注释 |
| `--selection` | `#F2DCD2` | `#4A2A1E` | 文本选区 |

用法纪律：`--accent` 在一个视口内出现 ≤4 处（当前导航项、kicker、链接下划线之一、focus ring）；红色是批注墨水，不是装饰漆。图片在 Night Edition 下统一 `filter: brightness(0.92) contrast(1.02)` 以沉入纸面。

---

## 5. Light / Dark Mode 策略

- **Day Edition**：印刷车间白昼——暖白纸、墨字、朱砂批注。情绪：清醒、严肃、可信；用于默认与 System-Light。
- **Night Edition**：深夜编辑部校样——同样暖色系但整体压暗两档，文字是奶油色而非纯白（纯白在 #161310 上过曝刺眼），accent 提亮为 `#E06A4B` 保对比。两套 token 表（§4）各自完整设计，Dark 单独校对过所有对比度与 hairline 可见性（`#332D24` 在 #161310 上恰好"可见但不吵"）。
- **切换体验**：folio bar 右侧 mono 开关 `DAY / NIGHT`（亦支持 `prefers-color-scheme` 三态、localStorage 持久化）。切换 = 全站颜色 240ms ease crossfade（CSS transition on color tokens，无位移无缩放）；切换后 folio 处打出一枚 mono 状态戳 `NIGHT EDITION` 1.6s 后淡出——把主题切换叙事成"换版次"，是刊物隐喻的最小闭环。
- 工程实现：`<html data-theme>` + Tailwind v4 `@theme` CSS 变量；切换零布局位移（颜色即全部差异）；`color-scheme` 同步以保证原生控件与滚动条。

---

## 6. 布局系统

### 6.1 栏式网格

| 断点 | 列数 | 容器 max | 页边距 | gutter | 栏宽 |
|---|---|---|---|---|---|
| ≥1280 | 12 | 1320px | 64px | 24px | ≈77px |
| 1024–1279 | 12 | fluid | 48px | 20px | — |
| 768–1023（平板） | 8 | fluid | 40px | 20px | — |
| <768（手机） | 4 | fluid | 20px | 16px | — |

**不对称栏式语法**（桌面）：feature 正文占 3–9 栏（左空 2 栏作呼吸位）；marginalia 批注栏占 10–12 栏（图注、引文出处、"See also"）；跨栏标题一律起于第 1 栏、横跨 8–9 栏；目录与 index 列表占 1–12 全宽。这个"正文偏左 + 批注靠右"的不对称是版面的静态张力来源。

### 6.2 Baseline grid（垂直节奏）

- **基线单位 4px**；所有 line-height、段间距、区块 padding 为 4 的倍数（正文 18/28 压在 4px 基线上，CJK 17/28 同）。
- 间距阶梯：`4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128 / 160 / 192`。
- 段落间距 = 28（恰好一行）；标题上间距 = 2 行 + 1 行（如 96/48）；kicker 与标题间 8px；标题与正文间 24px。
- 图片与 code block 允许局部破格（高度非 4 倍数），但破格后**下一个文本块必须重新落回基线**——实现上在破格元素后插入 `margin-bottom` 补差（内容数据带 `baselineComp` 字段或运行时按 4 取整计算）。这是诚实处理"严格基线 vs 动态媒体"的工程注脚。

### 6.3 Hairline 规则线体系（版式核心元素）

三级规则线，语义分明：

1. **hairline（1px `--rule`）**：index 行分隔、marginalia 上缘、TOC 行分隔、folio bar 下缘。
2. **strong rule（2px `--rule-strong`）**：section opener 顶线、pull quote 上缘、Cover story 标题下缘。
3. **double rule（3px + 6px 空隙 + 1px）**：仅两处——刊名下方与 colophon 上方。double rule 是"刊物的边框"，全站最多出现两次，稀缺即权威。

### 6.4 Section 过渡与 opener

每个栏目/文章群的开头是一致的 **section opener**：2px strong rule 全宽 → 96px 节奏 → kicker（mono 11）→ Fraunces 栏题（title-xl）→ 可选 deck（Newsreader italic）→ 96px。同栏目内多篇目之间：1px hairline + 64px。从 hero 到正文的过渡因此永远是"一条压顶规则线 + 小字 kicker"，读者永远知道自己在哪一栏目的哪一层。

---

## 7. 主要交互与动效

原则：**Subtle, intentional, smooth**——全部 ≤400ms、transform/opacity/color only、一次性进入、`prefers-reduced-motion` 时全部退化为 opacity 120ms 或直接静态。

1. **导航（folio bar）**：链接 hover = 1px 下划线从左向右绘出（240ms）；当前栏目 = mono 编号（`03`）变 accent + 实线下划线，scroll-spy 驱动。
2. **Signature interaction — WONK hover**：首页 Cover Story 大标题 hover 时，Fraunces 的 `WONK` 轴 0→1 用 280ms 补间（字形轻微歪斜起来，像被编辑圈点过），离开回落。理由：这是"字体本身在动"的标志性瞬间——不添任何元素、不位移布局、只有一个变量轴，成本几乎为零；只在首页标题这一处启用，其余页面 WONK 恒 0。reduced-motion：静态 WONK 0。
3. **主题切换 = 换版次**：见 §5（240ms crossfade + `NIGHT EDITION` mono 状态戳）。
4. **Index 行 hover**（Work / Notes / Lab / Archive 通用）：整行是 `<a>`；hover 时背景 `--accent-wash` 淡入、mono 编号变 accent、标题在 180ms 内由 Newsreader 500 交叉淡化为斜体、行尾 `→` 平移 4px。触屏无 hover，行本身可点即可。
5. **正文链接**：1px 下划线 offset 3px，`--ink` 色；hover 下划线转 accent 并有 wash 从左至右扫入（200ms，background-size 过渡）。
6. **进入动效**：motion（Framer Motion）`whileInView`：opacity 0→1 + translateY 8px→0，480ms `cubic-bezier(0.22,1,0.36,1)`，同组 stagger 60ms，`once: true`；每次进入幅度恒定，绝不做弹跳/视差。
7. **阅读进度线**：文章页顶部固定 2px accent 线随滚动 `scaleX`——把"进度条"做成了规则线，是全站唯一的位置反馈动效。
8. **图片 figure**：`Fig. 01 — caption` 格式；hover 图 1.01 缩放 + 图注下划线出现；无灯箱大动画（放大查看用 `<dialog>` 简单呈现）。

---

## 8. Projects 展示方式（Selected Work = Dossier 档案）

**禁止三列卡片墙**，采用 **Index + Dossier 两级结构**：

- **Index 页（/work）**：全宽行式目录（杂志 "In this issue" 的索引形态）。每行：左 mono 编号 `DOSSIER 01`（5 栏内）→ Newsreader 19px 标题 + 一行 sans 摘要（跨 6–10 栏）→ 右缘 mono 元信息 `2026 · RAG / SECURITY`。行间 hairline，hover 见 §7.4。首行（最新 dossier）可升格为"半特稿"：标题跨 1–8 栏 + standfirst，制造目录内部的节奏。
- **Dossier 详情页**：文章版式而非产品页——kicker（`SELECTED WORK — DOSSIER 02`）→ Fraunces 标题 → **standfirst deck**（叙述这个项目回答什么问题，不罗列功能）→ margina 元数据栏（10–12 栏竖排：`YEAR 2026 / ROLE SOLO / STACK TS·PY / CODE GITHUB→ / DEMO→`，链接占位符全部走 config）→ 正文分节（crosshead + 段落），过程叙事（"问题—做法—踩坑—结果"），图片一律 `Fig. 01` 图注制。**不写"赋能""打磨"式营销语**，写工程过程。
- Sample 数据 6 条（`sample: true`），命名与描述只声称能力与过程：如 *"poisonbench — a tiny harness for measuring corpus-poisoning success rates"*；`GITHUB →`/`DEMO →` 为 config 占位，未配置时该 meta 行整行隐藏。

---

## 9. Research 展示方式（期刊 Feature Story，非产品营销页）

/research 把研究兴趣组织为四条 **Part I–IV** 特稿，每条 = 完整编辑结构：

- **Part I — RAG, properly**（检索与生成的交互）；**Part II — When the corpus lies**（RAG Robustness + Knowledge Poisoning 与防御，作为默认 Cover Story）；**Part III — AI Security**；**Part IV — LLM Systems**。
- 每条特稿的构件：kicker（`RESEARCH · PART II`）→ 跨栏 Fraunces 标题（如 *"What happens to a RAG system when the corpus is the adversary?"*——用研究问题做标题，不用名词短语）→ **deck 导语**（120 字内 standfirst，说清这条线为什么重要）→ 正文三段式叙事：**动机（为什么这是真问题）→ 当前理解（我的工作假设，标 `"working notes"`）→ 下一步（开放问题）**。
- **Open Questions 板块**：每条特稿末尾以 `Q1 / Q2 / Q3` mono 编号列出 2–3 个真诚的开放问题——期刊的"征解"栏目气质，同时是未来内容的自然入口（内容生长性）。
- **Experiments & Evidence**：支撑实验以 `FIG.` 图注制呈现方法小图与结果（无结果时只放方法图与文字，绝不放假图表数据）；状态标注 mono `EXPLORATORY / ONGOING`。
- 版式：正文 3–9 栏，右 10–12 栏 marginalia 放术语旁注与 "See also → Writing"（把阅读笔记变成特稿的引用文献，站内互链形成"引文网络"）。文内至多一条 pull quote（§3 `quote` token），置于 2px rule 之间。

---

## 10. Playground / Lab：**Lab Notes 实验专栏**

刊物隐喻落点：Playground = 学刊的**实验专栏（Lab Notes）**——像期刊的 "Methods" 与独立杂志的 "How-To" 混合体，每条是带编号、带状态戳的实验记录，不是 blog 列表。

**入口形态**（/lab）：section opener（`LAB NOTES — WORKING PROTOTYPES`）→ 索引行列表，每行 = mono `LAB NOTE № 001` + 标题 + 一句 deck + 右缘**状态戳**（mono 小字 + 1px 方框描边，像编辑部橡皮章：`WORKING / PROTOTYPE / EXPERIMENT / ARCHIVED`）。demo 详情页 = 文章版式 + 内嵌交互画布（`--paper-deep` 衬底、1px 规则线框、无阴影）。

**三个可离线运行 demo**（全部纯前端、零 API、数据打包在 `content/lab/*.ts` 且 `sample: true`）：

1. **Lab Note № 001 — "Poison the Corpus"**（旗舰，直通研究方向）：内置 30 篇虚构语料（某城市交通手册），预计算向量 + JS 暴力余弦检索；6 个固定问题可选；用户点击任意文档的 `POISON` 按钮注入一篇精心构造的投毒文本，调 top-k，观察右侧检索排名条（相似度横条，规则线风格）与"答案"如何被带偏——可视化的知识投毒。诚实标注：`RETRIEVAL-ONLY ANSWERING — NO LLM IN THE LOOP`。状态 `WORKING`。
2. **Lab Note № 002 — "The Chunking Desk"**：粘贴或选内置文本，切换 fixed-window / recursive / sentence+overlap 三种分块策略；正文上以 accent/`--ink-mute` 下划标出 chunk 边界，右侧 mono 表列出每块近似 token 数（chars/4 估算）与块长分布的 hairline 直方图。状态 `WORKING`。
3. **Lab Note № 003 — "Hit@k Ledger"**：10 条 QA 对同一玩具语料，调 top-k（1/3/5）与检索模式（纯向量 / 混合加权模拟 rerank），hit@k 与 MRR 以点线 + 短横条记账式呈现。状态 `EXPERIMENT`。

每个 demo 固定以两段收尾：**What this shows / What it doesn't**——研究者的 Methods & Limitations 自觉，也是全站诚实气质的最强表达。

---

## 11. 移动端方案（重新设计，非缩放）

- **导航**：folio bar 精简为 wordmark + `VOL. I` + "Contents" 按钮；点击打开**全屏目录页**（`--paper` 底、无遮罩模糊）：栏目以 Fraunces 28/36 + mono 编号纵向列表、行间 hairline，底部主题开关与 colophon 一行。这是把"杂志目录"直接变成移动导航——不抽屉、不汉堡菜单装饰。Esc/选中即关，焦点圈闭。
- **首屏**：刊名降为 clamp(44→72px) 两行叠放，双规则线降为单 2px；standfirst 全宽；Cover story 标题 32–44px。移动首屏依然完整表达"这是一本刊物"。
- **栏式**：4 列网格；正文全宽（20px 边距）；**marginalia 改写为行内 aside**：被批注段落后插入上下各 1px hairline 的旁注块（mono 12/16）——桌面"页边注"在移动端的标准印刷式降级。
- **内容优先级**：Cover Story → Contents（缩短为 5 行核心栏目）→ In This Issue 纵排（Lab、Notes、Work 依次堆叠，仍以规则线分隔，无卡片）；Work index 行保持行式（移动端天然好用）；demo 画布在移动端提供"只读回放"模式（预置一次投毒的动画序列按钮化），避免小屏操作过载。
- **移动特有体验**：文章末"翻页"区 = 上一篇/下一篇两行大字 index（命名 `← PREVIOUS NOTE` / `NEXT NOTE →`）；长文页底部 sticky mini-folio（当前 crosshead 名 + 进度线）；正文 17/28，drop cap 保留（CSS `::first-letter` 实现，零 JS）。

---

## 12. 空状态策略（一等公民）

1. **Publications = "征稿中"**：section opener（kicker `PEER-REVIEWED WORK`）下是一个**规则线框声明块**（上 2px strong rule + 下 1px hairline，无底色无圆角，max 56ch）：Newsreader italic 22/32 主句 *"Nothing in print yet — this page is reserved for peer-reviewed work."*；下一行 mono 12px：`STATUS: CALL FOR PAPERS — SELECTED RESEARCH WILL APPEAR HERE.`；结尾两条站内引导链接（"The research is already happening → Research"、"Working notes appear first → Writing"）。绝不放假论文、绝不放"敬请期待"的 spin 图。config 开关 `showEmptyState` 可整体隐藏该页并从目录移除。
2. **目录内联空态**：Publications 的 TOC 行右端标 `— CALL FOR PAPERS`（斜体），空栏目在目录里获得"栏目存在感"而非消失。
3. **Awards 等未提供模块**：默认**不渲染**（`content` 缺失即不进目录），不出现空壳。
4. **占位统一语法**：所有未知事实（姓名、学校、邮箱、GitHub ID、城市）在 `content/profile.ts` 中为 `"[PLACEHOLDER]"`，渲染为 mono `--ink-faint` 样式 `[NAME]`——一眼可辨"待替换"，替换一个文件全站生效；mock 内容一律携带 `sample: true`，开发模式下角标显示 `SAMPLE`。
5. **未来的空**：Archive 允许某月无条目——显示一行 hairline + mono `NO ENTRIES THIS ISSUE`。空行也是表格里体面的一行。

---

## 13. 与其他 7 个方案的差异（"我不是什么"）

1. **我不是 Swiss 坐标档案馆（Team F）**：F 的主角是网格与编号本身（sans 主导、坐标标注式 hairline）；我的主角是**排印与叙事文本**——编号系统为内容编目（Vol/№），rule lines 为阅读节奏服务，视觉签名是 serif 刊头而非坐标纸。
2. **我不是实验交互装置（Team H）**：H 把主页做成"可见的检索系统"，交互即概念；我的概念在**编辑结构与字体**里，页面安静得像在阅读，实验性全部收进 Lab Notes 专栏。
3. **我不是暗色科技风 / 赛博终端**：无满屏暗底荧光、无终端拟态；我的 Night Edition 是"深夜校样"，仍是排印逻辑（暖墨纸 + 奶油字），不是 RGB 氛围。
4. **我不是 Bento / 卡片栅格**：全站零卡片容器，一切信息以 index 行与文章版式呈现。
5. **我不是渐变 / 玻璃拟态 / 3D**：零渐变、零模糊、零阴影堆叠，纸面 flatness 是身份宣言。
6. **我不是 Brutalism 粗野堆叠**：大胆只出现在一处刊头；其余处基线、栏式、留白纪律严于大多数"精致"方案。
7. **我不是插画 / 人格化 / 表情驱动**：图像仅以 `FIG.` 图注制出现，气质是研究者-写作者，不是社区吉祥物。

---

## 14. 风险与自我批评

1. **最大风险——"旧"的误读**：Serif 重排印 + hairline 会被一部分评委第一眼读成"复古/PDF 模仿"。对策：变量字体的 WONK hover、mono 状态戳、web 原生目录导航等细节持续提示"这是 2026 年的 web"；刊名与 dateline 的文案保持当代口吻。若首轮被诟病"老气"，第一刀砍 masthead 字号（152→112px），而不是砍体系。
2. **排印强度依赖文案质量**：杂志版式会放大文字的坏——mock note 若写得平庸，整个方向塌掉。对策：sample 文案按"能直接发表"标准写，`sample: true` 提示替换后保持同等写作水准（文档中明示）。
3. **字体载荷**：Fraunces（全轴）+ Newsreader + Instrument Sans + Plex Mono ≈ 需控制在 260KB woff2 以内。对策：全部 latin 子集自托管、`font-display: swap`、按 unicode-range 分片、masthead 字符串用动态 `text=` 子集预载；CJK 走系统栈优先，`Noto Serif SC` 仅对标记 `zh` 的笔记按需子集加载。Windows 上 SimSun 小字发虚——CJK serif 一律 ≥17px 且优先命中 Noto。
4. **严格基线 vs 动态媒体**：图片、代码块会破基线。对策（§6.2）：允许局部破格 + 强制下一文本块回贴基线的补差机制；若实现成本过高，允许降级为"仅保证行高与间距为 4 的倍数"。
5. **WONK hover 的廉价感风险**：字形歪斜 hover 若被滥用即成杂技。对策：全站仅首页 Cover 标题一处启用；评委若认为多余，一处开关即可移除，不影响体系。
6. **隐喻疲劳**：Volume/Issue/编号若处处强刷会变成-theme 公园。对策：隐喻只落在四处结构性位置（刊头、日期行、目录、编号行），正文与交互完全"正常网页"；编号全部由真实日期/顺序推导，永不编造。
7. **内容少时的自我怀疑**：目录标注 `3 NOTES · 6 DOSSIERS` 会诚实暴露内容量。这是特性而非缺陷（dateline 已声明 "published when there is something to say"），但需接受"空旷期视觉上确实空旷"——用留白与规则线让空旷本身显得从容。

---

*Set in Fraunces, Newsreader, Instrument Sans & IBM Plex Mono. Drafted by Team B — Editorial/Magazine, October 2026.*
