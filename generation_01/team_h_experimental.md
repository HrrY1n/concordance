# Team H — Experimental Interaction：《可检索的人》（A Retrievable Self）

> **一句话灵魂**：把这个主页本身做成一个微型的检索系统——访客是 query，站内内容是 corpus，每一次交互都是一次"可见的检索"；实验性全部来自"让检索行为被看见"，可用性全部来自"每一次实验性操作都有一个确定性出口"。
>
> 首席设计师：Team H（Experimental Interaction）。本文档遵守 `BRIEF.md` 全部约束：内容策略（§3）、禁止清单（§5）、工程基线（§6）、交付章节（§7）。

**种子约束落点索引**（评委快速核对用）：

| 种子约束 | 落点 |
|---|---|
| 双模导航（主模式 + 隐藏模式 + 切换方式） | §7.1 |
| 布局刻意打破常规（每处附"为什么"） | §6 |
| 首屏"这个人是谁"交互式自述装置（完整脚本 + 10 秒节奏） | §2.2 |
| 证据链式项目展示（问题→方法→产物→链接） | §8 |
| Playground 2–3 个纯前端研究玩具（交互脚本） | §10 |
| 可用性守护全清单（键盘 / reduced-motion / 无 JS / SEO） | §15 |
| Light/Dark 完整 token 表（具体 hex） | §4 |

---

## 1. 设计理念

**一段话灵魂**：一位研究 RAG 的研究者，其职业本身就在回答"如何让人更快地从海量信息中找到可信的东西"。那么他的主页最诚实的实验方向，不是再加一层视觉炫技，而是**让主页的行为方式与他的研究信念一致**：页面是一个语料库，导航是一套查询接口，项目是一条条可验证的证据链，Playground 是把研究直觉做成可上手的研究玩具。我们允许自己打破常规——非对称首屏、横贯全宽的证据链、滚动驱动的揭示装置——但每一处打破都必须能回答同一个问题：**它是否让研究者或招聘者更快理解"这个人是谁、在做什么、做得怎么样"？** 答案为否的实验，无论多好看都会被砍掉。

**三条设计原则**：

1. **实验必须压缩理解时间（Time-to-Understand Budget）**：任何交互特性立项时写明目标——它把哪类访客（招聘者 90 秒扫描 / 研究者 5 分钟深读）的哪一步理解缩短了多少秒。若一个交互的完成时间超过它的静态等价物，直接砍掉。本文档每个实验特性都带"目的 / 降级方案 / 可用性守护"三件套。
2. **双通道原则（Every Experiment Has a Conventional Exit）**：每一个实验性入口都必须同时存在一条传统路径。Command Palette 存在时，传统导航永远可见；自述装置未交互时，文字内容始终在 DOM 中可读；证据链动画未触发时，链条完整静态呈现。实验是增量，不是门票。
3. **降级是一等公民（Design the Fallback First）**：每个特性的降级方案（reduced-motion、无 JS、触屏、低算力移动设备）与特性本体同一天设计，写在同一个章节，不允许"以后补"。

---

## 2. 首页信息架构

### 2.1 Section 顺序与理由

| # | Section | 内容 | 放置理由 |
|---|---|---|---|
| 00 | Hero / 自述装置 | 无姓名的克制标题 + 四侧面自述装置（§2.2） | 10 秒内建立"这个人是谁" |
| 01 | Selected Work（证据链） | 3–6 条证据链（§8） | 招聘者的黄金路径：身份之后立刻给证据。工作先于口号 |
| 02 | Research（Query Log） | 研究兴趣写成检索式问题（§9） | 从"做过什么"进入"在想什么"，深度递进 |
| 03 | Lab 入口 + 首个玩具预览 | Playground 大入口（§10） | 研究者的"可玩性证明"，也是记忆点 |
| 04 | Notes / Writing | 2–3 篇 sample 笔记，列表式 | 思维过程的旁证，轻量呈现 |
| 05 | Publications（优雅空状态） | "Selected research will appear here." | 故意放在 Notes 之后：空状态不出现在黄金路径上 |
| 06 | About + Colophon | 三行极简自述 + 本站技术说明 | 研究者会看 colophon，这本身就是信号 |
| 07 | Contact | 链接占位策略（§12） | 收尾，全站唯一 CTA 色 |

**为什么不是 "About 在前"**：没有论文、没有履历的当前状态下，About 是最弱模块；把它放前面等于把最弱的牌打在最好的位置。证据链（用 sample 项目展示"做事方式"）才是当前阶段最强内容。

### 2.2 首屏：自述装置 "The Retrieval Beam"（完整交互脚本）

**目的**：任务书禁止 "Hi, I'm XXX"。我们用一个轻交互装置代替自我介绍：访客亲手"检索"出这个人的研究身份，把"阅读一段自我介绍"变成"执行一次检索"。四条身份侧面——RAG → Robustness → Poisoning → Systems——以"未检索状态"（模糊遮蔽）出现，访客拖动/滚动后逐条揭示。

**首屏布局**（非对称，见 §6.1）：

