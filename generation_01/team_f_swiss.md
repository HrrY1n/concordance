# Team F — Swiss / International Style：「坐标系统 / Coordinate System」

> 方向：Swiss Style 的当代转译。不是复刻 1950 年代海报，而是把**网格本身作为界面骨架与美感来源**——让暴露的 hairline、编号体系、非对称但严格对齐的版面，构成一个可以长期生长的个人数字档案。

---

## 1. 设计理念

**一句话灵魂：这个网站不是"页面"，而是一张被精确标注的坐标纸——所有内容都是登记在坐标系统里的条目，秩序本身即是美学。**

研究者的本质工作是建立索引、编号、引用与证据链。个人主页作为"长期数字档案"，最诚实的形态不是炫技的展示橱窗，而是一座**档案馆**：每个项目有档案号，每个 section 有编号，每条数据行可被检索、展开、追加。Swiss Style 提供的正是这套语言——网格、栅格坐标、编号体系、黑白灰 + 一点红。

### 三条设计原则

1. **网格是骨架，不是装饰（Grid as skeleton, not ornament）**
   网格线在关键位置可见（hairline），编号体系（00–08）贯穿导航、标题、动效。所有元素严格对齐到 8px 基线，但版面刻意非对称——留白集中在左侧"批注栏"，内容集中在右侧"内容栏"。
2. **一克红色，重于一斤灰（One gram of red）**
   全站只有黑白灰 + 一个瑞士红 accent。红色只出现在"需要被找到的地方"：当前 section 编号、hover 行的左缘规则线、坐标锚点方块、focus ring。红色出现的位置不超过视口内 3 处；任何地方禁止渐变、禁止阴影堆叠、禁止圆角（全局 radius: 0）。
3. **档案优先，表演其次（Archive over spectacle）**
   动效只有一个主角：网格自身的呼吸与重排（见 §7 signature interaction）。其余动效全部克制在 300ms 内、transform/opacity only、一次性进入。内容为空时不掩饰、不注水——空行也是表格里的一行，优雅地登记"暂无条目"。

---

## 2. 首页信息架构

### 首屏：构成主义排版构图（FIG. 00）

首屏 = 100vh（min-height 680px）的一整版"图版"。**禁止 "Hi, I'm XXX"**，文字主角是身份的坐标系表达。桌面端元素与位置精确如下（12 列网格，外边距 64px，gutter 24px）：

| 元素 | 位置 | 规格 |
|---|---|---|
| 顶部标尺（Top Ruler） | y: 0–32px，全宽，下缘 hairline | mono 11px 左端 `FIG. 00 — INDEX`，右端 `GRID 12×8 / BASELINE 8`；每 80px 一个 4px 刻度线，每 160px 一个 8px 刻度 |
| 左缘索引轨（Rail） | x: 0–56px（含在左边距内），右缘 hairline | 竖排（writing-mode: vertical-rl）mono 11px：`A LIVING DOCUMENT — v0.1`；下方 01–08 section 编号竖列 |
| 标注行 Row A | y: 12% | 左起 col 1：`COMPUTER SCIENCE — RESEARCH × ENGINEERING`（mono 12px, tracking +0.08em, 大写）；右对齐 col 12：`MODE: SYSTEM`（随主题状态变化） |
| 海报字 Row B | y: 22%–62%，占三行 | 行1 `RETRIEVAL` 起于 col 1；行2 `GENERATION` 起于 col 2（缩进 1 列），**outline 描边字**（-webkit-text-stroke 1.5px ink，fill transparent）；行3 `& SYSTEMS` 起于 col 3，其中 `&` 为红色。Poster 层级 T0，line-height 0.94，tracking -0.035em，三行 baseline 严格落基线网格 |
| 红色锚点方块 | col 8 左缘 × Row B/C 交界 | 16×16px 纯红方块；两条 hairline 十字准星贯穿整个首屏（垂直线在 col 8 左缘、水平线在 y: 62%），交点旁 mono 11px 标注 `C8 / R5` |
| 兴趣索引 Row C | y: 66% | mono 12px，单行点号分隔且各自是锚点链接：`01 RAG · 02 ROBUSTNESS · 03 KNOWLEDGE POISONING · 04 AI SECURITY · 05 LLM SYSTEMS`，hover 变红 |
| 底部状态条 Row D | y: calc(100vh−48px)–100vh，上缘 hairline，高 48px | 左：`SCROLL FOR INDEX ↓`（mono）；中：**live 坐标读数** `X:07 Y:03`（跟随鼠标更新整数格坐标，签名微交互，见 §7）；右：`45.46°N` 之类一律禁止（不编造位置），改为 `8-COL GRID ACTIVE` |

