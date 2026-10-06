# Team D — Academic Researcher：「抽印本 / Offprint — 一份持续修订的研究读本」

> **方向**：以研究展示为绝对核心、以"阅读尊严"为第一约束的个人主页。它不是简历页，不是作品橱窗，而是一份**像论文抽印本一样被排版、像专著一样被修订的研究读本**：首屏是一个论文式的标题区（title block），首屏之后立刻是研究问题台账（Question Ledger），页面两侧是 Tufte 式页边注（sidenotes），Light 模式是暖白纸面，Dark 模式是台灯下的深色阅读室。
>
> 本文档遵守 `BRIEF.md` 全部约束（§3 内容策略 / §5 禁止清单 / §6 工程基线 / §7 十四章交付结构）。所有 mock 内容均标 `sample: true`，替换入口统一在 `content/*.ts`。

**种子约束落点索引**（评委快速核对用）：

| 种子约束 | 落点 |
|---|---|
| Research 为第一公民的首页信息架构 | §2（首屏后第一个 section 即 §01 Research） |
| 阅读优先版式：行宽 ch 上限、宽松行高、边注 + 移动端折叠 | §3.3（60ch 等行宽体系）+ §6.2（边注系统与三段降级） |
| Research Questions 一等公民版式（编号/追问/状态） | §9.1 Question Ledger（signature element） |
| Publications 空状态的学术礼仪 | §12.2（"Manuscripts in preparation." + ghost specimen 行） |
| 纯 CSS/SVG 研究地图（RAG/Robustness/Poisoning/Security/Systems/Interaction） | §9.2（节点坐标、连线语义、悬停行为） |
| 纸张感 Light / 深色阅读室 Dark 双 token 表 | §4（全部 hex） |

---

## 1. 设计理念

**一段话灵魂**：一位研究 RAG 的人，每天的日常是"把问题问清楚、把证据摆干净、把话说得可被引用"。那么他的主页最诚实的形态，不是一面自我介绍的墙，而是一份**抽印本（offprint）**——学者把刚印好的论文抽印本寄给同行，扉页干净、边注密布、问题比结论多。这份主页就是一份持续修订的抽印本：首屏是标题区而不是横幅，正文行宽被严格锁死在 60ch，思考过程以页边注的形式活在正文右侧，研究问题被编号、被追问、被诚实地标注"OPEN / IN PROGRESS / RESTING"。装饰被压缩到一种颜色（朱砂红 cinnabar，学术批注的颜色）与一种线（hairline），其余全部交给排印、留白与结构。它不表演谦虚，也不表演成果——它呈现的是**一个正在思考的人的工作现场**。

**三条设计原则**：

1. **问题是入口，不是成果（Questions before credentials）**。访客第一眼看到的不是这个人"有什么"，而是这个人"在问什么"。研究问题是一等公民：有编号、有追问、有状态、有最后修订日期；论文、项目、笔记全部是问题的延伸与证据。这个原则同时解决了内容红线——一个以问题为中心的页面，天然不需要编造任何 credential。
2. **版式为阅读服务，不为展示服务（Reading is the interface）**。所有布局决策回答一个问题："它是否让正文更值得被读完？"行宽 60ch 封顶、行高 1.75、边注分流次要信息、图表可以越栏但文字永远不越栏。滚动没有剧场，进入没有飞入——动效只做标点符号（句号、破折号、着重号），不做烟火。
3. **诚实是排印纪律（Honesty is typographic discipline）**。学术论文最不能造假的地方是引用与状态。本站沿用这套纪律：Publications 空着就写 "Manuscripts in preparation."，状态标签显示真实工作状态，mock 数据带 `sample: true` 并在视觉上可被识别（faint ink）。页面宁可"克制的空"，不可"注水的满"。

---

## 2. 首页信息架构

### 2.1 首屏：论文标题区（Title Block），100vh 内完成

首屏**复用学术论文的标题区结构**，但不模仿 PDF——它是 web 原生的、可滚动的、有边注的。桌面端使用 §6 的五列阅读网格，具体排布：

| 元素 | 位置 | 规格 |
|---|---|---|
| Kicker | 正文栏顶部 | mono micro（11px，0.08em，uppercase）：`CS — GRADUATE RESEARCHER · [AFFILIATION]`，_affiliation_ 为 config placeholder |
| 标题句 | 正文栏，`--measure-heading: 28ch` | serif 500，display 级（44–68px），mock：**"Trustworthy retrieval-augmented systems."**（中文版："研究检索与生成相遇处的可靠性。"）——这是立场句，不是自我介绍 |
| 摘要段 | 正文栏，60ch | lede 19px/1.7，2–3 句 mock："I work on what breaks when a language model starts quoting a corpus — robustness under noisy context, knowledge poisoning, and the systems that carry them." |
| 入口链接 | 摘要下方 | 两行内联引用式链接（mono 编号 + serif 文字）：`↓ §01 Current questions`、`→ §02 Selected work`，点击平滑滚动（reduced-motion 时直接跳转） |
| 作者栏 | **右边注栏** | 替代传统 photo+contact：mono 编排的字段列表——`FIELDS: RAG · Robustness · Poisoning · Security · LLM Systems`、`NOW: Exploring poisoning defenses in vector stores`（sample）、`CONTACT: [placeholder →]`。头像默认不放（identity 不靠脸，靠问题）；若未来想加，给一个 56px 小尺寸 grayscale 圆角 2px 的规格 |

