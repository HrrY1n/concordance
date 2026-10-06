# Judge 08：Recruiter Judge（招聘者评委）评审报告

## 评审视角

我是 AI/平台方向科技公司的招聘负责人。每周扫上百个候选人主页，平均停留 60–90 秒，从邮件和手机里点开是常态，不是在 27 寸屏上泡一杯茶慢慢看。

**我的一票否决区：ux、portfolio_presentation。** 这两个维度从严评分。

我的 90 秒只有三个问题：

1. **这个人做什么方向？**（5 秒内要能回答）
2. **他做过什么拿得出手的东西？**（作品行/case study 能否让我快速看到 角色 / 产出 / 链接，而不是被设计感淹没）
3. **怎么联系他？**（联系方式是否一层可达）

附加审视：

- **首屏有没有钩子**——让我想继续滚动，而不是截图发群里说"又一个模板"；
- **人设信号**——方案让候选人"更像工程师/研究者"，还是"更像设计师转行"？对 AI 平台岗，前者是加分项，后者是气质错位；
- **网站本身是否是作品证据（engineer credibility）**——敢不敢展示真实代码、真实构建信息、诚实的空状态；
- **深链是否合理**——case study 是"问题→做法→产出→链接"的完整闭环，还是点进去一片 TODO。

用"90 秒三问"先给全部方案过一个快筛（详细理由见逐方案评语）：

| Team | 5 秒知方向 | 作品可见性（role/产出/链接） | 联系一层可达 | 人设信号 | 网站即作品证据 |
|---|---|---|---|---|---|
| A 单行本 | 强 | 中（行缺 Role/链接） | 中（页尾+锚点） | 研究者 | 中 |
| B 学刊 | 中（刊名先于身份） | 中低（首页仅预览） | 是 | **偏设计师/写作者** | 中 |
| C 精密仪器 | 强 | **最强（ledger+dossier）** | 是（palette+页尾） | 工程师 | **强（自证读数）** |
| D 抽印本 | 强 | 强（meta 行+状态） | **最强（首屏作者栏）** | 研究者 | 中强 |
| E 工作台 | 强 | **最强（Code tab+链接站）** | 是（palette Actions） | **工程师** | **最强（可运行 demo）** |
| F 坐标纸 | 中 | 强（表格列全） | 弱（08 尾部） | **偏设计师** | 中 |
| G 暗展厅 | 强 | 强（铭牌栏全） | 中 | 偏产品/品牌 | 中 |
| H 可检索的人 | 强 | **最强（证据链四站）** | 是（右栏+palette） | 工程师 | 强（验收级 a11y） |

---

## 逐方案评语

### Team A — Minimalism「Monograph 单行本」

- **优点：**
  1. 首屏 5 秒完成方向自报：mono-label 行 + 三行 display 构图（"Retrieval-Augmented Generation, *before it breaks.*"）+ 两句 lede，我不滚动就知道这人做 RAG robustness / poisoning / security；首屏第一段话的排版里直接内嵌 `Selected Work ↘ Lab ↘` 两个锚点——黄金路径做进首屏，成本≈0，这是全池最聪明的首屏动作。
  2. Section 顺序明确按"可信度链条"组织（Research→Work→Publications→Open Source 连续不间断），Index Rows 把项目名/一句话问题/技术栈/年份压进一行，90 秒内可扫完 6 个项目，hover 反馈不抢戏。
  3. Contact 用全站最大字号收尾 + `Copy` 原地反馈；移动端 `Index` 全屏目录一跳直达任何章节，移动端是重新设计（章节指示器、正文反而更大）。
- **缺点/风险：**
  1. **作品索引行缺 Role 与链接位**：行内有 Tech/Year，但 "Role: solo" 与 GitHub/Demo 链接要进 case study 才可见——对我这类"扫行不点行"的读者是信息缺口。可执行修改：行尾 meta 增加 `ROLE` 缩写与 ↗ 链接计数。
  2. 只有前 3 个项目有 case study，第 4–6 个指向 GitHub TODO placeholder——招聘者点到空链接的概率不低；**未配置的链接应整行/整个锚点隐藏**（方案在 Contact 有"配置了才渲染"，Work 区没执行同一纪律）。
  3. 极简冷灰在 60 秒扫描下有"内容很少/像 README"的误读风险（方案 §14.1 自认）；加上 Contact 在第 09 节页面最底端，若访客没注意到锚点导航，联系成本就是"滚到底"。
- **最值得被偷走的想法：** Hero 首段排版里的 `Selected Work ↘ / Lab ↘` 锚点链接——把招聘者的黄金路径直接排进首屏文案，任何方案都该抄。

