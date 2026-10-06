# Team E — Creative Developer：「BENCH / 工作台」— 网站即作品 1 号（The Site Is Exhibit #1）

> **方向**：一个 Creative Developer 的能力不需要被"声称"，只需要被"当场演示"。这个网站本身就是最有力的作品集证据——首屏是一件真的能玩的检索装置，Projects 是能上手操作的工件而不是截图，Lab 是一台台纯前端、离线可跑的实验台。美学基调是**井井有条的研究工作台（workbench）**：钢与纸、刻度与标签、每一件工具都在它该在的位置——不是游戏风，不是 terminal cosplay，更不是炫技清单：**每一件交互装置都有明确的信息职能、完整的键盘路径、和一套被精心设计过的静态降级形态。**
>
> 主设计师：Team E（Creative Developer）。本文件遵守 `BRIEF.md` 全部约束：§3 内容策略（零编造 / `sample: true` / 空状态一等公民）、§5 禁止清单、§6 工程基线（Vite 7 + React 19 + TS 严格模式 + Tailwind v4 + motion + `content/*.ts` 数据驱动）、§7 十四章交付结构。

**种子约束落点索引**（评委快速核对用）：

| 种子约束 | 落点 |
|---|---|
| 首屏 Canvas 轻量交互装置（60fps / 移动端 / reduced-motion 静态降级 / 主题贴合检索-鲁棒性） | §2.2 装置 P-00「Perturb · Retrieve」：交互脚本 + 性能预算表 |
| 键盘优先：快捷键体系（`g`+`r`、`/`）、focus 管理、快捷键发现性 | §7.1 快捷键总表 + §7.2 focus 管理规范 + §7.3 发现性三层设计 |
| 站内搜索（纯前端、索引来自 `content/*.ts`）作为核心导航 | §7.4 检索面板（Command Palette）完整规格 |
| Projects「可操作」而非「可浏览」，1–2 种具体版式 | §8 版式一 Specimen Sheet + 版式二 Bench Row |
| Playground 2–3 个纯前端离线 demo（含"投毒文档改写检索排名"），每个给交互脚本与视觉方案 | §10 LAB-01/02/03 三台装置全规格 |
| Workbench 美学、非游戏非 terminal cosplay、Light/Dark 完整 token 表 | §4 token 表 + §5 双主题策略 |

---

## 1. 设计理念

**一段话灵魂**：研究者与工程师的区别不在于谁说得更漂亮，而在于谁的论断可以被复现。这个网站把"可复现"翻译成视觉语言——它不是一份陈列品的橱窗，而是一张**摊开的工作台**：台面上有正在运行的装置（首屏检索场）、有编号归档的工件（Projects）、有三台真能上手拧动的实验设备（Lab）。访客的每一次拖拽、每一次按键、每一次检索，都在替主人公回答同一个问题："他做的 RAG 鲁棒性研究，长什么样子？"——不用他说，你摸得到。而这一切的纪律是：**装置永远不挡路**。关掉动画、丢掉鼠标、只用键盘、只用手机，工作台依然是一张完整、安静、高级的台子。

**三条设计原则**：

1. **可操作优先（Operate over Browse）**——凡是能做成真 demo 的内容，就做成真 demo；但每一件交互装置必须回答"它让访客多懂了什么"，答不上来的交互一律砍掉。动效是仪表的指针，不是烟花。
2. **诚实装置（Honest Apparatus）**——台面上显示的每一个数字都在访客浏览器里被真实计算（TF-IDF、cosine、overlap 全部现场算），绝不伪造实验数据、绝不假装修复了什么、绝不假装跑过 benchmark。教学性 demo 一律带"示意原型（Educational prototype）"铭牌。sample 内容全部 `sample: true`，替换入口统一在 `content/*.ts`。
3. **键盘与降级是设计，不是合规（Keyboard & Degradation as Design）**——快捷键体系是一等导航，`:focus-visible` 是被设计过的部件，`prefers-reduced-motion` 下的静态形态与动态形态由同一双手画出，两套都好看。任何装置在无 JS、无鼠标、无动效三种残缺世界里都保有尊严。

---

## 2. 首页信息架构

### 2.1 Section 顺序与理由

| # | Section | 内容 | 理由 |
|---|---|---|---|
| 00 | Hero（标题 + 装置 P-00） | 克制身份行 + 一句话主张 + 检索装置 | 记忆点在装置，装置即检索研究的自证 |
| 01 | Work（Selected Work 索引） | Bench Row 项目行 ×4–6 | 第二屏就给出"可操作"的证据，让访客立刻动手 |
| 02 | Research（研究台面） | RA 面板 + 研究问题 + 实验记录摘录 | 项目看完，正好解释这些项目服务什么研究 |
| 03 | Lab（实验台，落在 recessed tray 上） | 3 台装置入口 | Research 提到的每一个问题都能在这里"上手"，全站动线的高潮 |
| 04 | Notes | 2–3 篇 sample 笔记行 | 副线内容，克制即可 |
| 05 | Record（Timeline，隐藏式） | 毫无简历感的里程碑归档行 | 弱化为一条归档带，placeholder |
| 06 | Contact / Colophon | 占位链接 + 版记（本站技术栈、字体、构建信息） | Colophon 是 workbench 气质的收尾：展示台子本身是用什么造的 |

