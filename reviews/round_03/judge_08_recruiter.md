# Judge 08 · Recruiter（招聘者）终审报告 — Generation 3「CONCORDANCE」

> 视角：一个只有 10 秒找记忆点、60 秒找能力证明、30 秒提取教育/方向/技能/联系方式、
> 然后决定"约不约"的人。首要权重：portfolio_presentation / ux。
> 本报告所有结论基于可证伪证据：截图路径 + 源码文件:行号。

## 0. 证据清单

- 截图：`shots/gen3/concordance.concordance.{home,work,connect,about,labcorruption-sandbox,publications,research,notesn1}.desktop.light.png`、`home.desktop.dark.full.png`、`home.mobile.light.full.png`
- 对照：`shots/gen2/team_a_monograph/a.a.home.desktop.light.png`、`shots/gen2/team_d_offprint/d.d.home.desktop.light.png`（gen1 无整页截图存档，以 Round 1 文字结论为参照）
- 源码：`generation_03/src/pages/{HomePage,WorkPage,ConnectPage}.tsx`、`src/content/{site,profile,links,timeline,projects,lab}.ts`、`src/styles/index.css:600-616`、`index.html`、`src/App.tsx`、`src/lib/seo.ts`
- 自查表：`generation_03/DESIGN_NOTES.md` §4（抽查 6 项，见 §5）
- `shots/gen3/concordance.console.json`：空数组（0 error / 0 warning）

## 1. 10 秒测试 — 首屏记忆点：**PASS，且是三代中最强首帧**

首帧同一屏内有四层信息（`concordance.concordance.home.desktop.light.png`）：

1. **双语气 Hero**："Retrieval-augmented generation,"（serif roman）+ "read at the level of the ranking."（serif italic + 钴蓝 caret）——2 秒内知道这个人做 RAG；
2. **INDEX OF ONE RESEARCHER** 右栏：7 个坐标 + 诚实读数（"6 TOPICS · 4 QUESTIONS / 0 RECORDS"）——3 秒内知道这个站有什么、这个人不吹；
3. **FIG.01**：clean vs poisoned 的 BM25 top-3 实算图，d8 ▲ POISONED 锈橙标记——5 秒内看到"论点的证据"而不只是论点的修辞；
4. facet chips（RAG / Robustness / Poisoning / Security）带 ⌕，是真检索入口（`HomePage.tsx:170-180` → `openSearch(short)`）。

对照进化：Gen2 A 的 "*before it breaks*" 短语更俏皮，但右列全空、首帧无任何证据；Gen2 D 的 Q1 水印概念强，但 "CONTACT — AVAILABLE ON REQUEST" 是死端。Gen3 首帧是三代中唯一"陈述 + 地图 + 证据 + 入口"四件套齐全的。代价：hero 短语比 "before it breaks" 更圈内（"read at the level of the ranking" 需要半秒解析）——但 lede 第一句就修复了理解，可接受。

**首帧可见性（Round 2 A 案 opacity:0 缺陷）已根除**：`.settle` 动画仅 `transform: translateY`（`index.css:605-615`，注释明写 "no opacity:0 anywhere"）；回访在首帧前打 `data-settled`（`index.html:36-39`）；noscript 有静态骨架（`index.html:74-97`）；全部整页截图内容 100% 可见。终审确认。

## 2. 60 秒测试 — Work 的 PLATE 语法与 Lab 的动手证明：**PASS**

**Work**（`work.desktop.light.png` + `WorkPage.tsx`）：PLATE 编号 / 状态点 / 年份 / ROLE-STACK-LINKS-CASE STUDY 表 / 缩进证据链（problem 一句问句 → method 动词短行 → artifacts 只列存在的东西）/ FIG.W1 实算条。这套语法让项目**可信**——每条主张都挂在"怎么验证"上；**可读**——同构模板扫读零成本；**有存在感**——display 级标题 + 大留白是"作品集"而非"列表页"。Plate 01 直通活体 sandbox（"Corruption Sandbox — live in §03"），这是验证链的关键一跳，做了。

**Lab**（`labcorruption-sandbox.desktop.light.png`）：这是全场最有说服力的"动手能力强"证明——不是截图壳，而是**在面试者浏览器里当场算给他看**的 BM25 重排，带 "TOY HEURISTIC, NOT A REAL DEFENSE" 防御开关、build 日期、"0MS NETWORK" 读数。防御逻辑抽查属实：`bm25.ts:73-90` 乘 factor 后统一重排（A1 落实），`RankList.tsx:21` 条宽归一 + 0.02 clamp（条形不再说谎）。

弱点：4 个 plate 中 3 个外部 artifact 为零（`projects.ts:17,31,46` 全 null，页面诚实写 "unlisted until they exist"）。PLATE 语法撑住了体面，但招聘者最终要的是**至少一个可点开的 repo/部署**——这一天只能由真实内容解决，版式已给出最佳托举。

## 3. 30 秒提取测试 — **方向满分，credentials 缺位（设计使然，但仍是招聘者的最大损失）**

| 提取项 | 路径 | 结果 |
|---|---|---|
| 研究方向 | Hero → lede → §01 方向表（每条一句人话 + adjoins 检索 chips） | 秒取 |
| 技能/栈 | Work 各 plate 的 STACK 行 + Lab 三个 instrument + site.ts 内容契约本身 | 可取 |
| 教育/学位 | About LOG 前两行 = "TODO — your degree" / "TODO — research role or internship"（`timeline.ts:8-16` 原样渲染） | **取不到** |
| 联系方式 | Connect 页 "Fastest signal right now: the email slot below." + mailto 槽位 | 形式在，值为占位 |