构图要点：三行大字逐行右移 1 列形成阶梯（构成主义的"斜向张力"），十字准星 + 红方块是整版的视觉支点，所有 hairline 与大字 baseline 对齐同一套 8px 网格——杂而不乱。

### Section 顺序与理由

首页纵向滚动顺序（编号即导航，锚点 `#s01`…）：

```
00 HERO（FIG. 00）          — 身份坐标 + 兴趣索引，30 秒讲清"这是谁、做什么"
01 Research                 — 研究者身份优先，先给智识画像再给作品
02 Selected Work            — 5 个 sample 项目（索引表，见 §8）
03 Lab / Playground         — 特色模块前置到中段：这是记忆点与差异化
04 Open Source              — 同索引表语法的简表，未来接 GitHub API
05 Publications             — 空状态即设计（见 §12），克制一行
06 Notes / Writing          — 3 篇 sample note 的登记表
07 Timeline                 — 编年登记表（非简历时间轴，见 §6）
08 Dossier（About + Contact）— 事实表 + 联系方式，收尾于页脚
```

理由：Research 放 01 是因为"研究者"是第一身份；Lab 提前到 03，让访客在注意力衰减点遇到可玩的差异化模块；About 后置是因为首屏的构成主义构图已经完成了自我介绍——文字简历式 About 前置只会稀释。

---

## 3. Typography

### 字体选择

| 角色 | 字体 | 理由 |
|---|---|---|
| Display / UI | **Inter Tight**（OFL 开源，variable） | Neue Haas Grotesk 的开源精神继承者：紧凑字幅、grotesque 骨架、大字号下 tracking 收紧后极接近 Helvetica 的密度，且 variable 版本便于字距光学微调 |
| Body（≤16px 正文） | **Inter**（同族正文光学尺寸） | Inter Tight 在小字号偏紧；正文回退到标准 Inter 保证可读性，两者骨架一致无缝混排 |
| Mono（数据/坐标/标签） | **IBM Plex Mono**（400/500） | 中性、有工程档案气质，用于编号、坐标、元数据、表格数字 |
| CJK | **Noto Sans SC**（400/500/700，unicode-range 子集化） | 中西文骨架兼容性最好的开源黑体；`font-feature` 与 `:lang(zh)` 微调 |

字体栈：`"Inter Tight", "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif`；mono 栈：`"IBM Plex Mono", ui-monospace, monospace`。加载策略：Inter Tight variable latin 子集 + Noto Sans SC unicode-range 切片，`font-display: swap`，关键两片 preload，总体 < 120KB（woff2）。

### 完整字号阶梯（桌面基线，移动端用 clamp 收缩）

| 级别 | 用途 | Size / Line-height | Tracking | Weight |
|---|---|---|---|---|
| **T0 Poster** | 海报大字（首屏） | `clamp(64px, 11vw, 152px)` / 0.94 | −0.035em | Inter Tight 600 |
| T0.5 Ghost | 批注栏幽灵编号 | 280px / 1 / outline，opacity 0.07，aria-hidden | −0.04em | Inter Tight 700 |
| T2 Display | 空状态宣言、Lab 入口标号 | `clamp(40px, 5vw, 64px)` / 1.05 | −0.03em | 600 |
| T3 Section Title | section 标题 | 32px / 1.2 | −0.02em | 600 |
| T4 H2 | 子标题、项目详情标题 | 24px / 1.3 | −0.015em | 600 |
| T5 H3 | 小标题 | 18px / 1.45 | 0 | 600 |
| T6 Body-lg | 导语、详情首段 | 17px / 1.7 | 0 | 400 |
| T7 Body | 正文 | 15px / 1.75 | 0 | 400 |
| T8 Caption | 图注、脚注 | 13px / 1.5 | 0 | 400, muted 色 |
| T9 Mono Label | 编号/坐标/标签 | 11px / 1.2 | +0.08em, 大写 | Plex Mono 500 |
| T10 Mono Data | 表格数据 | 13px / 1.6 | 0 | Plex Mono 400 |