```
┌────────────────────────────────────────────────────────────┐
│ ⌕ wordmark        Work Research Lab Notes Contact   ◐  ⌘K │
├──────────────────────────────┬─────────────────────────────┤
│  (左 7 列)                    │ (右 5 列)                    │
│  mono 小字: research index    │  INDEX OF ONE PERSON         │
│  display-1 (衬线):            │  01 Retrieval-Augmented Gen. │
│  "Retrieval, robustness,     │  02 RAG Robustness           │
│   and the systems in         │  03 Knowledge Poisoning      │
│   between."                  │  04 LLM / AI Systems         │
│                              │  ──────────────────────      │
│  [自述装置：四行侧面列表]        │  → Selected Work (W-01…)     │
│  + Beam 拖柄                  │  → Lab: 3 research toys      │
│                              │  → Contact                   │
└──────────────────────────────┴─────────────────────────────┘
```

**装置状态机**：`sealed（全部遮蔽）→ revealing（逐条揭示）→ resolved（完成态）`。

**初始状态（sealed）**：四行列表，每行 = 编号 + 侧面名称 + 一行摘要。名称可读（这是真实信息，永远可读），摘要以 `filter: blur(5px) + opacity .35` 遮蔽。**关键可用性决定：全部文字真实存在于 DOM，遮蔽纯属装饰层（`aria-hidden` 的重复视觉层 + 对低视力关闭遮蔽，见 §15.5）**。左列 Beam：一条 2px 竖直高亮线，顶端一个 8px×44px 拖柄。

**交互脚本（桌面）**：

| t | 事件 | 系统行为 | 节奏设计 |
|---|---|---|---|
| 0.0s | 首屏绘制 | 标题与侧面**名称**立即可读（LCP 就是真文本，无入场动画） | 无 JS 也不影响 |
| 0–4s | 访客无操作 | t=4s 时 Beam 拖柄做**一次性** 1.2s 呼吸脉冲（translateX 6px），旁白 mono 小字淡入一次："drag the beam, scroll, or press →" | 不自动揭示内容——尊重读者，但保证可发现性 |
| 用户首次输入 | 拖动 Beam / 滚动页面 / 按 → 或数字键 1–4 | Beam 位置映射揭示进度 p∈[0,1]，每跨过一行阈值：该行摘要 `blur 5px→0, opacity .35→1`（240ms standard easing）+ 摘要下方一行" substance"（一句真实的研究自述，如 RAG 行：*"让模型先查资料再回答——我研究这条通路怎么设计、何时失效。"*）以 grid-rows 0fr→1fr 展开（280ms） | **首次揭示承诺：任何首次输入后 ≤1.5s 内第 1 行完整可读** |
| 连续操作 | 继续右拖 / 下滚 | 四行依次揭示，行与行间隔由用户控制，无强制 stagger | 全程预计 6–10s |
| 全部揭示 | 进入 resolved | 四行折叠为一条紧凑索引条（chips，锚点链接到 §9 Research），Beam 淡出 | 页面高度回收 40%，滚动动线不停滞 |
| — | `localStorage['beam-v1']='resolved'` | 回访者直接看到 resolved 态 + 右上角 "replay" 幽灵按钮 | **二次访问零成本** |

**滚动映射实现（不劫持滚动）**：装置占据首屏 100vh，页面自然滚动，`scroll progress of viewport 0→100vh` 线性映射到 p。**绝不**使用 `preventDefault`、pin 或滚动锁——访客随时可以直接滚走，装置不会拦住任何人（这正是红线"疯狂滚动视差"的反面）。

**性能设计（10 秒承诺的工程保障）**：
- 装置全部由文本 + CSS `filter/opacity/transform` 构成，零图片、零 canvas；装置逻辑 ≤6KB gzip，随首屏 chunk 加载，不等待任何字体阻塞渲染（字体 `swap`）。
- Beam 拖动用 Pointer Events + rAF 节流，`touch-action: none` 只声明在 8px 拖柄上，页面其余区域滚动不受影响。
- 中端安卓（4G、Moto G 级）上装置可交互时间 <1.0s，首揭示 <1.5s——这是"10 秒内完成首次揭示"的量化下限。

**三件套**：
- **目的**：把自我介绍变成一次 8 秒的检索仪式，让"研究 RAG 的人"的网站**行为上**就是检索。
- **降级方案**：无 JS → `.no-js` 类直接移除遮蔽，四行全可读；reduced-motion → 240ms 过渡换成瞬时 opacity 切换，Beam 仍可拖但无动画；触屏 → 拖柄 44px 命中区 + 支持横向 swipe；键盘 → `→`/`←`/数字键 1–4 全路径等价。
- **可用性守护**：遮蔽层不承载任何不可达内容（DOM 全文 + aria-live 播报"facet 2 of 4 revealed"）；`prefers-contrast: more` 下禁用 blur 遮蔽；完成态被记忆，不会让回访者重做仪式。

---

## 3. Typography

