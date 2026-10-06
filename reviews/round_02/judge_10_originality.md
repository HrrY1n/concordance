# Round 2 评审判词 — Judge 10 · Originality（原创性）

> 职责：抓"模板味"，指认每案的方言来源与模仿比重，验证 Round 1 负分维度是否真的进化。
> 主要证据：`D:\Codex\play\portfolio\shots\gen2\`（a2/ap、d2/dp、h2/hp 截图，含 390px 与双主题）；辅助：`generation_02\team_*\src` 源码与 DESIGN_NOTES.md。
> 方法说明：整页截图过长者已切片检查（crops 于 `shots\gen2\_crops\`）；所有"声称的原创点"均做了源码/截图双向核验。

---

## 0. 三案共同的新问题：被强制的"偷窃"正在稀释原创性信号

Gen 2 规格强制吸收了 C 的诚实读数（`0 RECORDS` / `0MS NETWORK`）、ghost 空槽、E 的诚实声明、D 的 Question Ledger。结果三案现在共享同一批" Mono 大写读数 + 虚线 RESERVED 槽 + ILLUSTRATIVE TOY 声明"语汇。**这些是规格负债，不是任何一案的原创资产，本评审判时不计入任何一案的 originality 加分**；反之，谁把借来的语汇用出了自己的口音，谁才得分。三案的差异化因此必须靠各自真正的签名装置——这正是本轮的评判焦点。

---

## 1. Team A「Monograph 单行本」

### 1.1 方言来源指认

- **基底方言仍是 Swiss/开发者作品集系**：hairline 分隔、单橙 accent、radius 0、mono 大写导航（`01 ABOUT 02 RESEARCH …`）、账簿行——这一层的"口音"与 Round 1 判定的 A↔F 表兄弟同源，也与 Linear 式克制的开发者站共享气质。**模仿比重大约占整体印象的 55–60%**。
- **Hero 的"双语气"（sans 巨字陈述 + serif italic 限定语 + 橙 caret）**：这个组合在 2023–26 的个人作品集模板里已经相当常见，本身已接近" editorial dev portfolio "的通用句式。单看首屏，我无法指认"这是这个人"——首屏是三案中最可被模板复用的一屏。
- **但转化是真实发生的**：书籍隐喻不是贴纸，是结构。桌面导航即 running head、移动端 56px 章节指示条、`PLATE 0n` 图版编号（Selected Work 是全站唯一顶到 col 12 的"拉页"）、Colophon（`EDITION / RECORDS / TYPE / METHOD`）。书籍口音覆盖了导航、版式、页脚与结尾句（"The monograph continues."），贯穿度合格。

### 1.2 签名装置核验

- **FIG. 1（真签名，已验证）**：`src/sections/Work.tsx` 的 `PlateFigure` 用与 Lab 完全相同的 BM25 引擎在访客浏览器里实时计算 clean corpus 排名，以 hairline 分数条呈现，图注直读数据（"the bottom half is near-noise. That is exactly why a single forged passage can take the top slot."）。**"一次浏览器内实时计算被当作书里的一张图版"是我没在任何模板里见过的动作**——数据即颜料，图是论证不是装饰。这是 A 本轮唯一可被认领的原创语法。
- **accent 语义图例（Round 1 风险封堵，已验证）**：Colophon 左下明写 "The dot marks what is alive: the chapter you are reading, work still running, poisoned evidence, keyboard focus."（`A_light_06.png`）。Round 1 我判 A "若读不到语义逻辑会被误判为换色 Swiss"——这句话把误判空间直接关掉了。
- **诚实钩子**：Plate 04 "This site" 的 meta 行 `YOU ARE LOOKING AT IT.`、Work 末尾 "LINKS … INTENTIONALLY UNLISTED UNTIL THEY EXIST."（`A_light_03.png`）——人味在读数里，但"诚实读数"语言本身是偷来的共享语汇，不再为 A 加分。
- **主题切换"重新上墨"**：`src/index.css:250` `vt-reink` 自上而下 `clip-path: inset` 压印式 wipe，明确避开被点名的圆形光圈撞衫——差异化改造成立（无法从截图验证，源码可信）。

### 1.3 记忆点测试（闭眼回想）

留下两幅画面：① 巨大橙 caret 停在灰色斜体 "before it breaks." 后面；② PLATE 01 里那张真数据分数条图。前者可被任何站复用；后者不可——**FIG. 1 是 A 的记忆点，hero 不是**。

### 1.4 证据缺陷（不影响原创性结论，影响 light_mode 判读）

`a2.a2.home.desktop.light.png` 整个首屏空白（hero settle 动画未完成即截图；`a2.a2.home.desktop.light.full.png` 里 hero 呈半透明中间态）。A 的段落不用 scroll-reveal，所以其余内容在整页截图里全部可见——与 D 形成鲜明对比。判为采集时序伪影而非缺陷（sessionStorage 一次性落版，源码 `Hero.tsx:35-55` 已验证）。

### 1.5 Round 1 负分维度进化判定

- **originality（−0.52）：进化**。语义图例 + 图版版式 + FIG.1 让 accent 逻辑与存在感可读；但基底方言未变，属于"转化"而非"脱胎"。
- **portfolio_presentation（−0.87）：进化**。Selected Work 从目录行升级为带真数据图的图版，"This site" 也要面子有面子。

### 1.6 如果只能改一处

**把 FIG. 1 从"Plate 01 的特例"升级为 Monograph 的通用语法**——凡有数据可算的图版都带一张浏览器内实时计算的图（Chunk Boundaries 已有现成引擎）。一处改动让"数据即颜料"从一次性装置变成可被认领的站点签名，同时顺手稀释 hero 的模板味。

---

## 2. Team D「Offprint 抽印本」

### 2.1 方言来源指认

- **基底方言是"印刷学刊/抽印本"**：暖纸底、Newsreader 衬线正文、mono 标签、`WORKING EDITION` 字样、§ 编号。Round 1 的"arXiv 克隆"指控——**本轮不成立**：arXiv 是冷灰蓝的提交队列气质，D 的暖纸 + 文学性构图 + 朱批已经离 arXiv 很远。新的近似对象是 **Tufte 式学术讲义**（float 页边注、衬线、克制），但 Tufte 是学术参照系而非产品模板，且朱砂批注是 D 自己的语言——这个近似我认为是转化而非模仿。
- 衬线 + mono 配对本身是编辑类模板的常见句式，约占整体印象 45%；但朱批系统把气质拉回了 D 自己。

### 2.2 签名装置核验

- **朱批 + 幽灵编号（三案中最强的单一新签名，已验证）**：`src/components/sections/Hero.tsx:10-23` ——当前激活问题从 `researchQuestions` 数据派生，以审稿人页边批注形态出现（朱砂竖线 + `NOW ASKING — Q1` + 斜体问题原文），编号 `Q1` 以 9% 朱砂幽灵巨字压在标题区右上（`D_light_00.png` / `Dm_light_00.png`）。**"用审稿人的朱批宣布'这个人此刻在想什么'"既不是装饰动画也不是话术，是数据驱动的语义记忆点**——看到它就知道这是 Offprint。移动端（`Dm_light_00.png`）与暗色（`D_dark_00.png`）都成立。
- **accent 白名单（已验证源码 `index.css`）**：朱砂只允许出现在"问题被激活/追问/活点"五种语义（朱批、ACTIVE 编号、投毒文档行、过滤 chip、focus 环），青黛整个删除，三态改用 ink 系线型。这是 Round 1 A 式纪律的正确移植，且执行得比 Round 1 的 A 更自觉（白名单写成"违反即 bug"）。
- **隐喻贯穿度（三案最佳之一）**：`/research` 等 5 个非路由路径返回的不是通用 404，而是 "§ — · NOT IN THIS EDITION / The page you asked for is not in the edition."（`dp.dp.research.desktop.light.png`）——连**错误页都在说抽印本的语言**。沙盒页是 `APPENDIX X-01 · RE: Q1 · Q2`（`dp.dp.labcorruption-sandbox.desktop.light.png`），colophon 是 `§07 · COLOPHON … © 2026 — THE ARCHIVE BEGINS`（`D_light_05.png`）。从 hero 到 404 到 colophon， Edition 隐喻零破口。
- **Directions Ledger 降维（已验证源码 `ResearchSection.tsx`）**：SVG 地图删除，改为 `T01` 行 + 派生读数（`2 QUESTIONS OPEN` 从数据实时计算）+ `ADJOINS — Robustness · Poisoning` 交叉引用按钮 + 单向过滤。**"关系用陈述不用几何"本身就是个有立场的原创动作**（页边注明写 "The relationship between fields is stated, not drawn.¹"）。

### 2.3 证据的重大缺陷（本轮最大问题）

**整页截图里，D 首屏以下的大部分内容是不可见的。** `D_light_01/02/04.png` 显示：Directions Ledger 行、Question Ledger 行、Work 行、Lab 预览、About——全部空白，只剩标题、图例行和页脚说明（"4 OF 4 QUESTIONS SHOWN — THE FULL LEDGER"下面没有任何行）。原因已在源码确认：`src/components/chrome.tsx:56-71` 的 `Reveal` 用 `initial={{opacity: 0, y: 12}}` + `whileInView`，整页截图（不触发 IntersectionObserver）全部呈未显形状态。

- 对真实滚动用户无害，但这意味着：**打印、无 JS 后备、链接预览渲染器、以及"截图即证据"的任何评审/存档场景，D 的正文都是隐形的**。
- 我因此无法在视觉证据层面验证 D 的台账、Work、Lab 预览的最终观感——只能验证 hero、空态 specimen 行、sandbox 独立页、colophon。**设计得再好，看不见就是没有**；这是 D 在本评审判词里被压分的直接原因。

### 2.4 记忆点测试

留下两幅画面：① 巨大的幽灵 Q1 压在暖纸标题右上；② 一句朱砂批注。两幅都不可被模板复用——这是三案中最"署名"的首屏。可惜第二屏之后我什么都记不起来，因为我没看见。

### 2.5 Round 1 负分维度进化判定

- **arXiv 克隆风险 / 视觉沉闷：首屏进化成立，整页未证实**。hero 有了真正的语义记忆点；但证据里正文缺席，"90 秒扫站找记忆点"的判决我只能给 hero 部分通过。
- **technical_feasibility / maintainability（非本职维度，顺带）**：源码证实降维兑现（float 边注、原生 details、派生计数、零坐标），声明与实现一致。

### 2.6 如果只能改一处

**把 `Reveal` 的 `opacity: 0` 初始态改为默认可见、JS 确认支持后才动画**（或给 `noscript`/打印/IO 失败路径放行）。一处改动同时修复：评审证据完整性、打印/爬虫可见性、以及"台本比页面先死"的脆弱性——你已经造出了三案里最署名的首屏，先让世人看见你的台账。

---

## 3. Team H「检索系统」

### 3.1 方言来源指认

- **基底方言是"检索/索引/语料库"**：`query "who is this person?"`、`RESOLVED · 4 FACETS · 0MS NETWORK`、§ 坐标、`INDEX OF ONE PERSON` 右栏、mono 读数。mono 读数的器物口音与 C/E 家族共享（约占 35%），但 H 把它绑在一个真概念上——**站点把自己当作语料库执行检索**——口音于是有了主语。
- Round 1 的 originality 1.80 判的是概念；本轮要验证的是概念是否还活着、噪音是否收敛。

### 3.2 签名装置核验

- **Self-Query 首屏（降级被正确执行，已验证源码 `src/sections/Hero.tsx`）**：零 blur；标题 t=0 可见永不动画；四条 facet 1.2s stagger 渐入；状态行定格 `resolved · 4 facets · 0ms network`（真实读数）；skip 按钮 t=0 可见且占位防抖；Esc/等待 1.5s/localStorage 回访/reduced-motion 四重跳过。`H_light_00.png` 恰好捕获了 "RESOLVING…" 中间态（未到位的行只是"还没到"，不是坏掉），`H_dark_00.png` 是 resolved 定格构图——**两种状态我都看了，没有一种读作"页面坏了"**。Round 1 四位评委对 Beam 的共同否决被完整消化。
- **隐喻执法（本轮最欣赏的元动作）**：colophon 里公开声明 `RETRIEVAL LANGUAGE BUDGET: 3 TOUCHPOINTS — HERO, PALETTE, LAB`（`H_light_04.png`），`src/content/site.ts:22` 的 `metaphorTouchpoints` 是真的内容契约字段。**一个给"自己的隐喻允许出现在哪里"立法的站点，比一百个把隐喻刷满全站的站点更原创**——这是对"仪式疲劳"风险的制度化防御。
- **404 也是检索语言**：`/lab/corruption-sandbox` 返回 "404 · NO DOCUMENT AT THIS ADDRESS / The corpus has no record at this address."（`hp.hp.labcorruption-sandbox.desktop.light.png`）。与 D 的 404 异曲同工——两个都好，且各自成腔。
- **诚实读数全站贯穿**（`0 RECORDS` / `13 RECORDS` / `0 ANALYTICS · 0 TRACKERS`）——共享语汇，不加分；但 H 把它落到了 palette 的索引大小这种"能被代码审计"的粒度，执行度最高。
- **动效预算**：hero 渐入 / 主题 crossfade / sandbox 排名条，三项各配一句话信息功能，滚动零动画（源码与截图一致，中间态捕获即证据）。噪音确实砍掉了：2° 斜切线、左缘锚轨、链条绘制动画都没了。

### 3.3 排印与视觉（Round 1 负分维度）

- **typography（−0.97）：进化，验证成立**。字阶 token 实测 12/15/19/24/38/48/76（`src/index.css:111-234`），每级 ×1.25、4px 基线，Gen 1 的"14/13/12 三级各差 1px"消失；三族三职（Newsreader 内容声部 / Inter 界面声部 / Plex Mono 机器声部）在截图里可读分辨（`H_light_01.png` 的问题台账：衬线问题句 + mono 状态行，层级干净）。
- **visual_quality（−1.29）：进化**。做减法后全站装饰预算 = 每 section 一根 hairline + 坐标编号；整页截图全部内容可见（无 D 式空白），节奏安静。代价是中段（Notes/Publications）偏素——但这是"安静"而非"未完成"。

### 3.4 记忆点测试

留下一幅画面：`query "who is this person?" → 四条 facet → RESOLVED · 0MS NETWORK`。这幅画面**结构上绑定检索隐喻，换一个站就没法直接搬走**（搬走即侵权这个概念）——记忆点通过。第二记忆点是 palette（`/`），本次截图未捕获其打开态，仅源码验证（完整 combobox 语义）。

### 3.5 Round 1 负分维度进化判定

- **typography：进化（真字阶成立）**；**visual_quality：进化（减法成立、全页可见）**；**originality：保住**（概念活着且被预算制度保护）；**a11y：保住**（四重跳过、combobox、无 blur）。

### 3.6 如果只能改一处

**让首屏 facet 行从"锚点链接"升级为"真检索入口"**——点击即以该 facet 为 query 打开 palette 并显示全站命中（`/research#…` 锚点改为 `/?q=…`）。一处改动把自述装置从"首屏表态"变成"每次点击都在执行检索"，隐喻获得交互层面的第二生命，同时回应其自报的风险（首屏安静被误读为没有设计动作）。

