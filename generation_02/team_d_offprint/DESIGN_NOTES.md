# DESIGN NOTES — Team D「Offprint 抽印本」· Generation 2

> `@portfolio/gen2-d` — 相对第一代的改动、理由、偷了谁的什么、拒绝了什么、遗留风险。
> 结论先行：**研究展示保住了（Question Ledger 升级为纯数据派生），两个工程负分维度用“降维”打法转正；首屏加了唯一记忆点——“朱批”（当前激活问题的页边批注 + 幽灵编号）。**

---

## 1. 相对第一代改了什么 / 为什么

### 1.1 首屏（visual_quality −0.78 → 目标转正）

| 第一代 | 第二代 | 为什么 |
|---|---|---|
| 论文标题区（kicker + 立场句 + 摘要 + 右栏字段），“安静”被视觉评委确认为风险 | 同一标题区结构，但新增**唯一记忆点：「朱批」**——当前激活问题以审稿人页边批注的形态出现在右栏（朱砂竖线 + 朱砂 `NOW ASKING — Q1` + 斜体问题原文），同一问题的编号 `Q1` 以 9% 朱砂透明度的**幽灵巨字**压在标题区右上（视觉评委在评审意见里给的 ghost 手法补救方案，采纳） | 记忆点是语义的：看到一个幽灵编号，读到一句朱批，就知道“这个人此刻在想什么”。它不是装饰动画，是数据——`active` 状态的问题自动成为首屏批注，改 `content/research.ts` 内容随之更新 |
| display 44–68px | clamp **44→76px**（排印评委建议 76–80） | 首屏字号不再温吞 |
| 双语义色（朱砂 + 青黛） | **单语义色**：朱砂只出现在一组封闭清单里（见 §2 accent 白名单），青黛整个删除 | A 式 accent 纪律——“看到朱砂 = 此处有活的问题/活点”。三态状态改用 ink 系（实线框/虚线框）区分 |

### 1.2 研究地图 → 排版等价物（feasibility −0.96 / maintainability −1.15 → 主攻点）

**决策：删除 SVG 研究地图**（两套手写坐标 viewBox），换成 **Directions Ledger（排版关系账簿）**：

- 6 个方向各占一行：`T01` 编号 + 方向名 + blurb（全部来自 CONTENT_PACK）；
- 右栏是**派生读数**：`2 QUESTIONS OPEN` / `NO OPEN QUESTIONS`（从 `researchQuestions` 实时计算——视觉评委点名要偷的 “Q×n 只数问题不数论文” 语法保留，但不再挂在几何节点上）；
- 领域关系用 **`ADJOINS — Robustness · Poisoning`** 的 mono 交叉引用按钮表达（`adjoins` 是研究者自己的判断声明，存在 `content/research.ts`，增长时只加一行数据，无坐标可重排）；
- 单向联动：点击方向名/邻接词 → Question Ledger 过滤 + 平滑滚动 + `aria-live` 播报 “N questions shown after filtering”。第一代的双向 map↔ledger 联动被降为**单向过滤**——评委指出的双向联动工程成本就此清零。

### 1.3 Question Ledger 低维护化

- **`updated: null` → UI 什么都不渲染**（不渲染 “upd. —”，不留空槽）——任务书硬要求，已实现（q3 无日期，页面上该位置无任何痕迹）；
- **RESTING 有图例**：Ledger 头部一行 `ACTIVE — BEING ASKED NOW · OPEN — ON THE LIST · RESTING — PARKED, HONESTLY`（UX 评委要求的状态图例）；RESTING 行用虚线 chip，不折叠（数据只有 4 条，折叠机制本身是维护成本，不值得为 1 条记录引入手风琴状态）；
- **删掉了追问（followups）手风琴**：CONTENT_PACK 的问题契约没有 followups 字段，与其发明内容不如删掉展开状态——行是平的，状态是数据，无展开 state 可失步；
- 问题↔证据链保留且更诚实：`relatedDemo` 字段把 Q1/Q2 链到 Corruption Sandbox（`→ RUN IT IN THE LAB`），demo 页回链 `RE: Q1 · Q2`——研究者评委最喜欢的“问题有可运行的证据”语法，用稳定 id 引用（评审警告过显示编号重排会断链）。

