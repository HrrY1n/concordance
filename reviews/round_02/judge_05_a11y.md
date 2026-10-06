# Round 2 评审报告 — Judge 05 · Accessibility（无障碍）

> 评审对象：`generation_02/team_a_monograph` / `team_d_offprint` / `team_h_retrieval`。
> 方法：先看截图（`shots/gen2/` 下 a2/ap、d2/dp、h2/hp 各视口×主题），再逐案抽查 ≥3 处组件源码验证 DESIGN_NOTES 声明（本次每案实读 9–11 个文件），对比度全部由脚本从源码 token 实算（WCAG 2.1 相对亮度），不采信自述数值。
> 主权重清单：键盘可达性、语义结构、ARIA、对比度（双主题实算）、prefers-reduced-motion / prefers-contrast、alt 与控件 label。

---

## 0. 三案共同的及格线（本轮任务书强制项）

| 检查 | A | D | H |
|---|---|---|---|
| 无 FOUC 三态主题（index.html 内联脚本） | ✅ `index.html:27-43` | ✅ `index.html` 内联 + `theme.tsx:62-68` 回读 DOM | ✅ `index.html` + `theme.ts` |
| prefers-reduced-motion 全量降级 | ✅ CSS kill-switch（`index.css:274-289`）+ JS 门控（VT/theming/settle/layout 全部检查 `matchMedia`） | ✅ CSS（`index.css:466-477`）+ `useReducedMotion` 门控 Reveal/沙盒 layout/主题 fade | ✅ CSS（`index.css:129-140`）+ `MotionConfig reducedMotion="user"` + `rank-fill` 单独关 transition |
| skip link | ✅ `App.tsx:61-66` | ✅ `chrome.tsx:43-52` | ✅ `App.tsx:100-102` + `index.css:285-301`（transform 滑入式） |
| 诚实空态可感知（aria-hidden ghost 槽） | ✅ `sections/Publications.tsx:23` | ✅ `PublicationsSection.tsx:28` | ✅ `Publications.tsx:24` |
| console error | ✅ `a2/ap.console.json` = `[]` | ✅ `d2/dp.console.json` = `[]` | ✅ `h2/hp.console.json` = `[]` |

三案的 reduced-motion 纪律都是真的：A 在 `navigate()`（`App.tsx:54-55`）、主题切换（`useTheme.ts:64-76`）、Hero settle（`Hero.tsx:34-42`）、sandbox layout（`Lab.tsx:120,129`）四处分别门控；D 在 Reveal/Overlay/沙盒/主题 fade 门控；H 双保险。**没有任何一案只写 CSS 不查 JS**。

---

## 1. Team A「Monograph」

### 做得好（源码验证）

1. **对话框基础设施是三案中最完整的通用件**：`src/hooks/useDialog.ts` 一个 hook 收敛滚动锁、初始焦点、Esc、Tab 焦点圈、焦点归还 opener（`SearchDialog`/`IndexOverlay` 共用）；搜索框 `aria-label`，结果列表有 `role="listbox"/"option"/aria-selected`，空态是一句可读文本（`SearchDialog.tsx:127-131`）。`/` 快捷键排除输入焦点（`App.tsx:34-49`）。
2. **语义骨架干净**：每个章节 `section aria-labelledby + tabIndex={-1}`（`Section.tsx:18-22`），搜索跳转后 `el.focus({preventScroll:true})` 把焦点真正交给目标章节（`App.tsx:56`）——这是多数作品集站会漏掉的一步。导航 `aria-current="location"`；Lab 两个 demo 全键盘可达：`aria-pressed` 开关带可见 "— ON/OFF" 文本、range 有 `label[for]` + `aria-valuetext="24 words"`、读数挂 `aria-live="polite"`（`Lab.tsx:94,168-181,202`）。
3. **主题循环键的 label 语义正确**：`aria-label="Color scheme: auto. Switch to light."` 把当前态与后果都告诉了 SR（`Header.tsx:108`）。

