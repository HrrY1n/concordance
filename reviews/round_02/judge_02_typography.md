# Round 2 评审报告 — Judge #02 Typography（排印评委）

> 评审视角：字阶系统 / 行级排版（行高·基线·字距·measure）/ 字族职责 / CJK fallback / 排印的实现完整度。
> 一票否决区：**typography、information_hierarchy**。
> 方法：先截图后源码。desktop light/dark 整页 + 首屏、390 mobile 整页、768 tablet 首屏逐案过目；对关键区域做了放大裁切（证据路径见各节）；再对照 `src/index.css` 的实际 token 逐条验证 DESIGN_NOTES 声明。三案 `*.console.json` 均为空（无 console error）。

## 证据基准

- 截图：`D:\Codex\play\portfolio\shots\gen2\team_{a_monograph,d_offprint,h_retrieval}\*.png`
- 源码：`D:\Codex\play\portfolio\generation_02\team_*\src\index.css`（字阶 token 主证据）+ `components/`、`content/profile.ts`
- Round 1 对照：`D:\Codex\play\portfolio\design_review_round_01.md`

---

## Team A「Monograph」— 字距曲线与双语气完整落地，三案中排印实现最干净

### 声明核验（DESIGN_NOTES §1.2）

| 声明 | 源码证据 | 渲染证据 | 结论 |
|---|---|---|---|
| 字距曲线（display 紧、正文 0、mono/label 松） | `src/index.css` L118-179：`t-display -0.028em → t-display-2 -0.022 → t-title -0.012 → t-body 0 → t-mono +0.04 → t-label +0.08` | 首屏 92px sans display 与 12px mono 眉标同屏，张力正确 | **属实** |
| tabular-nums | `t-label`/`t-mono` 均 `font-variant-numeric: tabular-nums`（L158/L165） | RECORDS 行、Q 台账编号对齐 | **属实** |
| Dark 字重补偿 500→470 + 字距 +0.004em | `.dark .t-display { font-weight:470; letter-spacing:-0.024em }`（L194-198，light 为 -0.028，恰 +0.004） | dark 首屏 display 无光渗粘连 | **属实** |
| 双语气 sans=事实 / serif italic=人（≤3 处） | `t-serif-voice`（L174-179）；hero 第三行 + Connect 结尾 | 截图仅见两处 serif italic（`before it breaks.`、`The monograph continues.`） | **属实且未超额** |
| 移动端正文 17/1.8 重排 | `@media (max-width:767px)` L181-190 | 390 整页正文行宽舒适 | **属实** |

渲染质量：desktop light/dark、tablet、mobile **整页全部区段均完整渲染**（全页 10278px 无空窗、无压字、无断行事故）。About 区 CJK 测试句「这是一个占位段落：替换于 src/content/profile.ts。」以 sans 栈（PingFang/YaHei 系）落进 16/1.75 行栅，前后行距一致，无 tofu、无脱格（证据：`shots\gen2\team_a_monograph\a.a.home.desktop.light.full.png` About 区；`a.a.home.mobile.light.png` 首屏）。Plate 版式（display-2 52px 标题 + mono meta 行）层级干净（`a.a.home.desktop.light.full.png` Work 区）。

### 优点
1. **字距曲线是三案中唯一"光学连续"的实现**：从 -0.028em 到 +0.08em 随字号单调展开，且 dark 模式的补偿方向（放松而非加重）正确——这是 Round 1 被认可的资产，实现中一根未丢。
2. **行级排版纪律**：`text-wrap: balance` 只用在标题层；`tabular-nums` 让 mono 读数列真正成列；mobile 正文升到 17/1.8 是针对 CJK/小屏的可读性重排而非缩小。
3. **information_hierarchy 无可挑剔**：00–07 章节号 + sticky 左栏 + Plate 编号列 + mono meta，整页扫读时"章—节—条目—注脚"四级始终可辨（一票否决区通过）。

### 缺点
1. **dark 长文未降灰**：正文保持 `ink-1`（14:1），只有 lede 落到 ink-2（`index.css` L199-201）。对比 D 的 dark prose 方案（整段降至 10:1 级），A 的 dark 长文阅读偏"白灼"，halation 防御只做了一半。
2. **无基线栅承诺下的行高碎片**：1.75/1.7/1.8/1.3/1.4/1.5 混用（虽各有理由），使 17×1.8=30.6px 这类脱格值出现——A 不声称 4px 基线所以不算违规，但跨段落并置时（如 About 英文段接中文占位句）行节奏靠运气。
3. mono 栈（L28-29）无显式 CJK fallback，中文落入 mono 语境时交给浏览器兜底（当前内容未触发，属潜伏项）。