### 1.4 Publications 空态（C 的 ghost 语法 × D 的礼仪）

- `0 PUBLICATIONS — COUNTED, NOT PROJECTED`（C 的诚实读数）；
- **“Manuscripts in preparation.” 被删除**——研究者评委判它话术越线（手里没有在写的手稿时这句话本身是编造）。换成诚实版：*“Written work will appear here as it exists. Not before.”*；
- 两条 **ghost specimen 行**（dashed hairline + `ink-faint` + `aria-hidden`）：`[ AUTHORS ] — [ TITLE ] · [ VENUE ] · [ YEAR ] / PDF · CODE · DOI`，并配一句可见说明“第一篇论文入库时替换这两行，版式零改动”——既是空态也是版式契约（第一代的正确资产，保留）。

### 1.5 边注系统：三段降级保留，实现路径换掉（工程评委的处方）

- 桌面 ≥1120px：**纯 CSS `float: right; clear: right; margin-right: -26ch`**（Tufte CSS 方案）——工程评委明确建议：删掉“JS 测量 + ResizeObserver + 越界 fallback”的绝对定位引擎，维护成本立降；
- 平板 768–1119px：行内嵌入注（wash 竖线）；
- 移动 <768px：**原生 `<details>` 折叠注**，`[n]` summary、`aria-label`、展开态竖线——grid-rows 高度动画被删（工程评委点名它与“transform/opacity 宪法”矛盾），原生 details 零 JS 零动画零维护；
- 每个断点只渲染一种 DOM 结构（`useMediaQuery` 分支），无“双 SVG 双份 DOM”式冗余。

### 1.6 垂直节奏（B 的强制继承）

- 正文 **17px / 28px**，lede 19/32，h3 21/32，h2 28/36，h1 40/44，note 13/20，label 11/16——**行高全部落在 4px 基线**（第一代 17/1.75≈29.75 的脱格问题修正）；正文段间距 = 28px = 恰好一个空行；间距 token 全部为 4 的倍数；display（1.04）是唯一声明的例外。

### 1.7 Dark 模式（A 的强制继承）

- **字重补偿**：`--wght-display: 500`（Light）→ `470`（Dark），Newsreader Variable 连续 wght 轴实现（排印/A 认可的 halation 防御）；
- **长文降灰**：Dark 下 prose 用 `--ink-2`（#C9BFAE，10.2:1），UI 层保持 `--ink`——同一份纸放进台灯下，不是反色。

### 1.8 Selected Work（portfolio_presentation −0.93 / ux −0.45）

- 行内**常驻行动线**（不需要展开/跳转就能行动）：Poison Sandbox → `▶ TRY IT NOW — CORRUPTION SANDBOX`（真 demo，唯一的真链接，诚实）；This site → `→ YOU ARE LOOKING AT IT`；其余条目链接位留空、不渲染假按钮（links 到位时代码路径已备好：REPO ↗ / DEMO ↗ / WRITEUP ↗）；
- 招聘者 90 秒路径：Hero 右栏有 CONTACT（第一代被招聘者评委表扬的资产，保留）→ 入口链接第二屏即达 Work → 每行 `ROLE / AREAS / 状态` 一眼可读 → §04 Appendix 有可上手的东西；
- 删除了第一代“证据图住边注”的设计——CONTENT_PACK 没有图片数据，与其造假截图不如零图（`sample` 项目只描述做了什么）。

### 1.9 Lab：Corruption Sandbox（按 CONTENT_PACK §demo 全规格实现）