### 扣分（实算对比度 + 源码证据）

1. **`--color-ink-4` 掉出 AA 且被用在承载信息的文本上（本轮最大退步）**。实算：**light 2.55:1 / dark 3.00:1**（#9aa1a8/#5a6068 on bg）。落点全是真内容，不是装饰：
   - 搜索结果类型标签 `CHAPTER/PROJECT…`，11px mono（`SearchDialog.tsx:150`）；
   - "`4 MORE DOCUMENTS BELOW THE CUT`"（`Lab.tsx:149-151`）；
   - "`LEDGER OPEN — LAST SET …`"（`Publications.tsx:35-37`）；
   - 搜索框 placeholder（`SearchDialog.tsx:119`）。
   Round 1 我给 A 的评价是"token 级对比度验收"——这轮新组件没有执行这条纪律。ink-3 实算 4.81/5.75:1（过线），换 token 即可修复。
2. **搜索是"半套 combobox"**：input 无 `role="combobox"/aria-expanded/aria-activedescendant`，方向键移动的是视觉高亮（`aria-selected` 在 option 上），但焦点不进列表、无 activedescendant 桥接——SR 用户听不到"当前选中项"（对比 H 的完整实现）。另 `role="option"` 内嵌 `<button>` 不合 ARIA 规范（`SearchDialog.tsx:132-161`）。
3. **小项**：RankRow 把分数文本 `aria-hidden`（`RankRow.tsx:58`）——SR 用户听不到 BM25 分数（排名可由 ol 序号补，分数丢失）；搜索 input `outline-none` 且无替代 focus 指示（`SearchDialog.tsx:119`）；无 prefers-contrast。

### 如果只能改一处
**把 `--color-ink-4` 调深到 ≥4.5:1（或所有承载文本的 ink-4 落点改用 ink-3）**——一处 token 改动同时修复搜索/实验室/空态四处硬失败，其余问题都次于它。

---

## 2. Team D「Offprint」

### 做得好（源码验证）

1. **主题控件语义三案最佳**：桌面 `role="radiogroup"` + `role="radio"` + `aria-checked` + roving tabindex + ←→ 换挡（`chrome.tsx:171-207`），移动端降级为循环键且 label 声明当前态（`chrome.tsx:209-221`）；`T`/`?`/Esc 快捷键层 + Help 浮层用 `<dl>` 列键位（`chrome.tsx:423-458`）。
2. **播报层做得最对味**：沙盒切换用 `sr-only aria-live` 完整播报结果语义（"Poisoned document injected: it now ranks 1."，`SandboxPage.tsx:57-74,152-154`）；Question Ledger 过滤结果数同样播报（`ResearchSection.tsx:126-143`）。
3. **工程级细节**：路由切换把焦点交给 `#main-content`（`chrome.tsx:511`，三案唯一做 SPA 路由焦点管理的）；移动端边注用原生 `<details>` + `summary aria-label="Margin note n"`（`chrome.tsx:115-121`）——零 JS、原生键盘可达；`pointer:coarse` 下统一 44px（`index.css:365-372`）；**对比度自验表经我实算全部属实**（ink/paper 14.93 与其声称完全一致）。

### 扣分（实算对比度 + 源码证据）

1. **沙盒 rank>5 行 `opacity-55` 使正文掉出 AA（light）**：实算 ink @55% 混入 paper = **3.62:1**（17px 正文，WCAG AA 需 4.5）；dark 侧 5.05 过线（`SandboxPage.tsx:168-179` `dimmed ? "opacity-55"`）。降级语义应该用更淡的 token 而不是整体透明度。
2. **`<Reveal>` 把 `<li>` 包进 `<div>` 再放进 `<ul>`**：Directions/Ledger/相关列表的 DOM 是 `ul > div(motion.div) > li`（`ResearchSection.tsx:54-55,152-153`、`PublicationsSection.tsx` 同构）——无效 HTML，削弱列表语义（部分 SR 会丢失列表项计数）。
3. **小项**：无 prefers-contrast（其对照表也没覆盖此场景）；`aria-current="true"` 用在页内章节锚点上（合法，但 `location` 更准确）；`T` 键在浮层打开时仍生效（换主题于浮层之下，无碍但越层）。