About 不设独立长文 section，其内容拆为 Hero 主张句 + Work 区侧栏 3 行自述（`content/profile.ts` placeholder）。Publications 为空，按 §12 策略在 Research 末尾占一个"仪位空槽"。

**首屏文案（真实信息内克制表达）**：

- 眉行（mono，11px，字距 0.08em）：`CS GRADUATE STUDENT · RESEARCH × ENGINEERING`
- 主张行（display-1）：`Retrieval, perturbed, made robust.`（中文环境渲染 `检索 · 扰动 · 使其鲁棒。`）
- 副行（body，muted）：一句话：研究 Retrieval-Augmented Generation 的鲁棒性——知识投毒与防御、检索与生成的相互作用。这个站本身就是一件可以上手的工作台。
- 右下角两个 mono 动作点：`按 / 检索本站`、`进入 Lab →`。

**禁止项自查**：无 "Hi, I'm XXX"；姓名只在 wordmark 位留 `profile.name` placeholder（未配置时渲染 mono 占位 `—— · PORTFOLIO`）；无头像。

### 2.2 首屏装置 P-00「Perturb · Retrieve」（种子约束核心交付）

**概念**：一块带刻度边框的"仪表面板"，里面是一片**文本-向量场**：160–220 个真实关键词（来自站点内容词表 + RAG 术语：`RAG / rerank / BM25 / chunk / embedding / query / corpus / poisoning / robustness / TF-IDF / hallucination / guardrail …`）按构建期预计算的 2D 坐标分布，**同类相聚**（投毒/防御词聚成一簇，检索词聚成一簇）。词点之间以细发丝线连接近邻。它是首屏唯一的图像，主题就是主人公的研究本身：**一次看得见的检索，与一次看得见的扰动-恢复。**

**装置文案与读数（全部真实计算，杜绝随机假数）**：面板四角是 mono 刻度读数——左上：`FIELD: 196 WORDS`（真实节点数）；右上：`QUERY: poisoning`（当前查询词）；左下：`TOP-5: defenses · corpus · attack · RAG · filtering`（实时最近邻检索结果，词间距离即 toy 相似度）；右下：`DRIFT: on / PAUSED`。

**交互脚本（三个输入通道并列）**：

| 步骤 | 指针（鼠标/触屏） | 键盘 | 发生什么 |
|---|---|---|---|
| 1 · 待机 | 无操作 | 无操作 | 词点以极慢噪声漂移（幅度 ≤ 2px）；每 5s 自动换一个 query 词，其 top-5 近邻词与连线染 accent 色，其余保持墨色。这是一个自动运行的检索演示 |
| 2 · 扰动 | 指针移入场内 | 焦点在面板上时按方向键移动"虚拟光标" | 半径 90px 内的词点被柔性推开（spring 刚度 0.08，阻尼 0.82），连线随之拉伸变淡。左下读数追加一行 `PERTURBED: 12 NODES`（受扰词数，真实统计） |
| 3 · 恢复 | 指针离开 / 按住不动 2s | 停止按键 2s | 词点弹回原位——**鲁棒性的可视化隐喻：场被扰动后会恢复**。恢复过程用弱弹簧而非回弹动画，克制不弹跳 |
| 4 · 拖拽检索 | 按住拖动划出"查询轨迹" | 虚拟光标 + Enter | 轨迹沿途 k 近邻词被实时排序，top-5 读数逐词更新（词名从灰到 accent 逐个点亮，每词间隔 80ms） |
| 5 · 钉住 | 单击某个词 | 虚拟光标对准词 + Enter | 该词被钉为 query，连线固定；读数区出现 `↳ 用 "poisoning" 检索全站 [Enter]`——回车直接打开 §7.4 站内检索并预填该词。**装置由此接入全站导航，不是孤立的玩具** |
| 6 · 退出 | — | Esc / Tab | 取消钉住，Tab 把焦点移出面板到下一个可聚焦元素 |

**可达性与降级**：

- 面板是 `role="img"` + `aria-label="交互式关键词检索场：可用方向键扰动，Enter 钉住查询词"` 的聚焦区；词表另有一份屏幕阅读器可读的 `<ul>`（视觉隐藏，或提供"以列表查看"切换），保证信息不锁在 canvas 里。
- 点击词触发的是真实导航行为（打开检索），因此装置永远有"不用它也不损失信息"的兜底：canvas 上方就是标题与主张句，一切关键信息不依赖装置。
- **`prefers-reduced-motion: reduce`**：漂移、弹簧、逐词点亮全部关闭，渲染一张**被设计过的静态快照**——初始 query 的 top-5 连线与读数静止呈现（同一构图函数 `renderStatic()` 生成，非截图）。直接操作（点击钉词、方向键）仍可用，但更新瞬时完成、无过渡。面板右上角对所有人常驻一个 `PAUSE` mono 按钮（可暂停漂移，状态持久化到 localStorage）。
- 无 JS：SSR/构建期直接输出同构图的静态 SVG 快照 + `<noscript>` 提示，构图不塌。

