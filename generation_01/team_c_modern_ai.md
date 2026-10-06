# Team C — Modern AI / Future：「精密仪器 / Precision Instrument」

> **方向**：现代 AI 产品的工程美感——Linear / Vercel / Raycast 级别的精致与克制，但形成自己的语言：把整个网站做成一台**校准完毕的精密仪器**。面板是石墨灰的，信号灯是琥珀色的，所有标签是等宽刻字，所有状态是可读数。不是"科幻感"，是"仪器感"：仪器不炫技，仪器给出**读数**。
>
> 本文档遵守 `BRIEF.md` 全部约束：§3 内容策略（零编造 / `sample: true` / 空状态一等公民）、§5 禁止清单（无赛博朋克 / 无荧光 / 无粒子 / 无玻璃拟态堆砌）、§6 工程基线（Vite 7 + React 19 + TS 严格模式 + Tailwind v4 + motion + 内容全部数据驱动）、§7 十四章交付结构。

**种子约束落点索引**（评委快速核对用）：

| 种子约束 | 落点 |
|---|---|
| 系统语言：hairline / mono 元数据标签 / 状态指示点 / 极少量刻度装饰 | §3.5、§4、§6.4、§7.5、§8、§9 |
| 近单色石墨体系 + 一个信号色（Light/Dark 完整 token 表） | §4（Signal Amber：Dark `#FFB224` / Light `#9A6700`） |
| 首屏"数据自证"元素（不编造数据） | §2.2 FIG.00 三联装置：真实构建读数块 + 关键词矩阵 + 纯前端 RAG pipeline 微缩图 |
| Signature interaction（检索→生成隐喻，纯前端） | §7.3 Relevance Lens（相关性重排）+ §7.4 Retrieval Palette（⌘K） |
| Projects/Research 的"工程档案感"（版本号 / 模块拆解 / 架构微图） | §8（Ledger + Dossier）、§9（Research Ledger） |

---

## 1. 设计理念

**一段话灵魂**：仪器最动人的品质不是炫目，而是**可信**——每一处刻度都校准过，每一个读数都对应真实状态，每一盏信号灯都连着一条真实电路。这位主人公研究 RAG 的鲁棒性与知识投毒，他的职业本能是"不信任未经验证的输出"；那么他的主页就应该像一台他亲手装配的仪器：石墨灰面板上，等宽字刻着档案号与版本号，微小的琥珀色脉冲点标记"正在运行的研究"，首屏不是自我介绍而是一块**自检读数屏**——构建时间、内容记录数、研究方向状态，全部真实可计算，一处都不编造。视觉上它是 Linear 的克制、Vercel 的 crisp、Raycast 的精确，但它的语言是自己的：**面板（surface）+ 读数（mono meta）+ 信号（signal amber）+ 图示（diagram）**。当访客离开时，记住的不是特效，而是一台仪器精确运转的印象——这台仪器的测量对象，是一个研究者的专注。

**三条设计原则**：

1. **读数优先，装饰归零（Readings, not ornaments）**。页面上每个可见元素必须能回答"它显示了什么状态/什么信息"。hairline 是面板接缝，mono 标签是刻字，脉冲点是电路指示——它们不是风格贴纸，是信息本身。任何回答不了的元素删除。
2. **一个信号色，只说一件事（One signal, one meaning）**。全站近单色石墨阶 + 唯一信号色 Signal Amber。琥珀只标记"有活性的东西"：进行中的研究方向、运行中的实验、当前焦点、键盘焦点环。它从不装饰标题、从不做大面积色块——看到琥珀，等于读到"此处有信号"。
3. **数据自证（The instrument self-reports）**。首屏与页脚展示的每一个数字（构建时间、记录数、主题模式、检索方法）都必须从代码与内容文件**真实计算**得出。这台仪器最大的卖点就是诚实——`PUBS 0` 敢直接刻在面板上，并且刻得好看。

---

## 2. 首页信息架构

### 2.1 Section 顺序与理由

| # | Section | 内容 | 放置理由 |
|---|---|---|---|
| 00 | Hero「FIG.00 自检读数屏」 | 标题 + 三联数据自证装置（见 2.2） | 10 秒内建立"这是一台什么仪器" |
| 01 | README（About） | 两段短自述 + 研究声明，占 col 1–8，旁注 col 9–12 | 仪器铭牌：最小说明，紧随自检屏 |
| 02 | Research | 研究方向 ledger + 开放问题 + 实验表（§9） | 研究者访客与招聘者的第二停留点 |
| 03 | Publications | **优雅空状态**：`0 RECORDS` + ghost 槽位（§12） | 学术访客最早寻找的栏目，空也要"在场" |
| 04 | Selected Work + Open Source | 工程 ledger + dossier（§8）；Open Source 作为同页 sub-ledger | 证据区，向下承接动手能力的 Lab |
| 05 | Lab / Playground | 3 个可离线运行的实验入口（§10） | 紧跟 Work：看过架构图，就让访客亲手拨动仪器 |
| 06 | Notes / Writing | 笔记索引列表（2–3 篇 sample） | 深读区，放后半程不打断黄金路径 |
| 07 | Log（Timeline 重设计） | changelog 式 mono 流水账，非简历时间轴（§6.5） | 档案的"维护记录"，放页尾符合仪器隐喻 |
| 08 | Contact | mono 链接表，placeholder 显式（§12） | 收尾即出线端子 |