行宽控制：拉丁正文 `max-width: 65ch`；中文正文 `max-width: 38em` 且 `line-height: 1.85`；混合段落 `:lang(zh)` 下 `letter-spacing: 0.01em`。数字一律走 mono 的 `font-variant-numeric: tabular-nums`（表格对齐关键）。

### Poster 层使用规范（何时用 / 何时不许用）

**允许（仅此 3 处）：**
1. 首屏 FIG. 00 的三行大字；
2. 404 / 错误页（`404 — COORDINATE NOT FOUND`，构成主义首屏的呼应）;
3. Ghost 编号层（T0.5，永远 outline + opacity ≤ 0.08 + aria-hidden，只做空间标注）。

**不许用：**
- 任何正文强调——强调用红色或 600 字重，绝不放大字号；
- 移动端首屏之外的任何位置（移动端 Poster 上限 72px，且最多 2 行）；
- 超过 2 行折行的动态内容（用户可控文本禁止进 Poster 层）；
- 链接、按钮、导航；全红填充的多行文字（红字只允许单词级）。

---

## 4. 颜色体系

黑白灰 + 一个瑞士红。无渐变、无阴影（层级靠 hairline 与 surface 明度差）。

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--bg` | `#FAFAF8` | `#121212` | 页面底色 |
| `--surface` | `#FFFFFF` | `#1B1B1A` | 表格 hover 行、展开面板、code 块外层 |
| `--surface-2` | `#F1F1EE` | `#232322` | 二级面板、Lab 画布 |
| `--ink` | `#141414` | `#F0F0EC` | 主文字（对比 16.6:1） |
| `--muted` | `#5F5F5C` | `#A3A39E` | 次级文字（对比 ≥ 6:1，AA） |
| `--faint` | `#8A8A86` | `#6E6E69` | 装饰性 mono 标注（≥3:1） |
| `--hairline` | `#E2E2DE` | `#2A2A29` | 暴露网格线、分隔线 |
| `--hairline-strong` | `#C9C9C4` | `#3A3A38` | 区块边界、表头线 |
| `--accent` | `#C8102E` | `#FF4B3E` | 瑞士红（Light 下对 bg 对比 5.9:1，Dark 下 5.7:1，正文级可用） |
| `--accent-hover` | `#9C0C24` | `#FF6B5F` | 交互态 |
| `--accent-ink` | `#FFFFFF` | `#140B0A` | 红底上的文字 |
| `--code-bg` | `#F1F1EE` | `#1D1D1C` | 行内/块代码底 |
| `--selection` | `rgba(200,16,46,.16)` | `rgba(255,75,62,.28)` | 选中文字（红系 selection 是品牌暗号） |
| `--focus` | `#C8102E` | `#FF4B3E` | focus-visible outline 2px, offset 2px |

工程落地：Tailwind v4 `@theme` 中以 CSS variables 注册上述 token，Light/Dark 仅切换 `:root` 变量值；红色永远通过 token 引用，禁止硬编码。

---

## 5. Light / Dark Mode 策略

- **Light = "白纸图版"**：接近制图纸的白（非纯白，`#FAFAF8` 防眩），hairline 为浅暖灰，红是印刷红（Pantone 485C 一族，`#C8102E` 偏深，保证白底可读）。情绪：白天的研究室、打印出来的档案。
- **Dark = "暗房描图"**：不是黑白反转——底色带一丝暖（`#121212`/`#1B1B1A`），ink 是暖白（`#F0F0EC` 而非 `#FFF`，防刺眼），红提亮为 `#FF4B3E` 保持对比。hairline 在暗色下比 Light 下相对更亮一档，**暴露网格在 Dark 下反而更清晰**——这是两套模式各自的性格：白天网格退后，夜晚网格浮起。
- 切换体验：三态（Light/Dark/System）持久化；切换瞬间所有 hairline **红色脉冲一次**（160ms 亮到 accent 再回落，见 §7），作为"状态已改变"的确认反馈；颜色过渡 200ms，布局零位移（网格位置两套完全一致）。

---

## 6. 布局系统

### 网格规格