---

## 4. 横向对照与排名

| 检查项 | A | D | H |
|---|---|---|---|
| 方言基底 | Swiss/开发者系（模板亲和度最高） | 印刷学刊/Tufte 邻近（已转化） | 检索/索引（概念自带） |
| 签名装置 | FIG. 1 浏览器内实时数据图版 | 朱批 + 幽灵编号（数据驱动） | Self-Query + 隐喻预算立法 |
| 隐喻贯穿 | 导航/版式/colophon 贯穿 | hero/404/沙盒/colophon 零破口 | hero/404/palette/colophon + 执法条款 |
| 记忆点可复用性 | caret 可复用，FIG.1 不可 | 朱批不可复用 | self-query 不可复用 |
| 证据完整性 | 好（hero 采集伪影除外） | **差（正文 scroll-reveal 空白）** | 好（还捕获到 resolving 中间态） |
| 共享语汇占比 | 中（诚实读数/RESERVED/TOY 声明） | 中 | 中 |

**排名（本评委）：1. H · 2. A · 3. D**

- H 第一：唯一同时完成"负分进化 + 原创保冠"的方案，且用制度（预算立法）而非自觉来保护原创性。
- A 第二：进化真实可验证，证据完整，工程与表现同步；输 H 在于基底方言的模板亲和度仍最高，签名只有 FIG. 1 一处。
- D 第三：单一签名（朱批）可能是三案中最美的，但整页证据缺席使其"整体原创性"无法确认；看不见的设计在本轮只能记一半分。**注意：这不是判 D 的设计差，是判 D 的设计不可见。**