**选择与理由**：
- **Display（拉丁）**：`Newsreader`（可变字重、光学尺寸轴）——一份"学术期刊 + 现代编辑部"气质的衬线，斜体优雅，适合研究者的书卷气与技术感的混合。仅子集化拉丁字符（woff2 ≈ 30KB），`font-display: swap`。
- **Body（拉丁）**：`Inter`（可变）——为界面而生，数字等宽特性（`tnum`）让编号、年份、token 计数对齐。
- **Mono**：`IBM Plex Mono`——检索式、编号、状态词、代码的载体；比 JetBrains Mono 更"文献"而非"黑客"。
- **CJK 方案（不加载中文 webfont，系统栈兜底）**：Display 中文回退 `"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif`；Body 中文回退 `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif`；Mono 中文回退同 body（中文无 mono 意义）。**理由**：中文子集动辄数 MB，违背性能基线；系统栈在 Win/macOS/iOS/Android 的表现已被设计过（本站中文仅出现在摘要与笔记，量大但层级低）。

**字号阶梯**（基准 16px，比例 1.25，CJK 行高单独给值）：

| Token | Size | 行高 | 字距 | 用途 |
|---|---|---|---|---|
| `--text-display-1` | clamp(40px, 6vw, 76px) | 1.08（CJK 1.22） | −0.02em | 首屏标题 |
| `--text-display-2` | clamp(28px, 3.6vw, 44px) | 1.15（CJK 1.3） | −0.01em | 区块标题、证据链问题句 |
| `--text-title` | 24px | 1.35 | 0 | 项目名、笔记标题 |
| `--text-body` | 17px | 1.7（CJK 1.85） | 0 | 正文 |
| `--text-small` | 14px | 1.6 | 0 | 摘要、辅助说明 |
| `--text-label` | 13px mono | 1.5 | +0.08em, uppercase | 编号（W-01/Q01）、状态词、kbd |
| `--text-micro` | 12px mono | 1.4 | +0.04em | 页脚、colophon |

**行宽控制**：散文 `max-width: 68ch`（拉丁）/ `38em`（中文）；证据链问题句上限 `24ch` 强制短句；全部正文容器 `text-wrap: pretty`，标题 `text-wrap: balance`。

**中英文混排**：中西文之间自动 0.12em 间隙（`text-autospace` 不普及，用 CSS `:lang(zh) + fallback` 与手工 span 约定）；中文不使用斜体（改为色点强调）；中文标题禁用 negative tracking。

---

## 4. 颜色体系（完整 token 表）

情绪定调：**Light = "纸上索引"（白天的阅读室，暖纸面 + 钴蓝墨水）**；**Dark = "暗房检索"（夜间实验室，低照度 + 示波器高亮）**。`--signal`（警戒橙）在全站语义固定为"投毒/攻击/不可信"，`--accent` 永远表示"可交互/可信路径"——这个双色语义系统本身就在教访客读研究（正常 vs 被攻击状态），是配色服务于内容理解的实验点。

### Light — Paper Index

| Token | Hex | 用途 |
|---|---|---|
| `--bg` | `#F7F4EE` | 页面底（暖纸） |
| `--surface` | `#FFFFFF` | 卡片、palette 面板、代码块容器 |
| `--surface-2` | `#EFECE4` | 次级面板、demo 舞台 |
| `--text` | `#17140F` | 主文本（对 `--bg` 对比度 ≈ 15:1） |
| `--text-muted` | `#635C50` | 次文本（≈ 5.5:1，AA） |
| `--divider` | `#E2DDD2` | 1px 分隔线 |
| `--hover` | `#ECE8DF` | 行 hover、列表底色 |
| `--accent` | `#2547D0` | 钴蓝：链接、焦点环、Beam、检索高亮（对 `--bg` ≈ 6.8:1） |
| `--accent-soft` | `#DCE4FA` | accent 的底色态（选中行、高亮垫） |
| `--signal` | `#B3401B` | 投毒/攻击/被截断语义（≈ 5.6:1） |
| `--signal-soft` | `#F7E3D9` | signal 底色态 |
| `--ok` | `#1E6E52` | 防御生效/校验通过（≈ 5.2:1） |
| `--code-bg` | `#F0EDE5` | 行内与块级代码底 |
| `--code-text` | `#2A251D` | 代码文本 |
| `--selection` | `#D6DEF8` | 文本选区 |
| `--focus-ring` | `#2547D0` | 2px focus outline |

### Dark — Darkroom

| Token | Hex | 用途 |
|---|---|---|
| `--bg` | `#121110` | 页面底（近黑带暖） |
| `--surface` | `#1A1917` | 面板 |
| `--surface-2` | `#232120` | 次级面板、demo 舞台 |
| `--text` | `#ECE8E1` | 主文本（≈ 14:1） |
| `--text-muted` | `#A39C92` | 次文本（≈ 6.5:1） |
| `--divider` | `#2E2B28` | 分隔线 |
| `--hover` | `#262421` | 行 hover |
| `--accent` | `#8FA8FF` | 亮钴蓝（≈ 7.5:1）——Dark 下的 accent 重新设计过，不是反转 |
| `--accent-soft` | `#232B4A` | accent 底色态 |
| `--signal` | `#FF9B6A` | 攻击语义（≈ 8:1） |
| `--signal-soft` | `#3A2620` | signal 底色态 |
| `--ok` | `#6FD3A8` | 防御/通过 |
| `--code-bg` | `#0C0B0A` | 代码块底（比 bg 更深一级） |
| `--code-text` | `#D8D2C8` | 代码文本 |
| `--selection` | `#37415F` | 选区 |
| `--focus-ring` | `#8FA8FF` | 焦点环 |