首屏记忆点：**没有横幅、没有大头像、没有打字机动效，只有一行被当作论文标题来排的立场句**——对一个研究者而言，"把主页排成论文标题区"本身就是最准确的第一印象。

### 2.2 Section 顺序与理由

| 序号 | Section | 内容 | 排在这个位置的理由 |
|---|---|---|---|
| §01 | **Research** | Question Ledger（研究问题台账）+ Research Map（研究地图）+ Current directions（3 段短文） | 种子约束：首屏之后立即是研究。先看问题（正在想什么），再看地图（问题之间的关系），最后读方向（成段的论述）——由点及面 |
| §02 | **Selected Work** | 4 条 Case Records（编号卷宗） | 问题之后的证据：这些项目是问题的工作痕迹，不是独立的作品橱窗 |
| §03 | **Publications** | 优雅空状态 | 紧跟 Work，诚实交代"正式产出还在路上"，用学术礼仪处理 |
| §04 | **Notes / Writing** | 3 条研究笔记（Reading / Engineering / Idea） | 从正式产出回到非正式思考：笔记是问题的草稿纸 |
| §05 | **Lab / Playground** | 3 个可离线运行的 demo（Appendix 框架） | 笔记之后的"可运行部分"——把抽象问题变成可以上手玩的东西 |
| §06 | **Open Source** | 2–3 条 tooling 条目 | 收拢为"研究的工具层"：支撑实验的基础设施，不与 Work 抢戏 |
| §07 | **About** | 极简 3–4 段 | 履历性信息最后出现——对研究者主页，"你是谁"没有"你在想什么"重要 |
| §08 | **Contact / Colophon** | 联系方式 + 版权页 | 以书籍 colophon（版权页）收尾：字体、构建、修订日期、联系渠道 |

阅读动线的设计逻辑：**思考（§01）→ 证据（§02/§03）→ 过程（§04/§05/§06）→ 人（§07/§08）**。招聘者可在前两个 section 完成判断，同行会在 §01 停留最久。

---

## 3. Typography

### 3.1 字体选型与理由

| 角色 | 字体 | 字重使用 | 理由 |
|---|---|---|---|
| 正文 + 标题（拉丁） | **Newsreader**（variable，opsz 6–72，含真 italic） | 正文 400；标题 500；强调/引文 italic 400 | Google Fonts 中少有的**为屏幕阅读设计**的衬线体：opsz 轴在小字号时自动放开字距与笔画（可读），在大标题时收紧变锋利（有神态）；它的气质是"报刊正文"而非"海报展示"，与阅读优先定位一致，且与竞品常用 Fraunces（展示性）、Playfair（装饰性）明确区隔 |
| 正文（中文） | **Noto Serif SC** | 400 / 500 | 与 Newsreader 的灰度与 x 高度最接近的开源宋体；走 Google Fonts 的 unicode-range 切片（浏览器按需下载），`font-display: swap`，回退栈 `"Songti SC", "STSong", "SimSun"` |
| 界面微标签 / 元数据 / 代码 | **IBM Plex Mono** | 400 / 500 | 编号、kicker、状态标签、日期、代码统一用一台"打字机"承担——机器痕迹与衬线正文形成学术排印的经典对位；比 JetBrains Mono 更冷、更"印刷"，无开发者模板味 |
| 中文微标签 | **Noto Sans SC** | 400 / 500 | 11–13px 的中文若用宋体发虚，界面标签层用黑体保证小字可读 |

字体栈（Tailwind v4 `@theme`）：

```css
--font-serif: "Newsreader", "Noto Serif SC", "Songti SC", Georgia, serif;
--font-mono: "IBM Plex Mono", "Noto Sans SC", ui-monospace, monospace;
```

全站只用这两个家族。没有第三个 sans 主字体——mono 兼任 UI 层，是"印刷品里机器标注"的隐喻。加载策略：Newsreader 与 IBM Plex Mono 自托管 latin 子集（各约 30–45KB woff2，`<link rel=preload>`）；Noto Serif SC 用 CDN unicode-range 切片，首屏只需 2–3 个切片。

### 3.2 完整字号阶梯（桌面基准 17px，移动基准 16px）

| token | 字号 | 行高 | 字距 | 字重/家族 | 用途 |
|---|---|---|---|---|---|
| `--text-display` | clamp(2.75rem, 4.2vw + 1.1rem, 4.25rem) | 1.08 | -0.02em | 500 serif | 首屏标题 |
| `--text-h1` | 2.5rem / 40px | 1.15 | -0.015em | 500 serif | 内页标题（note/project 详情） |
| `--text-h2` | 1.75rem / 28px | 1.25 | -0.01em | 500 serif | section 标题 |
| `--text-h3` | 1.3125rem / 21px | 1.45 | 0 | 500 serif | 问题正文、卷宗标题 |
| `--text-lede` | 1.1875rem / 19px | 1.7 | 0 | 400 serif | 首屏摘要、每节导语 |
| `--text-body` | 1.0625rem / 17px | 1.75 | 0 | 400 serif | 全部正文 |
| `--text-note` | 0.8125rem / 13px | 1.6 | 0 | 400 serif, ink-soft | 桌面端边注 |
| `--text-caption` | 0.8125rem / 13px | 1.5 | 0 | 400 sans | 图注（中文可读性优先用黑体） |
| `--text-mono` | 0.875rem / 14px | 1.6 | 0 | 400 mono | 代码、数据行、字段列表 |
| `--text-label` | 0.6875rem / 11px | 1.3 | +0.08em, uppercase | 500 mono | kicker、章节号、状态标签、tag |