| 断点 | 列数 | 外边距 | Gutter | 说明 |
|---|---|---|---|---|
| ≥1600px | 12 | 96px | 24px | 网格线全暴露 |
| 1024–1599px | 12 | 64px | 24px | 默认桌面 |
| 768–1023px | 8 | 32px | 20px | 平板 |
| <768px | 1 | 20px | — | 单列 + 左脊线（见 §11） |

基线 8px：所有 padding/margin/行高取 8 的倍数（正文行高除外，服从可读性）。

### 版面语法：批注栏 + 内容栏（核心）

桌面端每个 section 分为两个纵向分区：
- **批注栏（cols 1–3）**：section 大编号（T2 级 mono 或 ghost 大字）、竖排 section 名、坐标标注、图表注——这是 Swiss "margin as canvas" 的当代转译；
- **内容栏（cols 4–12，约 75% 宽）**：全部阅读内容，起始于 col 4。

这套双区语法让全站**天然非对称但严格对齐**：批注栏永远有内容（编号、注记、图表编号），左侧从不空得尴尬；内容栏行宽可控。

### Section 过渡与 header 模式

每个 section 顶部：全宽 `--hairline-strong` 边界线 → 96px padding-top → header 块（高 96px）：左起 col 1 大编号 `01`（T2，红或 ink）+ col 4 起 T3 标题 + 右对齐 col 12 mono 副注（如 `TABLE 02 — SELECTED WORK / 5 ENTRIES`）→ 48px 后进入内容。exposure 分两档密度：
- **全暴露**（hero、Lab、section header）：竖向 hairline 可见；
- **低暴露**（正文阅读区）：只保留 section 边界线与左脊线，正文列内不画竖线——暴露网格绝不横穿正文行宽，避免干扰阅读。
- Timeline（07）不用竖线圆点轴，而是**编年登记表**：`YEAR(mono) | TYPE(EDU/RES/PRJ 小标签) | EVENT`，逐年一行，底部 hairline——档案感，且未来 5 年加行不变形。

---

## 7. 主要交互与动效

### Signature Interaction：「Grid Breathing / 网格呼吸」（含信息功能）

**触发**：IntersectionObserver 判定 active section 变化（或路由切换）。
**行为**（总时长 480ms，ease `cubic-bezier(0.16,1,0.3,1)`）：
1. 该 section 区域内的水平 hairline 逐条 `scaleX 0→1`（origin-left），垂直线 `scaleY 0→1`，每条 stagger 24ms——像坐标纸被逐笔画出；
2. 左缘 Rail 上当前编号由 ink 变红，旁边 8px 红方块滑入；
3. 批注栏浮现 Ghost 编号（T0.5 outline），交叉淡入 200ms；
4. 离开的 section：hairline `opacity 1→0.4` 退隐，Ghost 编号淡出。

**信息功能**：这不是装饰——它是"你在档案的哪一层"的空间反馈（类似 PDF 阅读器高亮当前页的坐标纸版本），同时让"网格是活的系统"这一理念被身体感知。实现上全部为 transform/opacity（hairline 用绝对定位 div 的 border，不做 boxShadow），`prefers-reduced-motion` 下退化为 150ms 交叉淡入淡出、零位移。

### 其余交互（全部 ≤ 300ms，transform/opacity only，一次性进入）

- **Hero 坐标读数**：鼠标在首屏移动时，底部状态条 `X:07 Y:03` 实时更新为鼠标所在网格单元的坐标（列 01–12 / 行 01–09）；红色锚点方块在 hover 交点时放大到 20px。功能：教会访客"本站一切按坐标组织"，并让首屏对鼠标有生命感。触屏/键盘下显示最后已知坐标，静止即可，不算动效。
- **滚动进度标尺**：顶部标尺左端有一段 2px 红色线段随滚动增长——scroll progress 被翻译成"测量了多少"，与标尺隐喻完全同构。
- **进入动画**：每个 section 内容子元素 stagger 40ms、`translateY(8px)+opacity` 300ms，仅在首次进入视口时播放一次。
- **主题切换**：hairline 红脉冲 160ms + 颜色 200ms 过渡（§5）。
- **链接 hover**：文字链接下划线 `text-underline-offset: 3px`，hover 变红；无下划线浮层、无弹跳。
- 全站尊重 `prefers-reduced-motion`：所有位移动效替换为 opacity 过渡；坐标读数保留（非运动）。

