# Round 3 · Judge 10 · Originality（原创性）终审报告

> 评审对象：Generation 3 唯一站点 **CONCORDANCE**（`generation_03/`，预览 localhost:4183）。
> 首要权重 originality，其次 visual_quality。方法：先全部 60 张截图（desktop/tablet/mobile × light/dark，29 张逐张 + 37 张 contact-sheet 全览），后逐文件源码审计，再与 `generation_02/` 三案源码对照。
> Round 2 我开的针：M1（单色系统内的第二次变奏）、M2（FIG 升级为全站语法）、M3（facet 变真检索入口）——本报告逐针复验。

---

## 1. CONCORDANCE 概念真实性：真概念，但比它的名字矮半档

判定标准：概念是否进入代码结构（改名即崩），还是停留在命名层话术（改名无恙）。

### 1.1 概念确实长进了代码（证据链）

| 概念层（语词索引 = 一本书 + 一套检索系统） | 代码落点 | 复验结论 |
|---|---|---|
| 语词索引的本质是**引文坐标**（词目 + 页码） | `src/lib/sections.ts:24-81`——§01–§07 坐标注册表，`reading` 字段全部从 content 模块**实数统计**（`reading: \`${researchTopics.length} TOPICS · ${researchQuestions.length} QUESTIONS\``），非手写 | **真**。坐标被 header 导航、Home 右栏索引、MobileMenu、palette 结果、404 地址表、colophon 六处消费，是数据不是装饰 |
| 检索结果按"词条目 + 引文坐标"排版 | `src/lib/search.ts:53-63`——每条检索记录携带 `coord`（如 `§02 · PLATE 01`），palette 渲染为 `type + title + coord` 三栏 | **真**。这是全站最原创的一笔：把 cmdk 式结果列表改写成了"可引用的索引条目"。页脚 `local index · N records · 0ms network`（SearchPalette.tsx:192）由构造保证为真 |
| 404 = 索引里查无此址 | `NotFoundPage.tsx:16-34`——"no record at this address" / "The concordance has no entry at this address" + "query the corpus" 按钮 + 全部地址罗列 | **真**。失败模式也在概念内，不是通用 404 贴皮 |
| 书的版权页（colophon）= 版本记录 | `Footer.tsx:14-50`——`corpusReading()` 实数统计（WORK 4 · TOPICS 6 · QUESTIONS 4 · NOTES 3 · PUBS 0 · LAB 3 DEMOS · 13 RECORDS）+ build 日期 + "0 analytics · 0 trackers · set in inter + newsreader"；M4 的唯一诚实声明在这里（`lab.ts:107-108`） | **真**。且这些数字随 content 自动更新——加一篇笔记，colophon、header reading、palette、FIG.N1 同步变 |
| 站点作为自己的词条 | `WorkPage.tsx:162-163`——plate 04 "this site" 的 case study 链接写作 "you are standing in it" | **真**。自指完成度高 |
| 检索作为全站语法（M3） | `palette.tsx`（openSearch context）+ Hero 四枚 facet chip（HomePage.tsx:170-180）+ Work 标签（261-271）+ Research adjoins chips（ResearchPage.tsx:105-114）+ WorkPage stack 下划线标签（132-142），全部 `openSearch(term)` 程序化预填 | **真**。Round 2 的"表态链接"针已拔出；标签的语义从"分类"改写为"检索入口"，`⌕` 记号 + aria-label 双保险 |
| 命名一致性 | site.ts 的 searchPlaceholder "query this concordance"、空态 "no documents matched"、Connect 的 "a concordance only lists what it can cite"（ConnectPage 截图可见） | **真**。文案服从概念，不是概念服从文案 |

**改名测试**：把站名改回 "Monograph"，header/palette/404/colophon 的行为（坐标引用、查无此址、版本页）会立刻显得无由来——概念与结构咬合。这通过了我的"真概念"测试。

### 1.2 概念的半档落差：palette 还不是真正的 concordance