**语义红线**：`--accent` 与 `--signal` 不得用于纯装饰；凡出现 `--signal`，同一屏幕内必有文字说明（色盲兜底：所有 signal 状态同时带 ▲ 图标或文字标签，不依赖色相）。

---

## 5. Light / Dark Mode 策略

- **Light「纸上索引」**情绪：清晨图书馆，纸面微暖，钴蓝墨水批注。适合招聘者白天的快速扫描——高明度、高扫描效率。
- **Dark「暗房检索」**情绪：夜间实验室/示波器。不是黑白反转：bg 是带暖的近黑、accent 换为更亮的钴蓝、阴影全部替换为 1px 边线（Dark 下阴影廉价化，禁用）。
- **切换体验（signature 微交互之一）**：切换瞬间不做全屏白闪/黑闪，而是从切换按钮的位置发出一个 240ms 的圆形 clip-path 扩散，覆盖层颜色 = 新主题 `--bg`；同时自述装置的遮蔽层瞬时重置模糊（一个彩蛋：换主题 = 重新"显影"）。`MotionConfig reducedMotion="user"` 下退化为直接换色。
- **持久化与系统跟随**：三态（Light/Dark/System）存 `localStorage` + `color-scheme` meta，SSR 内联脚本防 FOUC。两套主题下的代码块、palette、demo 舞台都**分别设计过**并出对照检查清单（对比度、边线、选区色）。

---

## 6. 布局系统

**网格**：12 列流式，`max-width: 1200px`（内容主轨）；Selected Work 单区允许出血至 `1440px`（见打破 2）。垂直节奏 `8px` 基数，section 间距 `128px`（移动 72px），组件间距 24/32/48。留白策略：**标题上方留白 > 下方**（标题呼吸感来自上方 96px，下方仅 32px 直接连接内容——阅读动线不停顿）。

**刻意打破常规的 4 处（每处附"为什么这帮助理解内容"）**：

1. **非对称首屏（7/5 分栏，装置在左、索引在右）**——打破"居中 hero"常规。*为什么*：招聘者的三个高频任务（看工作、玩 demo、联系）固定驻留在右栏，实验装置再怎么玩也不会阻塞任务路径；理解与任务双轨并行。
2. **Selected Work 全宽出血 + 横向证据链（1200→1440）**——打破"全部内容一条 max-width"常规。*为什么*：横向空间本身就是"问题→方法→产物→链接"的因果时间轴，物理距离 = 逻辑距离，招聘者视线一次左→右扫过即完成一条链的因果阅读，不需要上下往返。
3. **Research→Lab 之间的 2° 斜切分区线 + mono 边注 `— corpus split: from claims to artifacts —`**——打破"矩形 section 堆叠"常规。*为什么*：长页面滚过 3 屏后空间感消失，一条极低成本的斜线给用户"换主题了"的空间记忆点，减少迷路；比任何滚动动画都便宜且在无 JS 下依然存在。
4. **全站左缘编号锚轨（`00 hero / 01 work / 02 research…`，mono 12px，桌面常驻）**——打破"页面无坐标"常规。*为什么*：它让 Command Palette 的搜索结果可以引用坐标（"Q03 → §02"），页内检索有了地址系统——整站"可检索"隐喻的骨架；同时给研究者读者一个目录感的替代物。

**Section 过渡**：无飞入动画。标准过渡 = 上一区尾部的 mono 边注（一句话）+ 128px 留白 + 下区标题。只有一处例外：§6.3 的斜切线。

---

## 7. 主要交互与动效

### 7.0 Motion Tokens

| Token | 值 | 用途 |
|---|---|---|
| `--dur-instant` | 80ms | hover 色、焦点环 |
| `--dur-fast` | 160ms | 下拉、chip 状态 |
| `--dur-base` | 240ms | 遮蔽揭示、面板 |
| `--dur-slow` | 400ms | palette 出现、主题 clip 扩散 |
| `--dur-draw` | 600ms | 证据链连线绘制（一次性） |
| `--ease-standard` | cubic-bezier(0.2, 0, 0, 1) | 默认 |
| `--ease-enter` | cubic-bezier(0.16, 1, 0.3, 1) | 进入 |
| `--ease-exit` | cubic-bezier(0.4, 0, 1, 1) | 退出 |

**全局约束**：全站循环动画只有 1 个（首屏提示脉冲，1.5s，一次）；无视差超过 4px；hover 一律只有颜色/下划线/1px 位移；`motion`（Framer）统一包在 `<MotionConfig reducedMotion="user">` 内。

### 7.1 双模导航（种子约束核心）