---

## 8. Projects 展示方式：档案索引表 + 行内展开

**禁止卡片墙。** Selected Work 是一张"项目登记总表"（TABLE 02），档案式结构 = 目录页（索引表）+ 即时展开的图版页（详情面板）。

### 索引表行设计（桌面）

5 列，行高 72px，行间仅 hairline（无斑马纹），所有数字 `tabular-nums`：

| 列 | 内容 | 对齐 | 字体 |
|---|---|---|---|
| No. | `01`–`05` 档案号 | 左，列宽 64px | T9 mono 500 |
| Title | 项目名 | 左 | T4 600 |
| Year | `2025` | 右对齐，固定宽 | T10 mono |
| Role / Tags | `HARNESS · EVAL · PY` | 右对齐 | T9 mono, faint |
| [+] | 展开指示 | 右缘，列宽 48px | mono `+` / `−` |

**Hover 行为**（整行可点，行是 `<button>`）：行底色 `--surface`、档案号变红、行左缘 3px 红色规则线从 0 生长到 24px（160ms）、Title 右移 8px、`[+]` 变红——五件事同时发生但位移总量小，克制而确定。**键盘**：Tab 逐行聚焦（focus-visible 红 outline），Enter 展开，`aria-expanded` / `aria-controls` 完整。

### 展开详情（图版页）

点击行，下方插入 320–420px 高的展开区（高度动画 320ms，reduced-motion 时直切）：
- cols 4–7：T6 导语 + T7 描述（2–3 句，写"做了什么、遇到什么问题"）；
- cols 7–9：mono 元数据小表（YEAR / ROLE / STACK / STATUS / REPO→`GITHUB` / DEMO→`LINK`，全部 config 占位）；
- cols 9–12：图版位——**带 hairline 边框的图/示意/终端截图**，图注 T8：`FIG. 02-A — Architecture sketch (placeholder)`。
- 展开时该行左侧红规则线保持点亮，Ghost 编号 `01` 在批注栏亮起。

同一索引表语法复用于 Open Source（04，列：Repo/Lang/Updated）与 Notes（06，列：Date/No./Title/Tags），形成全站统一的"表 = 内容"语言。Sample 数据 5 条均带 `sample: true`（如 `01 RobustRAG Harness — retrieval corruption 评测脚手架`、`02 PoisonBench — 知识投毒攻防 benchmark 脚手架`、`05 This Site — 本站自身`），只描述过程与能力，不声称发表或获奖。

---

## 9. Research 展示方式

Research（01）用"问题登记表 + 实验数据表"呈现，让兴趣与问题显得像正式研究议程：

- **兴趣总表（R-INDEX）**：5 行，同索引表语法，档案号 `R-01`–`R-05`：RAG / RAG Robustness / Knowledge Poisoning / AI Security / LLM Systems。每行展开后给出：一句定义（T6）+ 2–3 个 **Research Questions**（以 `Q:` 前缀 mono 排版，如 `Q: 检索库中多少比例的投毒文档会使生成答案被系统性误导？`）——问题比结论更能定义一个研究者。
- **Selected Experiments**：2 个 sample 小实验，以"数据表 + 一张 hairline 图版"呈现（如一张 chunk-level 污染率 vs. 答案错误率的极简表格，mono 数字，表头 hairline-strong），明确标注 `SAMPLE — 替换为真实实验`。实验数据用表格而非花哨图表，符合档案气质；若未来加图，图版统一 `FIG. R-x` 编号。
- **未来 paper 挂载点**：Publications（05）与 Research 共用条目 schema（`id/title/venue/year/links/dataset/code`），将来论文直接以 R-编号交叉引用出现在 Research 行内（`→ P-01`），形成档案间的引用链。

---

## 10. Playground / Lab 概念

**入口形态**：Lab（03）是全站唯一"全暴露网格"的常驻区，`--surface-2` 底色标示"实验场"。入口不是文章列表，而是一张 Lab 登记表：`P-01 / P-02 / P-03`，每行右侧标 `OFFLINE · DETERMINISTIC`（可离线运行、结果确定性）。点击进入全宽工作台版面：左侧批注栏放说明（T7 + mono 注记），右侧 8 列是交互画布。