中文混排微调：中文字符自带方形字面，`--text-body` 在 CJK 为主段落行高提升至 1.85（`lang` 属性驱动，`:lang(zh) { line-height: 1.85 }`）；标题负字距对 CJK 无效，`:lang(zh)` 下字距归 0。

### 3.3 行宽控制（严格上限，全站仅 4 个 measure token）

| token | 数值 | 应用范围 |
|---|---|---|
| `--measure` | **60ch** | 全部正文段落、列表——超过 60ch 一律换栏或进入边注（60ch 对 CJK 约等于 30 字/行，处于 25–35 的舒适区） |
| `--measure-heading` | **28ch** | h1/h2/首屏标题——强制标题在语义单元处换行，避免一行到底 |
| `--measure-margin` | **21ch** | 边注栏文字 |
| `--measure-fig` | **81ch** | 图表、研究地图、demo 嵌入——只有"非文字内容"允许越出正文栏（= 正文 60ch + 沟 4ch + 边注 21ch 的总宽） |

规则：**文字永不越出 60ch，图像可以越到 81ch，地图与 demo 允许 full-bleed**。违反此规则的版面视为 bug。

---

## 4. 颜色体系

设计母题：Light 模式是**书桌上的暖白纸**（阳光下的纸面），唯一强调色是**朱砂红（cinnabar）——学者批注与藏书印的颜色**，辅助色是**青黛（teal）——只用于图谱与研究地图的第二语义**。Dark 模式不是黑白反转，而是**台灯下的深色阅读室**：暖棕黑背景、米白纸墨、提亮的朱砂。全站无渐变、无发光。

### 4.1 Light tokens（暖白纸）

| token | hex | 用途 |
|---|---|---|
| `--paper` | `#FAF7F1` | 页面背景（暖白纸） |
| `--paper-deep` | `#F1EBDF` | 代码块底、图版底、footer colophon 带、hover 行底 |
| `--surface` | `#FFFFFF` | 仅用于 Lab demo 嵌入面板与图片 backing（极少量） |
| `--ink` | `#26211B` | 正文墨色（暖近黑，对 paper 对比度 ≈ 13.9:1） |
| `--ink-strong` | `#171310` | 标题、地图节点描边 |
| `--ink-soft` | `#6E655A` | 次要文字、边注、图注（≈ 4.9:1，AA 通过） |
| `--ink-faint` | `#A29886` | 装饰性 ghost 元素、禁用态（不承载必读信息） |
| `--divider` | `#E5DCCB` | hairline 分隔线（1px） |
| `--divider-strong` | `#D3C7B2` | 表格头线、卷宗行 hover 边界 |
| `--accent` | `#A63D2A` | 朱砂：链接、章节号、状态 OPEN、focus ring、地图核心环（≈ 5.9:1） |
| `--accent-hover` | `#7E2D1E` | 链接 hover、按下态 |
| `--accent-wash` | `#F3E3DA` | 状态标签底、hover 微染 |
| `--accent-2` | `#35695C` | 青黛：IN PROGRESS 状态、地图第二语义（≈ 5.6:1） |
| `--accent-2-wash` | `#E2EBE5` | 青黛标签底 |
| `--code-bg` | `#F1EBDF` | 行内码与代码块 |
| `--code-text` | `#3A3226` | 代码正文 |
| `--tok-key` | `#93402C` | 语法-关键字（低饱和印刷色系） |
| `--tok-str` | `#4E6844` | 语法-字符串 |
| `--tok-num` | `#8A6B2F` | 语法-数字 |
| `--tok-com` | `#A29886` | 语法-注释 |
| `--selection` | `#EFD9CB` | 文本选区（朱砂淡染） |
| `--focus` | `#A63D2A` | focus-visible 外环（2px, offset 2px） |
| `--shadow-1` | `rgba(38,26,15,.08)` | 唯一阴影层级：`0 1px 2px / 0 8px 24px`，仅用于 Lab demo 面板 |

### 4.2 Dark tokens（深色阅读室）