### 各案优点 / 缺点速记

- **A**：优点——FIG. 1 真数据图版（`A_light_02.png`）、colophon accent 图例（`A_light_06.png`）、书籍装置结构性落地。缺点——hero 双语气近模板句式、签名装置仅一处、light 首屏采集空白（伪影）。
- **D**：优点——朱批+幽灵编号、404/colophon 的 Edition 语言零破口、accent 白名单纪律。缺点——Reveal 导致正文在截图/打印/无 IO 场景隐形（`D_light_01-04.png`）、非路由路径全部 404 使子页证据缺失、`/lab` 竟是 404 而真页在 `/lab/corruption-sandbox`（`dp.dp.lab.desktop.light.png`）。
- **H**：优点——Self-Query 降级执行干净（`H_light_00.png` 中间态、`H_dark_00.png` 定格态）、隐喻预算立法、字阶重建。缺点——首屏仍是元评论优先（人排第二）、palette 打开态无截图证据、中段排版偏素。

---

## 5. 评分（14 维度，1–10，可 0.5）

评分口径：originality 为本职权重；其余维度基于截图证据与源码抽查，供汇总参考（其他专职评委的判词优先）。

### Team A「Monograph」

| 维度 | 分 | 依据 |
|---|---|---|
| visual_quality | 8 | 双主题一致、hairline 纪律、colophon 完整；hero 采集空白为伪影不扣 |
| originality | 7 | FIG.1 + 语义图例为真进化；基底方言模板亲和度仍最高 |
| typography | 8.5 | 双语气 + 字阶纪律保持 Round 1 强项 |
| information_hierarchy | 8 | 章节骨架 + 左栏 sticky + 图版层级清晰 |
| ux | 7.5 | 锚点长卷 + `/` 搜索 + Index overlay；子路由不存在（截图全部同帧） |
| mobile_experience | 7.5 | 56px 头 + 章节指示条 + 全屏 Index（`Am_light_00.png`） |
| technical_feasibility | 8 | 依赖极轻、纯 CSS/React；console 全空 |
| long_term_maintainability | 8 | chapters 注册表 + content 数据驱动 |
| research_presentation | 7.5 | 方向账簿 + 问题台账（借自 D）执行合格 |
| portfolio_presentation | 7.5 | 图版版式 + FIG.1；无截图但诚实声明 |
| light_mode | 8 | 干净；首屏空白为采集伪影 |
| dark_mode | 8 | 字重补偿可见（`A_dark_02.png`），halation 防御 |
| performance | 8 | 静态、无重依赖 |
| accessibility | 8 | 状态灯均有文字、真实 button、reduced-motion 全关 |

