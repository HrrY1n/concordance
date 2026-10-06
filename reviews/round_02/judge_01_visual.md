# Round 2 评审 — Judge #1：Visual Design（视觉设计）

> 评委视角：以获奖级网站标准评**构图、色彩、层级、节奏、记忆点**。一票否决区：visual_quality、originality、light_mode、dark_mode（本轮三案均未触发否决线，但 D 有一处必须修复的排版缺陷，见 §D）。
> 视觉证据：`D:\Codex\play\portfolio\shots\gen2\{team_a_monograph,team_d_offprint,team_h_retrieval}\`（每案 desktop/tablet/mobile × light/dark，`.png` 首屏 / `.full.png` 整页）。每案至少实看：desktop light/dark 首屏 + 整页（整页切片放大逐段过）、mobile light 首屏 + 整页、mobile dark 首屏、tablet light 首屏。
> 工程佐证：三案 `*.console.json` 均为空数组（0 error / 0 warning / 0 failed request）。
> 抽查过的源码：三案 `index.html`（无 FOUC 内联脚本均属实）、`team_a_monograph\src\index.css`（Re-ink 三级降级）、`team_a_monograph\src\hooks\useTheme.ts`、`team_d_offprint\src\components\chrome.tsx`（Reveal / Noted 边注）、`team_d_offprint\src\lib\hooks.ts`、`team_h_retrieval\src\index.css`（字阶 token）、`team_h_retrieval\src\sections\Hero.tsx`（skip intro）、`team_h_retrieval\src\content\site.ts`（metaphorTouchpoints）、三案 `src\content\profile.ts`。

---

## 0. Round 1 进化靶点裁定（先给结论）

| 靶点 | 裁定 | 一句话依据 |
|---|---|---|
| A originality 由负转正 | **兑现** | FIG. 1 把"浏览器内实时计算"当图版内容（`a.a.home.desktop.light.full.png` Plate 01），加上"圆点=活着的东西"的图例化语义系统与 Re-ink 压印切换——不再会被误读成换色 Swiss |
| A portfolio_presentation 由负转正 | **兑现** | Work 从目录行升级为 PLATE 01–04 拉页版式 + 真数据图版 + "Built, not claimed" 诚实行动线 |
| D 打破沉闷 | **首屏兑现** | 朱批 + 9% 透明度幽灵 Q1 让 1440 首屏有了语义记忆点（`d.d.home.desktop.light.png`）；但整页证据被下面第 2 条缺陷拖累 |
| D feasibility / maintainability 转正 | **兑现（纸面）** | SVG 地图删除、边注改纯 CSS float、ADJOINS 数据化——但 float 方案自身产生了本轮唯一肉眼可见的排版 bug |
| H typography / visual_quality 由负转正 | **兑现** | 真字阶落地（`src/index.css`：12/15/19/24/38/48/76，逐档可查）；噪音做减法后整页是三案中最"安静而有序"的 |
| 三态主题无 FOUC | **三案属实** | 三案 index.html 内联脚本均首帧落主题（A: `monograph.theme`；D: `offprint-theme`；H: `h-theme`） |
| 390px 真重设计 | **三案属实** | A 的 56px 头 + Index overlay、D 的原生 `<details>` 边注 + Contents 层、H 的 resolved 直通构图，均非缩放 |
| Corruption Sandbox 功能一致 | **属实** | 三案排名条 / Inject / Toy Defense / 常驻诚实声明在截图中可见且形态各异 |

## 1. 新元素裁定（加分还是噱头？）

- **D「朱批」+ 幽灵 Q1**：**加分，且是三案中最好的单一记忆点**。它不是装饰：朱砂只出现在"活问题"语义上（白名单在 DESIGN_NOTES §3，截图中 nav/hover/项目 chip 确实无朱砂），幽灵编号是 `active` 问题的数据投影。9% 透明度在 dark 下恰好成立（`d.d.home.desktop.dark.png`）。风险备案（打印/低端屏消失）已在 notes 中自我声明。
- **A「Re-ink 主题切换」**：**加分**。`src/index.css:236-262` + `useTheme.ts` 验证：L1 View Transitions 压印式 `clip-path` 自上而下扫描、L2 分 token 延迟渐变、L3 瞬切——避开了被点名的 C/G/H 圆形光圈撞衫，隐喻（重新上墨）与单行本身份同构。截图无法呈现动效本身，但三级降级代码真实存在。
- **H「Self-Query 首屏」**：**加分，非噱头**。Round 1 的 blur 仪式被降级为"静态构图 + 诚实状态行"：`RESOLVED · 4 FACETS · 0MS NETWORK` 是可审计读数，四条 facet 就是真实的研究方向（首屏即内容而非装饰），skip intro / Esc / 1.5s 自动完成 / 回访直通四重跳过路径在 `Hero.tsx` 中属实。注意点：desktop light 截图捕在 `RESOLVING…` 中间态（`h.h.home.desktop.light.png`），10 秒扫描型评委撞上时它像"加载中"——这是把首因押在时间轴上的残余成本，好在 dark 同机位已定格 RESOLVED。

## 2. 趋同检查（三案有无新的相互趋同？）

**有，且部分是任务书强制的。** 共享词表已使三案像一家人：暖纸 light + 暖黑 dark、衬线大标题（Newsreader）+ IBM Plex Mono meta、编号体系（A 01–07 / D 01–06 / H §01–06）、诚实读数（`0 RECORDS` / `0MS NETWORK`）、Publications 虚线 ghost 槽（A RESERVED / D specimen / H pub-01–02，同一想法三种拼写）、中文占位句（CONTENT_PACK 第 60 行原文，三案 profile.ts 逐字渲染——是共享 fixture 而非单案错误，但在三个 About 里都像一条未翻译的遗留物）。**尚存的有效区分**：A = sans display + 书籍装置 + 橙点语义；D = 朱砂白名单 + 纸面批注隐喻；H = query/corpus 框架 + 蓝色信号色。**最接近双胞胎的一对是 D ↔ H 的 dark mode**（暖黑底 + 奶油衬线 + mono 读数行，并排几乎可互换），其次 D ↔ H 的 Publications 空态。Round 3 若继续，应把差异化押在"单色语义系统"层面而非再加装饰。

---

## 3. 逐案评语

### Team A「Monograph」— 8.54，排名 1

**优点**
1. **全场最完整的"语义—视觉"闭环**：colophon 明示图例"The dot marks what is alive: the chapter you are reading, work still running, poisoned evidence, keyboard focus"（`A_ml_seg5`），于是首屏橙点 kicker、Research 台账 ACTIVE 橙点、Plate 状态灯、沙盒投毒行全部获得同一把钥匙——Round 1"会被误读为换色 Swiss"的风险被正面封堵。
2. **FIG. 1 是全场唯一"数据即图像"的图版**：BM25 实时算出的 7 行分数条 + 图注把"低确定性"本身写成论证（`A_dl_seg1`），配合 PLATE 01–04 的拉页尺度，portfolio_presentation 从目录行跃升为有存在感的版式；"OPEN THE INSTRUMENT IN THE LAB ↘" 把作品与可玩证据缝合。
3. **节奏纪律**：96–128px 图版呼吸、hairline 分章、左栏 sticky 章节骨架、dark 下 display 500→470 的字重补偿（dark 整页无一处 halation，`A_dd_seg0/1`）——工艺密度三案最高。

**缺点**
1. **首屏右半屏是死空间**：1440 首屏（`a.a.home.desktop.light.png`）左侧是三行 display + lede，右侧除导航外完全空白。"书页留白锚"在智识上成立，但获奖级首屏的构图里 45% 面积不承担任何信息——Round 1"10 秒扫描没有设计动作"的批评只解决了一半（FIG. 1 在折叠线以下）。
2. **长页节奏单一**：整页从 Research 台账、Ledger、Lab 排名条到 Connect 全是"mono 编号 + hairline 行"同一种组合拳（`A_dl_seg0–seg3`），纪律有余、变奏不足；FIG. 1（Work）与沙盒排名（Lab）在首页出现两次几乎同构的条形图，轻微自我重复。
3. **尾部两个连续死区**：Publications（`— RESERVED` × 2）之后 Connect 六行全是 `— UNLISTED` + "No channels are configured yet."（`A_dl_seg3`）——诚实，但页尾 1.5 屏在视觉上是空城；至少其一值得获得不同的排版处理（如合并成单行台账）。

**如果只能改一处**：把首屏右半屏交给一个语义驻留物——最轻的做法是把 RECORDS 诚实读数行从页尾上提为右栏纵排批注（或把 FIG. 1 的前 3 行做成 hero 右侧的 live mini-ranking），让 1440 首屏的每一块面积都有职责。

### Team D「Offprint」— 8.18，排名 3

**优点**
1. **首屏脱胎换骨，"沉闷"死刑撤销**：76px 衬线 display + 右栏朱批（朱砂竖线 + NOW ASKING — Q1 + 斜体问题原文）+ 9% 幽灵 Q1 压角（`d.d.home.desktop.light.png` / dark 同构）——首屏第一次"看起来有人住在里面"，且记忆点是数据不是装饰。
2. **降维工程与视觉互惠**：SVG 地图删除后，"FIELDS IN ROTATION … stated, not drawn" 的 footnote 本身成了设计宣言（`D_overlap_zoom` 可读出全文）；SYS·LIGHT·DARK radiogroup + 移动端 THEME: SYSTEM 循环键把三态主题做成了显式控件而非隐藏开关。
3. **色彩系统最严格**：朱砂白名单五条、单视口 <2% 面积（截图中 nav、hover、状态 chip 均为 ink 系可证）；暖纸底 + ink 14.93:1 的对比度验收表是三案中最完整的色彩契约。

**缺点**
1. **一处必须修复的排版 bug（本评审轮唯一肉眼可见的文字重叠）**：1440px 下 Directions Ledger 的脚注（float 边注）下缘与 Ledger 图例行直接叠印——"round-one SVG node map was retired on purpose…" 与 "ACTIVE — BEING ASKED NOW · OPEN…" 互相穿透，light/dark 均可复现（证据：`d.d.home.desktop.light.full.png` / `d.d.home.desktop.dark.full.png` y≈2249–2440 区域，放大图 `_crops\D_collision*.png`）。成因即 §1.5 采纳的"纯 CSS float 负 margin"方案：float 高度超过宿主段落、而下方的 mono 图例行不参与 float 环绕。这是 Round 1 工程评委处方的真实失败模式。
2. **整页视觉证据 70% 空白——内容被 whileInView 隐藏**：`chrome.tsx` 的 `Reveal`（framer-motion `initial={{opacity:0, y:12}}` + `whileInView`）包住了每个 section 的主体；fullPage 截图不触发 IntersectionObserver，导致 `d.d.home.desktop.light.full.png` / mobile full 中 Question Ledger 四问、四条 Case Records、Lab、Notes、About 全部不可见（只有静态标签和 Publications ghost 行在场）。真实滚动浏览会渐入，但这意味着：打印/整页导出/任何不滚动场景下页面呈"半坏"状态，且三案中只有 D 把运动预算花在了"内容可见性"上（A/H 的动效全部在首帧，整页证据完整）——对一个以"长卷黄金路径"为身份的方案，这是稳健性代价。
3. **留白通胀**：即便补回隐藏内容，D 的分区间距全站最慷慨（"FIELDS IN ROTATION" 标签到下一可见元素间隔近一整屏，`D_map_zoom`）——纸面呼吸感与"90 秒扫站信息密度"存在张力。

**如果只能改一处**：修边注 float 的溢出（给图例行加 `clear` 或把 float 收进 `contain: layout` 的宿主容器），让"stated, not drawn"的宣言不再以叠印的形式自我反驳；同一刀里顺手把 `Reveal` 的隐藏初态改为首帧可见（stagger 照旧），整页证据即可自证。

### Team H「检索系统」— 8.50，排名 2

**优点**
1. **三案中最大的视觉翻身**：Round 1 的噪音清单（光束拖柄、blur、斜切线、锚轨、滚动驱动动画）确认全部删除，整页只剩"每 section 一根 hairline + 编号坐标"（`H_dl_seg0–seg2` 与 DESIGN_NOTES §1.3 逐项对上）；"INDEX OF ONE PERSON" 右栏把方位感与诚实计数（6 TOPICS · 4 QUESTIONS / 4 CHAINS / 0 RECORDS）做成了一等公民——这是三案里最好的"首屏右侧面积利用"。
2. **字阶重建属实且优雅**：12/15/19/24/38/48/76 逐档 ×1.25（`src/index.css` 实查），mono 回到 12px 单层、meta/kicker 以字族区分而非 1px 差；76px 衬线 hero 在 mobile 390 的 clamp 降档（`h.h.home.mobile.light.png`）依然成立。Round 1 的最重扣分项正式销案。
3. **Self-Query 是"降级做成最终形态"的范本**：resolved 态 = 常驻构图，query 状态行 `RESOLVED · 4 FACETS · 0MS NETWORK` 是可审计读数；动效预算表三条（facet 渐入 / 主题 crossfade / 排名条 scaleX）与截图证据一致（light 首屏捕在 RESOLVING、dark 捕在 RESOLVED，恰证明时间轴存在且收敛）。

**缺点**
1. **Work 证据链是全站最干的段落**：W-01…W-04 的 `01—PROBLEM / 02—METHOD / 03—ARTIFACTS / 04—LINKS` 四栏里，LINKS 一栏四次全是 "—"（`H_dl_seg1`）——诚实但四个死栏并排，mono 方法清单让它读起来像表单而非作品；这是 H 唯一"视觉质量低于其文字质量"的段落。
2. **与 D 的暗色趋同**：暖黑 + 奶油衬线 + mono 读数的 dark（`H_dd_seg1` vs `D_dd_seg1`）并排几乎同族；蓝色信号色在 light 下清晰（`§01` 蓝、ACTIVE 蓝点），dark 下与灰阶的分离度略降。
3. **首屏仍有一处时间轴赌注**：desktop light 机位捕到 `RESOLVING…`——对慢设备/慢手的真实访客，第一秒的状态行语义是"加载中"而非"身份宣言"；skip 路径完备，但状态词本身可以更主动（如 `QUERYING SELF — 0MS` 之类不装作网络等待的措辞）。

**如果只能改一处**：重排 Work 证据链的栅格——四栏收成两栏（PROBLEM/METHOD 为主，ARTIFACTS+LINKS 并入行尾 mono meta），让 LINKS 的 "—" 退化为行内缺项记号而不是一整根死柱；这一刀同时解决 Work 段的干涩与"表单感"。

---

## 4. 14 维评分（1–10，可 0.5）

| 维度 | A | D | H | 评注 |
|---|---|---|---|---|
| visual_quality | **8.5** | 7.5 | **8.0** | A 工艺密度最高但首屏死空间；D 首屏最佳但叠印 bug + 整页证据空白；H 最均衡、Work 段拉低 |
| originality | **8.0** | **8.0** | **8.5** | H 的自述框架+公开执法的隐喻预算最独特；A 的 FIG.1 数据即颜料；D 朱批是最佳单点但语言仍在纸面编辑谱系内 |
| typography | **9.0** | **9.0** | 8.5 | A 双语气 + dark 字重补偿最完整；D 76px display 与 4px 基线同分；H 字阶重建属实但 12px meta 偏小 |
| information_hierarchy | 8.5 | 8.5 | 8.5 | 三案同级：A 章节骨架、D 状态图例、H 右栏索引各有最强一笔；D 的叠印恰好发生在层级最密的接缝上 |
| ux | 8.0 | 7.5 | **8.5** | H 的 palette/skip/帮助层 + 无滚动仪式最顺；D 的 whileInView 门控与叠印扣分 |
| mobile_experience | 8.5 | 8.5 | 8.5 | 三案 390 均为真重设计；D 的原生 details 边注与 H 的 resolved 直通是各自亮点 |
| technical_feasibility | **9.0** | 8.0 | 8.5 | A 无运动依赖最稳；D 引入 framer-motion 且暴露 IO 失败面；H 动效三条全可控 |
| long_term_maintainability | 8.5 | 8.5 | 8.5 | 三案内容契约同源；D 白名单即契约、H 隐喻预算即契约，A 章节注册表即契约 |
| research_presentation | 8.0 | **9.0** | 8.5 | D 的 Ledger+图例+ADJOINS 仍是研究展示天花板 |
| portfolio_presentation | **8.5** | 7.5 | 8.0 | A 的 PLATE+FIG.1 存在感最强；D 的 Case Records 在证据中不可见；H 的链式四栏偏干 |
| light_mode | 8.5 | **8.5** | 8.5 | 三案暖纸底同级；D 的朱砂在纸上最动人，H 的蓝最清晰，A 的橙最克制 |
| dark_mode | 8.5 | 8.0 | 8.5 | A 中性黑独立于 D/H 的暖黑双胞胎；D 的 dark 略平 |
| performance | 8.5 | 8.0 | 8.5 | D 的变量衬线 ~460KB + framer-motion 是最重的账单（已自报） |
| accessibility | 8.5 | 8.5 | **9.0** | H 四重降级 + noscript 骨架保持全场最佳；D 的内容可见性依赖 JS/IO 是 a11y 邻接风险 |
| **均值** | **8.54** | **8.18** | **8.50** | |

**一票否决区复核**：三案的 visual_quality / originality / light_mode / dark_mode 均在及格线之上，无否决。D 的叠印 bug 记为 visual_quality 内扣（7.5），未到否决（否决留给"不可修复的品质塌方"——这是单点可修的缺陷）。

## 5. Top 3 排名（视觉评委）

1. **Team A「Monograph」** — 唯一在构图、色彩、层级、节奏四个维度都没有明显短板的方案；本轮把 Round 1 的两个负分维度用"系统"而非"装饰"补掉，工艺密度即护城河。
2. **Team H「检索系统」** — 进化幅度最大者：减法做掉了全部噪音，字阶销案，自述装置降级成身份；距第一只差 Work 段的一次重排。
3. **Team D「Offprint」** — 拥有三案最佳的单屏记忆点（朱批 + 幽灵 Q1）与最严的色彩契约，但叠印 bug 与内容可见性门控把执行分拖到概念分之下；修掉这两处，排名随时可以掉头。

## 6. 给 Round 3 的一句话（视觉）

三案共享词表已经够多了——下一轮的差异化不该再来自"又一个诚实读数"，而应来自**谁敢在自己的单色系统里做出第二次变奏**（A 的第二构图、D 的第二版式密度、H 的第二段落质感）。