真正的语词索引是**穷尽式**的：每个词的每次出现都要给引文。而 gen3 的 palette（`search.ts:144-168`）：
- 只索引 title / hint / keywords，**不索引笔记正文与 lab 语料**——note n1 里原句 "it needs to persuade the ranker" 拿去查，返回空；
- 评分是 substring 启发式，上限 8 条；站点自己 shipped 的 `lib/bm25.ts`（137 行，带测试）就在旁边，palette 却不用；
- `DESIGN_NOTES.md:165` 自认（遗留风险 2）。

所以 palette 目前是"**带坐标的目录**"，不是"语词索引"。这是命名层领先结构层的半档——概念是真的，但最配得上名字的那个深度还是存根。

### 1.3 概念真实性评分依据

概念入码 7 处全真（§1.1），落差 1 处（§1.2），.Register 命名超支 1 处（见 §3）。**结论：概念真实，非话术**。

---

## 2. 方言清点（Linear / Vercel / Notion / Apple / arXiv 残留）

### 2.1 仍在场的通用口音（可被任何站点原样搬走 = 不计入原创）

| 口音 | 位置 | 计数 |
|---|---|---|
| Linear/Raycast | `/` 与 ⌘K 呼出的暗底搜索 overlay；`?` 键盘帮助层（App.tsx:73-84, SearchPalette.tsx:207-283） | 2 |
| Vercel | mono 大写 meta 标签 + 全站 hairline；`system→light→dark` 循环主题钮 | 2 |
| Notion | Work plate 的 ROLE/STACK/LINKS/CASE STUDY 属性栅格（WorkPage.tsx:127-168）；palette 页脚读数 | 2 |
| Apple | 首屏 min-h-svh 居中 display hero（HomePage.tsx:140） | 1 |
| arXiv/学术 | FIG./PLATE./§/Q/L- 编号系统、evidence chain | 1（但这一条是概念本身，不算残留） |
| indie-web | "0 analytics · 0 trackers" colophon 行 | 1 |

共 **8 条**通用口音在场——数量与 gen2 相当（融合本来就是指令）。关键变化是**重心**：gen2 H 的身份就由 mono+hairline 这类通用口音承载（视觉评委 Round 2 的批评对象）；gen3 的身份重心移到了坐标系统、引用式检索、colophon 这些**内容耦合、搬不走**的结构上（§1.1 表）。

### 2.2 直接继承自 gen2 的部分（按 DESIGN_NOTES §0 声明的融合配方）

- **双语气 Hero 是 gen2 A 的直接移植物**：`generation_02/team_a_monograph/src/content/site.ts:11-12` 为 `heroSans: ["Retrieval-Augmented","Generation,"]` + `heroSerif: "before it breaks."`，caret 为橙；gen3 `site.ts:20-21` 改写 serif 行为 "read at the level of the ranking."，caret 改钴蓝。骨架、字体选择（Newsreader display + Inter）、settle 动画、caret 记号全部承袭。首屏的"类型时刻"本身是可迁移的；首屏的原创性实际由右栏 §-index（带实数 readings）+ 首屏内的 FIG.01 扛。
- **BM25 引擎**自 gen2 D 演化（tokenize 重写 + 停用词表 + TF·IDF 分支 + RankOptions），正当工程继承。
- **palette 骨架**自 gen2 H，但结果条目的 coord 三栏排版、facet 入口网络、`?` 帮助层的 "Every section has a coordinate" 段落是新的。

### 2.3 清点结论

残留口音 8 条，无新增；身份载体已从"可复用的通用口音"迁到"不可复用的坐标/引用/colophon 结构"。**可复用清单**（另一站点可直接搬）：Section/PageShell 框架、REGISTER_PAD、contrast.test 守卫、FIG.02/R1 的堆叠条、换词即用的 hero 组合。**不可复用清单**（gen3 真正的原创资产）：`sections.ts` 坐标注册表、`search.ts` 的 coord 引用式结果、404/colophon/corpusReading、"you are standing in it" 自指。

---