**性能预算（硬指标，写入验收）**：

| 项 | 预算 |
|---|---|
| 节点数 | 桌面 ≤ 220，移动 ≤ 90（按 `min(breakpoint, deviceMemory≤4GB)` 缩减） |
| 帧预算 | 桌面 ≤ 8ms/帧，移动 ≤ 14ms/帧，目标 60fps；掉帧检测连续 30 帧 < 45fps 自动降为"半速漂移 + 隐藏连线" |
| 渲染 | 单 canvas 2D，DPR 上限 2；词条文字构建期预渲染为 sprite（`OffscreenCanvas`），每帧仅 `drawImage`；邻接对在构建期一次性生成（O(n²) 只算一次），每帧零距离计算 |
| 动画 | 唯一 `requestAnimationFrame` 循环；`visibilitychange` 与 `IntersectionObserver` 离开视口即停 |
| 内存 | JS 堆增量 < 30MB；sprite 图集 < 2MB |
| 体积 | 装置代码 + 词表数据 lazy chunk ≤ 24KB gzip，首屏关键路径不含它也完整（标题先渲染，装置 hydration 后淡入 200ms） |

---

## 3. Typography

**字体选择与理由**：正文与展示用 **IBM Plex Sans**（400/500/600），元数据、代码、读数用 **IBM Plex Mono**（400/500）。理由：Plex 家族为工程文档而生，mono 与 sans 同源，台面刻度、仪表面板、正文天然是同一种材料——"实验室工具感"从字体开始，而不靠装饰。刻意不用 serif display（那是 B/D 的领地），也不用 Space Grotesk 类几何 display（避免现代 AI 模板味）。CJK 不加载 webfont（体积红线），走系统栈：`"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC"`，Latin 用 `unicode-range` 子集 woff2（≤ 3 个字重）。`:lang(zh)` 下全局加 `letter-spacing: 0.01em` 并放大标点悬挂处理。

**完整字号阶梯**（px 按桌面渲染值，实现用 rem）：

| Token | 字号 | 行高 | 字距 | 字重 | 用途 |
|---|---|---|---|---|---|
| display-1 | clamp(44px, 3vw+36px, 88px) | 1.04 | −0.02em | 600 | Hero 主张行 |
| display-2 | clamp(32px, 2vw+22px, 56px) | 1.08 | −0.015em | 600 | Lab/Work 区头 |
| title-1 | 28px | 1.25 | −0.01em | 600 | 页面标题、项目名 |
| title-2 | 20px | 1.4 | 0 | 600 | 小节标题、demo 名 |
| title-3 | 17px | 1.5 | 0 | 600 | 列表行标题 |
| body | 16.5px | 1.75 | 0 | 400 | 正文（`text-wrap: pretty`） |
| body-sm | 15px | 1.65 | 0 | 400 | 侧栏、注释 |
| mono-meta | 13px | 1.5 | 0.02em | 400/500 | 读数、路径、表格数据 |
| label | 11px | 1.4 | 0.08em, uppercase | 500 | 区块铭牌 `02 · RESEARCH`、kbd 键帽 |
| micro | 11px | 1.3 | 0.08em | 400 | 面板四角刻度读数 |

**行宽控制**：正文散文 `max-width: 40rem`（Latin ≈ 70ch，中文 ≈ 36 字/行）；侧栏 meta 列 `max-width: 22rem`；代码块 `max-width: 56rem`、行高 1.6。全局 `orphans/widows: 3`。

---

## 4. 颜色体系

**情绪**：Light = "台面纸与钢"——暖纸灰台面、白纸工件、制图蓝墨水；Dark = "熄灯后的台面"——深蓝黑阳极氧化钢面，读数微亮。全程近中性 + **单一 accent：制图蓝（Drafting Blue）**——每一件工件都是先画图再制造的，蓝是图纸上墨的颜色。另有一个功能色**铅封红（Stamp Red）**，只在 Lab-01 投毒场景与破坏性状态出现（红色是被"盖章"使用的，不是装饰）。

**Light Theme — Paper & Steel**：

| Token | Hex | 用途 |
|---|---|---|
| `--bg` | `#F4F3EF` | 台面（暖纸灰页面底） |
| `--surface` | `#FFFFFF` | 工件纸面（面板、demo 窗） |
| `--surface-2` | `#ECEAE4` | 凹槽台面（Lab 区、代码底、仪表凹面） |
| `--text` | `#1C1B18` | 主文（对 `--bg` 对比 ≈ 15:1） |
| `--muted` | `#6E6A61` | 次要文（≈ 4.9:1，AA 通过） |
| `--divider` | `#DAD7CE` | 发丝线、刻度 |
| `--accent` | `#1F5ED1` | 交互蓝（大字号/图形） |
| `--accent-text` | `#1B55C4` | 文字链接蓝（≈ 6:1） |
| `--accent-dim` | `rgba(31,94,209,0.12)` | 选中底、hover 洗色 |
| `--stamp` | `#B4232A` | 铅封红（投毒、警示、delta 负向） |
| `--ok` | `#2F6B3A` | 正常状态点、delta 正向 |
| `--code-bg` | `#ECEAE4` | 代码底 |
| `--code-text` | `#33312C` | 代码文 |
| `--code-keyword` | `#1B55C4` | 关键字 |
| `--code-string` | `#3F6E44` | 字符串 |
| `--selection` | `rgba(31,94,209,0.18)` | 选区 |