### 2.2 首屏：FIG.00 自检读数屏（100svh）

禁止 "Hi, I'm XXX"。首屏由**一句话标题 + 三联数据自证装置**构成，桌面端 12 列网格布局：

**（a）标题区（col 1–9，垂直上 1/3）**

```
● RESEARCH × ENGINEERING — RAG / ROBUSTNESS / SECURITY      ← mono-tag 11px，行首 6px 琥珀脉冲点
Retrieval, made robust.                                      ← display-1 64px/1.06，-0.03em，w550
一行配置化的副题（profile.tagline，placeholder，15px body，muted）  ← 不编造履历，只陈述方向
```

标题只有一句观点（研究方向是真实信息，非 credentials）。`Retrieval, made robust.` 是方向声明，不是成果声称。

**（b）装置一：SYS 状态块（col 1–5，mono 排版）**

```
● R·LAB — ONLINE
BUILD     2026-10-05 14:32 UTC · a1b2c3d
FOCUS     RETRIEVAL-AUGMENTED GENERATION
RECORDS   WORK 5 · NOTES 3 · PUBS 0 · LAB 3
MODE      SYSTEM (LIGHT / DARK)
```

每一行都真实可计算，**实现来源**：

- `BUILD`：Vite `define` 注入 `__BUILD_TIME__` 与 `__GIT_HASH__`（CI 可用，本地构建也真实）；
- `RECORDS`：构建时从 `content/*.ts` 各模块 `length` 汇总，天然与站点内容同步，`sample: true` 的条目照常计入（诚实计数）；
- `MODE`：实时反映当前主题状态（随切换更新）；
- `● ONLINE`：站点可达性自指（static site 恒真），脉冲点动画 2s。

**（c）装置二：关键词矩阵（col 6–9）**——六个**真实**研究兴趣排成 2×3 矩阵，每格：

```
K-03                              ← mono-micro 10px 索引
Knowledge Poisoning               ← title-3 17px
● ACTIVE                          ← 6px 琥珀点 + mono-tag（六个方向均为真实声明的活跃兴趣）
```

交互：hover 任意一格，其余格子按数据文件中**人工声明的 affinity 映射**（如 poisoning↔robustness `0.9`，`content/research.ts` 中的 `affinity: Record<id, number>`，声明的是研究者的判断，不是伪造的指标）降低透明度至 `1 − affinity × 0.6`；点击跳转 Research 对应条目锚点。纯 opacity 过渡 160ms，无位移。

**（d）装置三：RAG pipeline 微缩图（col 10–12 纵排或 col 6–12 横排，响应式重排）**

SVG 绘制五段流程，hairline 1px 描边、圆角 4px、每段 88×32px：

```
QUERY ──▶ RETRIEVE ──▶ RERANK ──▶ AUGMENT ──▶ GENERATE
              ▲
        (amber dot 沿路径移动)
```

- 一枚 6px 琥珀读数点沿连接线移动：加载后运行一次（5.2s），hover 图示重放；SVG `<animateMotion>`（SMIL）实现，GPU 开销极低；
- 每段 hover：该段边框转琥珀，图下方一行 mono 注释切换为该段的**真实研究注脚**（来自数据，如 RETRIEVE 段："corpus poisoning enters here — see R-03"）；
- 图左上角 mono-micro 标注 `FIG.0 — RETRIEVAL-AUGMENTED GENERATION (ILLUSTRATIVE)`：明确这是**方向示意**，不是成果声称，杜绝"假装有系统"的误读。

首屏构图纪律：全屏最多 **2 个琥珀点同时脉冲**（SYS 块 + 矩阵当前 hover 格），除 pipeline 读数点外无任何循环动画。

---

## 3. Typography

### 3.1 字体选型与理由

| 角色 | 字体 | 字重 | 理由 |
|---|---|---|---|
| Display / UI / 正文 | **Inter**（variable） | 400 / 500 / 550（display 用可变轴中间值）/ 600 | 中性、精密、hinting 极佳；variable 单文件承载 550 这个"仪器灰度"字重，display 与正文共用一套骨架，全站字形零噪音 |
| 系统语言（标签/读数/代码） | **IBM Plex Mono** | 400 / 500 | 比 JetBrains Mono 更有"工程文书"的刻字感而非黑客感；点式零、大写形态端正，适合 +0.08em 的 tag 排版；OFL 可子集化 |
| 中文 | **Noto Sans SC** | 400 / 500 | 与 Inter 的 x 高度与灰度最匹配的开源中文；unicode-range 分片子集化按需加载 |

