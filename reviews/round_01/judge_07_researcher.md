# Judge 07：Academic Researcher（学术研究者评委）评审报告

## 评审视角

我是 NLP/AI 方向的在职研究者（博士后期），日常工作对象是 arXiv、OpenReview、学者主页和组站。我评审一个研究者主页设计时，脑子里始终是三类真实访客：**(1) 同行研究者**——30 秒内要判断"这个人的问题意识是否严肃"；**(2) 三年后的站主本人**——页面不能变成需要持续撒谎或持续羞耻的东西；**(3) 五年后已发十几篇论文的站主**——版式必须装得下变长的列表、分组、按年折叠和速记链接。

**我的一票否决区：`research_presentation` 与 `long_term_maintainability`。** 这两项我的评分基准比其他维度严一档，具体审视以下五件事：

1. **RAG / Robustness / Knowledge Poisoning / AI Security 是被"标签化装饰"还是被给了展示结构？** 判据：这些方向有没有对应的问题句、状态、证据、可运行的直觉演示——还是只是 hero 上的一行关键词、tag 云、雷达图。
2. **Research Questions / 实验状态对同行是否可信、是否可持续维护？** 判据：状态词是否有真实的语义空间（包括"搁置"）、有没有会自动腐烂的承诺（假日期、假进度、"under review"式的话术）。**一个三个月不更新的状态字段，比没有状态字段更伤害可信度。**
3. **"研究地图"类可视化是帮助理解还是自嗨？** 判据：节点/边是否编码了可核查的语义、是否可数据驱动、是否给了文字等价物与降级路径。
4. **Publications 空状态的学术礼仪。** 判据：是否体面、是否暗示了不存在的事实（如 "in review"）、第一篇论文入库时版式是否零改动。
5. **五年尺度。** 判据：列表变长后是否仍然成立、有没有分组/折叠/归档的预留路径、有没有设计上注定要腐烂的元素（假版本号、假期号、假指标）。

另外两条我的本能厌恶：**花哨但不好维护的东西**（canvas 装置、手排 SVG 大图若断了没人修）；**看起来像营销页的研究展示**（"高级感"不能以牺牲"这是一个正在思考的人的工作现场"为代价）。

---

## 逐方案评语

### Team A — Monograph 单行本（Apple-like Minimalism）

- **优点：**
  1. §9 Research 是"反装饰"的正确用法：兴趣账簿（词条+一句话释义）、Open Questions 悬挂编号排版、In Progress 状态点，并明说"不放仪表盘、不放关键词云、不放雷达图——研究者的专业度由问题的表述质量体现"。这正是同行判断一个人的方式，方向判断完全正确。
  2. **动效预算表是我全轮最喜欢的工程纪律之一**：每个动画必须用一句话回答"传递了什么信息"，同屏环境动画 ≤3。caret 闪烁 = "档案仍在书写"，用一个 3×0.9em 的橙块同时解决了空状态焦虑——这是把"网站未完成感"转化为"长期承诺"的最便宜方案。
  3. 五年尺度想得清楚：Notes > 20 篇拆路由、Home 只留最新 3 条；`LAST UPDATED {build date}` 是诚实元数据；索引行式 Projects 天然无限扩展。选 D 的"问题台账"落选、选 A 的"行列表"落选，都不会产生维护债务。
- **缺点/风险：**
  1. **In Progress 状态点（running/paused）没有日期戳**，是 A 里唯一会腐烂的承诺。若一年不更新，"● running"就成了谎。建议补一个 `since: 2026-10` mono 小字——一行代码的事，把承诺变成可核查的。
  2. Open Questions 只有 Q1/Q2/Q3 且无 followups、无领域归属、无更新日期——问题意识有了"目录"，没有"台账"。同行想追一个人的问题演化时，A 没有给抓手。
  3. 纯文字 Hero 对学术访客极佳，但对 OG 分享与招聘者 10 秒扫站的"第一眼身份信息"偏薄（自我批评 §14.5 已承认）。这不是致命伤，但意味着 A 的成败 100% 押在执行精度上。
- **最值得被偷走的想法：** 动效预算表制度——"任何动画必须能用一句话回答它传递了什么信息，回答不了就删"。这条应该写进所有 8 个方案的实现验收标准。

### Team B — Field & Retrieval（Editorial / Magazine）