**Dark Theme — Ink Bench**：

| Token | Hex | 用途 |
|---|---|---|
| `--bg` | `#12151A` | 台面（深蓝黑，非纯黑） |
| `--surface` | `#181C23` | 工件面 |
| `--surface-2` | `#1F242D` | 凹槽 |
| `--text` | `#E7E5E0` | 主文（暖白，≈ 14:1） |
| `--muted` | `#8C919B` | 次要文（≈ 5.8:1） |
| `--divider` | `#2A2F39` | 发丝线 |
| `--accent` | `#6FA0F0` | 交互蓝（≈ 6.9:1） |
| `--accent-text` | `#8AB2F5` | 文字链接蓝（≈ 8:1） |
| `--accent-dim` | `rgba(111,160,240,0.16)` | 选中底 |
| `--stamp` | `#F0716D` | 铅封红（暗色提亮版） |
| `--ok` | `#63B57C` | 状态点 |
| `--code-bg` | `#1F242D` | 代码底 |
| `--code-text` | `#D9D7D0` | 代码文 |
| `--code-keyword` | `#8AB2F5` | 关键字 |
| `--code-string` | `#8CC49A` | 字符串 |
| `--selection` | `rgba(111,160,240,0.28)` | 选区 |

纪律：accent 在任一视口内的出现面积 ≤ 5%（查询词、连线高亮、focus 环、主按钮、当前区刻度）；红色只出现在 Lab-01 与"示意/警示"语境；禁止大面积渐变（唯一的"渐变"是 Lab 凹槽区 2% 深度的线性明度过渡，模拟台面凹陷的物理感）。

---

## 5. Light / Dark Mode 策略

- **两套各自被设计**：Light 是"白天在台前工作"——纸面工件白得发亮，蓝墨水清晰，刻度是压印的浅痕；Dark 是"熄灯后台面上只剩仪器通电"——钢面蓝黑，读数是发光的，连线在暗处更细（0.75px vs Light 的 1px），canvas 装置的 accent 连线在暗色下亮度提高一档。二者共享构图，不共享情绪。
- 三态 Light / Dark / System，`localStorage` 持久化，System 跟随 `prefers-color-scheme`；首屏内联 1KB 脚本防闪烁（FOUC）。
- 切换体验：`t` 键或头部仪钮切换，160ms 交叉淡入（`View Transition API` 可用则用，不可用降级 CSS transition）；`prefers-reduced-motion` 下瞬时切换。
- 主题切换动的不是颜色 token 之外的任何东西——布局、装置、读数全部保持原位，只有"光照"变了。这是 workbench 的隐喻：**晚上把顶灯关掉，台子还是那张台子。**

---

## 6. 布局系统

- **网格**：12 列，`max-width: 1200px`，gutter 24px，页边距 `clamp(20px, 6vw, 96px)`。散文占中 8 列；项目 Specimen Sheet 用 4（meta）+ 8（工件窗）非对称；Lab 页双列仪架（桌面）。
- **台面标尺（Bench Ruler）**：桌面（≥1280px）左侧 56px 固定竖轨——一条全高发丝线 + 一个随 scrollspy 滑动的 accent 刻度块（高度 24px，`transform` 过渡 240ms）+ 当前区 mono 竖排标签。它是"台子边缘的钢尺"，与 F 队"把整张网格露出来"不同：我只露一把尺。
- **间距节奏**：8px 基数（刻度细节允许 4px）；section 垂直 padding 桌面 128 / 平板 96 / 手机 64；标题块与正文之间 32px；相关行组间距 12px、组间 24px——"同一抽屉里的东西放得近"。
- **Section 过渡**：统一模式 = 铭牌行（`label` 字号：`02 · RESEARCH`）+ 全宽发丝线 + 标题。Lab 区整体落在 `--surface-2` 凹槽底上（页面唯一的底色变化），物理隐喻：台面上唯一的"水槽区"留给动手实验。
- 工件窗（demo/代码）一律带 1px `--divider` 边框 + 四角 8px 刻度短线（纯 CSS 伪元素），这是全站统一的"仪表面板"母题。

---

## 7. 主要交互与动效

### 7.0 动效纪律

时长：120ms（状态反馈）/ 200ms（内容进入）/ 320ms（大面板）；缓动 `cubic-bezier(0.2, 0.7, 0.3, 1)`；只动 `transform/opacity`；全页同时动画元素 ≤ 3；`motion` 库统一封装 `<Motion config>`，全局 `useReducedMotion()` 一票否决。禁止：视差、bounce、滚动劫持、逐字飞入。