## 3. M1 复验：第二次变奏在渲染层真实存在，但系统层八成是叙事

### 3.1 渲染层：变奏可感知（及格）

Home 整页截图（light/dark full）可辨六段交替：PLATE hero（巨号 serif）→ LEDGER research（紧排行）→ PLATE work（display "Poison Sandbox"）→ LEDGER lab（FIG.02）→ ESSAY notes（serif 阅读）→ PLATE connect。相邻段不同档的承诺兑现；页面级 Work（整页 PLATE）vs Notes/About（整页 ESSAY）vs Research/Lab（LEDGER）的反差在 desktop 截图上清晰。普通访客能感知"大 serif 时刻 / 密数据行"的呼吸交替——**Round 2 "从 §01 到 §07 一种组合拳" 的单调已解除**（desktop 上）。

### 3.2 系统层：Register 的机器只转了 20%（新发现）

- `index.css:8-16` 头注宣称三档 CSS 类 `.r-ledger / .r-plate / .r-essay`——**样式表里这三个类不存在**（grep 全库无定义）；
- `structure.tsx:68` 写入 `data-register={register}` 属性——**没有任何 CSS 规则消费它**；
- `structure.tsx:94` PageShell 里留着死三元 `` `${register === "plate" ? "" : ""}` ``——意图与实现脱节的化石；
- register prop 的全部机械效果 = `REGISTER_PAD` 垂直内边距表（structure.tsx:14-18，py-14/16 vs 20/28 vs 16/24——肉眼几乎不可辨）；
- 三档中只有 ESSAY 有真实 CSS（`.essay` 66ch/29px，index.css:535-555）；PLATE 与 LEDGER 的排印差异实际来自**各页自行选用 t-h1 vs t-entry**，即变奏存在于内容选择，不存在于系统。

**判定**：M1 的可见目标达成（变奏可感知），但达成手段是每页的手工排印选择 + 一个 padding 表；"三档 Register 系统"作为系统大部分是文档叙事。风险落在 Meta Designer：若按 DESIGN_NOTES §1.3 的表格去"打磨 Register"，会打磨一个不存在的东西。另外 mobile 上（home mobile full）六段节奏明显趋平——单列下 PLATE/LEDGER 只剩字号差。

### 3.3 M2 复验：语法全站化达成，形态谱系单 Narendra（证实视觉评委）

五张 FIG 逐个验证（代码 + 截图）：

| FIG | 位置 | 形态 | 基因型 |
|---|---|---|---|
| FIG.01 | Home 首屏 | 双栏 rank 行（横条 ×3+×3） | **A：横条行** |
| FIG.02 | Home lab 预览 | 单根堆叠横条（分段填色） | **B：堆叠条** |
| FIG.R1 | Research | 单根堆叠横条（与 FIG.02 仅色 tone 不同） | **B：堆叠条（近亲）** |
| FIG.W1 | Work plate 01 | 两根 `.rank-track` 横条 | **A：横条行（与 lab sandbox 同语言）** |
| FIG.N1 | Notes | 三根横条（n=3 的词数） | **A：横条行** |

**5/5 全部是横条形，仅 2 个基因型（A 横条行 ×3、B 堆叠条 ×2）**。视觉评委"三种是横条近亲"成立且保守——其实是全部。语法层（编号 + method 标注 + "computed in your browser · 0ms network" + 上下 hairline）执行一致、无假数据（FIG.N1 词数从 body 实算、FIG.R1 从台账实算、FIG.W1 现场跑 BM25），M2 的"凡有数据可算处"精神达成。但"数据即颜料"只产出了一种颜料形状。**形态处方**：①FIG.R1 对 n=4 的台账用堆叠条属于杀鸡用牛刀，改成台账状态坐标条/引用摘录；②补一个 **KWIC 引文行**图（key-word-in-context——语词索引的原生图形，命中词居中对齐的引文列）——只有这个概念养得起这个图形；③FIG.01 本来就算出了两个 ranking，permutation（bump/连线图）是免费的第四形态；④Lab 三个"活图"（FLIP 重排、滑杆截断、双引擎对比）不受此限。