| token | hex | 用途 |
|---|---|---|
| `--paper` | `#17130F` | 背景（暖棕黑，绝不用蓝黑） |
| `--paper-deep` | `#211B15` | 代码块、图版、footer 带（比背景亮半档） |
| `--surface` | `#1D1812` | demo 面板 |
| `--ink` | `#EAE2D3` | 正文（米白纸墨） |
| `--ink-strong` | `#F7F1E5` | 标题 |
| `--ink-soft` | `#A99D8A` | 次要文字、边注 |
| `--ink-faint` | `#786F60` | 装饰 ghost（对背景 ≈ 3.2:1，仅限装饰） |
| `--divider` | `#332B21` | hairline |
| `--divider-strong` | `#483D2F` | 强分隔 |
| `--accent` | `#DA8A62` | 朱砂提亮版（≈ 6.7:1） |
| `--accent-hover` | `#ECAC89` | hover |
| `--accent-wash` | `#2C221A` | 标签底 |
| `--accent-2` | `#82B0A0` | 青黛提亮版 |
| `--accent-2-wash` | `#1E2A26` | 青黛标签底 |
| `--code-bg` | `#211B15` | 代码块 |
| `--code-text` | `#DED4C2` | 代码正文 |
| `--tok-key` | `#DA8A62` | 语法-关键字 |
| `--tok-str` | `#9CB584` | 语法-字符串 |
| `--tok-num` | `#CBA86B` | 语法-数字 |
| `--tok-com` | `#786F60` | 语法-注释 |
| `--selection` | `#3C2E22` | 选区 |
| `--focus` | `#ECAC89` | focus ring |
| `--shadow-1` | `rgba(0,0,0,.45)` | demo 面板阴影（Dark 下更多依赖 1px 边框而非阴影） |

语义状态色不引入新色相：`OPEN = --accent`、`IN PROGRESS = --accent-2`、`RESTING = --ink-soft`。色是语义，不是装饰——每个非中性色的出现都必须能被朗读成一句话（"这个是活的""这个在进行中""这个被选中了"）。

---

## 5. Light / Dark Mode 策略

- **Light「书桌上的抽印本」**：日光、暖白纸、墨与朱砂。用于白天扫读与打印联想，是默认态（System 跟随时 `prefers-color-scheme`，但品牌记忆以 Light 为准）。
- **Dark「夜读的阅读室」**：同一份纸放进了台灯下——背景是暖棕黑而非纯黑，文字是米白而非刺目纯白，朱砂提亮半档保持"批注"的可见性。两套主题共享完全相同的版式与动效，**只有材质变化，没有结构变化**。
- 切换体验：header 右侧一个 mono 三段切换 `[ SYS · LIGHT · DARK ]`（radiogroup 语义，键盘 ←→ 切换）。切换时通过 View Transitions API 对根元素做 200ms 交叉淡化（只 crossfade 颜色，不动画布局），不支持时立即切换；`prefers-reduced-motion` 时跳过过渡。选择持久化在 `localStorage("offprint-theme")`，`<head>` 内联脚本防 FOUC。
- 细节：地图节点、代码高亮、状态标签在两套主题下分别校准过对比度（见 §4 表）；选区颜色也随主题换——选中的文字在 Dark 下是"台灯照到的那一行"。

---

## 6. 布局系统

### 6.1 阅读网格（全站唯一骨架）

非对称五列网格——正文略偏左，**右边注栏是页面的第二主角**（Tufte 传统）：

```css
.page-grid {
  display: grid;
  grid-template-columns:
    [full-start]  minmax(1.5rem, 1fr)
    [text-start]  minmax(0, var(--measure))        /* 60ch 正文 */
    [gut-start]   minmax(2rem, 4ch)                /* 沟 */
    [margin-start] minmax(0, var(--measure-margin)) /* 21ch 边注 */
    [margin-end]  minmax(1.5rem, 1fr);
}
.text   { grid-column: text-start / gut-start; }
.wide   { grid-column: text-start / margin-end; }  /* 图表 81ch */
.margin { grid-column: margin-start / margin-end; }
.full   { grid-column: full; }                     /* 研究地图、demo */
```

- 1440px 屏上：正文约 510px，边注约 230px，整体居中偏左，右侧留白承担"纸边"。
- **Section header 挂边**：章节号（mono `§01`）挂进边注栏，章节标题（serif h2）在正文栏，一条 1px hairline 从正文栏顶横贯到边注栏尾——编号、标题、线三件套是全站统一的章节语法。
- 允许"越栏"的内容只有：图表（81ch）、研究地图（full）、Lab demo（full）、footer（full）。边注还可承载：图注、补充引文、状态日期、pull quote。

### 6.2 边注系统（Sidenotes）与三段降级

1. **桌面 ≥1100px**：边注漂浮在右边注栏，与正文锚点行对齐（absolute 定位到锚点 + max-height 校验，越界时自动 fallback 为行内块）。边注 13px/1.6、ink-soft，前缀 mono 上标编号（如 `³`）——编号呼应学术引用的观感。
2. **平板 768–1099px**：边注栏消失，边注折叠为**行内嵌入注**：正文流内的左侧 2px accent-wash 竖线块，字号同 `--text-note`，缩进 16px——保住"次要信息被分流"的层级，放弃"占边"。
3. **移动 <768px**：边注变**可折叠行内注**——正文内上标编号渲染为 `<button>`（mono，`[3]`，44px 触达区由 padding 保证），点击展开下方注块（`grid-template-rows: 0fr→1fr`，200ms）；`aria-expanded`/`aria-controls` 完整；无 JS 时用 `<details><summary>` 原生降级。这是"移动端折叠方案"的正式定义：**编号可见、内容按需展开、展开态有竖线标识**。