**模式 A「Index 导航」（主模式，默认可见）**：
- 固定顶部 64px。左：wordmark `⌕`（检索符号 glyph，`profile.wordmark` 配置项，默认不使用任何假名字，TODO 注释提示替换）。中/右：`Work · Research · Lab · Notes · Contact`（≤5 项，纯锚点 `<a>`，无 JS 可用）。最右：主题三态切换 + **`⌘K` chip 按钮**（accessible name: "Open command palette"）。
- 滚动行为：页首透明融入 bg；滚过 80px 后出现 `--surface` 底 + 1px `--divider` 下边线（160ms）。当前 section 的导航项带 2px accent 下划线（IntersectionObserver，无动画库依赖）。

**模式 B「Query Palette」（隐藏模式，进阶通道）**：
- 触发：`⌘K` / `Ctrl+K` / `/`（非输入焦点时）/ 点击 chip。移动端：顶栏 ⌕ 图标，以 bottom sheet 呈现。
- 面板：640px 宽，顶部 15vh 居中，`--surface` 底 + 1px 边线 + 400ms enter（scale 0.98→1 + fade）。48px 输入框，占位文案："query this person…"（隐喻克制的唯一一处）。
- **索引范围（这是它与传统导航的本质区别）**：Pages / Projects（证据链，含编号 W-01…）/ Research Questions（Q01…）/ Lab Demos / Notes / **Actions**（Toggle theme · Copy email · Copy GitHub URL · Jump to top）。Actions 让 palette 成为"对这个人的操作台"，而不只是目录。
- 键盘：`↑↓` 在全部结果中线性导航（roving tabindex），`Tab` 在分组间跳，`Enter` 执行，`Esc` 关闭并归还焦点到触发器，`⌘K` 再按一次关闭。命中计算：前缀 > 子序列 > 模糊，完全本地，无网络。
- 空查询显示：最近 5 条（localStorage 持久化）+ 建议项 `Try: "poisoning"`。无结果显示设计过的空态（§12）。
- 结果行结构：`type badge（mono）+ 标题 + 坐标（§ 编号）+ kbd 提示`。

**切换方式与可发现性**：主模式永远在场，palette 是增量。首次会话中，自述装置 resolved 后 5 秒，右下角出现一次性 toast（5s 自动消失，可关闭）："This site is queryable — press ⌘K."。chip 常显 + hover title。**用户从不打开 palette 也零损失**——这是双通道原则的直接体现。

**为什么双模导航帮助理解内容**：Index 模式服务"我知道要找什么"的线性读者；Query 模式服务"我想直接跳到 poisoning 相关的一切"的目的性读者（招聘者搜 "publications"、研究者搜 "poisoning" 都在 1.5s 内着陆）。两种阅读人格，两个入口。

### 7.2 其他核心动效

- **进入动效**：仅首屏装置（§2.2）与证据链连线绘制（§8）两处；其余 section 静态呈现。**刻意不给全部元素飞入**（红线）。
- **Hover**：链接 = accent 下划线 80ms + `text-underline-offset` 2→3px；证据链节点 = 半径 3→5px；笔记行 = `--hover` 底色。
- **Signature interaction**：自述装置（§2.2）+ 主题"显影"切换（§5）。

---

## 8. Projects 展示：证据链（Evidence Chain）

**版式**（禁止卡片墙的实现细节）：每个项目 = 一条横向四站链，占全宽出血轨（1440px），**无任何盒子/卡片**——四个站点是"锚在一条 1px 基线上的开放文本"，层级全部由排版承担：

```
W-01 · Poisoned Corpus Canary                    [sample]  2026
───────────────────────────────────────────────────────────────────
  ●01 问题          ●02 方法              ●03 产物            ●04 链接
  RAG 系统默认信任   构造检索探针集；        探针生成脚本 +       ↗ GitHub
  知识库，但语料     对引用做"答案-出处"    复现 notebook +      ↗ Demo
  本身可被投毒。     一致性校验的流水线。    一份写作中的报告。    ↗ Case study
（display-2 衬线）  （mono 14px 列表）     （body 17px）       （下划线标签）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (链条线随滚动一次性绘)
```

- **问题站**：display-2 衬线短句（≤24ch），口语化表述，零术语堆砌——这是给招聘者的。
- **方法站**：mono 小号 2–3 条，动词开头，不吹成效——这是给研究者的。
- **产物站**：body 字号，只写**存在的东西**（脚本/notebook/demo/草稿），不声称任何发表或奖项（符合 §3 内容红线）。
- **链接站**：下划线标签式（非按钮），hover 时箭头位移 2px。空链接按 §12 规则不渲染。
- 链与链之间：120px 间隔 + 编号分隔（W-01 / W-02 …），编号同色于左缘锚轨。

**滚动行为**：链条线在进入视口 40% 时**一次性**从左向右绘制（600ms，`--dur-draw`），绘制经过每个节点时该站文本以 80ms 间隔淡入；**反向滚动不回放**（单向，杜绝 yoyo 恼人）。`reduced-motion` / 无 JS：线与全部文本直接静态呈现。**不使用滚动劫持**：链不吸顶、不 pin，用户可以任何速度滚过。