### 7.1 键盘快捷键体系（种子约束）

| 按键 | 动作 | 焦点行为 |
|---|---|---|
| `/` | 打开站内检索面板（Command Palette） | 焦点移入搜索输入框；Esc 关闭并归还焦点给触发者 |
| `g` `r` / `g` `p` / `g` `l` / `g` `n` / `g` `h` / `g` `c` | 跳转 Research / Projects / Lab / Notes / Home / Contact | 和弦窗口 1.2s；路由后焦点移到该页 `h1`（`tabIndex={-1}`），屏幕阅读器播报页名 |
| `t` | 循环 Light → Dark → System | 焦点不变；右下 mono toast 播报当前态 2s |
| `?` | 打开快捷键帮助浮层 | 浮层内 Tab 循环，Esc 关闭 |
| `↑` `↓` | 检索结果 / 项目行导航 | 活动行获 `aria-selected`，滚动跟随 |
| `←` `→` | 工件窗 tab 切换（Demo/Code/Notes） | roving tabindex |
| `Enter` | 装置 P-00 钉住虚拟光标处最近词 / 打开选中项 | 同上 |
| `Esc` | 关闭浮层 / 取消钉住 | 焦点归还 |
| Tab 首击 | 显示"跳到内容" skip link | 标准行为 |

冲突保护：所有快捷键仅在非输入焦点时生效（`event.target` 非 input/textarea/contenteditable）；浏览器保留键不劫持。

### 7.2 Focus 管理

`:focus-visible` 全站统一为 2px `--accent` 外描边 + 2px offset；在仪表面板母题上，focus 环自动换形为**四角刻度变亮**（同一视觉语言的 focus 态）。Canvas 装置、检索面板、tab 组、demo 控件均有完整的键盘路径（见各自章节）；路由切换必移焦到 `h1`；对话框一律 focus trap + `aria-modal`。SPA 内 `aria-live="polite"` 区域播报路由与检索结果数。

### 7.3 快捷键发现性（三层）

1. **常驻层**：页脚一条 mono 快捷键带：`/ search · g-r research · g-l lab · t theme · ? all keys`；头部检索按钮上常驻 `/` kbd 键帽。
2. **求助层**：`?` 打开的全键位浮层（分组：导航 / 主题 / 装置 / 检索），每条附一句功能说明——这是键盘用户的正式文档。
3. **情境层**：导航项 hover/focus 时浮出对应 kbd 键帽（120ms 淡入）；首次到站（localStorage 标记）右下出现一次 3s toast：`支持全键盘操作 · 按 ? 查看快捷键`，绝不弹窗打断。

### 7.4 站内检索 = 核心导航（Command Palette，种子约束）

- **索引**：构建期 Vite 插件遍历 `content/*.ts`（profile/projects/research/writing/labs/links）产出 `search-index.json`：`{ type, id, title, path, headings[], body, tags[], demo? }`；纯前端运行，无任何服务。
- **评分**：客户端 BM25（k1=1.4, b=0.75）+ CJK bigram 切分 + 子序列模糊兜底；索引量级数百条，keyup 同步执行无感延迟。Lab demo 深链支持检索直达状态（如 `/lab/poison?q=robustness`）。
- **UI**：屏幕中上 12vh 处 640px 面板（仪表面板母题）：输入框 + 分组结果（Project / Research / Note / Demo），每行 = type 铭牌 + 标题（命中词 `<mark>` 样式为 accent 下划线，非高亮块）+ mono 路径 + 单行摘要；空 query 显示最近访问与命令（`> theme dark`、`> copy email` 占位命令）。
- **地位**：检索不是彩蛋，是导航的另一半——头部有钮（带 `/` 键帽）、装置 P-00 能唤起它、移动端是头部第一图标。`g`+`r` 是"知道去哪"的人用的，`/` 是"只想找"的人用的。

### 7.5 Signature Interaction 清单

1. 装置 P-00（§2.2）——首屏签名；
2. **Bench Ruler 滑刻**（§6）——导航即仪表；
3. 项目行 hover 的终端式预览打字（§8 版式二，reduced-motion 直接静态呈现）。

---

## 8. Projects 展示方式（禁止三列卡片墙，两种具体版式）

### 版式一 · Specimen Sheet（工件标本板，用于详情页与首屏精选 2 件）

满宽纵向版式，自上而下四个分区：

1. **头部带**：mono 档案号 `WK-2025-03`（编号规则 `WK-年份-序号`，与 content 数据一致）+ title-1 项目名 + 一行 Role/Year（`Role: solo · Year: 2025 · sample`）。
2. **工件窗（Operating Window）**：16:10 仪表面板，三态内容按项目能力切换：
   - **A · Live 嵌入**：可交互 mini demo（lazy、代码分割、沙箱 props），如为某个检索工具做的 30 秒上手场；窗角常驻 mono 状态读数（如 `INDEX: 42 DOCS · QPS: live`——全部真实计算）。
   - **B · Schematic Session**：无可运行 demo 时，播放一段**终端式会话**——但它是诚实版式：内容取自该项目真实命令与输出摘录（`sample: true` 项目里为示意脚本），左上角标注 `SCHEMATIC SESSION · 示意会话`，逐字打字 12ms/字符，输出行成块出现；reduced-motion 下整段静态呈现为 `<pre>`。**绝不伪造 benchmark 数字**，会话只演示行为，不声称成绩。
   - **C · 静态图**：架构 SVG 图 + 图注。