- BM25（k1=1.5, b=0.75）客户端打分，8 篇干净语料 + 1 篇投毒；Inject 开关（aria-pressed）、Toy Defense 开关（标签写明 **“toy heuristic, not a real defense”**）、常驻诚实声明（页面顶部横幅 + 页脚重复）、诚实读数（`CORPUS 8/9 DOCUMENTS`、`METHOD: BM25 (K1 1.5 · B 0.75) · 0MS NETWORK`）、▲▼ 排名变动箭头（上次切换以来，纯数据）、scaleX 分数条（transform-only）、reduced-motion 下重排瞬时完成、`aria-live` 播报注入结果；
- **数值验收（`scripts/verify-sandbox.ts`，esbuild 跑真实出厂代码）：inject 后 d8 第 1 名（9.56 vs 5.11）；defense 开启后 d8 掉到第 4（出 top-3）；语料读数 8/9。**
- 两处与 CONTENT_PACK 语料的有意偏差（均在包许可范围内，已注释在 `content/lab.ts`）：
  1. **d8 重写**：原文与给定 query 的词法重叠几乎为零（实测 BM25 0.78、第 4 名），无法满足“inject 后 d8 必须第 1”。包自己规定“调语料而非改代码作弊”，故对 d8 做关键词堆叠改写，保留 prompt-injection 语气与 “ignore previous instructions” 触发短语；
  2. **新增 d0**（干净文档）：让干净语料 = 8 篇，与包的读数示例 “8 documents / 9 documents” 一致；
  3. **defense 强度**：包的“降权 50%”是“例如”；实测 ×0.5 时 d8 仍是第 3 名（4.21 > 1.32），过不了“掉出 top-3”验收线，故实现为**注入模式段落 ×0.1 降权到底部**（UI 文案如实写明 demote 语义）。
- demo 页固定页脚 + 顶部横幅均为常驻（E 的诚实声明纪律）。

### 1.10 键盘层（E 的强制继承）

- `T` 循环主题、`?` 开关快捷键层、`Esc` 关层（焦点归还触发者）、`←→` 在主题 radiogroup 内换挡；全局监听排除输入焦点与修饰键；
- 发现性三层：页脚常驻 kbd 带（`T THEME · ? SHORTCUTS`）、`?` 全键位浮层、沙盒页内所有控件都是真实 button（Enter/Space 原生可用）；
- 移动 Contents 全屏目录层与 Help 层共用同一 Overlay：焦点圈闭 + body 滚动锁 + Esc/按钮关闭。

### 1.11 主题系统

- System/Light/Dark 三态；`localStorage("offprint-theme")` 持久化；**index.html 内联脚本首帧落 `data-theme`，零 FOUC**；System 档监听 `prefers-color-scheme` 变化；
- 桌面：三段 radiogroup（SYS·LIGHT·DARK，roving tabindex + 方向键，第一代被 a11y 评委点名的正确语义保留）；移动：单键循环（`Theme: system`，aria-label 说明当前态）；
- 切换的“事件感”：**240ms 墨洗 crossfade**（切换瞬间才挂 `theme-fade` class）——刻意不用 C/G/H 撞衫的 View Transitions 圆形扩散；reduced-motion 下直接切。

### 1.12 其他

- 路由：`/`（长卷首页，保住第一代“滚动即达 Research”的移动黄金路径冠军设计）+ `/lab/corruption-sandbox` + 404（阅读式 “not in the edition”）；路由级 `document.title`；
- SEO：完整 meta + OG（含 og.svg 占位图）+ JSON-LD（WebSite + ProfilePage/Person——name 为 null 就不写 name，knowsAbout 用 6 个真实方向）+ `robots.txt` + `sitemap.xml`（example.com 占位域名）；
- 移动 390px：header 收缩为 wordmark + 主题循环键 + Contents；首屏 ghost 编号缩小、字段块变全宽 hairline 块；ledger/case 行改上下堆叠；触控目标 coarse pointer 下 ≥44px；沙盒控件纵排；
- 全局 `prefers-reduced-motion`：CSS kill-switch（transition/animation 归零）+ JS 侧 `useReducedMotion` 门控（Reveal 不挂动画、沙盒重排不 layout、主题切换不淡入）；`motion` 只用 transform/opacity/layout；
- 无障碍：skip link、语义 landmark、`aria-current`、`aria-live`（过滤结果/沙盒播报）、focus-visible 统一 2px 朱砂环（accent 白名单内的“界面活点”）、对比度逐对验收（下表）。