**滚动行为的理解价值**：绘制动画的方向性（左→右）在物理上复演了"因果"阅读方向，1 秒的仪式感之后所有内容永久静态可读——动效只负责指出阅读顺序，不负责挽留视线。

**sample 数据**（`content/projects.ts`，全部 `sample: true`，渲染时右上有 12px mono `[sample]` 角标）：W-01 Poisoned Corpus Canary（如上）；W-02 Chunk Stress Bench（上下文截断与排序敏感性 stress 工具）；W-03 Cite-Check（答案与引用一致性的 lint 规则集）。文档明确注释："示例仅展示能力与过程，替换 `content/projects.ts` 即可"。

---

## 9. Research 展示：Query Log

研究兴趣不写成"关键词云"或进度条（红线），而写成**检索式研究问题日志**：

```
Q02  当知识库被投毒，RAG 的引用还能被信任吗？
     为什么问  ——  引用是 RAG 的信任界面；若语料层被污染，引用可能反而
                  给错误答案镀上可信度。
     现在      ——  reading + prototyping（真实自述状态词，非假进度）
     什么算进展 ——  能给出一个"引用一致性与语料可信度"的判定探针。
     关联      ——  W-01 证据链 · Lab: 投毒三明治 · 笔记 2 篇
```

- 每条 = `Q##` 编号 + 检索式问题句（衬线 display-2）+ 四行结构（为什么问 / 现在 / 什么算进展 / 关联）。**"关联"行是全站检索脉络的显式化**：问题 ↔ 证据链 ↔ 玩具 ↔ 笔记互相引用，palette 搜任一编号都能命中。
- **Current Research 状态词**只用真实自述（`reading / prototyping / writing-up`），绝不出现"已完成/准确率 95%"式假数据（§3 红线）。
- 无图表、无假 benchmark——Research 区的专业感来自**问题的清晰与诚实**，这正是让研究者读者最快建立信任的方式。

---

## 10. Playground / Lab：三个研究玩具

**入口形态**：Lab 不是博客列表，而是"实验台"页面——顶部一句 mono 定位（`hand-built toys · zero network · no fake numbers`）+ 三个玩具的横向索引（同证据链排版语言），每个玩具 = 一个 `--surface-2` 舞台 + 常驻侧栏"这个玩具在演示什么 / 什么是真的 / 什么不是真的"。**诚实条款**：所有数据为手工构造的演示数据（`content/lab/*.ts` 独立文件），全站任何位置不出现伪造 benchmark 数字。

### 10.1 玩具 A「近邻侦探」Nearest Neighbors（检索）

- **目的**：演示"语义相似度"的直觉与其失败模式（多义词歧义）——RAG 检索层的第一课。
- **构造**：24 个手写文档点（8 维手工特征向量：tech/food/animal/question 等维度），2D 平铺在 SVG 舞台（纯 DOM/SVG，无 WebGL）。
- **交互脚本**：① 输入 "apple pie" 回车 → 计算余弦相似度，前 3 名点亮 + 连线 + 距离标注（240ms）；② 点击任意点 → 侧栏显示其 8 维条形码 + 一句"为什么它相似（共享维度：food, homemade）"；③ 按"试着骗过我"按钮 → 自动发送多义词查询（如 "jaguar"），前 3 名中混入"汽车/豹/公司"三个语义 → 展示检索歧义失败；④ "重置"恢复初始。
- **降级**：无 JS → 舞台替换为静态 24 行"文档列表 + 特征标签"；reduced-motion → 高亮无过渡；键盘 → 点可 Tab，Enter 选中，结果同步到 `aria-live` 区。
- **可用性守护**：颜色高亮同时伴随加粗 + 序号徽标（不依赖色觉）；文字结果与图形等价。

### 10.2 玩具 B「投毒三明治」Poison the Corpus（Knowledge Poisoning）

- **目的**：让访客 60 秒内理解本研究的核心命题——**引用不等于可信，语料层才是根因**。
- **构造**：6 条 mock 语料（某公共设施开放时间主题），每条带来源标签（官网 / 论坛 / 匿名）；3 枚预制"投毒筹码"（冒充官网 / 诱导性措辞 / 统计幻觉）。回答 = **逐字摘录**被检中文档片段（extractive，非生成，杜绝"假 LLM"造假）。
- **交互脚本**：① 拖一枚筹码进语料堆（键盘路径：Tab 到 Add 按钮）；② 点"运行检索 + 回答" → 答案区逐字摘录 + 底部引用行（`[1] 官网 · [2] 匿名`）；③ 若假文档被引用，其中假事实以 `--signal` 高亮 + ▲ 标记；④ 打开"来源加权防御"开关 → 重新检索，匿名来源降权，两次引用差异并排展示；⑤ "明白了，清空重来"。
- **降级**：无 JS → 静态图文分步讲解（同一教育点的漫画式 4 帧）；触屏 → 筹码支持 tap-to-place（无拖拽依赖）；reduced-motion → 检索过程瞬时呈现。
- **可用性守护**：signal 状态均有文字标签；防御开关注明"仅示意'来源加权'这一种最简单直觉，非 SOTA 声明"（诚实条款）。