### 6.3 间距节奏与 Section 过渡

- 4px 基线；间距 token：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160。
- 正文段间 24px；卷宗/台账行内上下 padding 28px；section 间 **128px**（桌面）→ 64px（移动）；首屏 min-height 78vh，保证标题区有"一页纸"的完整感。
- Section 之间的过渡只有两种语法：**hairline + 章节三件套**（默认），以及**paper-deep 色带**（仅 footer 与 Lab full-bleed 区）。禁止色块卡片式的"容器换底"。
- 圆角 token：全局 0（印刷品没有圆角），例外仅两个——`--radius-chip: 2px`（状态标签）、`--radius-media: 3px`（截图与 demo 面板）。

---

## 7. 主要交互与动效

**动效宪法**：全部动效 transform/opacity only；时长 120ms（hover）/ 200ms（状态）/ 320ms（进入）；缓动 `cubic-bezier(0.22, 1, 0.36, 1)`；进入动效每节最多 1 组、stagger 40–60ms、`whileInView once: true`（motion 实现）；`prefers-reduced-motion` 下所有位移动画转为纯 opacity 或直接显示。

| # | 交互 | 行为描述 |
|---|---|---|
| 7.1 | 顶部导航 | 56px 固定 header：左侧 mono wordmark（config placeholder），右侧章节导航（≥1100px：mono 编号 `01 Research … 08 Colophon`）。滚动超过 24px 后 header 底部浮现 1px hairline 与实色 paper 底。当前章节的编号转朱砂色并带 2px 下划短线（motion `layoutId` 使短线在编号间平移，200ms）。<1100px 时导航收进 "Contents" 按钮 → §11 的目录层 |
| 7.2 | 阅读进度线 | header 下缘 2px 朱砂 hairline，`scaleX` 随滚动（rAF 节流）——阅读优先站点里，进度线是功能性动效，reduced-motion 下保留（直接操纵反馈，非装饰） |
| 7.3 | 链接 | 正文链接：朱砂下划线（thickness 1px, offset 3px）；hover 时下划线增粗到 2px 并加深为 `--accent-hover`（120ms）。外部链接尾部带 mono 上标 `↗`。无颜色闪烁、无背景高亮 |
| 7.4 | **Signature：Question Ledger 行展开** | 见 §9.1——点击问题行，追问列表以 40ms stagger 逐条显现；行首 mono 编号由空心描边数字转为实心朱砂；同时桌面端右缘地图上对应节点描边加粗并短促脉冲一次（320ms）。行展开状态 `aria-expanded` 同步 |
| 7.5 | 主题切换 | §5；切换瞬间 accent 下划短线在 `[SYS·LIGHT·DARK]` 三段间平移（200ms） |
| 7.6 | Section 进入 | 标题三件套（§号 + 标题 + hairline）先入（opacity + translateY 12px→0，320ms），正文组 60ms 后 stagger 进入；每节只发生一次 |
| 7.7 | 卷宗行 hover | 行底染 `--paper-deep`（color-mix 40%）、行左缘 2px 朱砂竖线 `scaleY` 自上而下展开（200ms）、行号转朱砂——触屏设备上同样的反馈绑定到 `:active` |
| 7.8 | 复制反馈 | Email/citation 的 "Copy" 按钮：点击后按钮文字原位替换为 `Copied —`（mono）1.5s 后还原。**不用浮层 toast**——印刷品上没有悬浮物 |
| 7.9 | 地图 hover | 见 §9.2——非相邻边与节点降至 25% opacity（150ms），相邻边转朱砂 |

明令禁止：视差、打字机、逐字渐显、粒子、光标跟随、滚动劫持、任何 bounce。

---

## 8. Projects 展示方式：「Case Records 编号卷宗」

**形态：全宽台账行（ledger rows），hairline 分隔，零卡片、零网格墙。**

每行是一个 `<article>`，内部沿用阅读网格：

- **左边注位**：mono 卷宗号 `W-01` + 年份（竖排两行，ink-soft）。
- **正文栏**：标题（serif h3 21px/500，一行）→ 一句话摘要（17px，ink-soft，最多 2 行）→ mono 元数据行（12px）：`ROLE: Sole author · STACK: Python / FAISS / FastAPI · CODE ↗ · DEMO ↗`。
- **右边注位**：状态标签（mono chip：`ACTIVE` 朱砂 / `MAINTAINED` 青黛 / `ARCHIVED` ink-soft）+ 一张 21ch 宽的"证据图"（截图或架构手绘图，1px divider 边框，radius 3px）——证据图住在边注里而不是行首大图，是本方案与"封面图卡片流"的根本区别。
- **交互**：§7.7 的行 hover；整行可点进入 Case Study 详情页——详情页就是标准阅读版式（60ch 正文 + 边注放实现注记与失败尝试），结构复用 Notes 页。
- **内容红线执行**：4 条 sample 卷宗只描述"做了什么、怎么做的、学到什么"，不声称发表/获奖；数据文件每条带 `sample: true`，文档注明"整行替换即可"。

