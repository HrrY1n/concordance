# DESIGN_SYSTEM — Concordance 设计系统

> 站点的全部视觉决策都收敛在这份文档与 `src/styles/index.css` 的 token 层里。
> 原则：**一个语言、三个声部、一档 accent**——排版是唯一材料，数据是唯一颜料，
> 单色系统内的节奏变奏代替装饰。

---

## 1. 概念与声部（Voices）

站点隐喻：**Concordance（语词索引）**——既是书，又是检索系统。三个字体声部分工明确：

| 声部 | 字体 | 用途 |
|---|---|---|
| 陈述（sans） | Inter（可变，latin+latin-ext 子集） | Hero 陈述句、正文、界面 |
| 题辞（serif） | Newsreader（可变，display opsz 行为内建） | display、章节标题、ESSAY 正文、`t-serif-voice` 斜体限定语 |
| 读数（mono） | 系统 mono 栈（ui-monospace / Cascadia / Consolas） | 元数据、坐标 §、诚实读数、代码 |

**双语气 Hero**：sans 陈述 + serif italic 限定语 + accent caret——这是全站的第一签名。

## 2. 颜色 Token（双主题同构）

### Light —「暖纸」| Dark —「阅读室」（重调，非反色）

| Token | Light | Dark | 语义 |
|---|---|---|---|
| `--bg` | `#f7f4ed` | `#151310` | 页面底色 |
| `--bg-inset` | `#efeadd` | `#1d1a15` | demo 井 / 代码井 |
| `--raised` | `#fffdf6` | `#211d17` | palette / 对话框 |
| `--ink` | `#211b10`（15.6:1） | `#ebe5d8`（14.8:1） | 正文 |
| `--ink-2` | `#5c5342`（6.9:1） | `#a99f8b`（7.1:1） | 次要文本——**可读文本的最低档** |
| `--faint` | `#8b8168`（3.5:1） | `#7c7360`（4.0:1） | **仅限装饰**（坐标、编号）；信息性文本禁用（有测试守卫） |
| `--line` / `--line-strong` | `#ded7c4` / `#b5ac93` | `#322d24` / `#4c4536` | hairline / 强分隔 |
| `--accent` | `#2547d0`（6.6:1） | `#97acff`（8.5:1） | **唯一 accent**：只给"活着的/当前/可操作"的事物 |
| `--accent-wash` | `#e3e8fa` | `#262f52` | accent 的低饱和衬底 |
| `--signal` | `#a43a10`（6.0:1） | `#ff9d6b`（9.1:1） | 被投毒 / 失败 / 截断 |
| `--ok` | `#1f6b50`（5.8:1） | `#74d3a5`（10.3:1） | 已验证 / 防御生效 |
| `--selection` / `--code-bg` / `--shadow` | `#d7def7` / `#f0ebdd` / `rgb(33 27 16/.14)` | `#3a4160` / `#100e0b` / `rgb(0 0 0/.5)` | 选区 / 代码井 / 阴影 |

结构 token：`--z-header: 40 · --z-overlay: 50 · --z-skip-link: 100`；
图版宽度只有两档 + 一个跨栏：`--measure-figure: 40rem · --measure-figure-sm: 35rem · --measure-note-spread: 68.75rem`。

**对比度契约（有测试守卫）**：全部可读文本 ≥ 4.5:1（AA）；`--faint` 被测试锁定为装饰级——
一旦有人把它用在信息性文本上，`npm run test` 直接变红。`prefers-contrast: more` 时
hairline 与装饰 mono 提升到 AA。

## 3. 字阶（The Ladder）

一个比例，量化到 4px 基线。**全站零魔法字号**——每个尺寸都是角色 token：

| 角色 | 类 | 字号/行高 | 字重 | 备注 |
|---|---|---|---|---|
| Display | `.t-display` | clamp(46→80px)/1.04 | 500 | Hero；`text-wrap: balance` |
| H1 | `.t-h1` | clamp(34→44px)/1.14 | 500 | |
| H2 | `.t-h2` | 32/40 | 500 | |
| H3 | `.t-h3` | 26/34 | 500 | |
| H4 | `.t-h4` | 22/30 | 500 | |
| Lede | `.t-lede` | 21/32 | 400 | 章节导语 |
| Entry | `.t-entry` | 19/28 | 500 | 小标题/条目题 |
| Body | `.t-body` | 17/28 | 400 | |
| Small | `.t-small` | 15/24 | 400 | |
| Meta | `.t-meta` | 12/16 | 400 | mono，+0.05em，tabular-nums |
| Kicker | `.t-kicker` | 12/16 | 500 | sans 大写 +0.12em |
| Code | `.t-code` | 14/24 | 400 | mono |