### Team D「Offprint」

| 维度 | 分 | 依据 |
|---|---|---|
| visual_quality | 7 | hero/沙盒页优秀；正文在证据中不可见（Reveal 脆弱性）拖累 |
| originality | 7.5 | 朱批是最强新签名；但整页可见的原创面过窄 |
| typography | 8.5 | Newsreader + 4px 基线 + 字重补偿；衬线版面三案最佳 |
| information_hierarchy | 7.5 | 60ch/21ch 网格清晰；正文缺席使验证不全 |
| ux | 7 | 长卷锚点 + Contents 层；5 个导航项落 404 有真实的困惑成本 |
| mobile_experience | 7.5 | 朱批/幽灵字移动端重排成功（`Dm_light_00.png`） |
| technical_feasibility | 8 | float 边注/原生 details/派生计数，声明全部兑现 |
| long_term_maintainability | 8 | 零坐标、数据即关系 |
| research_presentation | 9 | Question Ledger + ADJOINS + demo 回链，仍是三案最强 |
| portfolio_presentation | 7 | 行内行动线设计合理；证据不可见 |
| light_mode | 8 | 暖纸 + 对比度验收表 |
| dark_mode | 8 | "台灯下的纸"成立（`D_dark_00.png`） |
| performance | 8 | 轻依赖、本地计算 |
| accessibility | 8.5 | aria-live 过滤播报、焦点管理、对比度逐对验收 |