卷宗号（W-01…）与研究问题存在数据层引用（`related: ["Q2"]`），卷宗详情页顶部显示 `RE: Q2` 反链 chip——项目被定义为问题的证据。

---

## 9. Research 展示方式（核心章节）

### 9.1 Signature Element：Question Ledger（研究问题台账）

**让访客 10 秒内看懂"这个研究者在思考什么"。** 版式：

- Section 头：边注位挂 `§01 · THE QUESTION LEDGER`（mono），正文栏 h2 "Questions I'm currently asking."（中文站："我此刻在问的问题。"），下方 lede 一句："编号与状态是真实的工作状态，不是修辞。"（sample 内容注明可替换）
- **问题行**（全宽，hairline 分隔，桌面网格 `[6ch 编号][1fr 问题][auto 状态][21ch 边注]`）：
  - **编号**：`Q1`–`Qn`，mono 500，1.25rem，默认空心描边（ink-soft），展开/激活时实心朱砂。
  - **问题正文**：serif 21px/1.45/500，最多两行——问题必须写得像论文里的 open question，而不是营销标语。
  - **状态 chip**：mono 11px uppercase + 1px 边框 + 2px radius：`OPEN`（朱砂）/ `IN PROGRESS`（青黛）/ `RESTING`（ink-soft）。三态是诚实的语义：包括"暂时搁置"也是可展示的工作状态。
  - **边注位**：`upd. 2026-10`（mono 11px）+ 所属领域 tag（点击 = 按领域过滤台账）。
- **追问（followups）**：点击行展开——缩进列表，italic serif 17px，左侧 1px divider 竖线，40ms stagger；追问是"问题的子问题"，通常 2–3 条。展开区底部一条 mono 反链：`→ see map: Poisoning`。
- **桌面端联动**：默认展开 Q1（邀请阅读）；已展开行与右侧 Research Map 对应节点联动高亮（§7.4）。
- **移动端**：编号与状态合并到问题上方的一行 meta；追问展开为缩进块；地图联动降级为展开行内的 mini-map 缩略图（可选）或省略。
- 数据层：`content/research.ts` 的 `questions[]`（`{ id, text, area, status, followups[], updated }`），**状态与日期是内容策略的一部分——这是页面最诚实的地方，也是最需要维护自觉的地方**（见 §14）。

Seeded 5 问（全部 `sample: true`）：

- **Q1**（RAG × Robustness / IN PROGRESS）：当检索到的上下文彼此矛盾时，生成应当信任谁？——追问：attribution 该如何呈现给用户；噪声比例超过哪个阈值后答案质量坍塌。
- **Q2**（Knowledge Poisoning / OPEN）：攻击者需要往语料里投多少"被污染的记忆"，才能稳定地改变一个系统的答案？——追问：检测污染是否比防御污染更可行。
- **Q3**（AI Security / OPEN）：检索库是新的攻击面——它的安全边界应该画在哪里？——追问：把信任边界画在检索层还是生成层。
- **Q4**（LLM Systems / RESTING）：在什么规模下，检索延迟会反过来决定 RAG 的架构选择？——追问：cache、reranker 与召回深度的三边权衡。
- **Q5（Retrieval × Generation Interaction / IN PROGRESS）**：引用是天然可信的，还是可以被伪造的引用欺骗？——追问：模型能否区分"来自语料的引用"与"编造得像语料的引用"。

### 9.2 Research Map（研究地图，纯 SVG）

**用一张手排的关系图替代"兴趣标签云"。** 结构描述（viewBox `0 0 920 560`，全部手写 inline SVG，无图表库）：

- **核心节点**：`RAG`（cx 460, cy 260, r 58）——paper 底 + ink-strong 1.5px 描边，外围一圈 r+8 的朱砂虚线环（dash 2 3）标记"这是核心"。
- **第一环（直接属性，短实线边）**：`Robustness`（255, 150, r 42）、`Retrieval × Generation`（665, 150, r 42）。
- **第二环（威胁与基座）**：`Knowledge Poisoning`（135, 315, r 46）——与 Robustness 实线相连（投毒直接威胁鲁棒性）；`AI Security`（330, 455, r 40）——与 Poisoning 实线相连（投毒是安全的一种攻击向量），与 RAG 虚线相连（整体安全视角）；`LLM Systems`（640, 425, r 42）——与 RAG 实线相连（承载基座），与 Robustness 虚线相连（评测与复现依赖系统设施）。
- **线语义**：实线 1.5px = 直接研究焦点；虚线 1px = 支撑视角。图下 legend 一行 mono 注明两种线型 + "节点大小 ∝ 未决问题数"。
- **数据驱动**：每个节点带 mono 小徽标 `Q×n`（n = 该领域下未决问题数，从 questions[] 计算）——**地图上永远不出现论文数、星级或任何伪造成果，只有问题的分布**。
- **交互**：hover 节点 → 该节点描边转朱砂 2px、相邻边转朱砂、非相邻元素 opacity 降至 0.25（150ms），并浮出该领域的 Q 编号列表；点击节点 → 平滑滚动至 Question Ledger 并应用领域过滤器（Ledger 头部出现可移除的 `Map: Poisoning ×` chip）。这是全站第二个跨组件 signature 交互。
- **A11y**：`role="img"` + `<title>/<desc>` 描述全部关系；图下方提供一个视觉隐藏（或移动端可见）的文字版关系列表；移动端切换为**竖版地图**（viewBox `0 0 360 760`：RAG 居顶，Robustness 与 Interaction 分列下行，Poisoning → Security 沿左列，Systems 沿右列），两套 SVG 都在 DOM 中、按断点显示其一。

