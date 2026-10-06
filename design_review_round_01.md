# Round 1 评审报告 — design_review_round_01.md

> 8 个独立设计团队（Team A–H）提交了完整设计提案（`generation_01/team_*.md`）。
> 10 位独立评委从各自专业视角对 8 案 × 14 维度打分（1–10）。
> 本报告为汇总、共识分析与 Top 3 决定。逐案详细评语见 `reviews/round_01/judge_*.md`。

## 1. 评审设置

- 评委：视觉设计、排印、UX、前端工程、无障碍、移动端、学术研究者、招聘者、产品设计师、原创性（各评委的完整报告见 `reviews/round_01/`）。
- 维度：Visual Quality / Originality / Typography / Information Hierarchy / UX / Mobile Experience / Technical Feasibility / Long-term Maintainability / Research Presentation / Portfolio Presentation / Light Mode / Dark Mode / Performance / Accessibility。
- 归一化：为消除评委宽严差异，先按评委内 z-score 归一化再取均值；Top 3 票点 = 每个评委 Top 3 排名（3/2/1 分）累加。
- 数据文件：`reports/round_01_scores.json`；聚合脚本：`reports/aggregate_round_01.mjs`；原始聚合输出：`reports/round_01_aggregate.md`。

## 2. 总排名（归一化总分排序）

| 排名 | Team | 方向 | 归一化总分 | 原始均分 | Top3 票点 |
|---|---|---|---|---|---|
| 1 | **A** | Apple-like Minimalism「Monograph 单行本」 | **9.00** | 8.54 | **19** |
| 2 | D | Academic Researcher「Offprint 抽印本」 | 1.09 | 8.22 | 5 |
| 3 | H | Experimental Interaction「检索系统」 | 0.96 | 8.24 | 6 |
| 4 | C | Modern AI「精密仪器」 | 0.85 | 8.22 | 8 |
| 5 | B | Editorial「Field & Retrieval 学刊」 | −0.51 | 8.13 | 8 |
| 6 | E | Creative Developer「BENCH 工作台」 | −1.96 | 8.10 | 13 |
| 7 | F | Swiss「Coordinate System」 | −4.07 | 8.06 | 1 |
| 8 | G | Dark Premium「Dimmer Room」 | −5.36 | 7.99 | 0 |

**注意 E 的极化**：E 归一化分仅第 6，但 Top 3 票点全场第二（13）——a11y、recruiter 把它排第一，visual、ux、originality 把它排第二，而 typography/engineering 给了全场最重扣分。典型的"高潜力、高执行风险"。C 票点 8 但各维度均衡。

### 各维度归一化均分（正 = 高于评委均值）

| Team | vis | orig | typo | hier | ux | mob | feas | maint | res | port | light | dark | perf | a11y |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | 0.40 | −0.52 | **1.26** | **1.32** | 0.11 | 0.44 | **1.50** | **1.20** | 0.02 | −0.87 | 1.04 | 0.57 | **1.53** | 1.00 |
| D | −0.78 | −0.21 | 0.81 | 0.99 | −0.45 | 1.02 | −0.96 | −1.15 | **1.65** | −0.93 | 0.99 | −0.13 | 0.01 | 0.23 |
| H | −1.29 | **1.80** | −0.97 | −0.39 | 0.20 | 0.28 | −0.17 | −0.37 | 0.62 | 0.52 | −0.20 | −0.21 | 0.05 | 1.09 |
| C | −0.24 | −0.53 | −0.71 | 0.05 | 0.88 | 0.07 | 0.40 | 0.62 | 0.16 | 0.32 | −1.03 | 0.97 | 0.42 | −0.54 |
| B | 1.21 | 0.42 | **1.34** | −0.08 | −0.63 | −0.10 | −0.98 | −0.13 | 0.64 | −0.43 | 0.74 | −0.22 | −1.46 | −0.81 |
| E | −0.53 | 0.84 | −1.16 | −0.80 | **1.47** | 0.13 | −1.01 | −0.85 | −0.50 | **1.60** | −0.66 | −0.55 | −1.01 | 1.07 |
| F | 0.25 | −0.72 | −0.54 | −0.22 | −0.80 | −0.54 | 1.17 | 1.16 | −1.29 | −0.86 | −0.19 | −1.61 | 0.96 | −0.84 |
| G | 1.00 | −1.07 | −0.03 | −0.87 | −0.78 | −1.30 | 0.05 | −0.49 | −1.30 | 0.64 | −0.69 | 1.17 | −0.50 | −1.20 |

### 各评委 Top 3

| 评委 | Top 3 |
|---|---|
| 视觉 | A > E > B |
| 排印 | B > A > D |
| UX | A > E > D |
| 工程 | A > C > F |
| 无障碍 | E > A > H |
| 移动端 | A > C > E |
| 研究者 | D > B > H |
| 招聘者 | E > C > H |
| 产品 | A > C > B |
| 原创性 | H > E > B |