### 10.3 玩具 C「上下文预算」Context Budget（Systems）

- **目的**：演示 context window 预算与 chunk 取舍——为什么 reranking 重要。
- **交互脚本**：① 一个问题 + 5 个长度各异的候选 chunk；② 拖动 token 预算滑杆（512–4096）→ 按序装入，装不下的 chunk 变虚线轮廓 + "truncated"（`--signal` 文字标签）；③ 上移/下移按钮调整 chunk 顺序 → 观察"谁被留下"随之改变；④ 底部一行提示："顺序决定谁被留下——这就是 reranking 的意义。"
- **降级**：全部为长度算术，无 JS 退化为静态对照图；滑杆有等价 +/− 按钮与键盘步进。
- **可用性守护**：预算数值用 `tnum` 等宽对齐；截断状态有文字与形状双编码。

---

## 11. 移动端方案

**导航**：顶栏压缩为 `wordmark + ⌕(palette) + 主题`；五个主链接**不**塞进汉堡菜单——它们进入 palette（bottom sheet，大行高 56px）+ 页脚站点地图。**移动端把 palette 升为主模式**，这本身就是重新设计而非缩放：拇指场景下"查询"比"扫菜单"更快。⌕ 图标 44px 命中区。

**自述装置重设计**：拖柄在触屏上换成**横向 swipe 卡位**（四行纵向堆叠，swipe 或 tap 逐条揭示），滚动映射保留；4s 后提示改为"swipe to reveal"。

**证据链垂直化**：横向四站变纵向左轨线（问题→方法→产物→链接自上而下），绘制方向改为向下一次性绘制；轨道线就是移动端的"因果轴"。

**内容优先级**：装置（可跳过）→ 证据链 → Research → Lab → 联系。Publications 空态与 Notes 在移动端折叠为单行入口（palette 可达）。

**移动端特有体验**：① palette bottom sheet（桌面是浮层）；② 玩具 A/B 全宽舞台 + tap-to-place；③ 玩具点数在低端机自动降为 16 个（`navigator.hardwareConcurrency` 探测，≤4 核减载）；④ 主题切换 clip 动效改为中心点扩散（拇指位置）。

---

## 12. 空状态策略

**三条规则**（全站统一引擎，`renderIf(value)`）：

1. **值为空 → 不渲染**：Awards 不存在就不出现；Contact 中每个链接独立判断，空值链接不渲染占位壳。访客永远不会看到"没做完"的骨架。
2. **模块级空 → 设计过的空态**：唯一强制展示的空态是 Publications（任务书要求），版式：
   ```
   ─ ─ ─ ─ ─ ─ ─ ─ ─（虚线保留框，暗示这是预留位而非缺失）
   Selected research will appear here.
   // the corpus grows — publications slot is intentional.
   ```
   虚线框 + 两行字 + mono 边注。**刻意不用**"0 results / 404 / empty"等错误美学。
3. **检索语境的空 → 检索美学**：仅 palette 无结果时使用 `no documents matched "…"` + 建议词——空态文案随语境（检索隐喻只在检索界面出现）。

Contact 全空时：整节退化为一句 "Everything here is configured in `content/links.ts`." 不，这是开发者口吻——改为访客口吻 "Ways to reach me will appear here."（同样满足优雅空态）。

---

## 13. 与其他 7 个方案的差异（"我不是什么"）

1. 我不是**极简瑞士编辑排版派**：我保留编辑级 Typography，但我的页面是被"查询"的——双模导航与坐标系统让排版之外多了一层可操作的检索结构。
2. 我不是**暗色终端极客风**：只借用 mono 与键盘习惯，没有 CRT、扫描线、荧光绿；Dark 是被独立设计的"暗房"，且 Light 是同等级的一等公民。
3. 我不是**卡片瀑布流模板**：项目是开放文本锚在一条线上的证据链，全站找不出一个圆角卡片墙。
4. 我不是 **3D / Shader 视觉派**：零 WebGL、零 canvas 依赖（玩具用 SVG/DOM），所有交互可降级为静态文本。
5. 我不是 **AI 聊天助手风**：首页没有假装的 chatbot；"对话感"被诚实地替换为 Command Palette——它查询的是真实站内内容，不伪造一个 LLM。
6. 我不是**纵向时间轴叙事派**：Timeline 拆解为证据链（横向因果）与 Query Log（问题结构），传统简历轴被废除。
7. 我不是**滚动劫持动效派**：全站零 pin、零 preventDefault、零强制 stagger；唯二的滚动/揭示动效都单向、可跳过、有静态等价物。

---

## 14. 风险与自我批评

