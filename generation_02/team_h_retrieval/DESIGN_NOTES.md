# DESIGN_NOTES — Team H「检索系统」Generation 2

`@portfolio/gen2-h` · A Retrievable Self, second generation.
Round-1 verdict to answer: originality 1.80 / a11y 1.09 must survive; typography −0.97 and visual_quality −1.29 must flip positive; the self-description device must not be a ritual toll.

---

## 1. 相对第一代改了什么，为什么

### 1.1 自述装置：Retrieval Beam → Self-Query（降级，被授权的降级）

Gen 1 的装置是"拖动光束揭开 blur(5px) 遮蔽的四行侧面"。Round 1 四位评委从四个角度否决了同一个东西：视觉（糊 = 未完成感，不是悬念）、UX（遮蔽态与渲染坏掉不可区分；4 秒提示真空期）、a11y（低视力用户不设 prefers-contrast，默认路径就是"先操作才能读"）、product（首因风险赌注大于收益）。

Gen 2 执行任务书授权的降级形态——**"逐行渐入的静态构图"，并把降级做成了最终形态**：

- 首屏 = 站点对自己执行的一次固定检索：`query "who is this person?"` → 四条 facet 以 1.2s 的 stagger（transform/opacity，唯一的环境动画）到位，随后状态行定格为 `RESOLVED · 4 FACETS · 0MS NETWORK`（真实读数：本地渲染，确实 0ms 网络）。
- **零 blur**。未到位的行只是还没到（arriving），不是坏掉（broken）。任何用户群都不再需要"先操作才能读"。
- 标题 t=0 可见、永不参与动画（LCP 是真文本）；resolved 态即常驻构图——没有"折叠回收 40% 高度"的 CLS 事故，空间从头保留。
- 3 秒内可跳过的四重路径：显式 `skip intro →`（t=0 可见，占位防抖动）、Esc、等待 1.5s 自动完成、回访 localStorage（`h-intro-resolved`）直通静态。reduced-motion 直接静态。数字键 1–4 快捷键被废除（NVDA 浏览模式冲突，a11y 评委点名）。
- 解散后的交互需求转移到了真正有用的地方：palette（`/`）才是访客主动检索的入口。首屏不需要访客做任何事。

### 1.2 typography：从"装饰性台词"到真字阶（负分维度 #1）

排印评委的指控成立：Gen 1 自称 1.25 模数，实际阶梯 76/44/24/17/14/13/12——44→24 是 1.83，14/13/12 三级每级差 1px，比例是台词不是推导。Gen 2 的重建：

- **一个比例，诚实执行**：阶梯 = 12 / 15 / 19 / 24 / 30 / 38 / 48 / 60 / 76，每级 ×1.25（整数化后 1.250–1.267，无一级"只差 1px"）。
- **每档有职责**：12 = mono meta（坐标/读数/日期）；15 = small + code（code 首次拥有完整 token：15/24、零字距——Gen 1 缺失的 code 层）；19 = body + 衬线 entry 标题；24 = 问题句/问题台账（t-h4）与 standfirst（t-lead 斜体）；38 = 路由页 H1；48 = 首页 section 标题；76 = 仅 hero。两处 skip-one（24→38、48→60→76）是显式文档化的跳级，不是比例失效。
- **行高全部落在 4px 基线**（16/24/28/32/44/56/80），间距全站 4 的倍数——这是从 B 偷来的纪律，但服务于检索语言而非杂志版面。
- **三族三职**：Newsreader = 内容声部（标题/问题/问题句），Inter = 界面声部（正文/kicker），Plex Mono = 机器声部（坐标/读数/代码）。meta 与 kicker 同为 12px 但以字族+字重+字距区分（Gen 1 的 13 vs 12 伪层级被废除）。
- **CJK 三条 Gen 1 的正确判断被保留**（中文不用斜体、标题禁负字距、`:lang(zh)` 行为独立），并补上 serif/sans 各自的中文回退栈；about 里常驻一句中文作渲染自检。
- **Dark 字重补偿**（偷自 A）：display 500→470、字距 +0.002em 抗光渗。

### 1.3 visual_quality：做减法（负分维度 #2）