- **优点：**
  1. §9 把研究方向组织为 Part I–IV feature story，每条的结构是"动机 → **当前理解（working notes）** → 下一步（open questions）"——"working notes" 这个措辞是全轮最聪明的学术修辞之一：它把内容定义为**持续修订的理解**而非成果声明，天然抗腐烂。用研究问题做标题（"What happens to a RAG system when the corpus is the adversary?"）而不是名词短语，这是懂行的人写的。
  2. **Publications 空状态是我见过的最好的学术礼仪**："Nothing in print yet — this page is reserved for peer-reviewed work." + 目录行右端 `— CALL FOR PAPERS` + 两条站内引导链接。它不假装、不卖惨、还把空状态变成了刊物隐喻的有机部分。dateline 的 "PUBLISHED WHEN THERE IS SOMETHING TO SAY" 同样是诚实自洽的。
  3. Lab demo 的 "What this shows / What it doesn't" 收尾两段式——Methods & Limitations 自觉做进了每个 demo 的固定结构。Retrieval-only、no LLM in the loop 的标注杜绝了"假 AI"误读。
- **缺点/风险：**
  1. **刊物隐喻自带"出版压力"**。VOL/NO 编号、期次、目录状态计数（`3 NOTES · 6 DOSSIERS`）都在提醒"该出新一期了"。对没有 publication 的博士生，一个"自己的期刊"可能是持续的心理税。防线已有（publish-when-there's-something-to-say），但编号系统仍需要站主自律地让 VOL. I 保持"薄"而不尴尬。
  2. 四个字体家族（Fraunces + Newsreader + Instrument Sans + Plex Mono）+ 严格基线网格 + baselineComp 破格补差机制——**排版体系的维护复杂度是 8 个方案里偏高的**。五年后站主想加一篇笔记，要在心里过一遍基线纪律，这个成本会被低估。
  3. "刊名"是假刊物名（config placeholder），但 nameplate 是全站最大的视觉元素——一个挂着虚构刊名的 152px 大字，替换前有轻微的"身份悬空"感。
- **最值得被偷走的想法：** 空栏目以"征稿中（CALL FOR PAPERS）"状态在目录里获得存在感——空状态不是缺席而是排期，这个语法可以移植到任何方案。

### Team C — 精密仪器（Modern AI / Future）

- **优点：**
  1. **"结构先于内容"是本方案对长期维护性的最大贡献**：每个研究方向预留 `outputs: []` 数组，paper/code/dataset 到来时自动渲染 OUTPUTS 行、版式零改动。这正是我"五年后装得下吗"问题的标准答案之一。实验表 RESULT 列允许 `—`（未出数），读数语言诚实。
  2. **数据自证是天然防腐设计**：RECORDS 计数构建期从 `content/*.ts` 算出、BUILD 时间戳注入、`PUBS 0` 敢刻在面板上——这些数字不会撒谎，因为它们不是手写的。⌘K 面板底部常驻 `METHOD: LEXICAL · LOCAL INDEX · N=41 · 0ms NETWORK`，把检索方法如实刻出，是研究者会心一笑的细节。
  3. 实验表（ID/QUESTION/SETUP/RESULT/STATUS）+ 领域条目 `related: R-02, R-03` 交叉引用，给研究区一个可核查的台账结构。mono ≤10% 的红线明确切开了"仪器刻字"与"终端 cosplay"。
- **缺点/风险：**
  1. **项目版本号（v0.4.1）与 ACTIVE/MAINTAINED 状态灯是两处会腐烂的手写字段**——比"问题状态"更容易被忘记更新，而仪器隐喻会放大不一致（一台"校准过的仪器"读数是旧的，很讽刺）。建议版本号也构建期生成或干脆砍掉。
  2. 首屏 RAG pipeline 微缩图：即使标了 `ILLUSTRATIVE`，pipeline 图仍是 RAG 领域最俗的视觉符号，与 B/D 用问题做首屏相比，它的信息增量最低。hover 注脚（"corpus poisoning enters here — see R-03"）救回一半，但它仍是我眼中 C 离"标签化装饰"最近的一步。
  3. Publications ghost 槽位（P-01/P-02 预留索引号）——aria-hidden 无妨，但"预留队列"暗示了一个不存在的排序承诺，读数语言里混进了一点修辞。
- **最值得被偷走的想法：** `outputs: []` 结构先于内容——研究方向条目预埋论文/代码/数据集挂载位，内容到来时零改动。这个 schema 应该成为全站默认。

### Team D — Offprint 抽印本（Academic Researcher）

