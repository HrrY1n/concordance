# Team G — Dark Premium：「暗室与晨光 / The Dimmer Room」

> 一句话灵魂：把整个网站当成一间**只装了一盏灯的展厅**——Dark Mode 是打烊后的夜展，一束钨丝灯打在展品上；Light Mode 是清晨拉开幕布后的同一间展厅，阳光落在暖纸墙上。层级不靠阴影堆砌，靠**材质**（surface 抬升、发丝线、玻璃内侧高光）说话；光是一次**事件**，不是持续装饰。

## 0. 种子约束的落点（自检表）

| 种子约束 | 本文落点 |
|---|---|
| 非纯黑深色体系 + 材质层级 | §4.1 暖石墨「Ink」体系（#131110 基底，带 28° 色温），elevation = surface 提亮 + inner hairline 高光，浮动层才允许阴影 |
| Light 为「暖纸与晨光」对位设计 | §4.2「Paper」体系（#F5F0E7 暖纸），elevation 方向反转（更白更亮 + 暖色软阴影），非反色 |
| 单光源叙事首屏 | §7.3「First Light」：加载时一次灯光呼吸 + H1 一次光泽扫过，1.6s 内结束，compositor-only |
| Dark 下图片/图表规范 | §4.4 图片压亮规范 + §4.5 双主题图表 token |
| 主题切换 = 环境光过渡 | §7.4「Dimmer Switch」：以切换钮为圆心的光圈扩张（View Transitions API + 降级链） |
| Projects 展柜感 | §8「Vitrine」舞台式大图版式，禁卡片墙 |

---

## 1. 设计理念

高端音频品牌（Devialet、Naim、B&O）与顶级开发工具营销站（Linear、Vercel）共享同一套视觉语法：**近乎单色的材质、精确的发丝线、克制的金属色点缀、把产品当展品打光**。本方案把这套语法移植到研究者个人主页：研究项目是展柜里的展品，研究问题展墙上的铭牌，Playground 是一排仪器机架。深度感全部来自材质的三种手段——**surface 抬升**（Dark 下逐级提亮，Light 下逐级变白）、**inner hairline**（1px 内侧高光/暗线模拟物体边缘受光）、**极低透明度 surface 叠加**——阴影只保留给真正悬浮的浮层。首屏只允许发生一次「开灯」事件；此后光不再是动画，而是状态。

**三条设计原则：**

1. **材质先于色彩（Material before Color）**：任何层级问题先问「它离光源多远」，用 elevation + hairline 回答；禁止用彩色、阴影数量、模糊半径表达层级。全站主色只有一个（黄铜/古铜 Brass），且只出现在「可交互」与「铭牌」上。
2. **单光源纪律（One Light at a Time）**：每个视口同一时刻至多一个主动光效；首屏的 First Light 每会话只播一次；图片的提亮、focus 环、hover 光泽共享同一套光源逻辑——**光跟随注意力，而不是自行表演**。
3. **内容即展品（Exhibit, Not Dashboard）**：排版承担奢华感——衬线大标题 + 中性正文 + 等宽铭牌字的三声部体系；所有模块有「铭牌/规格表/展柜」的博物馆隐喻，但没有一处真的画成博物馆插画风。

---

## 2. 首页信息架构

**首屏（Hero）放什么：** 无头像、无大图。左对齐三行结构——mono eyebrow 一行：`CS · RESEARCH × ENGINEERING`；衬线 display-1 主标题（占位文案，写进 `content/profile.ts`，可替换）：*Making language models retrieve what matters.*；正文一段（subhead 字号）：*Graduate researcher working on Retrieval-Augmented Generation — robustness, security, and the systems that make retrieval trustworthy.*（此句描述真实研究方向，不编造身份）。右下角一个安静的 mono 规格铭牌（Reading List 式）：六行真实研究兴趣关键词（RAG / RAG Robustness / Knowledge Poisoning / AI Security / LLM Systems / Retrieval–Generation Interaction），行间发丝线分隔。首屏底部一条 hairline + 向下箭头（可聚焦，回车滚到第一 section）。First Light 动效见 §7.3。

**Section 顺序与理由：**