3. **Tab 条**：`Demo / Code / Notes`（roving tabindex + 方向键）：Demo 即上述工件窗；Code 展示真实源码关键摘录（语法高亮、行号、`56rem` 滚动面板）+ `View full source →` 链接位；Notes 是 3–5 条设计决策（`- 选 TF-IDF 而非 embedding：语料 42 篇， lexical 足够且可解释`）。
4. **Meta 列**（桌面右侧 4 列 / 移动端头部下方折行）：Stack（mono 文本逗号列表，非技能条）、Links（GitHub/Demo，placeholder 用 `TODO` 铭牌渲染）、Status plate（`ACTIVE / ARCHIVED` 刻字状态块）。

### 版式二 · Bench Row（台面行，用于 Work 索引页）

**行列表，不是卡片**。每行 = `mono 序号 01` + title-3 项目名 + 一行 muted 摘要 + 行尾 stack 词（mono）+ 右缘 `operate →`。行与行之间只有发丝线。

- **指针增强**：hover 时行下方滑出 200px 高的预览带（0.75px 边框，不出现在行内文本上层）：内部按项目类型渲染 mini demo 静态帧 / 会话打字预览 / 架构图缩略；hover 移开即收。**hover 永远只是增强**——没有 hover 也不损失任何信息。
- **触屏/键盘**：无 hover 的环境里，行可展开（Enter/点击），原地手风琴展开同一预览带 + `Open case study →`。展开态用 `aria-expanded` 声明。
- 整行可聚焦（`role="link"` 语义用真 `<a>` 包裹标题，展开钮独立），Tab 顺序 = 视觉顺序。

---

## 9. Research 展示方式

Research 区的组织单位不是"兴趣标签云"，而是**研究台面（bench areas）**：

- **RA 面板**：每个研究方向一个发丝线围合的面板，头部 mono 铭牌 `RA-01 · RAG ROBUSTNESS`，正文两行克制描述 + 关键词 mono 行（`poisoning · detection · filtering`）+ 右缘交叉链接 `→ 在 LAB-01 里操作它`。**Research 与 Lab 双向互链**是本方案独有动线：读到的问题可以立刻上手，玩过的 demo 能跳回它服务的问题。六个真实方向（RAG / Robustness / Knowledge Poisoning / AI Security / LLM Systems / Retrieval-Generation Interaction）即六块面板。
- **Question 行**：当前研究问题以编号行呈现（`Q1 · 投毒文档能否在不重训的情况下被lexical特征识别？ · 状态: exploring`），状态用 mono 词 + 状态点，不画进度条。为 placeholder 时整组隐藏。
- **实验记录摘录（Notebook Excerpt）**：一张 mono 表格样式的"实验记录本摘录"——列：`EXP-ID / 问题 / 设置 / 观察`，2–3 行 sample（`sample: true`，明确标注示例），内容演示"如何记录实验"而非任何成绩。它比论文列表更能让招聘者/研究者读懂主人公的工作方式。
- **Publications 空槽**：区末一个空仪位（见 §12），不渲染假条目。

---

## 10. Playground / Lab 概念（最强模块）

**入口形态**：`/lab` 是台面上的凹槽区——页头 `display-2: Lab.` + 一句话（`三台可以拧动的装置。全部在你的浏览器里离线运行，没有服务器，没有假装。`）+ 仪架：三块竖排仪表面板，每块 = mono 编号铭牌（`LAB-01`）+ 名称 + 一行描述 + 状态点（`ok · offline` 绿点 = 离线可跑）+ `Open →`。**不是卡片墙**：面板全宽、之间发丝线分隔，每块右缘露出该装置的一个 24px 微缩静帧（SVG）。每台装置页顶部常驻铭牌：`教学示意原型 · Educational prototype — 语料与数值均为示例，在浏览器内实时计算`。

### LAB-01 · Poison the Retrieval（投毒如何改写检索排名）——旗舰 demo

