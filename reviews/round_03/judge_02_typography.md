# Round 3 终审 — Judge 02 · Typography（排印）

> 评审对象：`D:\Codex\play\portfolio\generation_03\`（CONCORDANCE，Generation 3 唯一最终站点）。
> 首要权重：typography。方法：先源码（`src/styles/index.css` 字阶段全文、全站 grep、组件抽查）后截图（home 整页 dark×2 视口、notesn1 desktop light/dark、about/research/mobile 抽样），并对照 DESIGN_NOTES §1.2/§1.3 自查声明逐条证伪。

## 1. 证据路径

- 源码：`generation_03/src/styles/index.css`（@font-face 36–95、tokens 104–153、type scale 259–371、essay/sn 523–577、print 703–748）；`generation_03/index.html`（主题内联 27–45、noscript 73–97）；`generation_03/scripts/sync-fonts.mjs`；`src/pages/HomePage.tsx`（hero 144–161）、`NotePage.tsx`、`AboutPage.tsx`、`Sidenote.tsx`、`content/site.ts`（heroSans/heroSerif）、`content/notes.ts:104–130`。
- 截图：`shots/gen3/concordance.concordance.home.desktop.dark.png`（hero 细节）、`home.desktop.dark.full.png`、`home.mobile.dark.full.png`、`notesn1.desktop.light.png` 与 `notesn1.desktop.dark.png`（essay 排印缺陷可见）、`about.mobile.light.png`（中文段）、`research.desktop.light.png`（LEDGER 档）。
- `concordance.console.json`：空（0 error / 0 warning）。

## 2. 字阶系统核查

**结论：纪律极高，全场唯一"零魔法数"执行。**

- 全站 grep：`text-[...]` 任意值 **0 处**、内联 `fontSize` **0 处**、内联 px 字号 **0 处**。所有字号经由 13 个角色级 token 类：`t-display / t-h1 / t-h2 / t-h3 / t-h4 / t-lede / t-entry / t-body / t-small / t-meta / t-kicker / t-code / t-serif-voice`（`index.css:259–353`）。语义命名完整（display→meta 角色齐全），无一处逐字尺寸残留。
- 阶梯 12/16 → 15/24 → 17/28 → 19/28 → 21/32 → 22/30 → 26/34 → 32/40 → clamp h1 → clamp display；行高全部落在 4px 基线；display 级字距曲线 −0.022 → −0.018 → −0.015 → −0.012 → −0.01 → −0.005 → 0 单调收敛，`text-wrap: balance/pretty` 落在标题级。`t-meta/t-kicker` 带 `tabular-nums`——LEDGER 档读数对位正确（research 截图证实）。
- 两处背离声明的量化（见 §4 问题 2）：`.essay` 行高 29px（自注释"slightly looser"，有意但打破了 ladder 注释里"quantized to 4px baselines"的承诺）；段距 `1.15rem`=18.4px 为非整像素。
- 全部字阶为 px 锁定（17px 而非 1.0625rem）：页面缩放不受影响，但浏览器"仅文本放大"偏好失效——小扣分项，非 WCAG 违规。

## 3. 双语气 Hero 排印执行

**结论：成立，且是我三轮看到的最完整执行。**

- 结构（`HomePage.tsx:147–155` + `site.ts`）：sans 陈述 "Retrieval-augmented generation,"（t-display 500）+ serif italic 限定语 "read at the level of the ranking."（`t-serif-voice`：italic、weight 400、字距 −0.012em，`text-ink-2` 降灰）+ accent caret（0.12em 宽、仅在 hero 可见时闪烁）。字号同阶继承、同一 22ch 行宽容器——陈述与限定语的关系靠字重（500/400）、字形（roman/italic）、字距（−0.022/−0.012）、灰度（ink/ink-2）四轴拉开，字号关系为"同阶等大"而非缩差，是正确选择（缩差会造成两行视觉断层）。
- dark 下 sans 行 470、serif 行保持 400：两语气权重差从 100 收窄到 70——halation 防御与语气对比之间存在轻微张力，但 dark hero 截图显示衬线行因 ink-2 灰度补偿仍清晰分层。可接受。
- 移动端 390：display 落到 clamp 下限 46px，"Retrieval-augmented" 在连字符处自然断行（mobile dark 整页证实），无孤行、无溢出。

## 4. 发现的问题（按严重度）

### 问题 1（最重要）：ESSAY 档正文实际是 sans，与全站自我声明矛盾
`.essay`（`index.css:535–538`）只声明 `font-size: 17px; line-height: 29px`，**未声明 font-family**——正文继承 body 的 Inter。但：`index.css:16` 头注 "REGISTER ESSAY — 66ch **serif** measure"、DESIGN_NOTES §1.3 "66ch **serif** 行宽"、Home notes 段 lede 原文 "**serif**, measured, with margin apparatus"（`HomePage.tsx:310`）。三处声明 vs 一处实现，渲染结果（`notesn1.desktop.light/dark.png`）：h1/lede/h2 是 Newsreader，正文段落全部是 Inter sans。这正是任务书要抓的"纸面落实"。连带后果：M1 的"第二变奏"里 ESSAY 与 LEDGER 的差异只剩行宽/行高/边注，签名级的长文衬线质感缺失。

### 问题 2：essay 段落节奏规则有洞，n1 可见
`.essay p + p, .sn-row + p, .sn-row + .sn-row, h2 + p { margin-top: 1.15rem }`（`index.css:542–547`）**漏掉 `p + .sn-row` 与 `figure + p`**。后果：n1 中普通段 → 边注段（"…it is vocabulary." → "The Corruption Sandbox…"）零段距、两行粘连——light/dark 两张 desktop 截图均清晰可见；n2 存在 code → p 序列（`notes.ts:108–126`），代码块后的段落同样裸贴，且代码 figure 用硬编码 `mt-5` 在节奏系统外。

### 问题 3：字体装载无 preload、无 fallback 度量覆盖
`index.html` 仅 2 个 link（canonical/favicon），**无任何 `<link rel="preload" as="font">`**；@font-face 只有 `font-display: swap`，fallback 栈（Georgia/serif）无 `size-adjust`/`ascent-override`/`descent-override` 度量对齐。首访时 80px hero 先以 Georgia 排出再换 Newsreader——LCP 文本 FOUT + 布局位移。任务书点名的 "preload/fallback 度量" 两项均未落实。

### 问题 4：Newsreader 只装 wght 轴，opsz 弃用
`sync-fonts.mjs` 只拷 `*-wght-*` 文件；fontsource 包内 `newsreader-latin-opsz-normal/italic.woff2`（含 opsz 轴）存在而未用，全站亦无 `font-optical-sizing`。80px display 渲染的是正文光学字号（text cut）放大版：笔画对比低、字面偏宽。对 halation 反而是稳妥的副作用，但"印刷纪律"叙事下放弃光学字号应至少在 DESIGN_NOTES 里记录为决策——目前无一处提及。

### 问题 5（潜伏）：`.dark .t-display` 会压过 `:lang(zh)` 的字距防御
`index.css:367–371` 的 `:lang(zh) { letter-spacing: 0.01em; font-style: normal; text-transform: none }` 特异性 (0,1,0)，规则位置在其后可覆盖 `.t-caps/.t-display` 的单类声明（已验证顺序正确）；但 dark 段 `.dark .t-display` 等六条 (0,2,0) 规则（`index.css:355–364`）会赢得字距，中文 display 文本在 dark 下将吃到 −0.019em 负字距。当前站内唯一中文是 About 正文段（`AboutPage.tsx:33`，无 display 类），**无现网可见影响**，但 G5 的"选择器正确性"在组合场景下有洞。`:lang(zh)` 未调行距——正文 28/17≈1.65、essay 29/17≈1.7 对 CJK 够用，不算缺陷。

## 5. Round 2 §4 验收复核（排印相关项）

| 项 | 结论 | 证据 |
|---|---|---|
| G2 对比度/faint 纪律 | **通过** | token 注释含实测比值（`index.css:104–141`）；`contrast.test.ts` 直接解析 CSS 断言全矩阵；faint 使用点均 aria-hidden（`structure.tsx:38,200`） |
| G5 dark 补偿 + `:lang(zh)` | **通过（带 §4 问题 5 的潜伏洞）** | `index.css:355–364`（500→470 + 字距回撤，六条覆盖全部 500 级 display 类）；`:lang(zh)` 三禁 + 正字距真实存在；About 渲染 `lang="zh"` 段（about.mobile.light.png 证实中文用回退栈正常渲染） |
| G6 图表双主题 | **通过** | 无位图；print 段整册重映射为纸黑（`index.css:703–748`） |
| H2 字体预算 | **通过** | 2 族 6 文件（latin+latin-ext 子集，共 ~332KB，unicode-range 按需取用），权重 400/500/470 + mono 400；sync 脚本可复现 |
| M1 第二变奏 | **基本通过** | 三 Register 真实存在且 Home 六段相邻不重档（源码与整页截图一致）；但 ESSAY 因问题 1 少了"serif 质感"这半档 |
| G1（transform-only 入场） | **通过** | settle-up 仅 translateY，无 opacity:0；回访 `data-settled` 首帧前杀动画 |

## 6. 14 维度评分

| 维度 | 分 | 一句话理由 |
|---|---|---|
| visual_quality | 8.5 | 双语气 Hero、单 accent、Register 节奏全部在场；ESSAY 半档失色 |
| originality | 8.5 | concordance 概念 + Register 系统 + FIG 语法是可认领的组合 |
| **typography** | **8.0** | 字阶工程满分纪律，但旗舰长文档（ESSAY）正文衬线承诺未兑现 + 段落节奏洞，正中本维度核心 |
| information_hierarchy | 8.5 | §坐标/kicker/读数行三级语法严整，tabular-nums 对位 |
| ux | 8.5 | palette/44px/诚实状态（非本权重，依证据） |
| mobile_experience | 8.5 | 390 单列重构、边注 details 折叠、display clamp 落点正确 |
| technical_feasibility | 9.0 | build/lint/test 全绿，代码分割与字体预算兑现 |
| long_term_maintainability | 9.0 | content 契约 + token + 对照测试，两年后加内容成本低 |
| research_presentation | 8.5 | Ledger + 证据回链 + 全站 FIG |
| portfolio_presentation | 8.5 | PLATE 语法完整 |
| light_mode | 9.0 | 暖纸 + 钴墨，token 层面无瑕疵 |
| dark_mode | 9.0 | 470 补偿 + 重调灰度实测有效（dark hero/essay 截图证实） |
| performance | 8.5 | 首屏 JS ~109KB 达标；字体无 preload 拖 LCP 后腿 |
| accessibility | 9.0 | 对比度测试化、focus-visible 全局；px 字阶不响应文本缩放（小扣） |

## 7. 如果只能改一处

**把 ESSAY 档做成它自称的样子**：在 `index.css` 的 `.essay` 块加一行 `font-family: var(--font-display)`，并补全相邻选择器 `p + .sn-row`、`figure + p` 进 `margin-top: 1.15rem` 组。三行 CSS，站点的长文之魂（"serif, measured, with margin apparatus"）从声明变成事实，M1 的第二变奏同时补完——这是全站性价比最高的一次排印修复。

## 8. 结论

**PASS。** CONCORDANCE 的排印系统是三轮以来完成度最高的：零魔法数、角色级字阶、可测试的对比度契约、真实的 dark 补偿与 `:lang(zh)` 防御。扣分集中在 ESSAY 档的"声明与实现背离"——不是能力问题，是收尾疏漏；终审阶段补上三行 CSS 即可进入 Meta Designer 打磨。