1. **最大风险——仪式疲劳**：自述装置对回访者可能从"记忆点"变成"路障"。已设三重防线：localStorage 记忆 resolved 态、装置下方常驻"跳过"锚点（从第一秒起就在）、回访直接呈现折叠索引条。若评测仍显示二次访问时长上升，装置退化为纯静态四行（降级方案写死在代码路径里）。
2. **Palette 可发现性低**：隐藏模式可能没人用。防线：chip 常显 + 一次性 toast + `/` 快捷键提示印在页脚；且主模式完备使损失为零——但这也意味着该特性的投入产出比必须诚实评估。
3. **隐喻过载**：如果每个模块都在讲"检索"，全站会变成主题公园。已划红线：检索隐喻只允许出现在 4 个触点（自述装置、palette、检索语境空态、Lab 诚实条款），Research/Notes/Contact 回归普通的好排版。
4. **"假数据"误读**：玩具可能被当成真实系统。防线：每个玩具常驻"什么不是真的"声明、手工数据独立文件、`sample: true` 角标系统贯穿全站。
5. **遮蔽层对低视力用户的灾难**：blur 遮蔽若作用于真实内容就是自残。设计上内容永远在 DOM、遮蔽只是 `aria-hidden` 装饰层、`prefers-contrast: more` 直接关闭遮蔽——但评审仍应质疑：为什么不干脆不遮蔽？答案：遮蔽是"未检索"隐喻的最低成本载体，且它必须随时可被任何用户一键绕过（输入或跳过），这个权衡写明，接受挑战。
6. **移动端玩具性能**：SVG 舞台在低端机的交互延迟。已设点数减载（24→16）与纯 transform 动画约束；仍是最需要真机验证的一环。

---

## 15. 可用性守护清单（全站，验收标准）

### 15.1 键盘地图

| 按键 | 作用 |
|---|---|
| `Tab` / `Shift+Tab` | 全站顺序焦点，`focus-ring` 2px accent 永远可见（outline offset 2px） |
| `⌘K` / `Ctrl+K` | 开/关 Query Palette |
| `/`（非输入焦点） | 打开 Palette |
| `↑` `↓` | Palette 结果线性导航（roving tabindex） |
| `Enter` / `Esc` | 执行 / 关闭并归还焦点 |
| `→` `←` | 自述装置：揭示 / 回退一条 |
| `1`–`4`（首屏焦点内） | 直接揭示对应侧面 |
| 顶部第一个 Tab | Skip to content 链接 |
| Palette 打开时 | 焦点圈闭（focus trap），`aria-modal` |

### 15.2 Reduced-motion 全量降级表

| 动效 | 降级 |
|---|---|
| 自述装置揭示过渡 | 240ms → 瞬时 opacity 切换；Beam 无弹簧 |
| 证据链连线绘制 | 直接静态渲染完整线条 |
| 主题 clip-path 扩散 | 直接换色 |
| Palette 进入 | 400ms → 瞬时出现 |
| 唯一循环动画（提示脉冲） | 完全移除，改为静态文字提示常驻 |
| 全站 hover 位移 | 保留（≤1px，不属 motion 范畴） |

实现：`<MotionConfig reducedMotion="user">` + CSS `@media (prefers-reduced-motion: reduce)` 双保险。

### 15.3 无 JS 核心可达

- 全部文本内容（含四条侧面、证据链、Research、Notes、空状态）为服务端产出的真实 HTML；`<noscript>` 环境下 `.no-js` 类移除遮蔽与一切 CSS-only 交互依赖。
- 导航是纯锚点 `<a>`；palette、装置、玩具为渐进增强，不可用时零内容损失（玩具显示静态讲解）。

### 15.4 SEO 兜底

- 每路由静态 title/description 模板；Open Graph + Twitter Card + OG 图（1200×630，静态排版图）；`sitemap.xml` + favicon（明暗双套）。
- JSON-LD `Person`（字段全部 TODO 占位，注释标明待填，不造假值）；首屏 LCP 是真实文本节点（非 canvas/图片）。
- 内容驱动：`content/*.ts` 全量数据化，`sample: true` 标记系统贯穿，替换数据即替换页面（§6 工程基线）。

### 15.5 其他硬指标

- 对比度：正文 ≥ 7:1，次要文本 ≥ 4.5:1，accent 文本用途 ≥ 4.5:1（§4 已标注实测值）。
- 触控目标 ≥ 44×44px；`--signal` 状态永不用纯色编码（配图标/文字）。
- `prefers-contrast: more`：关闭遮蔽层、divider 加深一档。
- 语义化 landmark（header/nav/main/footer）+ 全图 alt + 玩具结果 `aria-live="polite"`。

---

## 附录：sample 数据与替换指南

- `content/profile.ts`：wordmark、about 三行、（TODO：姓名/学校/邮箱——默认渲染为空触发 §12 规则）。
- `content/projects.ts`：3 条证据链，`sample: true`，UI 右上角 `[sample]` 角标。
- `content/research.ts`：Q01–Q04（真实兴趣方向），状态词仅限 reading / prototyping / writing-up。
- `content/writing.ts`：2 篇 sample 笔记，`sample: true`。
- `content/links.ts`：全部 TODO 空值 → 联系方式按 §12 规则不渲染。
- `content/lab/*.ts`：三个玩具的手工数据（向量表、语料、chunk），与演示逻辑分离，文件头注明"演示数据，非实验结果"。