### 3.4 M3 复验：达成（见 §1.1 表第 6 行，不再赘述）

M4 达成（全站无 "SAMPLE ENTRIES" 面贴；诚实只在 colophon/lab 声明行/publications 空态三处）。M5 达成（Connect："Fastest signal right now: *the email slot below*." + 显式 mailto 占位 + "+ 5 SLOTS — HIDDEN UNTIL CONFIGURED"，见 connect 截图）。

---

## 4. 记忆点终版 + 签名交互终审

### 4.1 闭眼回想留下的画面

1. 巨号双语气 serif hero 行尾**钴蓝闪烁光标**；
2. 右栏 **"index of one researcher"** §-坐标列表，每行行尾一枚诚实读数（0 RECORDS / 3 ENTRIES）；
3. **红色 POISONED 条抢走 rank 1**，图上写着 "computed in your browser · 0ms network"。

这个复合画面——"一本会以引文作答的书，首页跑着一个被投毒的实时排名"——在个人网站谱系里**我没有先例可指**：⌘K palette 是 2021 后个人站的通用件；serif 编辑部 hero 有大量先例（含 gen2 A 自身）；诚实零态罕见但有。但"首页即实验 + 全站引用语法 + 版权页实数清点"三者绑在一个隐喻上运行，是可认领的组合。

### 4.2 签名归属

| 候选 | 判定 |
|---|---|
| **palette + facet 检索网络** | **签名**。首屏内两处可感知（hero 四枚 `⌕` chip + header `⌕`/`/` 键提示），键盘优先，全站每个标签都是它的入口，404 也为它导流。尺寸测试通过——它不是藏在深处的彩蛋 |
| FLIP 重排（手写 55 行） | 最强的**演示**，但在 `/lab/corruption-sandbox` 一层之下，是招牌菜不是签名 |
| Register 三档 | 是节奏不是交互（且系统层未建成，§3.2） |

签名够大，但深度不足——它配得上 "concordance" 之名的最后一步（穷尽式索引 + KWIC 引文）还没走（§1.2）。

### 4.3 其他原创性观察（正向）

- Publications 空态的 ghost 编号行 "RESERVED — this line auto-numbers when publications.ts grows"——把"还没有"做成站点机制的一部分，罕见；
- About 的中占位句以 `lang="zh"` 包裹进入排版契约（:lang(zh) 禁斜体/负字距）——诚实占位也占在系统里；
- Hero settle 一次会话一次 + Esc 可中断 + 首帧前打标（App.tsx:109-117）——回访零闪动，工艺级细节；
- 全站唯一 opacity:0 是 caret 闪烁关键帧（grep 证实）——G1 纪律真实。

---

## 5. 评分（14 维）

| 维度 | 分 | 一句话依据 |
|---|---|---|
| visual_quality | 8.5 | 纸/墨/钴蓝双主题完成度高；PageShell 页顶 ~200px 死白（research/lab/publications 截图）稀释节奏；FIG 形态单一略压中段 |
| **originality** | **8.5** | 概念真入码（§1.1 六处 + 404/colophon），签名首屏可感知；扣分：hero 直接承袭 gen2 A、FIG 5/5 横条、palette 低于自己名字、Register 系统层未建成 |
| typography | 9 | 1.25 阶梯 + 4px 量化 + 暗色 470 补偿 + :lang(zh) + tabular-nums；Register 未建系统不损字阶本身 |
| information_hierarchy | 9 | 坐标/kicker/lede/reading 四层到位，palette 结果三栏（type/title/coord）信息密度优雅 |
| ux | 8.5 | 检索入口无处不在 + 404 可查询 + Connect 行动导向；页顶死白与 chip-as-search 的轻度歧义（有 ⌕ 缓解） |
| mobile_experience | 8.5 | 单列重排、44px、safe-area、全屏坐标目录； Register 节奏在移动端趋平（截图证实） |
| technical_feasibility | 9 | console.json 空、TS 5.9 嵌套手术有文档、无死依赖、手写 FLIP 55 行 |
| long_term_maintainability | 9 | 编译期契约（Record<ProjectId,EvidenceChain>）+ 全部读数实数派生——加一篇笔记五处自动同步 |
| research_presentation | 9 | 台账 + 状态图 + 证据链 + demo 回链 + 笔记喂台账，闭环 |
| portfolio_presentation | 9 | PLATE 语法、无卡片墙、"you are standing in it" 自指 |
| light_mode | 9 | 暖纸+钴蓝，token 比值全测（contrast.test 守卫） |
| dark_mode | 9 | reading room 重调校非反转，470 补偿，信号色两套 |
| performance | 9 | 首屏 gzip ≈109KB、路由分割、2 族 6 文件、FIG 全部渲染时计算 |
| accessibility | 9 | combobox 全套、skip、trap、aria-live、prefers-contrast、守卫测试锁死对比度契约 |