三个 demo（全部纯前端、零 API、数据打包在 bundle 中）：

1. **P-01 Poison the Corpus**：固定 8 篇关于一个虚构事实的小语料；用户以 checkbox 勾选投毒 1–2 篇文档，界面即时展示 top-k 检索排序变化 + 按模板拼装的"生成答案"如何被带偏；右侧红/灰方块矩阵显示每篇文档的检索得分。把主人公的研究方向（知识投毒）变成一个 30 秒可感的装置。
2. **P-02 Chunk & Rank Explorer**：滑杆调节 chunk size / overlap，画布按基线网格渲染固定文档的切块边界（hairline 分割），下方用预计算向量展示某 query 的 top-3 检索结果如何随切块策略变化——理解 RAG 的最小交互课。
3. **P-03 Token Budget Simulator**：堆叠条形（网格色块，非渐变）演示 context window 预算分配：system / retrieved / history / answer 各占多少 token，拖动滑杆看比例实时重排。工程感强、实现极简。

Lab 的深层作用：即使论文列表为空，这里证明"这个人真的动手"，且每个 demo 都直接对应其研究兴趣。

---

## 11. 移动端方案（<768px：单列秩序，不丢体系）

**原则：暴露网格不是被删掉，而是退化为一根"脊线"。**

- **左脊线（Spine）**：屏幕左缘 20px 处一根贯穿全页的 1px hairline，其上有一个 8px 红色 tick 随滚动移动到当前 section 的相对位置（transform only）——12 列坐标纸塌缩成 1 根轴，但"按坐标组织"的体系感、位置感完整保留。所有 section 编号 `01`–`08` 以 mono 前缀保留在每个标题前，这是移动端体系感的最小载体。
- **导航**：顶部固定条（高 48px，hairline 下缘）：左 `FIG.00 →` 回首页，右主题切换；再点 `INDEX` 打开全屏目录 overlay——Swiss 目录页：01–08 大编号 + 标题（T2/T3 级），mono 数字红色，点击跳转。不用汉堡菜单图标（画一个抽象符号不如直接写 `INDEX` 这个词）。
- **内容优先级**：Hero 海报字 clamp 到 56–72px、最多 2 行（`RETRIEVAL` / `& SYSTEMS`，`GENERATION` 移入标注行），十字准星与坐标读数简化为一条水平线 + 红方块；Row C 兴趣索引换行成两行仍保留编号；Row D 状态条只留 `SCROLL ↓` + 主题态。
- **索引表 → 堆叠行**：行高 88px 两行制：第一行 `01 RobustRAG Harness`（编号红点规则保留），第二行 mono `2025 · HARNESS · EVAL`；展开为行内全宽面板，图版满宽带 hairline 框。触摸目标全部 ≥ 44px；hover 五联反馈在移动端映射为按压态（`:active`：左红规则线 + 编号变红）。
- **移动端特有体验**：脊线 tick 的滚动跟随（桌面没有的"位置感"补偿）；目录 overlay 的编号逐条 stagger 滑入（240ms，一次性）；bottom 标尺刻度改为页面锚点吸附点。

---

## 12. 空状态策略

空内容是一等公民，语法与满内容完全一致——**空 = 表格里的一行，不是一块留白**：

- **Publications（05，永久优雅空）**：表头照常（YEAR/VENUE/TITLE/TYPE），表格体只有一行：档案号列 `P—`（红），TITLE 列一句 T2 级宣言 `Selected research will appear here.`，其余列 `—`。下方 mono 脚注 `// auto-renders from content/publications.ts — add entries to populate`。表格骨架在，没有"未完成感"，只有"待归档感"。
- **Awards / 无内容模块**：`content/*.ts` 中条目为 0 且未标记 `keep: true` 的 section 整个不渲染，导航编号**自动重排**（01–06 而非跳号）——编号系统是数据驱动的，这本身就是 Swiss 方案对"内容会长"的回答。
- **图片占位**：图版位未放图时显示 hairline 框 + 对角交叉线 + mono `FIG. 02-A — PENDING`（工程制图的待标注符号，不是灰色渐变块）。
- 所有 sample 数据带 `sample: true`，前端在该行 meta 里渲染一个小红点 + `SAMPLE` 标签，诚实且可一键检索替换。