- **概念**：一个玩具级 TF-IDF 检索沙盘：8 篇 sample 文档（RAG 主题短文，`sample: true`）构成的语料，访客输入 query，实时看到排名与得分条；然后**亲手投毒**——添加一篇为特定 query 调过关键词的文档，看它插队到 top-1。这正是主人公主修的威胁模型的微缩模型。
- **交互脚本**：① 选择/输入预置 query（`how does RAG fail under attack`）；② 观察左栏语料列表的得分条与右栏排名；③ 点 `Add poisoned doc` ——一篇预置投毒文档（关键词堆叠：`RAG fail attack robustness RAG fail…`）入场，排名面板出现 delta 箭头（`▲4` 铅封红），投毒文档整行铅封红描边；④ 编辑投毒文档文本（textarea），得分条实时跟随词汇频率变化——访客自己发现"堆叠关键词即可劫持 lexical 排名"；⑤ 点 `Defense: keyword-cap` 开关，模拟一个 20 行的词频上限防御，看投毒效力回落；⑥ `Reset` 复位。
- **视觉方案**：双栏 7+5——左栏语料为发丝线分隔的行列表，每行标题 + mono 片段 + 3px 高得分条（accent 填充，投毒行 `--stamp`）；右栏排名榜 + delta 箭头列；底部一条解释行（body-sm，muted）：`没有训练、没有后门：一篇会写关键词的文档就够了。这就是 lexical 检索的攻击面。`
- **实现要点**：无依赖 ~200 行 TS（分词 → tf → idf → cosine，`useMemo` 缓存 idf 表）；UI 状态 `useReducer`；lazy chunk ≤ 12KB gzip；得分条变化 120ms 宽度过渡（reduced-motion 瞬时）。

### LAB-02 · Chunking Workbench（切块如何决定召回）

- **概念**：同一篇 sample 长文，切块参数不同，"哪个块会被检索命中"就不同——把 RAG 工程里最日常的 chunking 折衷变成可触摸的东西。
- **交互脚本**：① 预置一篇 600 词短文（内置一个隐藏"考题"：`文中哪一段定义了失败模式？`）；② 拖 chunk size 滑杆（120–800 token）与 overlap 滑杆（0–40%）；③ 中部"切块丝带"实时重切：一条水平带按块分节（发丝线分节 + 悬停显示块号与词数）；④ 下方向 toy lexical 打分标出命中的块，命中节 accent 填充；**当正确答案恰好被切在块边界**，边界出现铅封红虚线 + 提示 `answer split across chunks——这就是 chunking 的代价`；⑤ 滑杆全部键盘可达（方向键步进 20 token）。
- **视觉方案**：纵向三段式——控件行（仪表面板内嵌滑杆，30px 高拇指、44px 触控目标）/ 丝带（56px 高，刻度线每 100 token）/ 命中面板。全部色彩只用 accent/stamp/divider 三种。
- **实现要点**：~150 行；滑杆用原生 `<input type="range">`（可访问性白得）；切块为纯函数 `splitChunks(text, size, overlap)`，便于单测。

### LAB-03 · Query Stress Bench（扰动下的检索稳定性）

- **概念**：鲁棒性的另一面：query 被打错字、被改写时，检索结果还稳吗？复用 LAB-01 的 toy 检索核，扰动 query，量化"结果漂移"。
- **交互脚本**：① 选一个基线 query，记住 top-5；② 拖 typo rate 滑杆（0–30%，按比例替换字符）或点 `Synonym swap`（预置同义词表随机替换）；③ 每次扰动自动跑一次检索，结果面板显示 `Recall@5 = 3/5`（与基线 top-5 的交集，真实计算），新进榜的词标 `+`、掉出的标 `−`；④ 面板右缘一条 12 次运行的 sparkline（24px 高，accent 折线）；⑤ `Reset` 清空历史。
- **视觉方案**：左右 6+6：左为 query 扰动台（当前 query mono 大字展示，被扰动字符下加铅封红点线）；右为 top-5 对照列表（基线 vs 当前，逐行 delta）+ sparkline。读数全部 mono，大号 `Recall@5` 数字是页面唯一的大字读数。
- **实现要点**：~150 行；typo 注入用确定性 seed（可复现，符合"诚实装置"）；sparkline 为 12 点折线 SVG。

**Lab 的纪律**：三台装置共享同一个检索核模块（~80 行），互不重复；每台 ≤ 12KB gzip、无第三方运行时依赖、断网可用；所有"结果"都是访客浏览器现场计算的示意，页脚统一声明。

---

## 11. 移动端方案（重新设计，不是缩放）

- **导航**：头部收缩为 wordmark + 检索图标 + 菜单。`g` 和弦无意义 → 移动端以**检索为第一导航**（全屏 palette，结果分组可滚动），菜单为底部滑出 sheet（44px 行高、safe-area 适配）；快捷键提示在触屏环境自动隐藏。
- **装置 P-00**：移动版独立参数（90 节点、全宽 420px 高、radius 70px），触摸拖拽 `touch-action: none` 仅限 canvas 内部，页面滚动不受劫持；单击钉词与"用此词检索"在拇指可达的下半区。
- **Projects**：Specimen Sheet 纵向堆叠（工件窗置顶、meta 折行为单行 mono）；Bench Row 的 hover 预览变为点击展开手风琴；tab 条变为可滑动的 segmented control（`scroll-snap`）。
- **Lab**：触屏优先控件（滑杆拇指 44px、按钮 ≥ 44px、双栏改纵向、得分条横向占满）；三台装置的交互脚本在移动端全部成立（这是选题时就约束过的：不用 hover 依赖型 demo）。
- **移动特有体验**：底部轻量"工具坞"只含检索与主题两钮（拇指区），Lab 内长按装置铭牌可分享深链；其余一切保持与桌面同构。
- 性能：移动优先加载顺序 = 文案 → 装置（lazy）→ demo（进入视口才加载）；Lighthouse 移动端目标 Perf ≥ 90、A11y 100。

