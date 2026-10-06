# Round 2 评审 — Judge 08 · Recruiter（招聘者视角）

> 我是技术招聘负责人，每天扫 50 份候选人主页/简历，每站只给 30–60 秒。
> 我要在 10 秒内知道"这人是谁、做什么方向、强不强"，60 秒内找到 2–3 个能让我相信的项目证据，30 秒内提取出可填进 ATS 的字段（方向/技能/联系方式），并决定下一步动作（约聊 / 看 GitHub / 转发同事）。
> 本轮我按五条检查：10 秒测试、60 秒测试、30 秒简历提取、信任信号、CTA 与移动端转发场景。首要权重 portfolio_presentation / ux，其次 visual_quality / originality。
> 前提声明：三案共享 CONTENT_PACK，`name/email/github` 全部为 null——所以"没有名字、没有联系方式"不是任何一案的错。我评的是**真实信息落地后的可达性**：架构是否为此准备好、占位姿态是否让招聘者舒服、以及现在这个占位状态下我还能不能形成判断。

---

## 0. 证据与一条重要的捕获异常

- 视觉证据：`D:\Codex\play\portfolio\shots\gen2\team_a_monograph\`（a2.* home、ap.* 各页）、`team_d_offprint\`（d2/dp）、`team_h_retrieval\`（h2/hp）；六份 `*.console.json` 全部为空数组（三案零 console error）。
- 源码：`D:\Codex\play\portfolio\generation_02\team_*\`（DESIGN_NOTES.md + src/content/）。
- **捕获异常核实（影响多个 dp./ap. 截图的解读）**：
  - Team D 只有两个真实路由（`/` 与 `/lab/corruption-sandbox`，见 `src/App.tsx:37-39`），所以 `dp.dp.research/work/publications/lab(.mobile)` 全部是精心排版的 **404 页**（"The page you asked for is not in the edition."）。这不是渲染 bug，是**架构选择**：章节没有可分享的 URL。
  - Team A 是纯单页（无路由），`ap.*` 各页截图因此全是 home 首屏；A 的真实页面证据 = `a2.*.full.png` 长卷。
  - Team H 是唯一给每个章节真实路由的方案（`src/App.tsx:113-122`），`hp.hp.work/research/publications/lab` 均正常渲染；只有 `/lab/corruption-sandbox` 这个地址 404（H 的沙盒住在 `/lab` 里）。
  - 两处"首屏空白"截图：`a2.a2.home.desktop.light.png`（hero 整块缺失，仅导航）与 `d2.d2.home.desktop.light.png`（display 标题缺失）——都是**入场动画未完成时截图**（A 的 settle 动画、D 的 H1 入场），dark 版本均完整。另有 D 的整页截图出现**大面积空白段**，根源是其 Reveal 组件（`src/components/chrome.tsx:56-78`）用 framer-motion `whileInView` 且 `initial opacity:0`——快速滚动捕获/打印/链接预览渲染器看到的就是洞。

---

## 1. Team A「Monograph」— 最好看的一屏，最难行动的一站

### 优点
1. **10 秒测试（dark 下）是三案最强单屏**：`a2.a2.home.desktop.dark.png` — 巨型 display "Retrieval-Augmented Generation, *before it breaks.*"（sans 事实 + serif italic 限定语）一眼给出方向与个性；kicker "A MONOGRAPH IN PROGRESS — RETRIEVAL · ROBUSTNESS · SECURITY"；首屏底部 `RECORDS — WORK 4 · NOTES 3 · PUBS 0 · QUESTIONS 4 · SET 2026-10-04` 是全场最好的"诚实读数"——第一屏就告诉我这个人不吹牛。CTA 就位：Selected Work ↘ / Lab ↘，正是我要点的两个。
2. **Selected Work 从"行"升级成"图版（Plate）"，Round 1 的最大短板被真修了**：`a2.a2.home.desktop.light.full.png` 中 Poison Sandbox / Retrieval Lens / robust-eval-kit / This site 四块全宽 Plate，display 级标题 + 状态灯 + meta 行；Plate 01 内嵌 FIG. 1——用与 Lab 同一个 BM25 引擎在浏览器里实时算出的分数条。**这是我唯一能"看见他会干活"的证据**：图不是装饰，是论证。"This site — YOU ARE LOOKING AT IT" 是很好的信任钩子。
3. **信任信号密度高且不吵**：`0 RECORDS` + RESERVED ghost 槽（`src/sections/Publications.tsx`）、Connect 六渠道 `— unlisted`、Lab 常驻 "Illustrative toy — … Not a claim about real systems"。没有一处让我怀疑在编造。

### 缺点
1. **Connect 是三案中最冷的死胡同**：`src/sections/Connect.tsx` 渲染 6 行 `— unlisted` + "No channels are configured yet."；About 还有一句 "The identity fields live in `src/content/profile.ts`"（`src/sections/About.tsx:16-18`）——**把源码路径写给招聘者看**是开发者自嗨，对 30 秒提取毫无帮助。占位姿态"诚实"但零温度：我真想约聊时，这一页给我的动作是零。
2. **30 秒简历提取最慢**：全站没有 FIELDS/技能层，方向只能从 hero 推断、技能只能从项目 tags（RAG/Robustness/TypeScript…）拼；没有教育/时间线（timeline 主动不渲染）。真实信息落地后，我仍然要滚动三屏才能拼出"MS 学生、做 RAG 鲁棒性、写 TypeScript 工具"。
3. **首屏被入场动画劫持**：`a2.a2.home.desktop.light.png` 整块 hero 缺失（settle 动画未完成）。慢 JS 的微信/LinkedIn webview 里，我可能先看到一屏导航+空白。30–60 秒预算里这是不可接受的开局风险（DESIGN_NOTES §3 自己说了 settle 每会话一次，但没有解决首帧可见性）。

### 如果只能改一处
**让 hero 首帧可见**：settle/入场动画永不从 `opacity: 0` 起步（只做位移/字重微调，或首帧直出、动画只锦上添花）。首屏空白是招聘场景里唯一不可恢复的失败——他只需要一屏就已赢，别让一帧动画毁掉它。

---

## 2. Team D「Offprint」— 最好的单件证据，最差的分享基建

### 优点
1. **单件说服力全场第一：Corruption Sandbox 独立页**（`dp.dp.labcorruption-sandbox.desktop.light.png`）：`APPENDIX X-01 · RE: Q1 · Q2` 开头——**把可玩 demo 挂回研究问题**，这是研究型候选人能给出的最专业信号；顶部 wash 诚实声明框 + `TOY HEURISTIC, NOT A REAL DEFENSE` 标签 + `CORPUS 8 DOCUMENTS · 0 FLAGGED BY HEURISTIC / METHOD: BM25 (K1 1.5 · B 0.75) · 0MS NETWORK` 读数 + "FIXED FOR THIS INSTRUMENT (EDIT SRC/CONTENT/LAB.TS)"。看完这一页，我能对面试官转述："这人自己实现了 BM25、做了投毒实验、并且对 demo 边界极其诚实。" 移动端（`dp.dp.labcorruption-sandbox.mobile.dark.png`）同样完整可玩。
2. **30 秒简历提取最快**：`d2.d2.home.desktop.dark.png` 右栏 FIELDS 六项（RAG · ROBUSTNESS · POISONING · SECURITY · SYSTEMS · RETRIEVAL × GENERATION）一屏读完方向；hero 有 `CONTACT — AVAILABLE ON REQUEST.`；Work 行内 `ROLE SOLO · AREAS RAG / ROBUSTNESS`（`src/components/sections/WorkSection.tsx:35-37`）+ 状态 chip + 结尾 "4 CASE RECORDS — CAPABILITY SHOWN OVER CREDENTIALS CLAIMED"。整站的语言系统就是为"被快速评估"设计的。
3. **"NOW ASKING — Q1" 朱批是三案中最以"人"为记忆点的首屏**：ghost Q1 + 页边批注告诉我这个人*此刻*在想什么——比起口号，这是能让我在 50 份简历里记住他的东西；且它是数据（`content/research.ts` 的 active 问题自动上屏），不是装饰。

### 缺点
1. **章节没有 URL——转发场景直接 404**：`dp.dp.research/work/publications` 全是 404 页。同事间转发是招聘漏斗的真实一环："看下他的 work" → 粘贴 `…/work` → "not in the edition"。`/lab/corruption-sandbox` 可转发，但 work/research 不可。这是**信息架构对招聘场景的真实失分**，不是截图问题。
2. **整页滚动证据满是洞**：`d2.d2.home.desktop.*.full.png` 中 sections 之间大片空白（whileInView 未触发的 opacity:0 内容，`src/components/chrome.tsx:70`）。快速扫站、打印 PDF、链接预览渲染器看到的都是残页。四行 hero 也一样：`d2.d2.home.desktop.light.png` 的 display 标题缺失。
3. **"AVAILABLE ON REQUEST" 没有请求入口**：占位状态下这句是合理话术，但和 hero 里无 email、Connect 无渠道叠加后，对招聘者等于零路径；且 3/4 个 work 条目无任何可点击物（诚实，但意味着 60 秒内我只有一件证据可看）。

### 如果只能改一处
**给 Reveal 动画降级为"永不遮蔽"**：`initial opacity:0` 改为从 0.99 起步或仅位移（`src/components/chrome.tsx:70`），保证任何捕获/打印/慢设备下内容首帧可见——这同时修掉整页空洞和 light 首屏缺标题两个证据缺陷。（若能改第二处：给 02 Work 一个真实路由。）

---

## 3. Team H「检索系统」— 最像"工程候选人"的证据链，最好的转发基建

### 优点
1. **转发与分享基建全场第一**：每个章节真实路由（`/research` `/work` `/lab` `/publications` `/about`，`src/App.tsx:113-122`），`hp.hp.work.desktop.light.png` 证明深链直达且导航高亮正确；`/?q=` 深链进搜索；404 页（`hp.hp.labcorruption-sandbox.desktop.light.png`）本身就是信任作品——"The corpus has no record at this address" + 回索引链接 + 页脚实时计数 `WORK 4 · TOPICS 6 · QUESTIONS 4 · … · 13 RECORDS / BUILD 2026-10-04 · 0 ANALYTICS · 0 TRACKERS`。**三案中唯一一个我可以放心把任意链接发给同事的站**。
2. **Work = Evidence Chains 是最"工程候选人"的项目呈现**：每条链 `01—PROBLEM / 02—METHOD / 03—ARTIFACTS / 04—LINKS`（`hp.hp.work.desktop.light.png`），缺链接处诚实渲染 `—`，standfirst 直接写 "Every project as a chain: … Nothing else is claimed."。这正是我在面试里想听到的结构：问题→方法→产物→可验证链接，占位状态下架构已经为真实链接准备好了四列中的最后一列。
3. **诚实被落成可审计的读数**：Lab 页 standfirst "Both compute entirely in your browser; nothing phones home, and every reading is real arithmetic on hand-written data"（`hp.hp.lab.desktop.light.png`）+ 首页 §03 内嵌真实 BM25 排名条预览 + Publications 空态的两个恢复型 CTA（"The research is already visible → / Working notes appear first →"，`hp.hp.publications.desktop.light.png`）——空态不让我停留，把我推向存在的证据。Intro 降级执行到位：标题 t=0 可见（light 捕获里标题在、facets 未到）、`RESOLVING…` 有终态、skip intro 常驻。

### 缺点
1. **Connect 占位文案是三案中最被动的**："Ways to reach me will appear here."（`src/sections/About.tsx:82`）——对招聘者是句"回来再看"，没有给我任何下一步。H 的 palette 连 copy-email 都因 email 为 null 而不渲染（正确！），但正确+被动=死胡同；相比之下 D 至少写了 "AVAILABLE ON REQUEST."。
2. **视觉注册表仍是最忙的**：mono 坐标（§01…§06）+ 双语义色 + query 语言三套语言并行；light 模式纸面偏灰（`hp.hp.*.light.png`），密读久了略平。对招聘者影响小（我只待 60 秒），但转发给非技术 hiring manager 时气质偏"系统诗歌"。
3. **首访 intro 的空槽帧仍在**：`h2.h2.home.desktop.light.png` 捕获到四条空 hairline 槽 + "RESOLVING…"——虽然只有 ~1.2s、有 skip、标题常驻，比 Round 1 的 blur 光束好一个量级，但"空槽帧"与 Round 1 被否决的"遮蔽态"在截图上只差一步；链接预览/极慢 webview 下仍可能停在半程。

### 如果只能改一处
**把 Connect 占位改成行动导向**：`"Ways to reach me will appear here."` → 保留渠道占位、但加一行指向现有证据的行动线（如 "Fastest signal right now: run the Lab →"）并预留显式 mailto 槽位。H 的基建全是"可转发"，唯独最后一步（联系这个人）没有为占位状态准备好动作。

---

## 4. 招聘者视角横向对比

| 检查项 | A Monograph | D Offprint | H Retrieval |
|---|---|---|---|
| 10 秒测试（dark 完整态） | 最强单屏：宣言式 hero + RECORDS 诚实行 | 强：立场句 + FIELDS + 朱批 | 强：标题 t=0 + INDEX OF ONE PERSON 计数 |
| 10 秒测试（首帧/慢 JS） | **风险最高**：light 捕获整屏 hero 缺失 | 风险：light 捕获 H1 缺失 | 最好：标题常驻，仅 facets 延迟 |
| 60 秒测试（2–3 件证据） | FIG.1 + Plates（2/4 条无验证途径） | **最强单件**（沙盒独立页 RE: Q1·Q2）+ home Lab 预览 | 证据链 + Lab 页 + Publications 恢复 CTA |
| 30 秒简历提取 | 最慢（无 FIELDS/技能层，无教育） | **最快**（FIELDS 右栏 + ROLE/AREAS + CONTACT 行） | 快（facets + INDEX 计数 + footer） |
| 信任信号 | 高（RECORDS/0 RECORDS/unlisted） | 最高（声明即规格，语料偏差主动披露） | 高且可审计（0 TRACKERS、真实读数、诚实 404） |
| CTA/分享基建 | 无路由可分享；Connect 最冷 | 沙盒可分享；章节 404 | **全场第一**（全路由 + /?q= + 恢复型空态） |
| 移动端（微信/LinkedIn 假设） | 好（390 重排 + 章节指示条） | 最好（mobile home + 移动沙盒） | 好（facets/链堆栈清晰） |
| "用力过猛"检测 | 无 | 无（"edition" 语气稍偏学术） | 轻微（三套语言并行） |
| "没做完"检测 | Connect 死胡同最明显 | "AVAILABLE ON REQUEST" 无入口 | Connect 文案最被动 |

## 5. 排名与理由（招聘者口径）

1. **Team D** — 唯一让我在 60 秒内同时完成"方向提取（FIELDS）、水平判断（可玩沙盒挂回研究问题）、信任建立（诚实声明即规格）"的方案；"NOW ASKING — Q1" 让我记住的是**这个人**而非站点。扣分（无路由 404、Reveal 空洞、单件依赖）都是工程层可速修的，不伤判断本身。
2. **Team H** — 我最愿意转发、深链、复访的站；证据链呈现最贴近工程面试的验证结构；诚实读数让我默认相信它页面上的一切。扣分：连接的最后一步（Contact）最被动，视觉气质对非技术受众稍隔。
3. **Team A** — 我最愿意多看 30 秒的站（以及最好的第一印象 dark 态），FIG.1 是真证据；但作为招聘者我的三个动作（提取字段、验证项目、联系本人）在 A 上都最难完成，首帧空白风险加在最重要的那一屏上。

**进化靶点核验（招聘者视角）**：A 的 portfolio_presentation 由"目录行"变"图版+FIG.1"，确实由负转正；D 打破沉闷（朱批+沙盒页）成功，research 展示保住；H 的 typography/visual_quality 在截图中肉眼可见地由负转正，且 originality 未折损。三案的 sample 标记、空态礼仪、demo 诚实声明均合格，无一处"伪造进度"红旗。

## 6. 评分（14 维，招聘者视角）

| 维度 | A | D | H |
|---|---|---|---|
| visual_quality | 8.5 | 7.5 | 7.5 |
| originality | 7.5 | 8.0 | 9.0 |
| typography | 9.0 | 8.5 | 8.5 |
| information_hierarchy | 8.5 | 8.0 | 8.5 |
| ux | 7.5 | 7.0 | 8.5 |
| mobile_experience | 8.0 | 8.5 | 8.0 |
| technical_feasibility | 9.0 | 8.5 | 8.0 |
| long_term_maintainability | 8.5 | 8.5 | 8.0 |
| research_presentation | 8.0 | 9.0 | 8.5 |
| portfolio_presentation | 8.0 | 7.5 | 8.0 |
| light_mode | 8.0 | 7.5 | 7.5 |
| dark_mode | 9.0 | 8.5 | 8.5 |
| performance | 8.0 | 7.5 | 7.5 |
| accessibility | 8.5 | 8.5 | 9.0 |
| **原始均分** | **8.36** | **8.04** | **8.18** |

> 说明：分数只代表招聘者视角的判断——我按"能否在 30–60 秒内完成评估并形成行动"为锚。D 的 ux 7.0 主要扣在深链 404 与整页空洞（分享/打印场景的真实失败）；A 的 ux 7.5 扣在提取路径与 Connect 死胡同；H 的 ux 8.5 是三案中唯一"每一步都有下一步"的。A 的 visual/typography 高分是真实优势，但在我的权重里它们只是让评估更愉快的乘数，不是决定项。