Gen 1 的装置感来自元素数量；Gen 2 的身份感来自约束数量。删掉：Beam 拖柄、blur 遮蔽层、2° 斜切分区线、左缘常驻锚轨、链条连线绘制动画、滚动驱动的一切、sample 角标（数据层诚实、展示层沉默）。留下的全部装饰预算：**每 section 一根 1px hairline + 编号坐标**。双语义色系保留（accent=可信路径 / signal=攻击态，signal 永配 ▲+文字），它是被评委验证过的资产。

**动效预算（学 A，逐条可审计）**：

| # | 动画 | 触发 | 一句话信息功能 |
|---|---|---|---|
| 1 | Hero facet 渐入（1.2s，transform/opacity） | 首访一次 | "内容正在到位"——检索正在执行的最后一眼 |
| 2 | 主题 crossfade 240ms | 用户切换 | "状态已改变" |
| 3 | Sandbox 排名条 scaleX 240ms | 用户操作 | "注入/防御改变了排名" |

滚动不再触发任何动画；hover 只有颜色与下划线（160ms）；`MotionConfig reducedMotion="user"` + 全局 CSS 双保险；rank 条用 scaleX 而非 width。

### 1.4 information_hierarchy：主线显式化

Home 顺序改为任务书指定的主线：**首屏（00 身份）→ 方向（01 Research：方向台账 + Question Ledger）→ 证据（02 Work：四条证据链）→ 行动（03 Lab 真实排名预览 + 06 About/Connect）**，Notes（04）/Publications 空态（05）作为附录收尾。右栏 "INDEX OF ONE PERSON" 保留（UX 评委认证的 10 秒方位感），每个坐标旁挂诚实计数。Gen 1 的"工作先于口号"让位于更清楚的主线；证据链本身没变。

### 1.5 诚实读数（偷自 C，全站贯穿）

`0 RECORDS` / `4 CHAINS` / `0MS NETWORK` / `METHOD: BM25` / `DOCUMENTS: 8→9` / `BUILD {date} · 0 ANALYTICS · 0 TRACKERS` / palette 底部 `LOCAL INDEX · N RECORDS · 0MS NETWORK`。每一行都能被代码审计——footer 的计数从 content 模块实时求和，sandbox 的分数是真实 BM25，索引大小是真的。诚实是这个方向的原创性资产，Gen 2 把它从"声明"落成"读数"。

## 2. 偷了谁的什么

| 来源 | 偷什么 | 落点 |
|---|---|---|
| B | 垂直节奏/baseline 纪律（4px 基线、行高落格） | §1.2 字阶与全站间距 |
| B | Publications 空态的"征稿中"礼仪 | 虚线 ghost 槽位 + `status: call for papers` |
| A | 动效预算（≤3、全 transform/opacity、"每个动效一句话说明信息功能"） | §1.3 预算表 |
| A | token 级对比度验收 + Dark 字重补偿 | css 注释逐 token 标注对比度；display 470 |
| C | content schema 数据契约（sample/status 进类型系统） | `src/content/types.ts`，pack 契约全保留、只扩展 |
| C | 诚实读数语言 + ghost 槽位 + 缺项显示 `—` | §1.5；Work 链接位缺项渲染 `—` |
| E（自动继承） | `/` 站内搜索 + `?` 帮助层 + 键盘四重降级 | palette（完整 combobox 语义）、help overlay、Esc/Skip/localStorage/reduced-motion |
| D | Question Ledger（研究问题是一等公民：编号/状态/日期） | §01 的 question ledger，状态 active/open/resting 全部文字化 |

## 3. 拒绝了什么

1. **Blur 遮蔽（自弃）**——四位评委的共同判决 + a11y 的实质伤害论证，见 §1.1。
2. **View Transitions 圆形扩散切主题**——趋同警告点名 C/G/H 撞衫；改用朴素 240ms crossfade，事件感由 crossfade 本身承担。
3. **证据链绘制动画（自弃）**——600ms 滚动触发违反 Gen 2 动效预算；链是静态排版结构。
4. **Timeline 渲染（自弃）**——pack 的三条里两条是显式 TODO，把"TODO — your degree"印给访客比不印更不诚实。数据与类型保留，UI 不渲染。
5. **左缘常驻锚轨、2° 斜切线、sample 角标（自弃）**——噪音预算砍到底；坐标语言压缩进 section header 与 palette。
6. **mono 化全站**——拒绝滑向 C/E 的仪器/终端方言：mono 只做 meta 层（≤10% 的文本量），检索隐喻的"诗歌"只允许三个触点（hero 自述块、palette、lab 读数），写进 `site.metaphorTouchpoints` 并在 colophon 公开执法。