1. **Hero** —— 身份定调，唯一的光事件。
2. **Research**（`01`）—— 研究者身份先于作品：三个研究关键词大字 + 一段 current work。放在 Work 之前是因为本站第一受众是学术/研究视角评委与同行。
3. **Selected Work**（`02`）—— 紧接着用两个精选 Vitrine 证明执行力（完整列表在子页/下方折叠入口）。
4. **Playground 预告带**（`03`）—— 全宽色带打断阅读节奏，作为「实验室入口」的橱窗，是记忆点也是差异化。
5. **Publications**（`04`）—— 刻意放在中段而非末尾：优雅空状态本身是一种宣言（见 §12），藏起来反而心虚。
6. **Notes / Writing**（`05`）—— 两篇 sample，证明持续写作。
7. **Open Source**（`06`）—— 表格式清单，非卡片。
8. **Timeline**（`07`）—— 台账式，非时间轴（见 §9.3）。
9. **Contact / Colophon**（`08`）—— 页脚收束，含 colophon（本站字体/技术栈说明，呼应「规格表」语言）。

理由：身份（1–2）→ 证据（3–4）→ 学术诚意（5–6）→ 工程诚意（7）→ 时间纵深（8）→ 联络（9）。每个 section 用 mono 编号 eyebrow（`02 — Selected Work`）+ 顶部 hairline 开场，编号即导航锚点。

---

## 3. Typography

**选择与理由：**

- **Display：Fraunces**（Google Fonts 变量字体，用高 optical size 轴 `opsz 144`、wght 340–420、SOFT=0 WONK=0）。高对比衬线在大字号下有奢侈品级的锋利细笔画，与常见开发者站的 Inter/Space Grotesk 单声部拉开差距；变量字体只加载一个文件。
- **Body/UI：Inter**（变量，wght 400–600）。中性、x-height 高，暗底长文可读性最佳；`font-feature-settings: "cv05" 1, "ss01" 1` 收敛字形。
- **Mono/铭牌：IBM Plex Mono**（wght 400/500）。比 JetBrains Mono 更「仪器面板」，用于 eyebrow、编号、spec 表、代码。

**字重：** Fraunces 340（display-1）/ 380（display-2）/ 420（h3）；Inter 400（body）/ 500（emphasis、按钮）/ 600（h4、导航）；Plex Mono 400 / 500（eyebrow）。

**字号阶梯（root 16px，完整 token）：**

| token | 字号 | 行高 | 字距 | 字体 | 用途 |
|---|---|---|---|---|---|
| display-1 | clamp(2.75rem, 1.5rem+5vw, 4.75rem)＝44–76px | 1.05 | −0.02em | Fraunces 340 opsz144 | 首屏主标题 |
| display-2 | clamp(2rem, 1.4rem+2.5vw, 3rem)＝32–48px | 1.1 | −0.015em | Fraunces 380 | 项目标题、章节大字 |
| title | 1.5rem/24px | 1.25 | −0.01em | Fraunces 420 | h3 |
| heading | 1.25rem/20px | 1.3 | −0.005em | Inter 600 | h4、模块标题 |
| subhead | 1.125rem/18px | 1.65 | 0 | Inter 400 | 副标题、导语 |
| body-lg | 1.0625rem/17px | 1.7 | 0 | Inter 400 | About/Research 正文 |
| body | 1rem/16px | 1.7 | 0 | Inter 400 | 默认正文 |
| body-sm | 0.875rem/14px | 1.6 | 0 | Inter 400 | 辅助说明 |
| caption | 0.8125rem/13px | 1.5 | 0.005em | Inter 500 | 图注 |
| label-mono | 0.6875rem/11px | 1.2 | 0.12em, uppercase | Plex Mono 500 | eyebrow、铭牌 |
| body-mono | 0.8125rem/13px | 1.5 | 0 | Plex Mono 400 | spec 表 |
| code | 0.875rem/14px | 1.7 | 0 | Plex Mono 400 | 代码块 |

**行宽控制：** 正文 measure 62–68ch（约 620–660px 容器）；display-1 允许突破正文栅格至 10 列；代码块 measure ≤ 80 字符。

**中英文兼容：** 站点主语言英文（学术惯例）。字体栈：`Fraunces, "Noto Serif SC", "Source Han Serif SC", serif` 与 `Inter, "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif`——中文回退到系统黑体/宋体，**不打包中文 webfont**（子集化成本不值）。中文出现在 Notes 偶尔段落与 placeholder 注释时：行高统一 1.7 已兼容 CJK；`label-mono` 遇中文时取消 letter-spacing 与 uppercase（`:lang(zh)` 覆写 `letter-spacing: 0.02em; text-transform: none`），避免汉字拉字距的发糊感。标点：中文段落启用 `text-autospace`/手写间距规范暂不做，交付实现阶段用 `pangu` 后处理可选开关。

**加载策略：** `font-display: swap`；Fraunces/Inter/Plex Mono 只加载 latin 子集（Google Fonts `text=`/unicode-range 自动子集）；预加载 Fraunces wght 轴一个文件。FOUT 期间 display 文本以系统 Georgia 兜底，尺寸已锁定无 CLS。