## 2. 偷了谁的什么（强制清单核销）

| 来源 | 偷了什么 | 落点 |
|---|---|---|
| **A** | token 级对比度验收纪律 | 下表，全部 PASS 后才锁色板 |
| **A** | Dark 字重补偿 + 长文降灰 | `--wght-display 470`、`--prose-ink` |
| **C** | 诚实读数语言 | `0 PUBLICATIONS`、`8/9 DOCUMENTS`、`0MS NETWORK`、colophon 计数行 |
| **C** | ghost 槽位空态 | Publications 两条 specimen 行 |
| **E** | demo 常驻诚实声明 | 沙盒页顶部横幅 + 页脚，永不折叠 |
| **E** | 键盘提示发现性 | `T`/`?`/Esc 体系 + 页脚 kbd 带 + 帮助浮层 |
| **B** | 垂直节奏纪律 | 4px 基线 + 段距=一空行（§1.6） |
| **F** | 单屏 accent 预算纪律 | §3 白名单 |
| **评审意见** | ghost 编号手法（视觉评委）、边注 float 方案（工程评委）、诚实空态文案（研究者评委）、状态图例（UX 评委）、早期 Contact（招聘者评委，第一代已有，保留）、`upd null 不渲染`（产品/工程共识） | §1.1 / §1.5 / §1.4 / §1.3 / Hero 右栏 / §1.3 |

### 对比度验收表（WCAG 2.1 相对亮度，脚本实测）

| 配对 | Light | Dark | 门槛 |
|---|---|---|---|
| ink / paper | 14.93 | 14.36 | ≥4.5 ✅ |
| ink-strong / paper | 16.79 | 16.57 | ≥4.5 ✅ |
| ink-2 / paper | 9.23 | 10.16 | ≥4.5 ✅ |
| ink-soft / paper（13px 边注） | 5.61 | 7.16 | ≥4.5 ✅ |
| ink-soft / paper-deep | 5.06 | 6.60 | ≥4.5 ✅ |
| accent / paper（11px chip、朱批） | 5.91 | 7.01 | ≥4.5 ✅ |
| accent / accent-wash（激活 chip 底） | 5.06 | 5.90 | ≥4.5 ✅ |
| accent-strong / paper（hover） | 8.21 | 9.53 | ≥4.5 ✅ |
| code-text / code-bg | 10.65 | 11.61 | ≥4.5 ✅ |
| tok-key / tok-str / tok-num / code-bg | 5.89 / 5.10 / 4.89 | 6.47 / 7.59 / 7.59 | ≥4.5 ✅ |
| tok-com / code-bg（装饰注释） | 3.32 | 4.33 | ≥3（仅装饰）✅ |
| ink / selection | 11.75 | 10.16 | ≥4.5 ✅ |
| ink-faint / paper（ghost 行，aria-hidden） | 3.36 | 3.84 | ≥3（仅装饰）✅（第一代 2.66 不达标，已调深为 #908672） |

## 3. Accent（朱砂）白名单——违反即 bug

只允许出现在“**问题当前被激活/追问/活点**”语义上：

1. Hero 朱批（NOW ASKING 标签 + 竖线 + 幽灵编号）；
2. Ledger 中 ACTIVE 问题的编号与 ACTIVE chip（含沙盒内 Poisoned chip）；
3. 沙盒中被注入的投毒文档行（左缘竖线 + 分数条）——它是“正在被追问的对象”；
4. 过滤 chip（激活态）；
5. `:focus-visible` 焦点环（界面的活点）。