**mono 使用占比硬约束：≤ 页面文本量的 10%。** mono 只出现在：tag、状态块、索引号、版本号、表格读数、代码。正文、标题、导航主文案一律 Inter。这条红线是本方案与"终端风开发者模板"的分界线——仪器面板上刻字是少数，仪表读数是少数，面板本身是安静的。

### 3.2 字号阶梯（完整数值）

| Token | 字号/行高（桌面） | 移动端覆盖 | 字距 | 字重 | 用途 |
|---|---|---|---|---|---|
| `display-1` | 64px / 1.06 | 40px / 1.1 | −0.03em | 550 | Hero 标题（每页最多 1 处） |
| `display-2` | 44px / 1.1 | 32px / 1.15 | −0.025em | 550 | Log 大年份、Lab 入口标题 |
| `title-1` | 30px / 1.25 | 26px / 1.3 | −0.015em | 600 | Section 主标题 |
| `title-2` | 21px / 1.35 | 20px / 1.35 | −0.01em | 600 | 项目名、条目标题 |
| `title-3` | 17px / 1.45 | 17px / 1.45 | −0.005em | 600 | 小标题、关键词矩阵格 |
| `body-lg` | 17px / 1.76 | 17px / 1.7 | 0 | 400 | README/案例研究长文（行宽 66ch） |
| `body` | 15px / 1.73 | 15px / 1.7 | 0 | 400 | 默认正文、摘要 |
| `body-sm` | 13px / 1.6 | 13px / 1.6 | +0.005em | 400 | 表格内文、次要说明 |
| `mono-tag` | 11px / 1.45 | 11px / 1.45 | +0.08em | 500 | 元数据标签，**全大写**（`RAG / ROBUSTNESS`） |
| `mono-micro` | 10px / 1.3 | 10px / 1.3 | +0.12em | 400 | 索引号、坐标读数、刻度旁注（仅装饰性，非必读信息） |

中文排版附加规则：CJK 文本 tracking 归零（`+0.08em` 只作用于拉丁 mono）；中西混排时 Inter 与 Noto Sans SC 的字重按 500/500 对齐；`title` 级中文用 `font-feature-settings: "palt"` 收紧标点。全部正文 token 对背景 ≥ 4.5:1（AA），`muted` 仅用于装饰性 micro 信息（§4 对比度策略）。

### 3.3 行宽与字体工程

- 长文行宽 **66ch**（约 680–720px），摘要行宽 56ch；dossier 内文双栏时每栏 ≤ 38ch；
- 字体加载：Inter variable latin 子集 woff2（≈48KB）+ Noto Sans SC 按 unicode-range 分片（cn-font-split）+ IBM Plex Mono latin 400/500 两枚小文件；全部 `font-display: swap`，`size-adjust` 校正 fallback 抖动；fallback 栈：`Inter, "Noto Sans SC", system-ui, -apple-system, "Segoe UI", sans-serif` / `"IBM Plex Mono", ui-monospace, "Cascadia Mono", Consolas, monospace`。

---

## 4. 颜色体系

### 4.1 设计立场

近单色**石墨（graphite）**体系——冷中性灰阶，微弱暖偏（避免死灰）；唯一信号色 **Signal Amber（信号琥珀）**：仪器面板指示灯/示波器琥珀扫描线的色相，与"蓝紫渐变 AI 俗套"彻底反向。琥珀在 Dark 下是点亮的面板灯（`#FFB224`），在 Light 下压深为可读的赭金（`#9A6700`），两套都是被独立设计的，不是简单反转。

### 4.2 Dark 主题 token 表（「熄灯的实验室」）

| Token | 值 | 用途 |
|---|---|---|
| `--bg-base` | `#0B0C0E` | 页面底色（深石墨，非纯黑） |
| `--bg-sunken` | `#07080A` | 页脚、代码井、输入井 |
| `--surface-1` | `#101215` | 面板 / dossier / 表格容器 |
| `--surface-2` | `#16191D` | hover / raised 态 |
| `--hairline` | `rgba(235,238,242,0.08)` | 一级 1px 分隔线（面板接缝） |
| `--hairline-strong` | `rgba(235,238,242,0.16)` | 表头线、section 分隔 |
| `--text-1` | `#E6E8EB` | 主文本（对 bg ≈ 13:1） |
| `--text-2` | `#9BA1A8` | 次文本（≈ 7:1） |
| `--text-3` | `#62676E` | 装饰读数/禁用（≈ 3.4:1，仅限非必读 micro） |
| `--accent` | `#FFB224` | 信号琥珀（对 surface ≈ 9:1） |
| `--accent-dim` | `rgba(255,178,36,0.16)` | 琥珀 12–16% 填充（hover 底、active 行底） |
| `--on-accent` | `#171410` | 琥珀底上的文字/图标 |
| `--focus-ring` | `rgba(255,178,36,0.9)` | 2px focus 环 |
| `--selection` | `rgba(255,178,36,0.22)` | 文本选区 |
| `--code-bg` | `#0E1013`；`--code-comment` `#62676E`（italic）；`--code-keyword` `#FFB224`；`--code-ident` `#D3D7DC`；`--code-punct` `#62676E` | 代码块：**单色 + 琥珀关键字**，不引入第二色相 |
| `--negative` | `#E5484D` | 仅表单错误/危险操作（语义色，非装饰） |