---

## 4. 颜色体系

### 4.1 Dark（默认，First Paint 即 Dark-preferred；无偏好用户也默认 Dark——这是本方案的立场）

基底是**带色温的暖石墨**（色相约 28°，饱和度 4–6%），不是蓝黑也不是纯黑：灯是钨丝灯，房间就该带一点暖。

| token | hex / value | 语义 |
|---|---|---|
| `--bg-page` | `#131110` | 页面基底（暖近黑，L≈7%） |
| `--bg-deep` | `#0E0D0C` | 页脚 / Hero 光晕的更深基底 |
| `--surface-e1` | `#1A1815` | 抬升一级：导航滚动态、Playground 色带 |
| `--surface-e2` | `#201D19` | 抬升二级：悬浮卡、下拉、代码浮层 |
| `--surface-e3` | `#272420` | 抬升三级：modal、command palette |
| `--surface-inset` | `#171512` | 凹陷：代码块、spec 表底 |
| `--hairline` | `rgba(237,232,225,0.07)` | 默认发丝线 |
| `--hairline-strong` | `rgba(237,232,225,0.14)` | 分区线、表格线 |
| `--inner-highlight` | `rgba(255,255,255,0.045)` | 顶边内侧高光（vitrine 玻璃反光） |
| `--text-primary` | `#EDE8E1` | 主文本（灯下暖白） |
| `--text-secondary` | `#A9A299` | 次级文本 |
| `--text-muted` | `#6F6961` | 弱化文本、图注 |
| `--text-faint` | `#4A453F` | 禁用、占位符 |
| `--accent` | `#C2A165` | 黄铜主色：链接、focus、铭牌编号、图表首序列 |
| `--accent-hover` | `#D6BC85` | hover 提亮一档 |
| `--accent-subtle` | `rgba(194,161,101,0.12)` | 黄铜薄涂：选中行底、tag 底 |
| `--selection-bg` | `rgba(194,161,101,0.30)` | 选区 |
| `--code-*` | comment `#6F6961` / keyword `#C2A165` / string `#9BA87A` / func `#C98F6B` / number `#B0755F` / punct `#A9A299` / default `#EDE8E1` | 代码 token（全部走暖系，禁蓝紫） |
| `--status-ok/warn/err/info` | `#8BA888` / `#C9A66B` / `#C4796B` / `#7E8CA0` | 状态色（低饱和，仅 Playground readout 使用） |
| `--focus-ring` | `#D6BC85` | focus-visible 2px, offset 3px |

**材质层级规则（Dark）：** e1 = 背景 +1 档亮度 + `inset 0 1px 0 var(--inner-highlight)`；e2 = 再 +1 档 + 1px `--hairline` 边框 + 顶边 inner highlight；e3（真正悬浮）= e2 底 + **唯一允许的阴影** `0 24px 48px -24px rgba(0,0,0,0.55)`。禁止在静态内容块上叠多层阴影。

### 4.2 Light ——「暖纸与晨光」（对位设计，非反色）

情绪：清晨的纸面展厅——底色是**未漂白的暖纸**（不是 #FFF），文字是**暖墨**，主色降为**深古铜**保证对比度。elevation 逻辑反转：层级越高**越白越亮**（像被晨光照到的纸堆顶层），并用带暖色相的软阴影替代 Dark 的 inner-highlight 提亮。

| token | hex / value | 语义 |
|---|---|---|
| `--bg-page` | `#F5F0E7` | 暖纸基底 |
| `--bg-deep` | `#EFE8DC` | 页脚更深纸色 |
| `--surface-e1` | `#FAF6EF` | 抬升一级（更白） |
| `--surface-e2` | `#FDFAF4` | 抬升二级 |
| `--surface-e3` | `#FFFEFB` | 抬升三级（最白） |
| `--surface-inset` | `#ECE4D6` | 凹陷（代码、spec 表） |
| `--hairline` | `rgba(52,42,28,0.14)` | 暖墨发丝线 |
| `--hairline-strong` | `rgba(52,42,28,0.26)` | 分区线 |
| `--text-primary` | `#221D15` | 暖墨 |
| `--text-secondary` | `#5A5244` | 次级 |
| `--text-muted` | `#877E6C` | 弱化 |
| `--text-faint` | `#B0A794` | 禁用 |
| `--accent` | `#8A6A2E` | 深古铜（对 #F5F0E7 对比度 ≈ 5.6:1） |
| `--accent-hover` | `#6E5322` | hover 压深 |
| `--accent-subtle` | `rgba(138,106,46,0.10)` | 黄铜薄涂 |
| `--selection-bg` | `rgba(138,106,46,0.20)` | 选区 |
| `--shadow-e1` | `0 1px 2px rgba(86,68,40,0.07)` | 一级软阴影 |
| `--shadow-e2` | `0 2px 10px -2px rgba(86,68,40,0.10), 0 1px 2px rgba(86,68,40,0.06)` | 二级 |
| `--shadow-e3` | `0 24px 48px -20px rgba(86,68,40,0.18)` | 悬浮层 |
| `--code-*` | comment `#877E6C` / keyword `#7A5A20` / string `#5F7245` / func `#9C5A3C` / number `#9C4F33` / punct `#5A5244` / default `#221D15` | 纸上墨水注释感 |
| `--status-*` | `#56744F` / `#8A6A2E` / `#A34D3F` / `#46628A` | 同语义 |
| `--focus-ring` | `#6E5322` | — |