### 如果只能改一处
把 dark 模式长文正文（`.t-body`/prose 语境）降灰到 ink-2，补齐 halation 防御的最后一块——一处 token 改动，dark_mode 与长文体验同时受益。

---

## Team D「Offprint」— token 层三案最强的基线系统，被渲染层两处硬伤拖入否决区

### 声明核验（DESIGN_NOTES §1.6/§1.5/§1.7）

| 声明 | 源码证据 | 渲染证据 | 结论 |
|---|---|---|---|
| 4px 基线全站落格：17/28、19/32、21/32、28/36、40/44、13/20、11-12/16，段距=28px | `src/index.css` L114-232：body 17/28、`.prose p{margin-top:28px}`、全部行高为 4 的倍数、display 1.04 唯一声明例外 | 首屏与 Research 区行节奏正确（`d.d.home.desktop.light.full.png` hero/Research） | **token 层属实** |
| 边注纯 CSS float（Tufte 方案） | `.sn-float{float:right;clear:right;margin-right:-26ch}`（L308-317），`Noted` 注释自称"measure wrapper 是 float 的锚" | **压字事故**（见下） | **实现失败** |
| Dark wght 470 + prose 降灰 ink-2 | `--wght-display:470`（L68）、`--prose-ink: var(--ink-2)`（L98-100） | dark hero 正确 | **属实** |
| CJK：宋体 fallback 正文、黑体 fallback mono 标签，"About 中文占位句即渲染自查" | serif 栈含 Noto Serif SC/Songti SC/SimSun，mono 栈含 Noto Sans SC（L39-42） | **无法验证**：About 段落在全部截图中不可见（见下） | **声明未兑现为证据** |

### 硬伤 1（typography 否决项）：边注 float 压字，两层文字直接叠印

`d.d.home.desktop.light.full.png` y≈2330-2450（dark 同）：脚注 ¹「Adjacency is my own judgment… liability, not a map.」与 Ledger 图例行「ACTIVE — BEING ASKED NOW · OPEN — ON THE LIST · RESTING — PARKED, HONESTLY」**逐字叠印，不可读**。根因：`ResearchSection.tsx` L101-114 把 `Noted`（float 边注）放在父块的最后一个元素，float 高度（约 200px）远超段落高度且无 `flow-root`/clearfix 收容，溢出侵入下一个兄弟块的全宽图例行。`index.css` L209 注释自己写了"measure cap 是 float 的承重墙"，但 `.measure`（max-width:60ch）只约束水平方向，**不建立 BFC，收不住垂直溢出**。这是排印实现层的真 bug，不是截图伪影。

### 硬伤 2（information_hierarchy 否决项）：whileInView 把大半页面变成"未渲染"

全站 section 内容全部包在 `Reveal`（`chrome.tsx` L56-74：`initial={{opacity:0, y:12}}` + `whileInView`）里。全页截图（light/dark/desktop/mobile 四组一致）显示：**Hero 与 Research 区段之外，Directions Ledger 行、全部 4 条 Question 行、Work 四条 case、Lab 沙盒、Notes、About 正文（含 CJK 自查句）全部 opacity:0 不可见**，只剩未包 Reveal 的小标签（`FIELDS IN ROTATION`、`4 CASE RECORDS`、`RECORD`、`CONNECT`）悬在巨大空窗中。A 与 H 均不使用 whileInView（grep 计数 0），同一截图管线只有 D 空窗——这是 D 自选策略与"整页可审计/打印/无 JS/未滚动即读"的兼容性失败，也让评委无法核验其引以为傲的基线系统在 60% 页面上的实际落格。D 声明"About 中文占位句即渲染自查"，但该句在所有证据中不可见，自查未兑现。

### 优点
1. **token 层是三案最强的排印系统**：真正的 4px 基线（行高+段距+间距三处同时落格）、17/28 的正文格律、`font-optical-sizing: auto` 的 Newsreader 大字号光轴、dark 下"同一张纸放进台灯"的 wght 470 + prose 降灰组合—— Round 1 对 B/D 的排印期待在 CSS 里全额兑现。
2. **首屏朱批 + 幽灵编号的排印语言高级**：衬线斜体引文 × 朱砂竖线 × 9% 透明度 ghost Q1（`d.d.home.desktop.light.full.png` hero），记忆点是排印的而非装饰的。
3. 对比度验收表（DESIGN_NOTES §2）逐 token 到 13px/11px 级别，`ink-faint` 严格限定装饰用途。