### 9.3 Current Directions

3 段 60ch 短文（真实兴趣的展开，各配 1–2 条边注），段首用 mono 侧标 `01 / 02 / 03`。这是研究叙述的"散文层"——地图给人结构，台账给人状态，散文给人语气。

---

## 10. Playground / Lab 概念：「Appendix · 可运行的部分」

- **入口形态**：不做"实验列表页"，而是 **论文附录（Appendix）**：Section 头 `§05 · APPENDIX — RUNS LOCALLY`，三条附录条目以台账行呈现，每条带 mono 标签 `[RUNS OFFLINE]` 与一行 method 说明（"启发式模拟 · 无网络请求 · 无模型调用"）。条目行点击进入 `/lab/<id>` 独立页——页面仍是阅读版式，正文 60ch 之外用 full-bleed 嵌入 `--surface` demo 面板（1px 边框 + 唯一允许的阴影层）。
- **Demo 1「Context Autopsy / 上下文解剖」**：预设或粘贴 3–5 段短文本（其中 1 段被"投毒"），客户端用 TF-IDF 式关键词重叠做确定性打分，走一遍 chunk → retrieve → rank → mock answer 的流程可视化；用户可以拖动"噪声比例"滑杆，观察被投毒片段何时压过真实片段。对应 Q1/Q2。纯前端、离线、确定性可复现。
- **Demo 2「Citation Fragility / 引用易碎性」**：一个 toggle 开关注入"伪造引用"到模拟上下文，模板化 mock generator 的答案随之改变，答案中的 attribution 高亮标到错误来源上——直观演示 Q5。30 秒可玩完，含一句结论注："这为什么值得研究 → Q5"。
- **Demo 3「Latency Budget / 检索延迟预算」**：SVG 曲线面板，滑杆调 chunk 数量 / 索引规模 / 召回深度，实时绘制端到端延迟与召回率的两条曲线与交点——把 Q4 做成可操作的直觉。
- 每个 demo 页固定页脚：`Heuristic simulation for intuition — not a benchmark.` + `sample: true`。诚实标注是 Lab 的学术礼仪，也是与"炫技 playground"的分界线。

---

## 11. 移动端方案

移动端是**重新排版，不是缩放**：

- **导航**：header 只剩 wordmark + 主题切换 + `Contents` 按钮。Contents 打开**全屏目录层**（书籍目录，非汉堡菜单）：8 个章节以 serif 大字（h2 级）+ mono 编号纵向排列，30ms stagger 淡入，底部附状态摘要（`5 questions · 4 cases · 3 notes`）。Esc / 点击遮罩关闭，焦点困在层内，关闭后焦点归还按钮。
- **内容优先级**：Question Ledger 的折叠态默认只显示编号 + 问题 + 状态（追问收起）；卷宗行重排为上下结构（meta 行 → 标题 → 摘要 → 证据图全宽），边注 → 可折叠行内注（§6.2）；地图切竖版；Lab demo 面板改为纵向步骤条布局。
- **移动特有体验**：① 正文内 `[3]` 边注按钮的展开交互（桌面没有的阅读动作）；② 行 hover 反馈迁移为 `:active` 左缘竖线即时反馈；③ 目录层是移动端独有的"全书总览"。
- **规格**：正文 16px/1.8，边距 20px（60ch 上限在 375px 屏自然满足）；触达目标 ≥44px；section 间距 64px；header 收缩为 48px。在 320px 小屏与 1024px 平板各做一档校验。

---

## 12. 空状态策略

**总原则：无内容的模块不渲染（Awards/Talks 直接消失）；必须出现的空，用学术礼仪书写。**

1. **Publications（旗舰空状态）**：

   ```
   §03 · PUBLICATIONS

   Manuscripts in preparation.
   —— 未提交与在审的手稿不在此列出；这是学术礼仪，也是本节的诚实。
   ```

   下方附**一行 ghost specimen**（faint ink，`aria-hidden`，`sample: true`）：`[ AUTHORS ] · [ YEAR ] — [ TITLE ] · [ VENUE ] ↗ [CODE] [DATA]`——它向访客与未来的自己展示"论文将以此版式出现"。第一篇论文入库时，删除 specimen 换上真行，**版式零改动**。克制、体面、一眼即懂，绝不显得"没做完"。

2. **Contact**：colophon 中只渲染 config 里存在的渠道；当前全为 placeholder 时，显示一个 faint mono 条目 `EMAIL — available on request · configure in content/links.ts`（文档注明）。有 GitHub 后自动变成 `GITHUB — @handle ↗`。
3. **Timeline**：设计为 "Milestones ledger"（与卷宗同构的行式时间线，年份挂边注位）；mock 给 3 条 sample；真实数据为空时整节不渲染。
4. **Question Ledger 的"空"**：理论上不允许为空（问题在先）；若用户清空 questions，渲染一行 italic："The ledger is being rewritten."——连空状态都保持台账语气。