### 如果只能改一处
**去掉沙盒 rank>5 的 `opacity-55`，改用 `--ink-soft`/次级 token 表达"低分区"**——保住 17px 正文 ≥4.5:1，这是唯一一处"正文级"对比度硬失败。

---

## 3. Team H「检索系统」

### 做得好（源码验证）

1. **三案唯一完整 combobox**：input `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-activedescendant` + option `aria-selected`/id 一应俱全（`SearchPalette.tsx:123-162`）——正是 Round 1 我点名缺的"半步"。沙盒播报也是三案最完整的：top id + 分数 + 排名变动全在 `aria-live` 里（`Lab.tsx:110-114,183-185`）；投毒态"从不只靠颜色"：`▲ POISONED` 文本 + signal 色 + 左缘粗边三通道（`Lab.tsx:32-35,158-163`）。
2. **自述装置的降级执行到位（a11y 视角全面翻案）**：零 blur；标题 t=0 可见；skip 按钮 t=0 可见且占位防抖动；Esc 跳过带 `isOverlayOpen()` 守卫（`focus.ts:24-32`）避免双花 Esc；回访 localStorage 直通；reduced-motion/回访渲染静态且状态行文案同步为 `resolved`（不撒谎说 resolving，`Hero.tsx:64-67,96-98`）；Gen 1 的数字键快捷键确认已废除（`App.tsx` 无相关监听）。Gen 1 的头号 a11y 伤害（"先操作才能读"）被根治。
3. **唯一实现 `prefers-contrast: more`**（`index.css:89-98`，divider/faint 双主题加深，实算 faint 提升到 5.25/5.72:1）；状态标记永远带文字（active/open/resting，`Research.tsx:6-24`）；移动 Index 是规范 dialog（初始焦点 Close、Esc、焦点圈，`MobileMenu.tsx:27-63`）；noscript 诚实骨架（`index.html:66-79`）。

### 扣分（实算对比度 + 源码证据）

1. **`--faint`（light 3.75 / dark 3.83:1）违反了自家注释"decorative only, never load-bearing"**。css 里写着这条纪律（`index.css:57`），但实际落在承载语义的文本上：
   - **诚实声明行**"illustrative toy — …not a claim about real systems."——在 surface-2 面板上实算仅 **3.49:1**（light）/3.26:1（dark）（`Lab.tsx:187-192`），这是全站最不该掉 AA 的一句话（E 系"诚实声明"是被评委验证过的资产）；
   - 沙盒读数 `documents: 7 · method: bm25`（`Lab.tsx:122-124`）、Context Budget 的 `truncated: n` 读数（`Lab.tsx:294-296`）；
   - palette 结果类型标签 `TOPIC/NOTE/DEMO`（`SearchPalette.tsx:159`）；
   - palette placeholder 4.09:1（surface 上，`SearchPalette.tsx:135`）。
   prefers-contrast 用户可获救（面板上 4.88 过线），默认路径不行。
2. **路由切换不迁移焦点**：`ScrollManager` 只 `scrollTo(0,0)`（`App.tsx:29-43`）——SR 用户在 SPA 内跳转后得不到任何"已到达"信号；palette 里 Enter 导航后焦点落回 body，D 案在此点做得更好。
3. **小项**：Help 浮层不迁移初始焦点（`SearchPalette.tsx:190-268`，对比 MobileMenu 有初始焦点）；`/research` 路由页 h1 → h3 跳级（`structure.tsx:19,31` + `Research.tsx:46`）；`?` 只开不关（notes 说"开关"）。