### 4.3 Light 主题 token 表（「图纸上电」）

| Token | 值 | 用途 |
|---|---|---|
| `--bg-base` | `#FAFAF7` | 暖纸白（工程制图纸，非冷白） |
| `--bg-sunken` | `#F0F0EC` | 页脚、输入井 |
| `--surface-1` | `#FFFFFF` | 面板 |
| `--surface-2` | `#F4F4F0` | hover 态 |
| `--hairline` | `rgba(22,24,27,0.10)` | 一级 1px 线 |
| `--hairline-strong` | `rgba(22,24,27,0.18)` | 表头线、section 分隔 |
| `--text-1` | `#1A1C1E` | 主文本（≈ 16:1） |
| `--text-2` | `#52565C` | 次文本（≈ 7:1） |
| `--text-3` | `#767B82` | 装饰读数（≈ 4:1，仅限非必读 micro） |
| `--accent` | `#9A6700` | 深赭金，文本级琥珀（对 bg ≈ 4.7:1，AA 正文可用） |
| `--accent-strong` | `#7A5200` | 11px mono-tag 等小字号琥珀（≈ 6:1 保险值） |
| `--accent-dim` | `rgba(154,103,0,0.10)` | 琥珀填充 |
| `--on-accent` | `#FFFFFF` | 琥珀实心块上的文字（仅 focus/极小面积使用实心琥珀） |
| `--focus-ring` | `rgba(122,82,0,0.9)` | 2px focus 环 |
| `--selection` | `rgba(154,103,0,0.16)` | 选区 |
| `--code-bg` | `#F4F4F0`；`--code-comment` `#767B82`；`--code-keyword` `#7A5200`；`--code-ident` `#1A1C1E`；`--code-punct` `#767B82` | 同 Dark 策略 |
| `--negative` | `#B3261E` | 语义错误色 |

### 4.4 Tailwind v4 落地（`@theme` 片段）

```css
@theme {
  --color-bg: var(--bg-base);
  --color-surface: var(--surface-1);
  --color-surface-2: var(--surface-2);
  --color-line: var(--hairline);
  --color-line-strong: var(--hairline-strong);
  --color-ink: var(--text-1);
  --color-ink-2: var(--text-2);
  --color-ink-3: var(--text-3);
  --color-signal: var(--accent);
  --color-signal-dim: var(--accent-dim);
  --font-sans: "Inter", "Noto Sans SC", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
}
:root { color-scheme: dark; }        /* .theme-light { color-scheme: light; } */
```

两套主题各自作为**被设计的整体**校准：Dark 的情绪是"熄灯实验室里点亮的读数屏"（对比靠发光的琥珀与三档灰阶），Light 的情绪是"白天图纸上的制图"（对比靠墨线与赭金批注）。禁止一套 + invert。

### 4.5 对比度纪律

- 所有**承载阅读**的文本只用 `text-1` / `text-2` / `accent`（各对背景 ≥ 4.5:1，已列数值）；
- `text-3` 与刻度装饰允许 3–4:1，但仅限 mono-micro 的索引号、旁注、坐标读数等非必读信息，屏幕阅读器场景下均为冗余信息；
- 琥珀做**文字**用 `accent`（Light 下用 `accent-strong` 于 <14px 场景）；做**灯**用 6px 圆点 + `accent`；两者永不放大成色块背景（`accent-dim` 填充除外，仅 hover/active 行底）。

---

## 5. Light / Dark Mode 策略

- **三态**：Light / System / Dark，默认 System；`localStorage` 持久化 + `prefers-color-scheme` 监听。切换器是导航右侧一枚**仪器拨档**：28×48px 分段控件，三档 `L · S · D`（mono-tag 字符，非太阳/月亮 emoji 图标），当前档位琥珀点指示。
- **切换体验（Signature 之二）**：使用 View Transitions API 的 **circular reveal 自拨档圆心扩散**（220ms，`clip-path` 过渡）——像拧亮/拧灭仪器照明；不支持的浏览器降级为 180ms 交叉淡入。切换动画期间禁止内容位移（token 驱动，无布局变化）。
- **两套情绪**：Dark 面向深夜研究者与开发者第一印象（默认首访若 System 为深色则先见 Dark——这是"仪器"最完整的形态）；Light 面向白天阅读与打印（印刷为纯黑白 + 赭金注释，层级完整成立）。
- 代码块、pipeline 图示、架构微图在两套主题下各出一份 token 映射，禁止截图式贴图。

---

## 6. 布局系统

### 6.1 网格