导航下划线、链接、进度线、hover 竖线、项目状态 chip 一律用 ink 系。单视口朱砂面积 <2%。

## 4. 拒绝了什么

- **SVG 研究地图（含数据化/力导向的“补救”）**：连评委建议的“预计算坐标落盘”也拒绝了——凡是节点坐标就是负债，排版等价物（Directions Ledger + ADJOINS + 派生计数）零坐标零重排，研究语义一点不少；
- **追问手风琴**：内容契约没有 followups，发明内容违背内容纪律，展开状态是维护面；
- **“Manuscripts in preparation.”**：话术越线（研究者评委）；
- **View Transitions 圆形扩散主题切换**：C/G/H 撞衫（评审趋同警告），改用墨洗 crossfade；
- **grid-rows 高度动画**：违反 transform/opacity 宪法（工程评委），原生 details 替代；
- **RESTING 自动折叠**：为 1 条记录引入手风琴状态不值，用图例 + 虚线 chip 解决可读性；
- **项目详情页**：CONTENT_PACK 没有案例正文数据，造 thin page 不如把行动线放进行内。

## 5. 依赖与工程

- 新增 npm 依赖仅两个字体包（允许清单内）：`@fontsource-variable/newsreader`（opsz+wght 变量轴，正体/斜体两文件）、`@fontsource/ibm-plex-mono`（400/500 latin 子集自托管，禁运行时 Google Fonts）；CJK 走系统栈（宋体系 fallback 正文、黑体 fallback mono 标签），About 里的中文占位句即渲染自查；
- TS strict 全开（TS7：顺手移除了模板 tsconfig 里已被删除的 `baseUrl`）；内容全走 `src/content/*.ts` + `types.ts`（CONTENT_PACK 字段零删除，扩展字段均注释标明）；
- 验证工件（不参与 app build）：
  - `scripts/verify-sandbox.ts` —— 沙盒数值验收（esbuild 打包真实出厂代码跑断言）；
  - `scripts/ssr-smoke.tsx` —— 三条路由 `renderToString` 冒烟 + 关键内容断言（无浏览器环境下最接近“无运行时错误”的证明）；
- `npm run build`（tsc --noEmit + vite build）零错误；dev/preview 均可启动（preview 人工核验过 HTML/路由/静态资源 200）。

## 6. 遗留风险（诚实清单）

1. **朱批记忆点的成败仍押在执行**：ghost 编号 9% 透明度在低端屏/打印场景可能消失——它故意是“不吵的锚”，若评委想要更响的第一屏，这是可调参数（`--accent` 混合比）；
2. **沙盒语料是我调过的**：d8 重写 + d0 新增让验收通过，但评委若对照 CONTENT_PACK 原文逐字核对会发现偏差——理由与实测数据都写在 `content/lab.ts` 注释和 §1.9，属透明偏差而非暗改；
3. **字体预算**：Newsreader 变量字体 latin+ext 正斜共 ~460KB（woff2，按 unicode-range 分片按需加载，首屏通常只取 latin 正体 ~130KB）——比系统字体重，是“衬线即版面”的必要成本；CJK 无打包，弱网安卓上宋体 fallback 断裂风险第一代已述、无解（系统栈已尽量收窄）；
4. **SSR smoke 不执行 effects**：滚动监听、IntersectionObserver、焦点陷阱的运行时行为靠代码审查保证（无法开浏览器是本轮环境限制）；逻辑都收敛在小的、防御性的 hook 里（窗口存在性守卫、被动监听、cleanup 完整）；
5. **og.svg 是占位图**：部分平台不吃 SVG OG 图——真上线时换静态 PNG（构建期 satori 渲染是下一代的活）；
6. **单页长度**：8 个 section 的长卷在低端移动端滚动成本高（移动评委第一代已记一笔）——Contents 层 + 锚点导航缓解，但未做路由级拆分，这是“长卷黄金路径”选择的代价。