对比度自查：两套主题的 `--text-primary/secondary` 对各自 `--bg-page` 均 ≥ 7:1 / 4.6:1；`--accent` 两套均 ≥ 4.5:1（正文尺寸可用）。

### 4.3 两套主题中行为不同的元素（硬门槛的正面回答）

| 元素 | Dark 行为 | Light 行为 |
|---|---|---|
| 静态层级 | surface 提亮 + inner-highlight 顶光，无阴影 | surface 变白 + 暖色软阴影，无 inner-highlight |
| 悬浮层阴影 | 黑色重影 0.55 | 暖棕轻影 0.18 |
| 发丝线方向 | 亮线压暗底（模拟边缘受光） | 暗线压亮底（纸上压痕） |
| 图片 | 压暗：`brightness(.86) saturate(.92)`，hover 恢复 | 原图直出，仅 `contrast(1.02)` |
| 图片框 | 1px `--hairline` + 顶边 inner highlight（玻璃罩） | 1px `--hairline` + `--shadow-e1`（照片压纸） |
| Hero scrim | 底部 `rgba(14,13,12,0.55)→transparent` | 无 scrim（浅底不需压字） |
| 代码块 | inset 暗井 `#171512` | 纸面凹陷 `#ECE4D6` |
| 图表 | §4.5 Dark 序列 | §4.5 Light 序列 |
| First Light 光晕 | 钨丝光 `#C2A165` @ 8% 大半径 radial | 晨光 `#E8D5A8` @ 10%，半径更大更柔 |
| focus ring | 亮黄铜 | 深古铜 |
| `theme-color` meta | `#131110` | `#F5F0E7`（切换时 JS 同步更新） |

### 4.4 图片与图形处理规范（Dark-first 的具体纪律）

- **摄影/项目截图（Dark 下）**：默认 `filter: brightness(0.86) saturate(0.92) contrast(1.04)`，让图片「待在暗展厅里」；hover/focus 时 400ms `ease-out-quart` 过渡到 `brightness(1) saturate(1)`——**射灯移过来了**。实现为 CSS class（`.media-dark`），图片 URL 全走 `content/projects.ts` 数据。
- **框架**：所有媒体统一 `border-radius: 4px`（近直角，奢侈品材质语言），1px hairline 框 + 顶边 inner highlight；首图之外全部 `loading="lazy"` + 固定宽高比防 CLS。
- **SVG 示意图/图标**：一律 `currentColor` + CSS 变量取色，随主题自动换装，禁止硬编码 hex。
- **背景纹理**：全站唯一的「材质贴图」是一个 2% 透明度的细噪点（SVG feTurbulence data-URI，贴在 `--bg-page` 上），抑制大面积纯色的 banding——这属于材质，不属于装饰。

### 4.5 图表配色（两套各一）

- Dark 序列：`#C2A165`（brass）/ `#EDE8E1`（parchment）/ `#7E8CA0`（slate）/ `#B0755F`（terracotta）/ `#8BA888`（sage）；网格线 `rgba(237,232,225,0.07)`；轴文本 `--text-muted`。
- Light 序列：`#8A6A2E` / `#221D15` / `#46628A` / `#A34D3F` / `#56744F`；网格线 `rgba(52,42,28,0.12)`。
- 图表库单选（Recharts/自绘 SVG），颜色从 CSS 变量读取，主题切换零重绘成本。

---

## 5. Light / Dark Mode 策略

**两套情绪：** Dark 是「闭馆后的私人导览」——专注、纵深、展品被灯挑出来；Light 是「开馆时刻」——坦率、纸面、一切摊在晨光下。两者共享同一个骨架（版式、字级、栅格完全一致），只有光不同。**刻意不做**：Light 下的深色 hero（那是偷懒的对称）、Dark 下的彩色霓虹（那是别人的赛博）。