- 内容容器 **max-width 1120px** 居中；12 列，gutter 24px（移动 16px）；断点：`sm 480 / md 768 / lg 1024 / xl 1280 / 2xl 1440`；
- 常用非对称分栏：正文 col 1–8 + 旁注 meta 栏 col 9–12（meta 栏放 mono 读数与锚点，sticky）；
- 全站 8px 基线：所有垂直间距落在 4px 网格的偶数倍上。

### 6.2 间距节奏

| Token | 值 | 用途 |
|---|---|---|
| `sp-1 … sp-3` | 4 / 8 / 12px | 元素内（icon-text、dot-label） |
| `sp-4 … sp-5` | 16 / 24px | 条目内组距、行内 gap |
| `sp-6` | 32px | 条目间 |
| `sp-7` | 48px | 子块间 |
| `sp-8` | 64px | Section 内段落组距 |
| `sp-9` | 96px（移动 64px） | Section 上下 padding |
| `sp-10` | 128px | 首屏/结尾特殊呼吸位 |

### 6.3 Section 过渡

Section 之间用 `--hairline-strong` 全宽分隔线；**section header 是全站的识别件**：

```
[02] RESEARCH ────────────────────────────▏▏▏
```

- 左：mono-tag `02` 琥珀编号 + `title-1` 标题；中：hairline 延伸；右末端：**三枚 6px 刻度短线**（全站唯一成组刻度装饰，纯 CSS border）。
- 刻度装饰总量红线：每屏可见刻度 ≤ 3 组（section header、pipeline 图内、rail 进度），超出即删——本方案与 Swiss 海报方向的分界。

### 6.4 左缘索引轨（≥1440px 显示）

固定左侧 64px 竖条，右缘 hairline：竖排 mono-micro `R·LAB — 2026` 字标、8 个 section 索引点（当前 section 点为琥珀实心 + 右侧 2px 短线）、10 格滚动进度刻度（按滚动比例填充）。`IntersectionObserver` 驱动，纯 class 切换。<1440px 隐藏。

### 6.5 Log（Timeline 的重设计）

不做竖线节点简历轴。做成 **changelog ledger**：mono 表格流，每行 `2026.Q4 ─ began RAG robustness reading group`（时间戳 mono + 事件 Inter body-sm），按时间倒序，年份做 `display-2` 分隔大字。空内容时整个 section 不渲染（§12）。

---

## 7. 主要交互与动效

### 7.1 动效 token

| Token | 值 | 用途 |
|---|---|---|
| `dur-instant` | 90ms | 颜色/透明度反馈 |
| `dur-fast` | 160ms | hover、dot、边框 |
| `dur-base` | 240ms | 内容进入、FLIP |
| `dur-slow` | 400ms | dossier 展开 |
| `ease-std` | `cubic-bezier(0.2, 0, 0, 1)` | 全站默认（Linear 同款收敛曲线） |
| `spring-flip` | stiffness 340 / damping 34 | 仅 Relevance Lens 重排 |

进入动效唯一范式：内容块 `opacity 0→1 + y 8px→0`，240ms，同组 stagger 40ms、**总量封顶 3 层**；滚动进入用 `whileInView once`，viewport margin −12%。滚动本身永远不被动画打断。

### 7.2 常规交互

- **导航**：当前 section 的 mono 索引号转琥珀（scroll-spy）；hover 其他项 text-2→text-1（90ms）。桌面导航项带 mono 上标编号（`01 RESEARCH`），本身就是目录。
- **行 hover**：ledger 行底色→surface-2，左缘 2px 琥珀条 `scaleY 0→1`（160ms，transform-only），右侧 mono 读数（年份/Δ值）text-3→text-2。
- **状态点**：6px 圆点，`pulse` 关键帧（opacity 1→0.4→1，scale 1→1.15，2.4s ease-in-out，无限）；`prefers-reduced-motion` 下替换为静态点 + 1px 外环。
- **主题切换**：见 §5。
- 全站动效仅 transform / opacity / color，无 width/height/top 动画。

### 7.3 Signature Interaction ①：Relevance Lens（检索式重排）

**隐喻**：hover 一个项目 = 一次查询，其余条目像被检索引擎按相关性重排——把"检索→生成"的心智模型压缩进一次 hover。

**行为**：Selected Work ledger 上 hover 行 `P-03` 时——

1. 构建时预计算每对条目的相似度：`sim(a,b) = Jaccard(tags_a, tags_b)`（tags 来自数据文件，真实可计算，无伪造评分）；
2. 其余条目按 sim 降序 **FLIP 重排**（motion `layout`，spring 340/34，240ms，transform-only）；
3. 原 hover 行上浮至重排队列顶部相邻位并保持高亮；每行右侧淡入 mono 读数 `Δ 0.67`（160ms 延迟于重排）；
4. `sim = 0` 的条目压暗至 opacity 0.45——"无相关性"本身也是读数；
5. 移出 hover：一切复位（同曲线）。

**实现与性能**：