## 4. 内容纪律

- `src/content/` 七个文件 + `types.ts` 全部对齐 CONTENT_PACK；只扩展（`facetLine`、`chain`、`ToyDefense`、`BudgetChunk`）不删字段。
- `sample: true` 只活在数据层；对用户可见的诚实只在两处规定位置：Publications 空态与 Lab 的 "illustrative toy" 常驻声明。
- links 全 null → Connect 渲染一句访客口吻占位（"Ways to reach me will appear here."）；palette 的 copy-email action 因 email 为 null 而不存在（不提供会失败的入口）。
- name 为 null → JSON-LD 不声称 name，UI 无假名。

## 5. 工程与验证记录

- `npm run build`（tsc --noEmit + vite build）零错误；TS strict 全开（含 noUnusedLocals/Parameters）。
- 无头 Chromium 审计（`scripts/audit-console.mjs`）：7 条路由 + 404 全部无 console error/warning、无 pageerror、无 failed request；palette 查询 "poisoning" 4 条结果、Enter 跳转；主题切换；sandbox 注入后 d8 第一、防御后掉出 top-3；Context Budget 缩减预算出现 TRUNCATED；390px 无横向滚动；移动 index 开合正常。
- UX 探针（`scripts/audit-ux.mjs`）：首访 resolving→self-complete→持久化；skip 按钮 t=0 可见、完成后消失；Esc 跳过；回访静态直通；reduced-motion 静态直通；`?` 帮助层；Publications 空态元素在场；CJK 测试句在场；768/1280/1600 无横向滚动。
- Sandbox 验收（`scripts/verify-sandbox.mjs`，经 vite ssrLoadModule 加载真实模块）：clean 语料 top = d1 2.17；注入后 **d8 = 3.73 第一**（d1 1.90）；防御 ×0.1 后 **d8 = 0.37 掉到第 6**。语料按 pack 规则调过（d2–d7 获得与 query 的自然词重叠；d8 关键词堆砌——真实投毒页的样子），打分器未做任何作弊。
- 依赖：仅新增 `@fontsource-variable/newsreader`、`@fontsource-variable/inter`、`@fontsource/ibm-plex-mono`（自托管子集，swap；CJK 走系统栈）。vite.config 增加 `@` alias 与 `__BUILD_DATE__` define；tsconfig 按 TS 7 要求移除 baseUrl。
- SEO：完整 meta + OG + JSON-LD Person（无 name）、`public/robots.txt`、`public/sitemap.xml`（example.com）、路由级 title；palette 支持 `/?q=` 深链。无 JS：noscript 静态骨架如实声明缺口（SPA 的诚实降级，不假装 SSR）。

## 6. 遗留风险

1. **首屏"安静"的误读风险仍在**：装置降级后，首屏的记忆点从"可玩"变成"构图+读数语言"。若评审判为"没有设计动作"，第一刀应加在 facet 行的 hover 态（坐标→accent），而不是恢复任何遮蔽/仪式。
2. **语料与查询耦合**：d8 的第一名依赖当前 query 与语料的词重叠；换 query 会改变演示效果。这是玩具的边界，已由常驻声明覆盖，但替换语料的人需要重跑 `scripts/verify-sandbox.mjs`。
3. **palette 首位结果排序**：同分时 NOTE 可能排在 TOPIC 前（按内容顺序）。可用性无损，但若要"方向优先"，在 `queryRecords` 给 TOPIC/DEMO 加类型权重即可。
4. **长文 measure 未经历真实长文考验**：notes 只有摘要行；将来放全文时 19/28 + 68ch 的正文设定需要真文校对。
5. **Home 是全量长滚动**：七段全渲染。内容增长后（笔记>10 篇）Home 应只保留摘要行并依赖路由页——结构与组件已就位，改 Home 的 section 调用即可。