### Team B — Editorial「Field & Retrieval 学刊」

- **优点：**
  1. Dossier 详情页的 marginalia 元数据竖栏（`YEAR / ROLE / STACK / CODE → / DEMO →`）正是我要的"角色/产出/链接"形态，且未配置时整行隐藏——细节纪律好。
  2. 空状态处理是全池最有品味：目录行右端内联 `— CALL FOR PAPERS` 斜体标注 + "Nothing in print yet" 声明块，空栏目有性格而不是缺席。
  3. Lab Notes 每个 demo 固定以 "What this shows / What it doesn't" 收尾——Methods & Limitations 自觉是研究者诚信的最强信号。
- **缺点/风险：**
  1. **招聘者的 90 秒会被排印前端吃掉**：首页前两屏是刊名 + Cover Story + Contents，Selected Work 只以 3 行预览挂在 "In This Issue" 底部——我可能还没看到一件作品就关页了。可执行修改：Work 预览行加 repo 链接，或 "In This Issue" 提到 Cover Story 之前。
  2. **人设信号偏"设计师转行"**：drop cap、pull quote、双规则线、WONK hover、`PUBLISHED WHEN THERE IS SOMETHING TO SAY`——对 AI 平台岗 hiring manager，这是写作者/编辑气质，不是 shipping code 的气质。研究者读者会喜欢，我第一眼会犹豫。
  3. 索引行只有编号/标题/摘要/年·领域，无 Role、无链接、无状态——入口行信息密度低于 A/C/E；Volume/Issue 编号体系 + "按能直接发表标准写"的文案要求是 5 年维护的高负担（方案自认）。
- **最值得被偷走的想法：** 目录内联空态标注（TOC 行右端 `— CALL FOR PAPERS`）——把空栏目变成有性格的一行字，比任何"敬请期待"高级。

### Team C — Modern AI「精密仪器」

- **优点：**
  1. **Ledger + Dossier 是全池对招聘者最友好的项目数据结构**：索引行就有版本号/状态/年份/标签，展开即 ROLE/STACK/STATUS/REPO/DEMO 读数行——10 秒内对 5 个项目完成"谁做的、活跃吗、代码在哪"三连问，缺项显示 `—` 而非"暂无"，读数语言统一。
  2. ⌘K Retrieval Palette 直接服务我的工作流：搜 "poisoning" 1.5 秒着陆；面板底部 `METHOD: LEXICAL · LOCAL INDEX · 0ms NETWORK` 的诚实读数同时是工程信誉广告。
  3. SYS 状态块（BUILD hash / RECORDS 真实计数）让"网站本身即作品证据"落地——敢把 `PUBS 0` 刻在首屏的候选人，通常也敢面对真实指标；架构微图 + 模块拆解表是优秀的 case study 骨架。
- **缺点/风险：**
  1. **Relevance Lens（hover 触发列表按相似度重排）对快速扫描者是反功能**：我正逐行扫读时列表在脚下重排，位置记忆被打断、视线丢失。禁用条件写得很全（触屏/reduced-motion/>12 条），但对"招聘者 90 秒"这个第一用例，默认开启是错的——应默认关闭，仅"浏览模式"启用。
  2. Section 顺序把 Publications 空态（0 RECORDS + ghost 槽位）放在 Work **之前**：学术访客优先可以理解，但招聘者要先穿过一个空 section 才见到作品，黄金路径被打折。
  3. 首屏三联装置（SYS 块 + 关键词矩阵 + pipeline 图）信息密度逼近仪表盘上限，60 秒读者的注意力会被装置吸走而非用在标题与副题上；装置三降级到二屏即可。
- **最值得被偷走的想法：** Dossier 的"元数据读数行"语言（缺项 = `—`，列表缺项 = `0 RECORDS`，全站统一）——空值被设计成读数而非道歉。

### Team D — Academic「Offprint 抽印本」

- **优点：**
  1. **首屏作者栏把 CONTACT 放进第一屏右栏**（FIELDS / NOW / CONTACT 并置）——"怎么联系"一层可达，全池唯一在 hero 就给联系位的方案，我不用滚、不用开菜单。
  2. Question Ledger 让我用 30 秒读懂"这个人怎么想问题"：编号/追问/状态/最后修订日期是可核查的诚实结构，比任何技能标签都有信息量；5 个 seeded 问题（矛盾上下文信任、投毒阈值、引用可伪造性）写出了真实的问题意识。
  3. Case Records 的 meta 行（`ROLE / STACK / CODE ↗ / DEMO ↗`）+ 边注状态 chip + `RE: Q2` 反链——项目被组织成研究证据，是简历之外的"工作样本"感；边注→移动端可折叠 `[3]` 按钮是真正的移动端重设计。