- 相似度矩阵构建时计算（6 条目 = 15 对，O(n²) 可忽略），运行时零计算；
- FLIP 只动 transform：`getBoundingClientRect` 前后差值 → translate，不触 layout；条目定高（88px 行 + 32px 间隙），无高度动画；
- **禁用条件**（全部写死）：触屏（`hover: none`）、`prefers-reduced-motion`、条目 >12（届时仅做高亮 + Δ 读数不重排）；
- 可访问性：重排仅是视觉层，DOM 顺序不变（用 `layout` 视觉重排而非 reorder DOM），键盘 Tab 顺序与屏幕阅读器顺序恒定；Δ 读数 `aria-hidden`（装饰性）。

### 7.4 Signature Interaction ②：Retrieval Palette（⌘K）

**隐喻**：站内搜索被实现成一台**诚实的迷你检索机**——这是本方案对"检索→生成"的第二处直接表达，也是 Lab EXP-03 的引擎。

- `⌘K / Ctrl+K` 或导航按钮打开居中 640px 面板（surface-1，hairline，radius 8px，无玻璃无阴影堆砌——一层 1px 边 + 24% 黑投影）；
- 输入即检索：**MiniSearch**（≈6KB gzip）+ 构建时从 `content/*.ts` 生成的索引（title/summary/tags/notes 全部入索引），**纯本地、零网络**；
- 结果最多 8 条，每条：`type` mono-tag（`PROJECT / NOTE / RESEARCH`）+ 标题 + 右对齐 mono 评分 `0.83`；面板底部常驻一行读数：`METHOD: LEXICAL · LOCAL INDEX · N=41 · 0ms NETWORK`——检索方法、语料规模、网络用量全部如实刻出（诚实是本方案的产品差异化）；
- 键盘完整：↑↓ 选择、Enter 跳转、Esc 关闭；ARIA combobox 模式，焦点圈闭；
- 性能：索引 JSON 与 MiniSearch 打成独立 chunk，首次 ⌘K 才加载（≈12KB gzip）；输入 debounce 80ms；结果渲染 `memo` 化，背景页面不重渲染。

---

## 8. Projects 展示方式：Ledger + Dossier（工程档案感）

**禁止三列卡片墙**。Selected Work 是一张**全宽工程台账（Ledger）**，每行一个项目：

```
P-03  ▎rag-eval-harness                    v0.4.1  ● ACTIVE      2026
      Evaluation harness for RAG pipelines under corpus corruption   ← body-sm，text-2
      RAG / EVALUATION / PYTHON                                     ← mono-tag 行
```

- 行结构（桌面 12 列）：`索引号 P-03`（mono，col 1）→ 项目名（title-2，col 2–6）→ 摘要一行（col 2–9，第二行）→ `版本号 v0.4.1`（mono-tag + hairline 小胶囊，右区）→ 状态点（● ACTIVE 琥珀 / ● MAINTAINED 空心 / ● ARCHIVED 灰）→ 年份（mono）；
- **点击展开 Dossier**（手风琴，全站同时最多展开一个）：400ms 高度过渡（grid-template-rows 动画，合帧不跳变），展开后为 surface-1 面板，内部 12 列分为：
  - **架构微图**（col 1–7）：SVG hairline 模块图，由数据驱动渲染——`flow: ["ingest", "index", "retrieve", "evaluate"]` 数组映射为 88×32px 模块框 + 箭头连线，mono 10px 标签；hover 模块显示其职责 tooltip；无 `flow` 字段则不渲染图（空内容策略）；
  - **模块拆解表**（col 8–12）：`MODULE / ROLE` 两列 mono 表，行间 hairline；
  - 元数据读数行：`ROLE` / `STACK` / `STATUS` / `REPO` / `DEMO`（缺省项显示 `—`，不显示"暂无"文案，保持读数语言）；
  - 案例研究正文（body-lg，66ch，可折叠二级）；
- 数据契约（内容全部来自文件，`sample: true` 标记示例条目并在站点 About 中一行声明"示例条目可直接替换"）：

```ts
// content/projects.ts
interface ProjectEntry {
  id: "P-03";
  title: string;            // "rag-eval-harness"
  summary: string;
  version: string;          // "v0.4.1"
  status: "active" | "maintained" | "archived";
  year: number;
  tags: string[];           // Relevance Lens 的相似度输入
  role?: string; stack?: string[];
  links?: { repo?: string; demo?: string };
  flow?: string[];          // 架构微图节点
  modules?: { name: string; role: string }[];
  caseStudy?: string;
  sample: true;
}
```

- Open Source 是同页的 sub-ledger：更窄行高（56px），仅 `id / repo 名 / mono 语言 tag / ★ 真实数（构建时拉取或静态填写）/ 最后提交年份`，未来可接 GitHub API 而版式不变。

---

## 9. Research 展示方式：Research Ledger

研究区让"兴趣 / 问题 / 实验"三个层次各自成为**读数**：