- **优点：**
  1. **Question Ledger 是 8 个方案里唯一把"研究问题"做成有生命的数据库的**：编号、追问（问题的子问题）、三态状态（OPEN / IN PROGRESS / **RESTING**）、`upd. 2026-10` 更新日期、领域过滤。**把 RESTING（搁置）定义为合法的可展示状态，是对研究工作真实样貌最诚实的建模**——学者的 problem list 本来就有一半在吃灰，承认这一点反而让 IN PROGRESS 可信。
  2. Research Map 回答了我对"研究地图"的全部质疑：节点大小 ∝ 未决问题数（从 questions[] 计算，**永不出现论文数/星级**）、实线/虚线编码直接焦点 vs 支撑视角（Poisoning→Robustness→Security 的威胁链是真的领域关系）、点击节点过滤台账（导航功能）、文字版关系列表兜底、移动端竖版。它不是自嗨，是一个数据驱动的小型知识图谱。
  3. 每个 demo 绑定具体问题编号（Context Autopsy→Q1/Q2，Citation Fragility→Q5）且页脚固定 "Heuristic simulation for intuition — not a benchmark."。Publications 空状态的 ghost specimen 行让第一篇论文入库时版式零改动。这三个设计共同构成"问题的证据链"，结构完整。
- **缺点/风险：**
  1. **"Manuscripts in preparation." 是一处话术越线**。学术礼仪里 "in preparation" 是一个事实状态声明——如果站主手里并没有在写的手稿，这句话本身就违背了零编造红线。它应该像其他字段一样 config 化：有手稿时用它，没有时用 "Written work will appear here as it exists."。这是 D 唯一让我皱眉的地方。
  2. **状态的维护自律是这个方案的存在前提**（自我批评 §14.5 说得很诚实）：`upd. 2026-10` 三个月不更新，"诚实的现场"立刻变"荒废的证据"。我愿意赌研究者会维护（改一个字段和改 README 一样自然），但这确实是把诚实做成了高维护资产。
  3. 手排 SVG 地图的坐标是手工的，领域从 6 涨到 10 要重排（§14.4 已承认）；中屏（1000–1200px）边注系统破版是头号工程风险。另外 `related: ["Q2"]` 这类硬编号引用在问题重编号时会悄悄断链——建议引用用稳定 id 而非显示编号。
- **最值得被偷走的想法：** RESTING 作为一等研究状态 + `upd.` 日期戳。所有有状态字段的方案（A/C/E/G/H）都该抄这一对：**没有"搁置"态的状态系统必然走向撒谎。**

### Team E — BENCH 工作台（Creative Developer）

- **优点：**
  1. **三台 Lab demo 是全轮 RAG 直觉教学设计里最扎实的**：LAB-01 投毒（可编辑投毒文档、词频防御开关、"没有训练、没有后门：一篇会写关键词的文档就够了"）、LAB-02 的 "answer split across chunks——这就是 chunking 的代价" 时刻（这是真做 RAG 的人才观察得到的痛点）、LAB-03 的 Recall@5 真实计算。全部浏览器现场计算 + "Educational prototype" 铭牌 + 共享 200 行检索核。"诚实装置"原则执行得很彻底。
  2. **Notebook Excerpt（实验记录本摘录表）是被所有其他方案忽略的真实学术物件**——研究者确实用 EXP-ID/question/setup/observation 记录实验，展示"如何记录"比展示任何成果都更能建立同行信任。
  3. 三态工件窗（Live / Schematic Session / 静态图）是为五年后设计的：任何项目至少能用 C 态保住版式。键盘体系（g 和弦、/、?、focus 管理、三层发现性）是 8 个方案里最完整的 UX 规格。
- **缺点/风险：**
  1. **首屏 canvas 装置 P-00 是全轮最大的长期维护隐患**：sprite 预渲染、DPR 上限、掉帧降级、localStorage 暂停态……一个博士生五年后未必愿意修它，而它坏掉时坏的是首屏。隐喻（扰动-恢复 = robustness）虽然是主题相关的，但它终究是 metaphor 而非 measurement——对学术访客，D 的问题台账或 B 的 feature story 的信息密度都高于一场视觉隐喻。
  2. Research 排在 Work 之后且 About 被拆散，整个信息架构是招聘者优先的。同行研究者要越过装置与项目行才遇到 RA 面板——黄金路径的第一受益人不是学术访客。
  3. "检索本站"和 palette 与 ⌘K（C/H 也有）三案撞车；E 的差异化靠 demo 质量撑着，若实现时 demo 缩水，E 的辨识度会塌向"又一个深色工程站"。