## 6. verdict：**PASS**

进入 Meta Designer 打磨阶段。附带给 Meta Designer 的三条边界：①不要按 DESIGN_NOTES §1.3 的表格去"完善 Register"——先把 §3.2 的三层脱节（幽灵类/死属性/死三元）修掉或把头注改写成实际行为，否则打磨会落在虚构上；②palette 升级（§7）改动面小、收益最大；③不要动 hero 的字体时刻（那是继承来的工艺），要动就动它右栏的 index 与 FIG.01 的地位强化。

**如果只能改一处**：见 §7。

## 7. 如果只能改一处：把 palette 变成名副其实的 concordance

`search.ts` 的 buildIndex 增加 note bodies（`notes.ts` 的 body[].text）与 `sandboxCorpus`/`budgetChunks` 语料，检索改走站内已 shipped 的 `bm25Rank`，结果条目把命中词所在句渲染为 **KWIC 引文行**（命中词居中/高亮 + 右侧坐标 `§04 · 2026-08-14`）。一针三雕：①站名在签名交互里变成事实而非修辞（修复 §1.2 半档落差）；②FIG 语法获得第二个基因型——排印引文图，打破 5/5 横条（修复 §3.3）；③签名交互从"目录"升格为"索引"，深度配得上它的显要位置。工程成本低：引擎、坐标系、UI 骨架全部现成。

---

## 证据索引

- 截图：`shots/gen3/concordance.concordance.*.png`（60 张全览；关键单证：home.desktop.light/dark(.full)、home.mobile.light/dark.full、research.desktop.light、work.desktop.dark、labcorruption-sandbox.desktop.light/dark、publications.desktop.dark、notesn1.desktop.light/dark、about.desktop.light/dark、connect.desktop.light、connect.mobile.dark、labcorruption-sandbox.mobile.light）
- 概念结构：`generation_03/src/lib/sections.ts`、`src/lib/search.ts`、`src/lib/palette.tsx`、`src/components/SearchPalette.tsx`、`src/pages/NotFoundPage.tsx`、`src/components/Footer.tsx`、`src/components/Header.tsx`（Mark 徽记）、`src/components/structure.tsx`、`src/styles/index.css`
- M1/M2 复验：`src/components/structure.tsx:14-18,68,94`、`src/styles/index.css:8-16,535-555`、`src/pages/HomePage.tsx:24-113,222-335`、`src/pages/ResearchPage.tsx:27-73`、`src/pages/WorkPage.tsx:29-87`、`src/pages/NotesPage.tsx`（FIG.N1）
- 继承对照：`generation_02/team_a_monograph/src/content/site.ts:11-12`、`generation_02/team_d_offprint/src/lib/bm25.ts`、`generation_02/team_h_retrieval/src/components/SearchPalette.tsx`
- 自查：`generation_03/DESIGN_NOTES.md`（§1.3/§1.4/§4/§6——§6.2 自认 palette 局限）
- console：`shots/gen3/concordance.console.json` = `[]`（0 error / 0 warning）