## 3. 共识分析（逐方案）

### Team A「Monograph」— 冠军：全员共识的均衡第一
- **共识优点**：工程故事最干净（feasibility 1.50 / performance 1.53，6 位评委进 Top 3 且 4 位排第一）；token 级对比度验收（a11y 好评）；"双语气" Hero（sans 陈述 + serif italic 限定语）+ 1.8 秒身份传达被 UX 评委点名有效；Dark 模式的字重补偿（500→470 防 halation）被排印评委认可为真设计。
- **共识缺点**：originality −0.52——原创性评委判其"气质与 F 同源（hairline + 单 accent + radius 0）"，若 accent 的"语义信号"逻辑不被读到会误判为换色 Swiss；portfolio_presentation −0.87——项目展示是"行"，招聘者/产品视角认为存在感不足；A 自己也承认"10 秒扫描式评审判为没有设计动作"。

### Team D「Offprint」— 研究展示天花板
- **共识优点**：research_presentation **1.65 全场最高**——Question Ledger（编号问题 + 三态 + 日期）被研究者评委排为第一理由："天然不需要编造成果，10 秒看懂这个人在思考什么"；移动端边注三段降级（1.02）设计扎实；排印体系（Newsreader + 4-token measure）获排印评委第三。
- **共识缺点**：technical_feasibility −0.96 / maintainability −1.15——台账的日期与状态是"长期维护自觉"负担，SVG 研究地图与台账双向联动的工程成本高；visual_quality −0.78 + 招聘者视角 UX 平庸——"学术感过头即沉闷，像 arXiv 克隆，90 秒扫站找不到记忆点"（其自我风险被多个评委验证）。

### Team H「检索系统」— 原创性最高，执行噪音最大
- **共识优点**：originality **1.80 全场最高**——"访客是 query，内容是 corpus"是被验证的真概念（贯穿导航/自述/Lab 而非话术）；a11y 1.09——四重降级（键盘/无 JS/reduced-motion/回访记忆）被无障碍评委称"全场天花板"，唯一把 prefers-contrast 写进验收的方案；诚实声明（"什么不是真的"常驻）被研究者与招聘者共同认可。
- **共识缺点**：typography −0.97 / visual_quality −1.29——排印体系是 8 案中最弱的（自称 1.25 模数但阶梯不成立，排印评委最重扣分），视觉噪音偏高；"Retrieval Beam 自述装置"存在仪式疲劳风险（回访变慢）。

### Team C「精密仪器」— 第 4 名，工程契约最佳
- 优点：数据契约（content schema）全场最佳（engineering Top 3）；诚读数（`PUBS 0`、`0ms NETWORK`）的诚实语言获多评委好评；dark_mode 0.97。
- 缺点：originality −0.53（原创性评委 5.5 分：Linear/Vercel 方言太重）；mono 系统语言"极易滑向开发者终端模板味"（自己承认 + 评委验证）；light_mode −1.03 是弱项。

### Team B「学刊」— 排印最强，UX 弱
- 优点：typography 1.34 全场最高（唯一真 baseline grid）；期刊隐喻结构性落地（Contents 兼路由表、空状态 "— CALL FOR PAPERS"）；research 叙事强。
- 缺点：ux −0.63 / performance −1.46——四字体族加载成本与排印强度对性能的拖累被工程/移动评委共同扣分；招聘者 6.5 分 UX："第一印象是'这人很会排版'，不是'这人很强'"。

### Team E「BENCH 工作台」— 最具潜力的高风险方案
- 优点：portfolio_presentation 1.60 全场最高（作品"可操作"而非"可浏览"）；ux 1.47（键盘体系 + 站内搜索 + `?` 帮助层）；a11y 评委 Top 1（P-00 装置四重降级）；LAB-01"投毒改写检索排名"被多个评委视为全场最强单个 demo 概念。
- 缺点：typography −1.16 / feasibility −1.01 / performance −1.01——Canvas 装置与 16.5px 正文被点名；维护负担重。

### Team F「Coordinate System」— 纪律最强，温度最低
- 优点：feasibility 1.17 / maintainability 1.16（表格语法最可生长）；performance 0.96。
- 缺点：research −1.29 / a11y −0.84 / dark −1.61；原创性 6 分（其自称最大风险"被读成线框图"被验证）；全案票点仅 1。

### Team G「Dimmer Room」— 主题工艺最好，整体失焦
- 优点：visual 1.00 / dark 1.17（Dimmer Switch 主题切换的 View Transitions 设计被工程评委认可）；portfolio 0.64。
- 缺点：research −1.30 / mobile −1.30 / a11y −1.20 / originality −1.07（原创性评委全场最低 5 分："高端音频品牌 marketing 站的语言，隐喻是包装"）；light 0.69 虽及格但"Light 是附庸"的担忧被验证。研究者的"准否决单点"：`In review` 式空态文案有伪造进度之嫌。