### 如果只能改一处
**把 `--faint` 从所有承载语义的读数/标签上撤下（诚实声明行、documents/method/truncated 读数、palette 类型标签改用 `--muted`，faint 只留坐标序号）**——"诚实"是这个方向的立身之本，诚实声明自己先过 AA 才成立。

---

## 4. 打分（14 维，我的视角；a11y 为主权重）

| 维度 | A | D | H | 依据摘要 |
|---|---|---|---|---|
| visual_quality | 8.5 | 8.5 | 8 | A 克制而精准；D 朱批+ghost 编号有记忆点；H 净化成功但偏素 |
| originality | 8 | 8 | 9 | H 的"resolved 自检构图 + palette 即检索面"仍是全场最原创 |
| typography | 9 | 9 | 8.5 | A/D 双双 4px 基线+字重补偿；H 真字阶建成（从 8 升） |
| information_hierarchy | 9 | 9 | 8.5 | H 路由页 h1→h3 跳级小疵 |
| ux | 8.5 | 8.5 | 8.5 | 三案键盘层都成立；D 的 T/? 层 + H 的 palette 各有胜场 |
| mobile_experience | 8.5 | 8.5 | 8.5 | D 原生 details 边注是移动最佳；A 56px 目录行；H 44px 纪律 |
| technical_feasibility | 9 | 8.5 | 8.5 | A 无路径依赖；D 砍掉 SVG 地图后成立 |
| long_term_maintainability | 8.5 | 8.5 | 8.5 | 三案都数据驱动 + 共享组件收敛 |
| research_presentation | 8.5 | 9 | 9 | D/H 的台账均带 SR 播报；D 微胜 |
| portfolio_presentation | 8 | 8 | 8.5 | H 的 index+demo 入口最清楚 |
| light_mode | 9 | 8.5 | 8.5 | A 全过；D 沙盒 dim 拖累；H faint 拖累 |
| dark_mode | 8.5 | 9 | 8.5 | D 的 prose-ink 降灰 + 470 是最佳暗读 |
| performance | 9 | 8.5 | 9 | 全部零 console、零图片；D 变量字体略重 |
| **accessibility** | **8** | **8.5** | **8.5** | 见 §1–3：A ink-4 失败+半套 combobox；D dim+无效列表 DOM；H faint 泄漏+无路由焦点 |
| 合计 | 120.0 | 121.0 | 120.0 | |

**我的 Top 3（a11y 评委席）**：
1. **H** — a11y 架构天花板坐实并升级：唯一完整 combobox、唯一 prefers-contrast、最完整的沙盒播报、Gen 1 伤害根治；扣分在 faint 纪律泄漏与路由焦点。
2. **A** — 默认路径纪律最好（dialog 件、reduced-motion 四处门控、焦点移交目标章节），但 ink-4 一枚 token 拖垮四个落点，搜索又是核心路径。
3. **D** — 工程级最自觉（对比度表经实算属实、路由焦点管理、radiogroup），但 dim 行失效与 `ul>div>li` 恰好都在本轮新写的主内容组件里。

（A/D 之差在误差范围内：A 输在"核心路径上的硬失败更多"，D 输在"主内容语义被自己的动画包装层破坏"。）

## 5. 逐案"如果只能改一处"

- **A**：把 `--color-ink-4` 调深至 ≥4.5:1（或可读文本落点全换 ink-3）——一处 token 修复搜索/实验室/空态/placeholder 四处硬失败。
- **D**：删除沙盒 rank>5 的 `opacity-55`，降级语义改用次级 ink token——唯一正文级对比度硬失败。
- **H**：把诚实声明行与语义读数从 `--faint` 迁到 `--muted`，faint 只留装饰坐标——让"诚实"先过 AA。

## 6. 给下一轮的一句话

三案的 reduced-motion 与键盘层都已达标，本轮的分差全部来自**"装饰 token 与语义文本的边界执法"**——A 的 ink-4、H 的 faint 都是在 css 注释里给自己写过纪律然后自己违反的；下一轮请把"哪个 token 允许出现在什么字号/语义上"写成 lint 级约定。