**三态实现：** `data-theme="dark|light"` 挂 `<html>`；"system" 走 `matchMedia('(prefers-color-scheme)')` 监听；选择持久化 `localStorage('theme')`；首屏内联 12 行脚本防 FOUC。系统主题变化且用户处于 system 档时，切换同样走 §7.4 的环境光过渡（光从屏幕边缘整体淡入，无圆心）。

**切换体验：** 见 §7.4。锚定一句话：**切换不是换皮肤，是有人拨了一下房间的总闸。**

---

## 6. 布局系统

- **栅格**：12 列，容器 max-width **1160px**，gutter 24px（移动 20px），左右安全边距随视口 clamp(20px, 5vw, 64px)。大桌面（≥1600px）容器锁定 1160px 居中，两侧留白即「展厅墙面」，**绝不拉满**。
- **间距节奏**：4px 基数，scale = `[4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160]`；Section 垂直 padding 桌面 128px / 平板 96px / 手机 64px；标题块与正文块之间 32px；正文段落间距 = 行高整数倍（27px）。
- **不对称使用**：文字内容锁 6–7 列；display 文字与 vitrine 媒体允许 8–10 列甚至全幅；右侧永远给「铭牌栏」（mono 元数据）。禁止三等分对称栅格。
- **Section 过渡**：三种合法过渡——(a) hairline 分隔线 + 编号 eyebrow；(b) **整幅色带**（Playground 用 `--surface-e1` 上下 hairline 夹住，像展厅里换了一间房）；(c) display 大字的负 margin 咬进上一 section 底部 24px（节奏变化）。禁止圆角大卡片拼贴、禁止渐变过渡带。
- **留白策略**：Dark 下留白是「暗处」，不怕大——section 间距宁大勿小；Light 下纸面留白同样慷慨，但允许图片与文字更靠近（纸上图文关系更紧凑的出版惯例）。
- **悬浮层**：导航、dropdown、palette 用 e3；页面滚动时导航从透明过渡为 `--surface-e1` 88% + `backdrop-blur(12px)` + 底部 hairline。

---

## 7. 主要交互与动效

**动效总则**：Easing 只有三个 token——`--ease-out: cubic-bezier(0.25,1,0.5,1)`（进场/悬浮）、`--ease-inout: cubic-bezier(0.65,0,0.35,1)`（主题/位移）、`--ease-in: cubic-bezier(0.5,0,1,0.5)`（退场）。时长 token：micro 120ms / standard 240ms / entrance 480ms / theme 700ms / first-light ≤1600ms。所有动效走 `motion`（Framer Motion）或纯 CSS，绝不 `setInterval` 驱动。`prefers-reduced-motion: reduce` 时全站策略：非必要动效直接不渲染（条件挂载），必要的状态变化退化为 ≤200ms 纯 opacity。

### 7.1 导航

- 桌面：顶栏 64px。左侧 wordmark（占位 `config.siteName`，mono 小写字 + 句点，如 `name.`）；右侧链接带 mono 编号（`01 Research`…）；当前 section 的编号变 `--accent`，其下 1px 指示线用 FLIP 在链接间滑动 240ms（IntersectionObserver 驱动，§2 的编号即锚点）。滚动态材质见 §6。
- 键盘：`Tab` 到导航即出现 skip-link；palette（`Cmd+K`）列出全部 section 与主题命令，e3 材质。
- 移动：见 §11。

### 7.2 Hover 与进场

- 链接：下划线用 `background-image` 从左向右生长 240ms `--ease-out`；外链箭头 `translateX(3px)`。
- Vitrine 媒体：亮度恢复（§4.4）+ 标题下划线同帧出现——光与文字同时被点亮，一套逻辑。
- 进场：每个 section 首次进入视口时，heading 与首段 fade + `translateY(12px)`，480ms，子元素 stagger 60ms，**只播一次**（IntersectionObserver, `once`）。reduced-motion：无位移，无 stagger，整块 200ms opacity。
- 列表行（Open Source、Notes）：整行 hover 时背景浮现 `--accent-subtle`，行首编号变 `--accent`——「铭牌被灯照到」。

### 7.3 Signature Interaction A —— 首屏「First Light」（单光源叙事）

**叙事**：页面加载 = 展厅开灯。两个动作，一次完成，此后光退为静态：