- **最值得被偷走的想法：** 三态工件窗（Live demo / 示意会话 / 静态架构图）——给每个项目的展示留一条"最省力保底"的退路，这是对五年内容生长最务实的保险。

### Team F — 坐标系统（Swiss / International Style）

- **优点：**
  1. **长期可维护性全场最佳**：一切是表格行，加内容 = 加行；空 = 表格里的一行（"空 = 待归档感，不是未完成感"）；**导航编号由内容配置自动生成、空 section 自动重排**——这套数据驱动编号系统是 8 个方案里唯一把"内容会长"当架构问题正面解决的。Timeline 做成编年登记表，逐年加行不变形。
  2. Publications 空状态语法完美自洽：表头照常，体里一行 `P— | Selected research will appear here. | — | —` + 一行 mono 脚注 `// auto-renders from content/publications.ts`。没有一句多余的话术，也没有一句谎话。
  3. R-INDEX 展开行内嵌 `Q:` 前缀研究问题 + 实验用 mono 数据表呈现（明确标 SAMPLE），未来论文通过 R-编号 ↔ P-编号交叉引用形成档案间引用链——方向判断正确，形式与档案气质统一。
- **缺点/风险：**
  1. **研究区深度偏薄**：每个方向 2–3 个 `Q:` 问题，但没有追问、没有状态、没有更新日期、没有"什么算进展"。F 的问题意识有登记、无台账——对同行是"议程表"，不是"工作现场"。比 D 少一整个语义层。
  2. "GRID 12×8 / BASELINE 8" 标尺、live 鼠标坐标读数、280px ghost 编号——这批"网格家具"对学术访客的信息增量接近零，属于给设计评委看的自嗨配额（好在都静态、aria-hidden、预算受限）。
  3. 全站一种版式（表格）的风险是真实的：Research 是表、Work 是表、Notes 是表、Lab 登记表——研究叙事需要的"成段论述"在 F 里几乎没有位置，Current directions 类内容会被挤成表格行,长此以往研究区会变成索引而非论证。
- **最值得被偷走的想法：** 数据驱动的编号系统（空 section 自动不渲染且编号自动重排）——所有方案的导航都该这么实现，一劳永逸解决"内容长了改导航"的维护税。

### Team G — Dimmer Room（Dark Premium）

- **优点：**
  1. **Selected Experiments 用音频器材规格表语言呈现**（setup / corpus / retriever / top-k / metric / Δ，右列数值右对齐）——这是全轮第二好的实验呈现格式，克制、可核查、天然抗"营销化"。
  2. Research Questions 有"current thinking" 2–3 行且可被 Notes 锚点引用（研究档案的内部网络意识）；Timeline 台账 + `[ED][RS][PJ]` 前缀干净利落。
  3. 自我批评 §14.1–14.3 的质量是 8 份文档里最高的：Light 被迫反转 elevation 方向、图片压暗伤截图信息的自查、"宁砍扫光保光晕"的降级表态。文档的诚实度反过来提高了方案的可信度。
- **缺点/风险：**
  1. **Publications 空状态的 "In review and in progress." 是全轮最严重的学术礼仪事故**——"in review" 是一个具体的投稿状态声明，对一个零论文的站主这是**凭空捏造投稿事实**，且它是直接写进页面文案的（不是注释）。方案自己的 §12 都写了"不编造 under review 事实"，然后样例文案打了自己的脸。这一句必须重写。
  2. 实验表下挂 `robustness ↓ 18% under poisoning` mock readout——即使标了 sample，一个具体的假百分比出现在研究区就是"让人误读成果"的种子。研究者访客对假数字的敏感度远高于设计评委。
  3. 只给 3 个方向做展墙（Robustness / Poisoning / Retrieval×Generation），AI Security、LLM Systems 降级为 hero 角落的六行铭牌——六个真实兴趣没有获得等价的展示结构， Coverage 是 8 案里最不均的。加上展厅/黄铜的整套奢侈品语法（Devialet/B&O 参照），**这是 8 案中最接近"产品营销页"气质的一个**——"高级"达成了，"这是一个正在思考的人"的信号被展柜语言稀释了。
- **最值得被偷走的想法：** 实验的 spec-table 格式（setup/corpus/retriever/top-k/metric/Δ）——比任何图表都更像"研究者在记录实验"，可以直接移植进 A/D/F 的研究区。

### Team H — 可检索的人（Experimental Interaction）