About/Connect 的空态**行动导向已落实**（M5）：Connect 给出显式 mailto 槽位、"+ 5 SLOTS" 诚实隐藏行、"become real the moment … does" 的修复路径（`ConnectPage.tsx:39-91`）。但 About LOG 把两条 TODO 排在真实里程碑（"This site went online"）**前面**——招聘者扫简历式阅读的第一站就撞上 "TODO — your degree"，这是 30 秒测试里观感最差的一帧。

## 4. 信任信号与下一步 CTA

**信任信号整体是加分**：读数全部从数据计算（`HomePage.tsx:126-131`）、"0 RECORDS"（Publications）、"ILLUSTRATIVE TOY"（Sandbox）、单一 colophon 声明（M4 落实，`lab.ts:107-108`）——读起来是一个有纪律的系统，不是"没做完"。"A list of papers, not a list of promises" 这句甚至会把诚实转化为好感。

**但有一类泄漏破坏了这层好感**：开发者文件路径进入用户可见文案——About 时间线 "Replace in src/content/timeline.ts"、Connect "set `email` in src/content/links.ts"、Publications "AUTO-NUMBERS WHEN PUBLICATIONS.TS GROWS"、About 中文占位 "替换于 src/content/profile.ts"。对招聘者这是**脚手架语言冒充候选人声音**——五处累积，把"自信的诚实"往"施工中"拉了一档。

**CTA 链路**：页内路径极好——hash 深链真实存在（`/work#plate-*`、`/research#q2`、方向 adjoins），`App.tsx:39-53` 处理锚点滚动；逐路由标题规范（"Selected Work — Concordance"，`seo.ts:12`）；sitemap/robots/JSON-LD 全套。**但链路终点是死的**：`mailto:address@example.com`（`ConnectPage.tsx:74`）+ 无 CV/resume 下载 + 无复制邮箱按钮；分享层面 `index.html` 无 `og:image`（`og.svg` 未被引用，且 SVG 本就不被多数爬虫接受——DESIGN_NOTES §6.1 已自报）。分享出去的链接预览是纯文字。

## 5. 自查表抽查（防纸面落实）

- **G1**：属实（CSS + index.html 双重验证，截图内容全可见）。
- **M3**：属实（hero chips 与 Work 标签均为 `openSearch(query)` 真检索入口）。
- **M4**：属实（全站无 "SAMPLE ENTRIES" 面贴，声明收敛到 colophon）。
- **M5**：属实（行动导向空态 + 显式 mailto 槽）。
- **A1/D2**：属实（重排式防御 + ▲▼ + clamp，`WorkPage.tsx:31-87` 的 FIG.W1 亦用同一实算）。
- **D1**：属实（note 页边注走 grid 列，`notesn1.desktop.light.png` 无叠印）。
- 抽查 6/6 通过，DESIGN_NOTES §4 无虚报。

## 6. 14 维度评分

| 维度 | 分 | 一句话依据 |
|---|---|---|
| visual_quality | 8.5 | 首屏构图三代最强；hero 短语解析成本略高于 A 的 "before it breaks" |
| originality | 8.5 | concordance 概念 + 三 Register + 实算 FIG 是可认领的签名系统 |
| typography | 9 | 双语气 + 三档 Register + 暗色 470 补偿，排印纪律全场标杆 |
| information_hierarchy | 8.5 | 坐标系统 + index 右栏是导航范本；About LOG 的 TODO 行破坏收尾 |
| ux | 8 | palette/深链/44px/行动导向空态全在；CTA 终点为死占位、文件路径泄漏 |
| mobile_experience | 8.5 | 单列重排、MobileMenu、FIG 降级单列（对比图并排变上下，略损说服力） |
| technical_feasibility | 9 | build/lint/test 全绿、代码分割、无死依赖 |
| long_term_maintainability | 9 | 编译期 content 契约 + 守卫测试，"换一个人来用"成本极低 |
| research_presentation | 8.5 | 证据链 + 台账 + 诚实空态；台账 4 问偏薄 |
| **portfolio_presentation** | **7.5** | 展示工艺满分段；但零可验证外部 artifact + 占位联系方式 + 可见 TODO，今天发出去约不到面试——是史上最好的模板，还不是可用的作品集 |
| light_mode | 9 | 纸面质感、hairline 层级干净 |
| dark_mode | 8.5 | 长文补偿可见（整页 dark 图），halation 无 |
| performance | 9 | 首屏 gzip ≈109KB、Home eager LCP、2 族字体 |
| accessibility | 9 | 对比度守卫测试、combobox、aria-live、noscript；抽查无反证 |

## 7. 如果只能改一处

**把所有用户可见文案里的开发者文件路径清出去**（AboutPage 时间线 detail、ConnectPage mailto note 与 empty line、PublicationsPage reserved 行、profile.aboutZh 占位句）：文件路径移入 `title`/aria-label/代码注释，用户可见层改成同一句人话（如 "This slot becomes real the moment a real address exists."）。一次扫除五处泄漏，是单点改动里对"招聘者观感：自信的诚实 vs 施工中"比值提升最大的一处。

## 8. 结论

**PASS** —— 进入 Meta Designer 打磨阶段。这个站点第一次让"诚实"从姿态变成了语法（读数、图版、空态全系统贯彻），首帧记忆点与动手证明是三代之最；它欠的不是设计，是一个真实的人把自己的名字、邮箱、repo 填进 `src/content/`——而站点已经为此准备好了编译期护栏。