1. **灯光呼吸**（0–1.4s）：一个全屏 `position:fixed` 径向渐变层（圆心在视口上方 1/3 处，半径 120vmax，色 `--accent` @ 8%，Dark）/ `#E8D5A8` @ 10%（Light），opacity `0 → 0.9 → 驻留 0.22`，同时 `scale(1.06)→1`；结束后该层转为常驻的极淡 vignette（这就是它在 DOM 里存在的唯一理由，否则移除）。
2. **光泽扫过**（0.4–1.5s）：H1 内嵌一个 `::after` 斜向高光条（`linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)`，Dark 用 `mix-blend-mode: plus-lighter`；Light 改 `soft-light` 暖白条），`transform: translateX(-120%) → translateX(120%)` 精确扫过一次，`animation-fill-mode: forwards` 后由 `animationend` 移除节点。**只扫一次，绝不循环。**

**性能预算（写死）**：总时长 ≤1.6s；常驻合成层 ≤2（光晕层 + H1 层）；两个动画均只动 `transform/opacity`（compositor-only，主线程 0 阻塞）；除一个 class 添加外无 JS 参与，JS 成本 <1ms；不延迟 LCP（H1 立即渲染，光效是叠加物）；CLS = 0；移动端缩短为 0.9s（省电）；每会话只播一次（`sessionStorage` 标记，bfcache 恢复时跳过）。

**降级**：`prefers-reduced-motion` → 跳过呼吸与扫光，光晕层直接 300ms 淡入到驻留态（「灯已经亮着」）；不支持 `mix-blend-mode` 的旧浏览器 → 只播光晕，扫光不注册。

### 7.4 Signature Interaction B —— 主题切换「环境光过渡 / Dimmer Switch」

**叙事**：导航右侧的主题钮做成一枚**旋钮式拨杆开关**（machined dial：e2 材质小圆钮 + mono 三档刻度 D·S·L）。用户拨动 = 拨动房间总闸。

- **实现主路径**：View Transitions API。`document.startViewTransition(() => toggleTheme())`，并在 CSS 里把 `::view-transition-old/new(root)` 处理为：新画面以**拨钮的屏幕坐标为圆心**做 `clip-path: circle()` 扩张——Dark→Light 是「晨光从开关处漫开」（circle 半径覆盖全屏，700ms `--ease-inout`）；Light→Dark 是「暮色从边缘合拢」（用反向 clip，旧画面从圆心被吞没）。切换瞬间给 `::view-transition-new(root)` 加一条 120ms 的 `filter: brightness(1.06)`（Light）/`brightness(0.97)`（Dark）微呼吸，模拟灯具过零的闪烁——这是叙事，不是炫技。
- **降级链**：无 VT API（Firefox）→ 色彩过渡方案：对 `body, section, a, table` 等关键元素声明 `transition: background-color 320ms, color 320ms, border-color 320ms`，并在 `<html>` 上临时挂 `.theming` class 控制开关，结束后移除（避免污染交互 hover）；再旧的环境 → 即时切换。
- **reduced-motion**：跳过圆环扩张与 brightness 呼吸，退化为 150ms 交叉淡入（或直接瞬时）。
- **工程细节**：圆心坐标 = 拨钮 `getBoundingClientRect()` 中心，注入 `document.documentElement.style.setProperty('--vt-x/--vt-y')`；切换期间锁输入 700ms；`theme-color` meta 同步更新；切换不打断滚动位置与 focus（VT 天然保持 DOM）。

---

## 8. Projects 展示 ——「Vitrine（展柜）」版式

**原则**：每个项目是一件展品，独占一个「舞台」，禁止三列卡片墙，禁止缩略图网格。

**桌面版式（≥1024px）**：单条目 = 16:9（首条 21:9）媒体舞台占 **7.5 列** + **3.5 列铭牌栏**（间距 1 列），条目间左右交替（zigzag，02 右 03 左）。舞台媒体即 §4.4 的 vitrine 处理（hairline 框 + 顶边 inner highlight + Dark 压亮 hover 恢复）；铭牌栏自上而下：mono 编号与年份（`02 · 2025`，编号 `--accent`）、display-2 衬线标题、一行 Role（body-sm, `--text-secondary`）、一段 60–80 词描述（body）、mono tech tokens（行内，`·` 分隔：`TypeScript · pgvector · FastAPI`）、两枚文字链接（`Case study →` / `GitHub ↗`，下划线生长式 hover）。**整块可点击**（包裹 `<a>`，键盘 focus 时媒体同步提亮——光跟随 focus 环）。

**首条「个展位」**：第一个项目全幅 12 列 21:9，标题与一行摘要以左下 scrim（Dark：`rgba(14,13,12,0.55)→transparent`，仅用于可读性，属功能性渐变）叠在媒体内，铭牌细节收在媒体右侧外栏。这是首屏之下最大的视觉锤。