- **优点：**
  1. **Query Log 的四行结构（为什么问 / 现在 / 什么算进展 / 关联）是全轮方法论上最成熟的研究问题格式**。"什么算进展"（success criteria）是连很多学者主页都没有的字段——它把研究问题从"口号"变成"有判据的承诺"，且天然规定了未来的更新内容。状态词锁定在 reading / prototyping / writing-up 的真实词汇表，杜绝假进度。
  2. **--accent（可信路径）与 --signal（投毒/攻击）的双色语义系统**让配色本身在教访客读研究：正常 vs 被攻击状态的视觉区分贯穿 Lab 与证据链。玩具 B 用逐字摘录（extractive）而非假 LLM 生成来回答——"不伪造一个 LLM"的诚实条款是真正的领域自觉。
  3. 双通道原则执行严格：每个实验性入口都有传统出口、遮蔽层 aria-hidden、`prefers-contrast: more` 直接关遮蔽、resolved 态 localStorage 记忆（回访零成本）。§15 可用性验收清单是 8 份文档里最完整的一份。
- **缺点/风险：**
  1. **Retrieval Beam 对核心学术访客仍是一道阅读闸门**：同行点进主页想要的是立即读，而摘要被 blur 到交互后才揭示（名称可读、DOM 全文在，但这些补救不改"必须操作才能读全文"的体验本质）。4s 提示 + skip 锚点 + 回访记忆把伤害压到了下限，但对"30 秒判断问题意识"的访客，A/B/D 的零门槛文本仍然更尊重时间。方案 §14.5 自己也问了"为什么不干脆不遮蔽"——我作为评委的答案是：学术场景下，不遮蔽。
  2. "无 JS 全内容可读" 声称服务端产出真实 HTML——这在 Vite+React SPA 基线内是**额外的 SSG 工程量**（任务书没有承诺 SSR/SSG），H 把它当默认能力写。要么降级承诺，要么明确它是一个实现成本项。
  3. Publications 空态被刻意移出黄金路径（Notes 之后）——策略上说得通，但学术礼仪上略像"藏起来"；且 "the corpus grows — publications slot is intentional" 的 mono 边注俏皮有余、郑重不足。相比 B/D 的空态，H 的处理是合格线而非典范。
- **最值得被偷走的想法：** "什么算进展"字段——给每个研究问题写一句成功判据。这一个字段同时解决可信度（有判据的承诺）与维护性（知道该什么时候回来更新）。全轮我最希望每个方案都抄走的一条。

---

## 排名与理由

**Top 3：**

1. **Team D — Offprint 抽印本。** 唯一一个从"研究者的认识论实践"（问题台账、边注、状态与日期、诚实标注）出发反推整个版式的方案。Question Ledger + RESTING 状态 + 更新日期戳是研究展示的完整解；研究地图是数据驱动、有导航功能、有文字兜底的"好地图"而非自嗨；demo 与问题编号互锁且标注 "not a benchmark"。两个否决区（research_presentation 9.5 / maintainability 8）都过我这一关。扣分点："Manuscripts in preparation." 话术需 config 化；中屏边注与手排地图是执行风险。
2. **Team B — Field & Retrieval 学刊。** "working notes" 修辞 + open questions + Methods & Limitations 的研究叙事是第二完整的学术结构；Publications "CALL FOR PAPERS" 空态是全轮最佳学术礼仪；排印纪律与文档质量极高。排第二而非第一的原因：刊物隐喻的出版压力与四字体+基线网格的维护复杂度，在五年尺度上是持续税，而这正是我的否决区 weighs 最重的变量。
3. **Team H — 可检索的人。** "什么算进展"是全轮最有方法论价值的一个字段；状态词表诚实；双色语义系统让配色参与研究叙事；可用性验收清单最完整。排第三的原因：Retrieval Beam 对核心学术访客是一道本不必要闸门，SSG 承诺超出基线栈，视觉规格的完整度略逊于 D/B。

**未入 Top 3 但必须说明的：** Team A 以 9 分的可维护性和最干净的动效纪律紧咬 H（差距仅在研究区少一个语义层）；Team C 的 `outputs: []` 与数据自证是所有方案都该吸收的 schema 思想；Team F 是"五年后依然不撒谎"的架构冠军，但研究区深度不足；Team E 的三台 demo 是最好的 RAG 教学设计，但首屏装置是最大的长期负债；Team G 的 "In review and in progress." 触碰了我对"让人误读成果"的底线，是我评分中唯一接近一票否决的单点。