### Team H「Retrieval」

| 维度 | 分 | 依据 |
|---|---|---|
| visual_quality | 7.5 | 安静、全页可见、装饰预算到位；中段偏素 |
| originality | 8.5 | 概念保冠 + 预算立法；降级后装置略平和 |
| typography | 8 | 真字阶验证成立（12–76 ×1.25）；三族三职清晰 |
| information_hierarchy | 8 | 主线按任务书落位 + INDEX OF ONE PERSON 方位感 |
| ux | 7.5 | palette/skip/四重跳过；首屏元评论先于"人"的小风险 |
| mobile_experience | 7.5 | 390px resolved 直出、无横滚（`Hm_light_00.png`） |
| technical_feasibility | 8 | transform/opacity 宪法、无重依赖 |
| long_term_maintainability | 8 | 内容契约 + metaphorTouchpoints 契约化 |
| research_presentation | 8 | 方向台账 + 问题台账 + 证据链格式 |
| portfolio_presentation | 7.5 | 证据链（PROBLEM/METHOD/ARTIFACTS/LINKS）格式原创且诚实（缺项 `—`） |
| light_mode | 8 | 双色系语义清晰 |
| dark_mode | 8 | 字重补偿 + 长文降灰 |
| performance | 8 | 本地计算、0MS 读数真实 |
| accessibility | 8.5 | 四重跳过、combobox 全语义、无 blur |

---

## 6. 结论

Round 1 的三个负分靶点全部有真动作：A 的 originality 语义化封堵成立、D 的"arXiv 克隆"被朱批正名（但被自己的 Reveal 出卖）、H 的排印与噪音两项以减法与真字阶翻正。三案的共同盲区是把"被强制偷来的语汇"当成了第二层皮肤——真正的分界线在于：**H 用制度保护隐喻，D 用白名单保护朱批，A 用图例保护圆点**——三者都做对了，但只有 H 和 D 造出了不可被模板复用的画面，而只有 A 和 H 让评委看得见自己的全貌。