**平板（640–1023px）**：取消交替，统一「舞台在上、铭牌在下」，舞台 4:3，铭牌改两栏（左标题右元数据）。

**移动（<640px）**：纵向堆叠：mono 编号行 → 标题 → 媒体（4:3，位于标题之下的原因：先给语境再看展品，避免滑动中图片突兀弹出）→ 描述 → tech tokens 可横滑 → 链接行。条目间 96px + hairline。

**数据契约**：`content/projects.ts` 每条含 `sample: true` 标记与注释「示例数据，替换 fields 即可」，媒体字段允许 `image?: string` 为空——空媒体时舞台退化为 `--surface-inset` 底 + 居中 mono 项目代号的「无图展台」，同样成立。

---

## 9. Research 展示

- **关键词墙**：三个核心方向（RAG Robustness / Knowledge Poisoning / Retrieval–Generation Interaction）以 display-2 衬线逐行排开，每行右侧跟一句 body-sm 白话解释；行间 hairline。像展墙铭牌，不像 tag 云。
- **Research Questions**：mono 编号 `Q01/Q02/Q03` + 问题句（title 字号），每问下配 2–3 行 current thinking（body）；问题可被 Notes 引用（锚点链接），形成长期研究档案的内部网络。
- **Selected Experiments —— 设备规格表语言**：实验呈现为 mono spec 表（Plex Mono 13px，`--surface-inset` 底）：`setup / corpus / retriever / top-k / metric / Δ` 各一行，右列数值右对齐——音频器材规格表的克制感，和「研究者做实验」的事实天然契合。表下允许挂一行 `--status-*` 的 readout（如 `robustness ↓ 18% under poisoning`，mock 数据注明 sample）。
- 禁止：雷达图、五边形能力图、进度条、云词图。

**Timeline（防简历时间轴）**：「台账 / Ledger」版式——左列 mono 年份（2024…），右列该年条目（education / research / project 三类用 mono 小标 `[ED]` `[RS]` `[PJ]` 前缀区分），**无竖线、无圆点、无连线动画**；年份是锚点，未来内容多时自动按年分节。placeholder 数据全部 `sample: true`。

---

## 10. Playground / Lab ——「仪器机架」

**入口形态**：全幅色带 section（`--surface-e1`，上下 hairline，见 §6b），eyebrow `03 — Playground`，一句导语：*Small instruments, built to understand retrieval.* 下方**一个整体机架面板**（e2 材质，内部被竖 hairline 分成三格——是「一排仪器」，不是三张卡片）：每格含 mono 仪器名、一句 spec、一个 `Open instrument →` 文字链接与一枚常亮黄铜指示点（2px，呼吸 4s 循环——全站唯一循环动画，reduced-motion 时静止常亮）。移动端三格纵向叠放，hairline 变横线。

**三个可离线运行的 demo（全部预计算数据 + 纯前端，无 API）**：

1. **Retrieval Lens**——输入/选择一段示例文档，页面展示 chunk 切分与「检索命中」高亮：命中的 chunk 以 `--accent-subtle` 底 + 左侧 2px 黄铜线点亮，可调 top-k 滑杆（1–8），高亮随预计算矩阵即时变化。叙事：看检索器「看见了什么」。
2. **Poison the Well**——RAG Robustness 具象化：一个 8 文档迷你语料，滑杆注入 0–5 条投毒段落（预置 mock），右侧 readout 显示答案翻转与置信度变化（预计算曲线，Chart token 走 §4.5）。这是主人公研究方向最直接的互动宣言。
3. **Context Budget**——token 预算分配器：四个横向刻度条（system / retrieved / history / answer）共享一根总量杆，拖动任一端其余实时让位，纯客户端算术；读数 mono 显示。像调音台的推子。

每个 demo 独立路由（react-router lazy chunk），Playground 首页只留机架入口——保持「实验室走廊」而非「demo 列表页」。

---

## 11. 移动端方案（重新设计，非缩放）

- **导航**：顶栏 56px，仅 wordmark + 主题钮 + 菜单钮（两条 hairline 组成的极简图标）。菜单以**自下而上的 sheets**（e3 材质，含 mono 编号的目录式列表，当前 section 标黄铜）展开，而非全屏遮罩炸场；菜单内直达主题三档切换（同一个 Dimmer 控件放大版）。滚动向上时顶栏滑入，向下时隐藏——把手势空间还给内容。
- **内容优先级**：Hero 砍掉右侧铭牌（关键词改为 eyebrow 行内形式）；Research 关键词降一档字号仍保衬线；Selected Work 移动版式见 §8；Playground 机架纵叠；spec 表改两行折叠（label 行 + value 行）。
- **移动特有体验**：(a) First Light 缩短为 0.9s 且光晕半径缩小 30%（省电）；(b) section 编号改为**顶部细进度 hairline**——一条 1px 黄铜线随阅读进度增长（Light 同款深铜），把「展厅动线」变成拇指可感的反馈；(c) 所有 hover 语义转为 touch 的 active 态（媒体提亮在按压瞬间发生 200ms）；(d) 技术上：图片 `srcset` 两档、Playground demo 首屏外全部 lazy chunk、动效统一降帧检查（`matchMedia('(pointer: coarse)')` 下禁用 blur > 8px）。