---

## 12. 空状态策略

- **Publications（空）**：Research 区末尾一个"预留仪位"：虚线发丝线围合的空面板，中央一行 body：`Selected research will appear here.`，其下一行 mono micro：`BAY RESERVED · WK-????`。像台面上为还没到的仪器刻好的安装孔位——克制、幽默、且明确传达"会持续有内容"，绝不显得没做完。文案由 `content/publications.ts` 的空数组驱动。
- **Awards 等无内容模块**：直接不渲染（一等公民策略），路由与导航同步隐藏。
- **Notes < 3 篇 / Projects 替换期**：行数自适应，行列表天然不怕少；任何 section 内容数 < 2 时隐藏序号铭牌的序号位。
- **Contact**：链接行逐项渲染 `content/links.ts`，未配置项不渲染；全空时只留一行 mono：`Links will be added as they exist.`。
- **Search 无结果**：`No matches for "xx" · 试试 g-l 去 Lab，或清空查询`——空结果也是导航机会。

---

## 13. 与其他 7 个方案的差异（我不是什么）

- **A（Monograph 极简）**：A 把一切删到只剩排版让人**读**；我把装置留在台面上让人**操作**——但每一件装置都服从同样严格的排版纪律。
- **B（Editorial 期刊）**：B 用刊号、栏目与长文让**内容**当主角；我的主角是可运行的工件，页面是台面而不是刊物，Notes 只是副线。
- **C（精密仪器）**：C 的仪器给**读数**，美在展示与校准；我的台面给**工具**，美在使用——读数只是动手之后的结果。
- **D（Offprint 研读本书）**：D 以阅读为中心、纸面学术礼仪式排版、Tufte 边注；我以操作为中心，demos 与 Research↔Lab 互链是一等公民。
- **F（坐标纸 Swiss）**：F 把网格与编号本身当作美学本体全部露出；我的网格沉在台面下，编号只用于工件与实验归档，露出来的永远是工具。
- **H（可检索的人）**：H 把整个站点隐喻成一个检索系统、行为即检索；我不做全站隐喻——隐喻只浓缩在首屏一件装置里，其余全是具体、独立、真能离线跑的 demo。
- **G（本轮未读到其方向）**：差异化按"不重合假设"处理——本方案的保险在于所有交互均绑定内容职能 + 明确的 workbench 材质语言（IBM Plex 双族 + 制图蓝/铅封红），不与任何"纯风格系"方案共享辨识特征。

---

## 14. 风险与自我批评

1. **最大的翻车点：变成炫技清单。** 三台 demo 若不与研究叙事互锁，就只是三个玩具，评委一眼看穿"互动 ≠ 能力"。防线：Research↔Lab 强制互链、每台装置头部的研究问题铭牌、§1 原则 1 的"信息职能"验收项。
2. **与 C（仪器）和 F（网格）的暗合风险。** 近中性底 + mono 读数 + 刻度母题，稍一松手就滑向"又一个深色工程站"。防线：材质语言的三处独占——铅封红只属于投毒叙事、凹槽区只有 Lab 有、Bench Ruler 只此一把；accent 蓝坚决不让渡给装饰。
3. **性能长尾。** canvas 装置 + 三个 demo 在低端安卓上是真实威胁。防线全部写死在预算表（§2.2）：节点缩减、sprite、邻接预计算、双停机条件（visibility + 视口）、降帧自动降级；demo 全部懒加载且无依赖。
4. **可达性的暗坑。** 装置最容易做成"鼠标专属"。防线：键盘虚拟光标、ARIA 词表兜底、PAUSE 常驻、reduced-motion 静态快照与动态形态同源渲染——降级态必须进设计评审，不许当补丁。
5. **诚实性的维护成本。** "数字都是真算的"意味着检索核代码要长期保持正确；sample 语料更新时 demo 结果会变。防线：检索核独立模块 + 单测；demo 文案与 `content/*.ts` 同源。
6. **内容的反噬。** 5 年后项目多了，Specimen Sheet 的操作窗可能没时间维护。防线：三种窗态（Live/Session/静态图）都设计过，任何项目至少能用最省力的 C 态保住版式完整；Bench Row 本质是行列表，100 个项目也不塌。

---

*附：实现交接提示——装置 P-00 与三台 Lab demo 共享 `lib/retrieval-core.ts`（分词/TF-IDF/cosine，纯函数）；`content/*.ts` 新增字段：`projects[].window: 'live'|'session'|'diagram'`、`labs[].id/badge/corpus`；检索索引由 Vite 插件在 `buildStart` 钩子生成。所有 sample 数据文件头部统一注释：`// sample content — replace via content/*.ts, marked with sample: true`。*