**Dark 补偿（防 halation）**：display/entry 字重 500→470，字距放宽到 −0.019em；
**`:lang(zh)`**：中文永不斜体、永不负字距、永不大写，且规则声明在 dark 补偿之后
（等特异性、后者胜）——中文 display 保持正字距。

## 4. Register 系统（三档版式节奏）

Round 2 的"第二次变奏"处方落地为**机制**（不是约定）：`PageShell` 的 `register` prop
落到 `data-register`，CSS 真实消费：

| Register | 版式 | 用在哪 |
|---|---|---|
| `ledger` | 紧凑台账、hairline 行、mono 编号 | Research（Question Ledger）、Lab、Publications、Connect |
| `plate` | 图版呼吸、大标题、宽留白 | Work、Home 的精选段 |
| `essay` | serif 长文、严格 measure、边注 | Notes 文章、About |

- 页顶留白按 register 分档：LEDGER 页不吃 PLATE 的呼吸；
- 首页六段按 `PLATE→LEDGER→PLATE→LEDGER→ESSAY→PLATE` 交替，**相邻段必不同档**
  （有护栏测试）；
- 加第 4 个页面时，register 由数据声明、机制保证节奏，不靠手工排印。

## 5. FIG 语法（数据即颜料）

凡有数据可算处，渲染浏览器内实时计算的图，并标注方法：

| 图 | 数据来源 | 方法标注 |
|---|---|---|
| FIG.01 | clean vs poisoned top-3 排名 | bm25 (k1 1.5 · b 0.75) · computed in this tab |
| FIG.02 | 上下文预算填充 | counts = chars ÷ 4 (est.) · nothing leaves this tab |
| FIG.R1 | Question Ledger 状态分布 | computed from research.ts · n = {total} |
| FIG.W1 | 项目证据链分数 | 两 regime 对比 |
| FIG.N1 | 笔记体量 | 词数统计 |
| QUOTE 行（palette） | 全文索引命中 | bm25 排序 + KWIC 引文（`<mark>` 命中 + §坐标） |

规则：每张图必须标注计算方法；同一句读数（如 "0ms network"）全站只出现一次原文，
其余用变体（"computed in this tab" / "nothing leaves this tab"…）。

## 6. 动效契约

- 预算：**同屏动画元素 ≤ 3**；每个动效必须能一句话说明信息功能。
- 允许的动效：Settle（hero 逐行落定，每 session 一次，回访零动画）、主题 crossfade、
  sandbox FLIP 重排（手写 ~40 行，transform-only，`transitionend` + 超时兜底清理）。
- **禁令**：任何元素初始态不得 `opacity: 0`（内容默认可见；动画只做 transform/字重——
  打印、快照、慢机、无滚动管线全部与滚动用户同貌）。
- `prefers-reduced-motion`：scroll-behavior 关闭 + FLIP/过渡全禁用。
- 无 JS：noscript 骨架给出 §00–§07 全站坐标与状态，诚实声明缺什么。

## 7. 无障碍契约

- Skip link + route-change 后焦点落 `<main>`（首载不动焦点）。
- palette 是完整 combobox（aria-expanded / aria-activedescendant / listbox+option），
  MobileMenu 焦点陷阱排除 roving `tabindex="-1"`（`lib/focus.ts`）。
- 触控：coarse pointer 下全部交互目标 ≥ 44px（行内 `.u-link` 升级 inline-flex——
  min-height 对行内元素无效是上一版的教训）。
- 安全区：fixed 头部/overlay/页脚带 `env(safe-area-inset-*)`。
- 每个数字读数用 `aria-live="polite"` 播报；sandbox 注入/防御有分场景文案。
- 对比度矩阵测试（3 底色 × 双主题）+ faint 用法守卫。

## 8. 命名与文件

- Token 全部语义命名（`--ink-2` 而非 `--gray-3`）；Tailwind v4 `@theme inline` 映射为
  `text-ink-2` / `bg-inset` 等工具类。
- 字阶只用角色类（`.t-h3`），禁 `text-[17px]` 式逐字尺寸。
- 内容-表现分离：组件零硬编码文案；读数只从 `content/*.ts` 派生。
- 设计决策变更必须同步本文件与 `DESIGN_NOTES.md`。