## 4. 趋同警告（视觉评委 + 原创性评委交叉验证）

- **B ↔ D 双胞胎**：都是"印刷品/阅读优先 + 衬线签名"——Top 3 里 D 与 B 只能取其一（取 D：研究展示显著更强）。
- **A ↔ F 表兄弟**：hairline + 单 accent + radius 0 同气质（取 A：均衡性碾压）。
- **C ↔ E 方言共同体**：工程工作台/仪器语言互相趋同（都不进 Top 3，但两案各有高价值想法被吸收）。
- **C/G/H 主题切换圆形扩散撞衫**：View Transitions 光圈切换是 2024–26 流行手法，最终方案若使用需改造出差异化。

## 5. Top 3 决定

**进入 Generation 2 的三个方向：**

1. **Team A「Monograph」** — 排名第 1（9.00 / 19 票点），全员共识的均衡冠军。进化任务：解决 originality 与 portfolio_presentation 两个负分维度，同时保住工程与性能优势。
2. **Team D「Offprint」** — 排名第 2（1.09）。研究展示全场第一，正是"研究者长期使用"这个核心目标的最强候选。进化任务：解决工程可行性/可维护性负分，打破"arXiv 克隆"的沉闷风险。
3. **Team H「检索系统」** — 排名第 3（0.96）。原创性全场第一，且无障碍设计全场最佳。进化任务：补上全场最弱的排印体系，收敛视觉噪音。

**为什么不是 C/E/B（票点更高的 E 为何落选）：**
- E 的 Top 3 票点（13）高于 D（5）和 H（6），但 E 的强度集中在"作品可操作性"与键盘 UX——这与 C 的仪器语言高度趋同，两案互相挤占同一生态位；且 E 的两个最大负分（typography/feasibility）恰恰是 Top 3 案需要补的维度，与其再实现一个工作台方言，不如把 E 的**想法**（站内搜索、诚实 demo、键位体系）注入三个幸存方向。D 与 H 分别代表"研究深度"与"交互原创"两个 A 覆盖不了的极点，三案组合的探索空间最大。
- B 与 D 双胞胎（见趋同警告），取研究展示更强的 D。
- C 的均衡分第 4 但原创性 −0.53 且 light −1.03；其最强资产（数据契约、诚实读数）作为"被偷想法"进入 Gen 2 规格。

## 6. 落选方案的"被偷想法"清单（写入 Gen 2 规格）

**强制吸收（评委点名的高价值资产）：**
- From C：① content schema 数据契约（状态/版本/sample 标记进类型系统）；② 诚实读数语言（`0 RECORDS`、`0ms NETWORK` 式的"真实可计算信息"）；③ 空状态 ghost 槽位语法。
- From E：① 站内搜索（纯前端，索引来自 content/*.ts）+ `/` 唤起；② `?` 快捷键帮助层（键盘可发现性）；③ LAB-01「投毒改写检索排名」demo（全场最强单 demo 概念）+ demo 常驻"什么不是真的"诚实声明。
- From B：① 垂直节奏/baseline 纪律；② Publications 空状态的"征稿中"礼仪；③ standfirst（导语）写作层。
- From F：① 编号体系作为导航锚点；② 空状态 = 列表中一行（编号自动重排）；③ 单屏 accent 预算纪律。
- From G：① 主题切换的"事件感"（View Transitions + 三级降级，但需差异化改造避免撞衫）；② 图片/图表双主题行为表。
- From D（给 A/H）：Question Ledger 概念（研究问题作为一等公民）。
- From A（给 D/H）：token 级对比度验收纪律；Dark 字重补偿。

## 7. Generation 2 要求（Top 3 进化规格）

1. **不允许简单延续**：必须吸收 §6 强制想法 + 修复本方向全部显著负分维度。
2. 各方向进化靶点：
   - **A**：originality、portfolio_presentation 由负转正；首屏记忆点增强但动效预算 ≤3 的纪律不破。
   - **D**：technical_feasibility、long_term_maintainability 由负转正（台账状态必须可低维护）；打破沉闷（记忆点）；保住 research_presentation 第一。
   - **H**：typography、visual_quality 由负转正（建立真字阶）；保留 originality/a11y 优势；自述装置必须有 3 秒内跳过路径。
3. 实现范围：可运行 Vite 应用（Home/Research/Work/Lab(≥1 真实可玩 demo)/Publications 空态/About/Connect）、双主题全 token、移动端 390px 真重设计、内容数据驱动、`npm run build` 零错误、无 console error。
4. 共享内容包（`generation_02/CONTENT_PACK.md`）统一 mock 数据，保证评委回可比对。