---

## 13. 与其他 7 个方案的差异（"我不是什么"）

- 我不是**复古瑞士海报模仿**——不出现倾斜文字、不出现海报纹理与做旧印刷感，网格是工程图不是艺术品。
- 我不是**新粗野主义（Neo-brutalism）**——不玩粗黑边框、硬阴影和撞色色块；我的线是 1px hairline，不是 3px 黑框。
- 我不是**暗黑极客终端风**——不用满屏 mono 大段落、扫描线与荧光绿；mono 只承担数据与标注，正文是 grotesque。
- 我不是**渐变光晕 / Aurora 科技风**——全站零渐变、零发光、零粒子；红是印刷色不是霓虹。
- 我不是**玻璃拟态 / 3D 场景风**——无模糊、无投影、无景深；层级只靠明度差与线。
- 我不是**日式侘寂极简（大量氛围留白）**——我的留白是结构性的（批注栏），并且总被编号、坐标、hairline 精确标注，不是情绪性的空。
- 我不是**杂志编辑风（大衬线 + 图文编排）**——不用衬线、不做图文绕排；所有内容以"登记表"而非"文章版面"出现。
- 最想被偷走的三个点：**Hero live 坐标读数**（教访客读网格）、**空状态 = 表格中的一行**（空内容的一等公民语法）、**主题切换时 hairline 红脉冲**（用品牌线做状态确认）。

---

## 14. 风险与自我批评

1. **冷、像设计工作室官网，个人温度不足**——最大风险。对策：展开详情的导语用第一人称写作、Notes 保留手写式短句、Dossier 的事实表里留一行 `CURRENTLY`（现在在做什么）这类"活人字段"。
2. **暴露网格被误读为"线框图/未完成"**——hairline 密度必须分档（全暴露/低暴露），正文区绝不画竖线；hairline 对比度经过控制（#E2E2DE）处于"看得见但不抢戏"区间。
3. **红色用多即俗**——红一多就变成品牌 logo 模板。硬性预算：单视口红色元素 ≤ 3 处（当前编号 / hover 线 / 锚点方块）。
4. **索引表语法在 8 个 section 重复，可能单调**——对策：图版页的展开区承担节奏变化（Work 有图、Research 有数据表、Lab 全暴露网格），表格是骨架不是全部。
5. **中西文混排的字距陷阱**——`tracking −0.035em` 只应用于拉丁 Poster 层，`:lang(zh)` 必须回正为 0–0.01em，否则中文发紧；Noto Sans SC 子集加载失败时的 fallback 行高跳动需要 `size-adjust` 调校。
6. **移动端信息密度**——档案表在 375px 宽度下列全砍，只靠两行堆叠，若项目标题过长会破行；标题 T4 在移动端降到 20px 并 `text-wrap: balance`。
7. **性能**——大量 hairline 若用 box-shadow/多 div 会拖累重绘；实现规定：网格线用 `border` + 绝对定位容器，动效仅 transform/opacity，Lab 画布与图版图片 lazy load。
8. **评委视角的"设计感 > 内容感"**——严格的系统可能让招聘者觉得"这是个作品集展品而不是人"。对策：Dossier 与 Notes 的文字量与语气保证"研究者本人"在场；首屏大字内容写的是研究方向而非设计宣言。

---

## 附：工程落点（Tailwind v4 / motion / content schema）

```css
@theme {
  --color-bg: var(--c-bg); --color-ink: var(--c-ink); --color-accent: var(--c-accent);
  --font-display: "Inter Tight", "Inter", "Noto Sans SC", sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  /* Light/Dark 由 :root 与 [data-theme="dark"] 切换变量值，radius 全局 0 */
}
```

```ts
// content/projects.ts —— 每条数据一个档案号，改数据即改页面
{ id: "01", title: "RobustRAG Harness", year: 2025, role: "SOLO",
  tags: ["HARNESS", "EVAL"], repo: "TODO_GITHUB_URL", demo: null,
  sample: true, summary: "…" }
```

组件清单：`<GridLines density>`、`<SectionHeader no title meta>`、`<IndexTable rows columns>`、`<GhostNumber n>`、`<CoordinateHero>`、`<ThemeToggle three-state>`。导航编号由内容配置自动生成（§12），新增 section 不需要改导航代码。