### 缺点
1. 修复压字：给 `Noted` 容器（`.measure`）加 `display: flow-root`，或把 `Noted` 移出块尾。
2. Reveal 降级策略：内容默认可见（initial 不为 opacity:0），动画只做 transform，或对 `prefers-reduced-motion`/无 JS/整页渲染场景给静态 fallback——当前实现在评委的通用证据管线上不可审计。
3. Desktop 全宽断点（≥1120px）只有 float 一种边注形态被验证，`sn-inline`/`sn-fold` 两档未见渲染证据。

### 如果只能改一处
去掉 `Reveal` 的 initial-hidden（内容默认可见、动画仅 transform），一处改动同时修复整页空窗、CJK 自查不可见与打印/无 JS 兜底；随后必须回补 `flow-root` 修复边注压字（若算两处，压字优先级更高，因为它发生在"可见区"）。

---

## Team H「Retrieval」— Round 1 的"伪阶梯"指控已了结，真系统建成，余两处 token 卫生死角

### 声明核验（DESIGN_NOTES §1.2）

| 声明 | 源码证据 | 渲染证据 | 结论 |
|---|---|---|---|
| 阶梯 = 12/15/19/24/30/38/48/60/76，每级 ×1.25 | `src/index.css` L153-237：t-meta 12/16、t-small 15/24、t-body 19/28、t-h4 24/32、t-h1 38/44、t-h2 48/56、t-display clamp→76/80；12→15→19→24→38→48→76 实测比例 1.25-1.58（两处 skip-one 已注释文档化） | Research 区 48px serif 标题 → 24px 衬线问题句 → 19px sans 正文 → 12px mono 坐标，五级同屏清晰可辨（`h.h.home.desktop.light.full.png`） | **属实，真系统** |
| 行高全部落 4px 基线（16/24/28/32/44/56/80） | 同上，逐条为 4 的倍数 | 行节奏均匀 | **属实** |
| 三族三职：Newsreader=内容声部 / Inter=界面声部 / Plex Mono=机器声部；meta 与 kicker 同 12px 以族+重+距分 | `--font-display/sans/mono`（L45-47）、`t-kicker`（sans 500 +0.1em）vs `t-meta`（mono 400 +0.04em）、`t-code` 15/24 零字距 | 首屏 query 行（mono）、facet 标题（serif）、说明（sans）三声部不混 | **属实** |
| Dark 字重补偿 500→470、字距 +0.002em | `.dark .t-display,…{font-weight:470; letter-spacing:-0.018em}`（L240-246） | dark 全页无光渗 | **对 display 属实；对 h1/h4 反向（见缺点 2）** |
| CJK：中文不用斜体、标题禁负字距、`:lang(zh)` 独立行为；about 中文自查句 | `:lang(zh){font-style:normal;letter-spacing:0.01em}`（L260-263）；sans 栈含 PingFang/YaHei | About 区 CJK 句以 sans 栈正常落格、无 tofu、无断行事故（`h.h.home.desktop.light.full.png` About 区） | **渲染通过；`:lang(zh)` 守卫是死代码（见缺点 1）** |

对比 Round 1（"自称 1.25 模数但阶梯不成立，排印评委最重扣分"）：Gen 2 的阶梯在源码与渲染两侧都能对上号，`t-h4` 问题句（衬线 24/32）与 `t-lead`（衬线斜体 24/32）让"24px 这一档有两种语气"的用法成为系统的 showcases——**H 的 typography 由负转正成立**。且 dark desktop 整页全部区段完整渲染（`h.h.home.desktop.dark.full.png`），Lab 沙盒、Publications ghost 行、About CJK 全部在场可审计。

### 优点
1. **字阶重建是真重建**：9 档声明、7 档在用、两处跳级显式注释（"skips 30, documented"/"the only skip, hero-only"），比"每级都用"更诚实；code 首次获得完整 token（15/24 零字距，注释"code never takes meta's tracking"）是 Round 1 缺口的精准补位。
2. **渲染侧零事故**：desktop/tablet/mobile × light/dark 六组截图无一空窗、无压字、无 CJK 破版；`u-measure 68ch` + 19/28 的正文 measure 组合在 About/Colophon 长段上表现稳定。
3. 12px 层的族/重/距三重区分（kicker vs meta vs code）解决了 Round 1 "13 vs 12 伪层级"问题，且 `t-caps` 注释明写 "CJK never gets this"。