- **缺点/风险：**
  1. **对行业招聘者，学术礼仪接近"零销售力"**：全站没有一处白话回答"这些能力在工业界值多少钱"。可执行修改：每条 Case Record 摘要第一句改为成果白话（"Built a harness that X"），第二句再上学术腔。
  2. `RESTING` 状态 + `upd. 2026-10` 日期是双刃剑：我看到一个 8 个月未动的 RESTING 问题，读出的信号是"已放弃"（方案自认"对懒人是事故"）——对长期维护自觉的要求过高，建议 RESTING 条目默认折叠。
  3. Research Map（手排 SVG）对 90 秒扫描者是纯装饰，且节点坐标手工维护成本高（方案自认要手校）——建议折叠进 Research 子页或提供纯文本版即可，首屏后黄金路径应直通 Work。
- **最值得被偷走的想法：** 首屏作者栏把 CONTACT 与研究字段并置——联系方式从"页面尾部的事务信息"提升为"身份信息的一部分"。

### Team E — Creative Dev「BENCH / 工作台」

- **优点：**
  1. **Work 放在 §01——全池唯一把作品放在第一节的方案**，招聘者黄金路径最短；Specimen Sheet 的工件窗三态（Live demo / 真实命令会话 / 架构图）+ **Code tab 展示真实源码摘录**——"Code" 页签是全池最强的工程信誉证据，没有之一，比任何形容词都直接回答"会不会写代码"。
  2. 三台 Lab demo 全部离线真算（LAB-01 可编辑投毒文档、可开关防御、看排名被劫持再回落），候选人声称的研究方向被当场演示——**网站本身即 Exhibit #1**，对 AI 平台岗这就是 work sample；Bench Row 行尾 stack 词 + `operate →` 让我扫索引就够。
  3. 键盘体系 + palette Actions（`Copy email` / `Copy GitHub URL`）+ 三层快捷键发现性——从邮件里点开、只想快进快出的我，联系和导航零摩擦；demo 的可达性设计（键盘路径、reduced-motion 静态快照、ARIA 词表）写成了验收标准。
- **缺点/风险：**
  1. SCHEMATIC SESSION 的 12ms/字符打字机效果对信息提取是净损失：我想看的命令输出被动画拖慢——**默认静态呈现、交互才逐字**，一行代码的改动。
  2. 三台 demo + canvas 装置的实现量是全池最大，第二轮工期一紧，最先被砍的恰恰是本方案的核心卖点；建议把首屏 P-00 装置降级为可选增强（静态快照兜底已设计好），优先保三台 demo。
  3. About 被拆进 hero 副行 + Work 侧栏三行，招聘者想看"这个人现在在哪、想要什么"（求职意向）时无处可看——建议 Work 侧栏三行中明确一行 `Looking for: …`（config 驱动，未配置不渲染）。
- **最值得被偷走的想法：** Specimen Sheet 的 Code 页签——项目详情内嵌 30 行真实源码摘录 + full source 链接，这是"engineer credibility"的最佳单件证据。

### Team F — Swiss「Coordinate System」

- **优点：**
  1. 项目索引表把 Year/Role/Tags 做成固定列、tabular-nums 右对齐——表格语义对"扫"极其友好；行内展开的 meta 表（YEAR/ROLE/STACK/STATUS/REPO/DEMO）完整，hover 五联反馈克制且触屏有 `:active` 映射。
  2. 空状态 = 表格中的一行（`P— | Selected research will appear here. | —`）+ 空模块时导航编号自动重排——"待归档"而非"没做完"，且 5 年内容生长不需要改导航代码。
  3. sample 项目里登记 `05 This Site — 本站自身`，把网站本身纳入作品索引，工程信誉的自指做得聪明。
- **缺点/风险：**
  1. **首屏 live 坐标读数 `X:07 Y:03` 对招聘者是纯噪音**——我第一眼看到的是设计系统的自我表演而非候选人的能力；而首屏唯一承载信息的 Row C 兴趣索引只有 mono 12px，信息权重与大海报字倒挂。
  2. **人设信号偏设计师**：十字准星、描边 outline 大字、ghost 编号、全站坐标家具——方案自认的"设计感 > 内容感"风险成立；对 AI/平台招聘方，这更像视觉设计师作品集的开场，而不是研究 RAG 的工程师。
  3. Contact 藏在 §08 Dossier（About+Contact 合并）页面最尾，是全池联系方式发现成本最高的方案之一；键盘用户和锚点导航能救，但移动端目录里它排第 8。