---

## 13. 与其他 7 个方案的差异

- **vs Team A「Monograph 单行本」（Apple-like 极简）**：A 靠删除达成克制（无卡片、无装置、冷灰 + 橙点），我保留一套完整的"学术排版装置"（边注、编号、台账、地图）——A 的克制是减法，我的克制是"每个装置各司其职"；且 A 是冷灰理性，我是暖纸与朱批。
- **vs Team B「Field & Retrieval」（个人学刊）**：B 把主页当**出版物**（Volume/Issue、feature story、跨栏刊名 hero），我把主页当**带工作装置的研究读本**——B 的主角是栏目与排期，我的主角是研究问题与边注阅读层；同为衬线，B 用 Fraunces 的展示性，我用 Newsreader 的可读性；B 的空状态是"征稿中"，我的是"Manuscripts in preparation"的学术礼仪。
- **vs Team F「Coordinate System」（Swiss 网格）**：F 的美来自网格与编号的秩序（档案馆隐喻，左批注栏、坐标红），我的美来自纸张与阅读的呼吸（阅读室隐喻，右边注、连续论证）；F 登记条目，我陈述问题——同样一点红，F 的红是"找到"的信号，我的红是"朱批"的学术。
- **vs Team H「A Retrievable Self」（实验交互）**：H 让整站变成检索系统（交互装置是主角：command palette、自述装置），我把交互收进附录（阅读是主角，Lab 是三个可控 demo）；H 的实验性分布在导航与首屏，我的实验性被限制在标注过 method 与 limitation 的附录里。
- **vs 画廊/视觉作品集路线**（对未见文档团队的预判）：我不以图像、镜头与大图驱动画面的第一印象——全站视觉资产最少化，字体即版面。
- **vs 叙事滚动 / scrollytelling 路线**（预判）：没有逐屏揭示与滚动剧场，滚动只是阅读的物理动作，动效只做标点。
- **vs 仪表盘 / 数据化路线**（预判）：不用统计卡片、雷达图与指标墙呈现一个人；数据只出现在问题状态、地图节点计数与日期里——数字为人服务，不是人为数字服务。

---

## 14. 风险与自我批评

1. **中屏破版是头号工程风险**：1000–1200px 区间边注栏（21ch）与正文（60ch）总和接近临界，边注可能溢出或挤压正文。缓解：1099px 以下立即切"行内嵌入注"；但切换处会损失本方案最独特的视觉特征，需在 1100–1280px 反复实测。
2. **"学术感"过头 = 沉闷**：克制到极致就是 arXiv 克隆——招聘者 90 秒扫站时可能觉得"没有第一印象的冲击"。本方案赌的是"论文标题区 + 朱砂 + 台账"三个细节足以形成记忆点；如果赌输，方案会显得"好看但没劲"。这是诚实的最大风险。
3. **中文衬线的加载与观感**：Newsreader 不含 CJK，Noto Serif SC 全量超过 8MB；unicode-range 切片能救首屏，但回退到 SimSun 的瞬间气质会崩坏。需要坚决子集化，并接受"首帧字体切换"的存在。
4. **手写 SVG 地图的维护成本**：节点坐标是排出来的，不是算出来的；问题数量变化时节点大小与徽标要手校。若未来领域从 6 个涨到 10 个，这张图需要重排——应预留"地图数据化"的重构路径。
5. **台账的诚实是双刃剑**：`upd. 2026-10` 与 `RESTING` 状态三个月不更新，就会从"诚实的现场"变成"荒废的证据"。这个方案要求主人像维护实验记录一样维护主页——对长期使用是优点，对懒人是事故。
6. **边注的内容纪律**：边注系统给了太多"写小字的地方"，用滥了正文会被切碎、页面会变成注文集。编辑守则：每 3–4 段正文最多 1 条边注，边注必须提供"不读会损失、读了不后悔"的增量。
7. **placeholder 的灰区**：占位符渲染太多（affiliation、email、seal），页面会泄露"还没配好"的气息。规则：placeholder 一律 faint ink + mono，视觉上属于" apparatus"而非"内容"，且数量全站 ≤3 处。

---

### 附：工程映射速查（供第二轮实现）

- Token 全部落入 Tailwind v4 `@theme`（颜色经 CSS 变量 + `[data-theme="dark"]` 切换）；动效用 motion 的 `whileInView`/`layoutId`，全部经 `useReducedMotion` 门控。
- 内容文件：`content/profile.ts`、`content/research.ts`（areas + questions + map edges）、`content/projects.ts`、`content/publications.ts`（空数组 + specimen 配置）、`content/writing.ts`、`content/lab.ts`、`content/links.ts`；所有 sample 条目带 `sample: true`。
- SEO：OG 图用 satori 生成"标题区式"卡片（paper 底 + kicker + 朱砂横线），1200×630；sitemap + favicon 常规。
- 性能预算：首屏（LCP = 标题句）< 1.8s（4G 中速）；字体 latin 子集 preloaded；地图与 Lab 代码 `React.lazy` 按路由分割。