### 缺点
1. **`:lang(zh)` 守卫从未生效**：三案 `index.html` 均为 `lang="en"`，H 的中文占位句（`content/profile.ts` L15）没有 `lang="zh"` 包裹——`:lang(zh)` 规则对该句不匹配，"中文不用斜体、标题禁负字距"实际是靠字体栈运气而非守卫兑现。写了规则没接线。
2. **dark 字距补偿过度覆盖**：`letter-spacing:-0.018em` 一刀切给 display/h2/h1/h4——light 下 h1 是 -0.015、h4 是 -0.01，dark 反而收紧（h4 达 -0.018em/24px），与声明的"+0.002em 抗光渗"方向相反；补偿应只作用于 display 层。
3. serif CJK 栈（L45）止于 Songti SC，无 Windows 的 SimSun 显式兜底（mono 栈同样无 CJK 项）——当前 CJK 只出现在 sans 语境所以截图无恙，若将来问题句/标题进中文，Windows 渲染路径未经验证。

### 如果只能改一处
给 CJK 占位句包上 `lang="zh"`（并把 `.dark` 的字距补偿收窄到 display 一类）——让已写好的 CJK 守卫真正通电，这是把"系统"变成"合同"的最后一行代码。

---

## 14 维度评分（1–10，可 0.5）

| 维度 | A | D | H | 备注（评委视角） |
|---|---|---|---|---|
| visual_quality | 8.5 | 7.5 | 8.5 | D 首屏极佳但整页空窗拉低 |
| originality | 8 | 8 | 8.5 | H 的自述检索语言保持全场最独特 |
| **typography** | **9** | **7.5** | **8.5** | A 字距曲线无死角；D token 最强但渲染压字；H 真阶梯建成留两处死角 |
| **information_hierarchy** | **9** | **6.5** | **9** | D 整页层级在通用证据管线上坍缩（否决区） |
| ux | 8 | 7.5 | 8.5 | H 的 skip/palette 四重降级扎实 |
| mobile_experience | 8.5 | 7.5 | 8 | A 的 390 真重排（章节指示条+Index 层）最完整 |
| technical_feasibility | 9 | 8.5 | 9 | D 删 SVG 地图后工程面确实变轻 |
| long_term_maintainability | 8.5 | 8.5 | 8.5 | 三案 token 化程度都高；D 的 Reveal 包裹是维护暗面 |
| research_presentation | 8.5 | 9 | 8.5 | D 的 Question Ledger + 状态图例仍是研究语法最强 |
| portfolio_presentation | 9 | 7.5 | 8 | A 的 Plate + FIG.1 完整在场可读 |
| light_mode | 9 | 8.5 | 8.5 | |
| dark_mode | 8.5 | 8.5 | 9 | H 的 darkroom 全页零事故 + 补偿正确面最大 |
| performance | 8.5 | 8 | 8.5 | |
| accessibility | 8.5 | 8 | 9 | H 保留 prefers-contrast/reduced-motion 双保险 |

## 排名

1. **Team A「Monograph」** — 排印实现与渲染证据两端都无事故，字距曲线/双语气/暗色补偿全部兑现，Round 1 两个负分靶点（originality、portfolio_presentation）在可见证据上确已转正。
2. **Team H「Retrieval」** — Round 1 排印最重扣分项完成真重建（源码+渲染双验证），originality/a11y 优势保住；与 A 的差距是两处 token 卫生死角与稍弱的移动重排。
3. **Team D「Offprint」** — token 层拥有三案最强基线系统与研究语法，但 float 压字（可见区不可读）+ whileInView 空窗（60% 页面不可审计、CJK 自查未兑现）双双踩进否决区，Round 1 要求的 visual_quality/portfolio_presentation 转正在渲染证据上未能确认。

## 给下一轮的一句话处方

- **A**：dark 长文降灰补完，即可成为三案中第一套"无死角"排印系统。
- **D**：把"默认可见"还给内容（Reveal 只动 transform），并给 float 边注建 BFC——token 层的天赋才配得上渲染层。
- **H**：给 `:lang(zh)` 通电、把 dark 字距补偿收回 display 层——系统已真，差合同最后一行。