- **最值得被偷走的想法：** "空状态 = 表格中的一行 + 导航编号数据驱动自动重排"——把内容生长当成一等工程问题提前解决。

### Team G — Dark Premium「Dimmer Room」

- **优点：**
  1. Vitrine 铭牌栏是完整的"招聘者读数"：编号/年份、衬线标题、Role 行、60–80 词描述、tech tokens、`Case study →` / `GitHub ↗`——信息齐全且层级干净，zigzag 交替有节奏不闷。
  2. **无图展台兜底**：媒体字段为空时舞台退化为 surface-inset + mono 项目代号——对当前"没有任何素材"的主人公非常现实，6 个项目没截图也不塌版。
  3. Publications 空态放中段（"藏起来反而心虚"）+ `EXHIBIT · RESERVED` 预留展位，学术诚实与展厅隐喻自洽；实验以 mono spec 表呈现（setup/corpus/top-k/metric）有真实的工程感。
- **缺点/风险：**
  1. **Dark-first + 展厅氛围把"高级"押在光上**：招聘者白天从邮件点开，第一印象是暗色展示间而非可扫描的档案——暖石墨上的长文扫读效率低于所有纸面方案，我更累。建议：Light 主题要有同等级的首屏完成度，且 System 跟随时真正尊重亮色偏好（方案默认无偏好用户也见 Dark，立场激进）。
  2. 主题切换锁输入 700ms 是可用性自伤——误触拨杆就被锁半秒多；应只做防抖不做输入锁。
  3. zigzag 大图舞台依赖媒体资产：当前没有项目截图，首屏之下最大的视觉锤（21:9 全幅首条）会落在无图展台上，Dark Premium 的说服力会明显缩水；Fraunces 340 + 黄铜的"奢侈品"语言也有"产品营销页"而非"研究者主页"的误读风险。
- **最值得被偷走的想法：** "无图展台"——媒体缺失时被设计过的一等版式（而非灰色占位块），所有依赖截图的方案都该带上这个降级。

### Team H — Experimental「A Retrievable Self 可检索的人」

- **优点：**
  1. **Evidence Chain（问题→方法→产物→链接，横向四站）是全池对招聘者最好的单项目版式**：左→右一次扫过完成因果阅读，问题站用白话（给我看）、方法站用动词开头的 mono 短句（给研究者看）、产物站只列存在的东西、第四站永远是链接；移动端纵向化保住同一语义。
  2. 首屏右栏 `INDEX OF ONE PERSON` 任务轨把 Work/Lab/Contact 做成常驻直链——"怎么联系"零层跳转；palette 的 Actions（Copy email / Copy GitHub URL）把联系变成一次按键；§02 的排序论证（"About 是最弱的牌，不打在最好的位置"）是完全正确的招聘者逻辑。
  3. §15 可用性守护清单是全池唯一把无 JS / SEO / reduced-motion / 对比度 / prefers-contrast 写成验收标准的方案——网站本身作为工程证据的说服力因此很强。
- **缺点/风险：**
  1. **首屏 sealed 态用 blur 遮蔽摘要**：对 60 秒扫描者，第一眼"文字是糊的"≈页面坏了的错觉。全部缓解措施（DOM 全文、首次输入 1.5s 内揭示、跳过锚点、resolved 记忆、prefers-contrast 关闭遮蔽）都成立，但缓解的前提是用户意识到这是个装置——多数招聘者不会。可执行修改：blur 半径降到 2px 或首行默认揭示，把"仪式感"留给主动交互者。
  2. palette 发现性依赖一次性 toast + 页脚提示——我几乎不会停留 5 秒等 toast；⌘K chip 应进入首屏右栏任务轨，与 Contact 并排。
  3. 证据链的视觉权重全部压在问题站（衬线大字），方法/产物是小字——对"只扫产物"的读者，建议产物站固定渲染文件数读数（`3 artifacts · notebook + script + draft`），让产出量在扫视中可见。
- **最值得被偷走的想法：** 证据链的三声部写法本身——"问题站白话 / 方法站动词开头 mono / 产物站只列存在的东西"就是给所有方案的 case study 写作模板。

---

## 排名与理由

**Top 3：E > C > H**