- **研究方向 ledger**（§2.2 关键词矩阵的完整版）：每条 = `R-01` 索引 + 方向名（title-2）+ 状态灯（`● ACTIVE` 琥珀脉冲 / `○ BACKGROUND` 空心灰）+ 一段 body 摘要 + `related: R-02, R-03` mono 交叉引用（来自 affinity 数据）。真实六个方向全部录入；
- **开放问题**：每条方向下挂 `Q-01 / Q-02` 编号问题列表（mono 编号 + body-sm 问题句），问题本身就是研究品味的展示，也是未来论文位的占位锚点；
- **实验表（Selected Experiments）**：真实 mono 数据表，列：`ID / QUESTION / SETUP / RESULT / STATUS`，行 hover 触发与 Work 一致的左缘琥珀条；`RESULT` 列允许 `—`（未出数）；
- **未来论文位**：每条方向预留 `outputs: []` 数组，有 paper/code/dataset 时自动在条目尾部渲染 `OUTPUTS` 读数行——**结构先于内容存在**，内容到来时版式零改动；
- 全区不使用任何"雷达图/能力环/百分比"——研究深度用文字与问题展示，不用仪表盘伪装。

---

## 10. Playground / Lab：「实验台」

**入口形态**：不是 blog 列表。Lab 区是一张仪器实验台：3 张 88px 的 EXP 行（与 Work ledger 同语言）：

```
EXP-01  Corruption Sandbox        ● READY     RUNS LOCALLY · NO API
        Knowledge poisoning 对检索排序的影响 —— 可动手的微型实验
```

点击进入实验页（或同页展开），每个 demo 是一个"仪器卡"：顶部 mono 标题栏 + 状态点，底部固定一行 `RUNTIME: LOCAL · DETERMINISTIC · v0.x` 读数。三个 demo 全部**离线可运行、确定性可复现**：

1. **EXP-01 Corruption Sandbox**：内置 12 篇玩具文档（数据文件，含预计算的 TF-IDF 向量）。滑杆调 injection rate（0–50%），前端按比例把无关文档注入语料，即时重算 top-5 检索结果：正常时排序合理，投毒升高后污染文档以琥珀边框标出"被检索到"。访客亲眼看到 knowledge poisoning 的作用——研究方向的可交互注脚。
2. **EXP-02 Chunking Explorer**：粘贴文本或选预设；拖 chunk size（128–1024）与 overlap（0–25%）滑杆，实时显示切块边界（色带可视化）+ 每块 token 计数（简单 tokenizer 估算，标注 `EST.`）。理解 chunking 的直觉教具。
3. **EXP-03 BM25 Playground**：把 Retreival Palette 的引擎反过来敞开——任选站内 query，展示每个词项对每条结果的**分数分解表**（term → score 贡献条，纯 mono 表格 + hairline 条形）。副标题：`this site's own retrieval, with the panel open`。三个 demo 共享一套 hairline + mono 读数语言，Lab 即整站设计哲学的展品。

---

## 11. 移动端方案（重新设计，非缩放）

- **导航**：顶栏 56px = 字标 `R·LAB` + 主题拨档（压缩为两点切换 L/D，System 收进抽屉）+ 检索 icon + 菜单键。菜单是**全屏索引抽屉**：顶部检索输入框（=Palette 移动形态），下方大号编号列表（`title-1` 级 `01 RESEARCH … 08 CONTACT`，44px 行高触达），底部 SYS 状态块两行摘要。无 bottom tab（内容型站点，顶栏 + 抽屉更符合阅读动线）。
- **首屏重排**：SYS 状态块收为 2 行（`BUILD / RECORDS`）；关键词矩阵改单列 3 行（hover 不存在于触屏 → 改为点击展开格内摘要 + affinity 高亮保留给再次点击）；**pipeline 图转竖排**（五段自上而下，连接线垂直，读数点仍然流动——移动端独有的"瀑布读数"构图）。
- **Work / Lab**：ledger 行改双行堆叠卡位（仍是全宽行，非卡片墙）；Dossier 改为 **bottom sheet**（拖把手、max-height 85vh、内部滚动、下滑关闭 240ms）；sheet 内左右 swipe 切换上/下一项目（移动端特有：把 ledger 变成可翻阅的档案夹）。
- **Relevance Lens 移动形态**：无 hover → 长按行（400ms）触发一次重排演示 + `Δ` 读数，或完全降级为展开时显示 `RELATED: P-01 Δ0.67` 文本行（rMD 友好）。
- **触达纪律**：全部命中区 ≥ 44×44px；mono-tag 在移动端不缩小（11px 保持）；左缘索引轨不渲染；section 刻度装饰移动端减为 2 枚。

---

## 12. 空状态策略