---

## 12. 空状态策略（一等公民）

- **Publications（当前为空）**：「预留展位」设计——一个 hairline 描边的窄幅框（4:1，max-width 560px），内部居中三行：mono 小字 `EXHIBIT · RESERVED`（`--accent`）→ body 一行 *Selected research will appear here.* → caption 一行 *In review and in progress.*（不暗示任何具体论文，不编造 under review 事实的话术收敛为「进行中的研究将在此出现」）。框体 hover/focus 无任何变化——**空位也是展品，不需要引诱点击**。
- **模块级策略**：Awards、Talks 等无内容模块**整体不渲染**（`content/*.ts` 数组为空即跳过 section），导航同步移除锚点；`sample: true` 的模块正常渲染但在数据文件顶部注释「示例数据」。Notes 少于 3 篇时不显示「查看全部」。
- **图片缺失**：见 §8 无图展台。GitHub 数据未接 API 前，Open Source 渲染静态表并带 `sample` 注释行（mono, `--text-faint`）。

---

## 13. 与其他 7 个方案的差异（「我不是什么」）

1. 我不是瑞士白极简队：我的 Light 是暖纸与晨光的**对位设计**，且 Dark 才是第一公民。
2. 我不是终端/黑客风队：我不用等宽字体当主角、不用扫描线与 phosphor 绿，mono 只是铭牌。
3. 我不是玻璃拟态/极光渐变队：全站只有一个功能性 scrim 与一层 2% 噪点，没有 backdrop-blur 卡片、没有 aurora。
4. 我不是新粗野主义队：我无边框暴力、无高饱和色块、无故意错位，材质靠 1px 精度而非 10px 粗线。
5. 我不是编辑杂志纸感队：同样用衬线大字，但我把它放进暗展厅的双主题材质体系，而非静态纸面排版。
6. 我不是插画/个性插画队：我没有吉祥物、没有手绘元素，图像全部是「被打光的实物」（截图/图表/照片）。
7. 我不是学术 CV 仿真队：我拒绝白底双栏论文腔与 BibTeX 直排，我用展柜与规格表重新编排学术内容。

---

## 14. 风险与自我批评

1. **最大风险——Light Mode 被做成了 Dark 的附庸**。整套材质语言（inner highlight、暗部留白）天然偏向 Dark；对策已在结构上强制：elevation 方向在 Light 中**反转**（更白+暖影）、阴影/hairline/图片三条 token 独立成表（§4.3）、评审维度上先做 Light 再做 Dark 的实现顺序写入交付计划。
2. **黄铜色用多即俗**：Brass 一旦出现在非交互、非铭牌位置，整站滑向「土豪金」。纪律：`--accent` 只允许出现在（a）可交互状态（b）编号/铭牌（c）图表首序列（d）光效，四处之外一律中性色；实现阶段加 lint 级 code review。
3. **图片压暗可能伤害信息本身**（截图里的代码看不清）：对策——压暗系数只有 0.86 且 hover 恢复是位移 0 的即时操作；同时 `forced-colors` 模式与打印样式下强制原图。
4. **First Light 与 Dimmer Switch 两个 signature 有被评委读作「炫技」的风险**：二者都有严格预算（1.6s/0.7s、compositor-only、reduced-motion 降级），且光效全年只在该时刻出现——但若实现质量不达（掉帧、闪烁），宁可砍掉扫光保留光晕。
5. **Fraunces 的「暖」与暗底的「冷峻」可能打架**：只用 opsz144 的高对比细笔画档位，禁用 SOFT/WONK 轴；若实装后仍嫌软，备选替换为 Newsreader display（同为变量衬线，切换成本 ≈ 0）。
6. **展厅隐喻的「空旷感」在内容只有 mock 的今天会显得更空**：这是特性不是缺陷——空状态设计（§12）与 generous spacing 就是为此准备的；但若未来内容膨胀 10 倍，vitrine 单列版式会拉长页面，届时引入「Index 表 + 精选展柜」双层结构（表格快览、展柜精选），版式语言不变。