1. **Team E（第一）**：唯一把"90 秒三问"全部做到最短路径的方案——5 秒知方向（hero 主张句），Work 在 §01（全池最早），Code tab + 三台离线 demo 让"网站本身即作品证据"从口号变成事实；palette Actions 让联系一次按键完成。扣分项（视觉最朴素、实现量最大、About 被拆散）都不触及否决区。它让候选人看起来**最像一个能上手干活的工程师**，这正是我招 AI 平台岗时最想看到的信号。
2. **Team C（第二）**：项目数据可见性第一（ledger 行含版本/状态，dossier 展开 ROLE/STACK/REPO/DEMO），⌘K 检索 + 构建自证读数让工程信誉可核查。扣分：Relevance Lens 的 hover 重排对扫描者有害（应默认关闭）、Work 排在空 Publications 之后、首屏装置密度偏高。
3. **Team H（第三）**：Evidence Chain 是全池最佳单项目版式，首屏任务轨 + palette Actions 让联系零层可达，验收级可用性清单本身就是工程素养证明。扣分：sealed blur 态是第一印象赌博（可低成本修正），palette 可发现性弱。

**第四名（差半步进前三）：Team A** —— 全池最稳的纯扫描体验与首屏黄金路径锚点，但作品索引行缺 Role/链接位、Contact 在最底端、后 3 个项目指向空链接，在 portfolio_presentation 上差 E/C/H 一档。

**角色拟合提示（给第二轮的定性结论）：** E/C/A/D/H 让候选人"更像工程师/研究者"；B 与 F 有明显的"设计师转行"气质风险（B 靠刊物隐喻与人文名层，F 靠坐标家具与海报字）；G 介于两者之间——更像一个被精心包装的产品营销页，媒体资产缺失时会显著失血。

```json
{
  "judge": "recruiter",
  "scores": {
    "A": {"visual_quality": 8, "originality": 7, "typography": 9, "information_hierarchy": 9, "ux": 9, "mobile_experience": 8.5, "technical_feasibility": 9, "long_term_maintainability": 8.5, "research_presentation": 8.5, "portfolio_presentation": 7.5, "light_mode": 8.5, "dark_mode": 8.5, "performance": 9, "accessibility": 9},
    "B": {"visual_quality": 8.5, "originality": 8.5, "typography": 9, "information_hierarchy": 7, "ux": 6.5, "mobile_experience": 8, "technical_feasibility": 7.5, "long_term_maintainability": 6.5, "research_presentation": 8.5, "portfolio_presentation": 7, "light_mode": 8.5, "dark_mode": 8, "performance": 7, "accessibility": 7},
    "C": {"visual_quality": 8, "originality": 7, "typography": 8, "information_hierarchy": 8, "ux": 8, "mobile_experience": 8.5, "technical_feasibility": 8, "long_term_maintainability": 8.5, "research_presentation": 8.5, "portfolio_presentation": 9, "light_mode": 8, "dark_mode": 9, "performance": 8.5, "accessibility": 8},
    "D": {"visual_quality": 8, "originality": 8, "typography": 9, "information_hierarchy": 8.5, "ux": 8, "mobile_experience": 8.5, "technical_feasibility": 7.5, "long_term_maintainability": 7, "research_presentation": 9, "portfolio_presentation": 8.5, "light_mode": 8.5, "dark_mode": 8.5, "performance": 8, "accessibility": 8.5},
    "E": {"visual_quality": 7.5, "originality": 8.5, "typography": 7.5, "information_hierarchy": 8.5, "ux": 8.5, "mobile_experience": 8, "technical_feasibility": 7, "long_term_maintainability": 7.5, "research_presentation": 7.5, "portfolio_presentation": 9, "light_mode": 8, "dark_mode": 8, "performance": 7.5, "accessibility": 9},
    "F": {"visual_quality": 8, "originality": 6.5, "typography": 7.5, "information_hierarchy": 7.5, "ux": 7.5, "mobile_experience": 7.5, "technical_feasibility": 8.5, "long_term_maintainability": 8, "research_presentation": 7.5, "portfolio_presentation": 8, "light_mode": 8, "dark_mode": 7.5, "performance": 8.5, "accessibility": 8},
    "G": {"visual_quality": 8.5, "originality": 7, "typography": 8.5, "information_hierarchy": 8, "ux": 7.5, "mobile_experience": 8, "technical_feasibility": 8, "long_term_maintainability": 7.5, "research_presentation": 8, "portfolio_presentation": 8.5, "light_mode": 8, "dark_mode": 9, "performance": 7.5, "accessibility": 7.5},
    "H": {"visual_quality": 7.5, "originality": 9, "typography": 8, "information_hierarchy": 8.5, "ux": 7.5, "mobile_experience": 8.5, "technical_feasibility": 8, "long_term_maintainability": 8, "research_presentation": 8.5, "portfolio_presentation": 9, "light_mode": 8.5, "dark_mode": 8.5, "performance": 8.5, "accessibility": 9}
  },
  "top3": ["E", "C", "H"]
}
```