- **Publications（当前 0 条）**：section 照常渲染，header 完整；主体为——`PUBS — 0 RECORDS`（mono-tag）+ 一句克制文案 *"Selected research will appear here."*（body，text-2）+ **2 行 ghost 槽位**：hairline 描边的空行（高 72px，内容区 opacity 8% 的假行位 + 右端 `P-01 / P-02` 预留索引号，`aria-hidden`）。传达"这台仪器已校准，等待录入"，而不是"没做完"；
- **条件渲染**：`content/*.ts` 中每个模块带 `enabled: boolean`；空模块（如 Awards）直接不渲染 nav 与 section，nav 编号自动重排（编号是派生值不是手写常量）；
- **空值读数语言**：元数据缺项显示 `—`（读数语言），列表级缺项显示 `0 RECORDS`（台账语言），两者覆盖全站，禁止 "coming soon 🚀" 类文案；
- About / Contact 的 placeholder 用**显式可替换设计**：`profile.ts` 中字段值形如 `"TODO: your name"`，渲染时被检出的 TODO 字段显示为带虚线下划线的 mono 占位符并附 `title="edit content/profile.ts"`——占位符本身被设计成仪器面板上的"待接线路"端口。

---

## 13. 与其他 7 个方案的差异（我不是什么）

1. **Team A（Minimalism「单行本」）**：我不是纯文字构图——A 把装饰删到只剩排印与留白，我保留一整套仪器系统语言（状态灯、读数块、架构微图、可运行实验），表达材料是"读数与图示"而非"字号与灰度"；且 A 弃容器，我的 hairline 面板是刻意的。
2. **Team B（Editorial「学刊」）**：我不做 serif 刊物隐喻与 Volume/Issue 出版叙事——我的编目单位是 `v0.4.1 / P-03 / EXP-01`（版本与档案号，工程时序），不是期号（出版时序）；B 的签名是排印的文学性，我的签名是面板的机械性。
3. **Team F（Swiss「坐标纸」）**：我不做静态构成主义海报——F 的刻度、准星、鼠标坐标是**版面构图**，我的刻度全站 ≤3 组且全部服务于状态与流程（遥测而非测绘）；F 的红是平面设计的观点，我的琥珀是"指示灯"的语义；我没有十字准星、没有 outline 海报大字、没有实时坐标读数。
4. **Team H（Experimental「可检索的人」）**：我不把"站=检索系统"做成整体交互叙事装置——H 的实验性在"让检索行为被看见"的剧场感，我的两个 signature（Relevance Lens / ⌘K）是收敛的**实用工具**，默认静止、hover/快捷键才发生、每个都有传统出口；H 打破布局，我的布局是全站最纪律的部分。
5. **Team D（预设方向：暗色玻璃/辉光 AI 产品站）**：我严禁渐变辉光、玻璃拟态堆砌与粒子——我的"AI 感"来自工程档案与可运行实验，不来自发光的 landing page 视觉套路。
6. **Team E（预设方向：Neo-brutalism）**：我不做粗黑描边、硬阴影、高饱和撞色的反设计宣言——我的 hairline 是 8–18% 透明度的细线，克制本身就是宣言。
7. **Team G（预设方向：温暖人文/自然系）**：我不做大地色、插画与衬线温情——全站温度只允许出现在两处：Light 主题的暖纸白底，与琥珀信号灯；其余一切是仪器。

---

## 14. 风险与自我批评

1. **最大风险：mono 系统语言滑向"开发者终端模板味"**——这正是本方案要逃离的东西。执行红线：mono 文本占比 ≤10%；禁止绿字黑底、打字机动效、`$` 提示符、假日志滚动；语言气质是"仪器读数"（校准、克制）而非"黑客终端"（炫技）。评审若在任何一处看到 terminal cosplay，即为执行失败。
2. **琥珀被误读为 warning/error**：琥珀天然带警示联想。对策：语义严格锁定（只表活性/焦点/信号），表单错误用独立的 `--negative` 色；全站琥珀同时可见点 ≤2 个，杜绝"警报灯阵"。
3. **精密感 → 冷淡无人味**：仪器没有人味会像产品官网。对策：About 与 Notes 的**写作声音**承担全部人味（第一人称、具体、不吹捧）；Light 主题的暖纸白是第二重温度。若文案也写成机器腔，方案塌陷。
4. **数据自证若实现偷懒就变成"假仪表"**：SYS 块的每一行必须真实注入（构建时间戳、内容计数），pipeline 必须标注 `ILLUSTRATIVE`。一处假读数会摧毁整台仪器的信誉——这条写进实现验收标准。
5. **FLIP 重排的性能与眩晕风险**：条目多时重排=大面积位移。对策已内置（§7.3）：>12 条禁用、transform-only、hover-only、reduced-motion 禁用；且首帧不动画。
6. **空档案 + 极简 = "网站没做完"的观感**：ghost 槽位、`0 RECORDS`、`—` 占位必须与整站读数语言完全一致，且 About 中显式声明示例条目可替换。空状态是设计出来的，不是漏掉的。
7. **与 F/H 的区分度依赖执行纪律**：刻度多画一组就滑向 F，⌘K 写出叙事感就滑向 H。本文档的硬约束（刻度 ≤3 组、mono ≤10%、动效默认静止）就是防滑条——第二轮实现时必须逐条验收。

---

*Team C — Modern AI / Future · 「精密仪器」· generation_01 · 2026-10-05*
