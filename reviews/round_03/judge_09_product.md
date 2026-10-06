# Round 3 终审 — Judge 09 · Product Designer（产品设计师）

> 评审对象：Generation 3 唯一站点 **CONCORDANCE**（`generation_03/`，预览 http://localhost:4183/ 实测 4 路由全 200，含 `/notes/n99` 的 SPA 回退+客户端 404）。
> 我的权重维度：**long_term_maintainability / technical_feasibility**。纪律：工程评委（J04）与 UX 评委（J03）已报的死代码/硬编码单点不重复展开——我补的是**设计系统层面的系统性视角**：这套站点作为"产品"两年后怎么加东西、哪里先崩、哪些声明是纸面的。

## 0. 证据

- 源码全读：`generation_03/src/`（styles/index.css 749 行、lib/* 9 文件、components/ 7 文件、pages/ 11 文件、demos/ 3 文件、content/ 11 文件）、`index.html`、`public/sitemap.xml`、`robots.txt`。
- 截图：`shots/gen3/concordance.concordance.{home.desktop.light.full, home.desktop.dark.full, connect.desktop.light, notesn1.desktop.light, home.mobile.light}.png`。
- 自查表：`generation_03/DESIGN_NOTES.md` §4 —— 做 33 项引用机械化核验（见 §5）。
- 实测：preview 服务器路由状态码；全站 grep（hex/任意值/z-index/faint/token 死活/44px 计数）。

## 1. Token 体系终审：色彩层接近满分，结构层缺三个层级

### 1.1 色彩层（优秀，全站最强项）
- **零一次性颜色**：`src/*.tsx` 无一处裸 hex、无一个 `[#...]` Tailwind 任意色值（grep 证据）。全部 16 个语义 token（`--bg/--bg-inset/--raised/--ink/--ink-2/--faint/--line/--line-strong/--accent/--accent-wash/--signal/--signal-wash/--ok/--selection/--code-bg/--shadow`）双主题同构（index.css:104-141），且 `@theme inline`（155-180）正确桥接 Tailwind。
- **守卫测试是真机制**：`contrast.test.ts:14-58` 直接解析 index.css 做 WCAG 实算，双向断言（可读 token ≥4.5:1、faint 必须 <4.5:1 防误用）。样式与测试物理上不可能漂移——这是我在三代评审里见过的最好的"设计决策防呆"。
- 但发现 **1 个死 token**：`--signal-wash`（index.css:116,136 定义 + :167 映射）全站 **0 次使用**（grep 全 src 仅 3 处定义/映射自身）。signal 状态的实际视觉落点走的是 `rank-fill[data-poisoned]` 与 `border-l-signal`。死 token 是色彩契约的噪点：下一个维护者会以为"wash 系统是活的"。
- **faint 违反自家契约两处**（J05 可能报对比度数字，我报的是**契约位置**）：
  - `ConnectPage.tsx:84`："+ 5 SLOTS — GITHUB · SCHOLAR · ORCID · LINKEDIN · RSS — HIDDEN UNTIL CONFIGURED" 是**信息性行**（告诉用户哪些通道未配置），用 `text-faint`（3.5:1）、无 aria-hidden——违反 index.css:26-29 头注 "decorative-only: never the sole carrier of meaning"。
  - `PublicationsPage.tsx:28`：ghost row 的 "RESERVED — this line auto-numbers…" 同类（[01] 序号有 aria-hidden，说明文本没有）。
  - 更深一层：`contrast.test.ts:86-89` 把 "faint < 4.5:1" 锁成不变量，等于**用测试把这两处文本永远钉在 AA 失败**——契约、测试、用例三者互相咬合，单独改颜色或单独改测试都过不去。修复必须三处联动（要么这两行升 `text-ink-2`，要么在契约里给"ghost row"开一个例外 token）。

### 1.2 结构层（缺三个体系，均为可控缺口）
| 层级 | 现状 | 证据 |
|---|---|---|
| spacing scale | **外包给 Tailwind 默认刻度**（py-14/16/20/24/28、gap-2.5 等）+ 组件内 padding 值（10px 16px、14px 18px、5px py-4） | 可接受但不成文：CSS 里没有任何"节奏来自哪里"的说明，`REGISTER_PAD`（structure.tsx:14-18）是唯一显式 spacing 决策 |
| z-index scale | 无体系：`z-40`（Header.tsx:93）、`z-50`（SearchPalette.tsx:122,237、MobileMenu.tsx:110）、`z-index: 100`（index.css:399 skip-link） | 仅 3 层、无冲突，但层级关系只活在人脑里 |
| radius scale | **"全直角"是一个真实的设计决策但从未被写成决策**：唯一例外 `.dot` 的 999px（index.css:479）与 range thumb 的显式 0（index.css:657,664） | 换人维护时无法分辨"直角是决定"还是"没想起来" |
| shadow | `--shadow` 双主题定义（index.css:120,140）但**全站仅 1 处使用**（SearchPalette.tsx:137 的 `shadow-[0_24px_80px_-24px_var(--shadow)]`，连偏移量都是 ad-hoc） | 单点 token 比没有 token 更误导 |

### 1.3 视觉侧 magic number 扫描
- **字号离阶**：文档字阶（index.css:253-257 头注 + DESIGN_NOTES §1.2）是 12/15/17/19/21/22/26/32px；但 `.essay h2` 用 **24px/32px**（index.css:551-552，不在阶上）、`kbd` 与 `.sn-num` 用 **11px**（index.css:241,559，低于阶底）。三处脱队值都是"就近手取"的痕迹。
- **measure 家族失控**：`.u-measure 66ch / .u-measure-sm 54ch` 是体系内的，但图版宽度全是 ad-hoc 任意值：`max-w-[640px]`（HomePage.tsx:88、SearchPalette.tsx:128）、`[560px]`（WorkPage.tsx:53、ResearchPage.tsx:44）、`[620px]`（NotesPage.tsx:35）、`[540px]`（SearchPalette.tsx:243）、`[320px]`/`[220px]`（ContextBudget.tsx:119、NotesPage.tsx:40）、`[1100px]`（NotePage.tsx:63）——9 个一次性宽度，无 `--measure-*` 或 `.u-figure` 抽象。FIG 语法声称"全站语法"（M2），但它的容器宽度没有语法。
- 行高 44/48/56/60px 四种行高并存（44 系统性的，22 处 min-h-[44px]；48/56/60 逐处手取）——44 有体系，其余是自由发挥。
- 干净面：动效时长只有 160/240/280/320/480ms 五档 + `--ease-settle` 单一缓动，纪律良好。

## 2. 组件目录与复用终审

### 2.1 真复用（值得表扬）
`RankRow/RankList`（全站所有条形图唯一的渲染路径）、`Figure`（6 处 FIG 语法）、`SidenoteRow`（三段降级）、`ThemeRadiogroup`（MobileMenu+colophon）、`XRef`、`useFlipList`、`useDocumentMeta`。RankList 把 A1/D2 的 0.02 下限与 clamp 收进一个组件（`RANK_FLOOR` 导出复用），是"机制而非约定"的正确示范。

### 2.2 伪复用 / prop 分叉
- **PageShell 的 `register` prop**：`structure.tsx:94` `${register === "plate" ? "" : ""}` 是字面空操作。7 个页面认真传参（ConnectPage:37 plate、AboutPage:29 essay、NotesPage:66 essay、WorkPage:100 plate、Lab/Research/Publications 默认 ledger），**全部无效**。J03 已报死代码本身；我补的是：这暴露了 API 设计问题——一个"看起来能配置质感"的 prop 比没有 prop 更糟，因为它让页面作者**以为**自己声明了节奏。
- **`Section` 的 register**：只兑现为 3 档 padding（`REGISTER_PAD`）+ `data-register` 属性（structure.tsx:68）——后者**无任何 CSS/JS 消费者**（全站 grep 仅此一处输出）。
- WorkPage.tsx:137 的 tag 链接是第三种链接样式（ad-hoc underline 组合，与 `.u-link`/`.u-chip` 并存）——链接语法有 1.5 个体系。
- WorkPage.tsx:186 `p.id === "poison-sandbox"` 的 FIG.W1 特判：内容 id 泄漏进组件逻辑，加第 5 个 plate 带图时需要再开一个 if。小站可接受，但它应该走 `demoRef` 式的数据字段（如 `figure?: FigureId`）。

### 2.3 缺失的抽象：EmptyState
全站有**四个**手工空态，质量都在线但彼此无共享语法：
1. Publications ghost row（虚线 + faint + 预留编号）；
2. Connect "+5 slots"（虚线 + faint 槽位表）；
3. Palette 无结果（"no documents matched" + suggestions，SearchPalette.tsx:178-186）；
4. About 的 name/location null 降级（"unlisted by choice of placeholder"，AboutPage.tsx:40-44）。
四者的共同结构是"**占位记号 + 一句为什么 + 一句怎么变成真的**"，却没有 `EmptyState`/`GhostRow` 抽象。后果：PublicationsPage.tsx:34 的 "auto-numbers when publications.ts grows" 是**承诺**——但那个 `<ol>` 里没有自动编号逻辑，第一条真论文来了之后这条 ghost row 要靠人删。空态是这个站的品牌资产（D 的幽灵槽位被吸收为卖点），值得一个真组件。

## 3. Register 系统：从"约定"到"机制"的最小方案（我的核心评估）

### 3.1 现状判定：约 15% 机制 + 85% 约定
| 声明 | 实际 |
|---|---|
| CSS 头注（index.css:8-16）宣称三个 register 类 `.r-ledger/.r-plate/.r-essay` | **这三个类不存在**（全站 grep 仅头注自身）——文档与实现的直接漂移面 |
| `register` prop（structure.tsx:12-18） | `Section` = 3 档 padding；`PageShell` = 空操作 |
| `data-register` 属性 | 零消费者 |
| 视觉上的"第二变奏"（J01/J02 确认 hero/work/notes 质感差异真实存在） | **全部来自页面作者手工 class 组合**（t-display vs t-entry、u-measure、.essay）——即 M1 的兑现是"每页按约定手写"，不是"系统强制" |

结论：M1 在**结果层**基本兑现（截图证实任何相邻段质感不同），在**机制层**未兑现。这就是"约定 vs 机制"的教科书案例——约定能产出这一版，是因为一个人盯着；换作者、加页面时不保证。

### 3.2 最小机制化方案（约 60 行改动，不动任何页面视觉）
1. **让 CSS 兑现头注**：定义 `[data-register]`（或兑现 `.r-*`）三组规则——目前差异项只有三件：垂直节奏（现 REGISTER_PAD 的 padding）、内容 measure 默认值（plate → 子元素默认 t-lede/max-w、essay → 66ch + .essay 行高）、hairline 密度（ledger 段落间默认 border-t）。把这三件从"页面手写"上收为 register 默认，`Section` 现有 DOM 不变。
2. **PageShell 修复或阉割**：要么同一套 `[data-register]` 落到 PageShell（一行 `data-register={register}` 替换 :94 的空操作三目），要么删掉该 prop 与 7 个页面的传参——二选一，不留"假旋钮"。
3. **护栏测试**：在 vitest 里断言 Home 相邻 section 的 `data-register` 互不相同（把 DESIGN_NOTES §1.3 的"任何相邻段不同档"从散文变断言）——这是 M1 的验收条件，现在没有任何东西守住它。
4. （可选）`Figure` 容器宽度收编为 register 内的 `--measure-figure` token，顺带清掉 §1.3 的 9 个 ad-hoc 宽度。

### 3.3 收益 / 成本
收益：加第 4 个页面/第 4 段时节奏自动正确（不用重读 DESIGN_NOTES 学约定）；CSS 头注从"愿望"变"事实"；M1 获得可测试的验收；删掉一处必然被下一个维护者困惑的空操作。成本：~60 行 CSS + 1 行 TSX + 1 个测试，零视觉回归风险（若按"现状即目标"落规则）。**投入产出比是本报告所有建议里最高的。**

## 4. ×10 演练终版：20 项目 / 30 笔记 / 10 demo 时，先崩次序

1. **先崩 · `sections.ts` 的"诚实读数"自噬**（系统性，工程评委未覆盖此角度）：文件头注（:1-6）写明 "counts derived from the content modules (honest readings — **never hand-written**)"，但 lab 行 reading 是手写字符串 `"3 DEMOS · 0MS NETWORK"`（:47），colophon `corpusReading()` 手写 `LAB 3 DEMOS`（:94）。加 demo #4 时 `DEMO_REGISTRY`/palette/内容契约测试全自动跟上，而这 2 处 + `lab.ts:115` "Three instruments" + `LabPage.tsx:18` SEO 描述 + `HomePage.tsx:291,296` + `index.html:87` noscript 共 **7 处用户可见文案**静默变谎言。**"诚实"是本站的品牌承诺，读数系统是承诺的载体，载体自身有 7 个手写洞**——同类问题还有 `HomePage.tsx:40` FIG.01 图题 "clean corpus — 7 documents" 硬编码（:28 明明已算出该值）。修法：sections.ts 里 lab reading 改 `Object.keys(DEMO_REGISTRY).length`，HomePage 图题改模板——20 分钟的活。
2. **再崩 · sitemap.xml 手工同步**：n1/n2/n3 硬编码在 `public/sitemap.xml`，与 `notes.ts` 无测试/脚本联动（content-contract.test.ts 不查它）。加第 4 篇笔记 = 双文件编辑 + 一次静默 SEO 失败。同理 `og.svg`（DESIGN_NOTES 自己承认）与 `index.html` JSON-LD knowsAbout 六项（TOPIC_IDS 加项时不会跟着走，好在那是内容决策不是计数）。
3. **三崩 · palette 截断无信号**：`queryRecords` `slice(0, 8)`（search.ts:150,168）。空 query 时 pages(8)+actions(2)=10 条已被截到 8（"Back to top" 现在就已被静默吞掉，实为现行 bug 而非未来风险）；30 篇笔记下任何热门词命中 20+ 条时只显示 8 且无 "showing 8 of 23"。footer 的 "N records" 是索引大小不是结果数——诚实读数体系在这里恰好缺席。
4. **四崩 · §00–§07 编号与导航**：比预想稳健——Header/MobileMenu/Footer/404/palette 全部从 `sections[]` 单源渲染，加 §08 是**纯数据改动**（好设计）；但 palette 的坐标加权（`coord === q +80`）与 index 里 demo 全部并到 "§03"（search.ts:107）意味着 demo 扩容后坐标失去区分度。编号本身两位数够用（§08-§09 后需要决定 §10 的排序字符串问题——`padStart` 已就位，风险低）。
5. **五崩 · Work/Research 页的 map+特判模式**：WorkPage FIG.W1 特判、ResearchPage adjoins 的 `find(...)!` 非空断言——20 项目时每个 plate 的"有没有图"逻辑会长成 if 树。
6. **最稳 · Lab 之外的引擎层**：bm25/flip/theme/contrast 全是纯函数+守卫测试，20× 内容不触礁。

## 5. DESIGN_NOTES 自查表可信度：抽查统计

**33 项 file:line 引用机械化核验**（sed 逐行比对声明内容）：
- **精确命中 20/33**（含 :lang(zh)、470 补偿、coarse pointer、safe-area ×4、combobox 语义、build date、colophonHonesty 等）。
- **块起始/范围引用 ~9/33**（如 `index.css:430,455` 指向 `.u-btn/.u-chip` 块首而非 min-height 行、`bm25.ts:73-90` 覆盖实际 81-83 的防御逻辑、`HomePage.tsx:170-262` 范围包含 chips）——可接受引用风格，不算失实。
- **行漂移 ±3-6 行 4/33**（index.css:600→606、139→144、377→378、SearchPalette:151→157）——疑为成文后微调未回填。
- **显著漂移 1/33**：`index.css:55-98`（token 注释段）实际 token 块在 **101-141**，偏了 46 行。
- **幻觉引用 0/33**。

**真正的"纸面落实"不在引用行号，而在三处"落实但弱于声明"**：① register 系统（§3，头注宣称的类不存在、PageShell 空操作）；② `data-register` 无消费者；③ PublicationsPage "auto-numbers" 承诺无实现。其余声明（G1-G6、A1-A3、D1-D3、H1-H3、M3/M4/M5）我逐项核对源码后**确认属实**——这份自查表的可信度显著高于 Round 2 各案，值得在 Meta 阶段保留为维护文档，只需修掉上述三处归因。

## 6. 状态完备性矩阵（每交互组件 hover/focus/active/disabled/empty）

| 组件 | hover | focus | active/pressed | disabled | empty |
|---|---|---|---|---|---|
| u-btn | ✓ 色变 | 全局 :focus-visible 兜底 | ✓ aria-pressed/data-active | **✗ 无 :disabled 规则**（潜在坑；现用例不触发） | n/a |
| u-chip | ✓ | 全局兜底 | n/a（瞬时） | ✗ 无规则 | n/a |
| palette option | ✓ onMouseEnter 同步 active | aria-activedescendant 全套 | ✓ aria-selected+bg-inset | n/a | ✓ 空态+建议词 |
| MobileMenu | ✓ | 关闭钮 44px 自动聚焦 | radiogroup ✓ roving tabindex | n/a | n/a |
| ContextBudget 移动钮 | ✓ | 全局兜底 | n/a | ✓ `disabled:opacity-30` + 44px | n/a |
| range slider | n/a | 全局兜底（原生 track 无 focus 特化，靠 2px accent outline） | ✓ thumb accent | n/a | n/a |
| sidenote 折叠 | n/a | ✓ summary 44px | ✓ 折叠展开 | n/a | n/a |
| Sidenote 三段 | JS 断点切换（68rem/48rem）有 resize 监听（focus.ts:49-57 onChange） | ✓ | ✓ | n/a | n/a |
| 404 | ✓ chip+link | ✓ | n/a | n/a | 它本身就是空态 |

状态面是合格偏优的；唯一系统性缺口是 **`.u-btn/.u-chip` 无 :disabled 样式**——一旦未来 demo 控件需要禁用态（如 L-02 budget=range 端点时禁用 ▲▼，现在用的是裸按钮+手写 opacity），会复用 u-btn 然后发现它没有禁用语义。

## 7. 评分（14 维）

| 维度 | 分 | 一句话依据 |
|---|---|---|
| visual_quality | 8.5 | 截图证实 print discipline + 双主题干净；下半页 register 差异靠内功不靠 surface |
| originality | 9 | Concordance 概念 + 坐标系统 + "书即检索"是可认领签名；register 概念原创但机制未闭合 |
| typography | 9 | 字阶有文档有守卫、470 暗色补偿、:lang(zh) 三禁；扣在 24/32 与 11px 离阶 |
| information_hierarchy | 8.5 | §编号+kicker+honest reading 三层坐标系统有效；palette 截断缺层级信号 |
| ux | 8.5 | combobox/帮助层/404/深链全齐；palette 8 条静默截断（含现行吞掉 action 的小 bug） |
| mobile_experience | 8.5 | 专用 MobileMenu、22 处 44px、safe-area 全套、coarse 全局规则 |
| technical_feasibility | 9 | 我实测路由 200、构建/测试/lint 声明与源码结构一致、依赖零冗余 |
| **long_term_maintainability** | **7.5** | 真机制（token 守卫/内容契约/单源 sections/RankList）与纸面机制（register/data-register/EmptyState/sitemap）对半开；7 处 demo 计数手写 |
| research_presentation | 8.5 | 台账+FIG.R1+验收测试+证据链编译期强制，全站最强语法 |
| portfolio_presentation | 8.5 | PLATE 语法完整、"you are standing in it" 收尾聪明 |
| light_mode | 9 | 暖纸+钴蓝，AA 由测试锁定 |
| dark_mode | 9 | 重调而非反色，halation 补偿 + theme-color ×2 |
| performance | 8.5 | 路由分割 + 6 字体文件 + 零位图；J03 实测 82.5KB 优于声明 |
| accessibility | 8.5 | combobox/trap/aria-live/noscript 全套；两处 faint 信息行违反自家 G2 |

## 8. 如果只能改一处

**把 Register 做成真机制**：在 index.css 兑现头注承诺的三个 register（让 `[data-register]` 被真实规则消费，或删掉 `.r-*` 注释改为如实文档），用一行 `data-register={register}` 替换 `structure.tsx:94` 的空操作三目，并加"Home 相邻段 register 互异"的护栏测试。理由：这一处修复同时兑现 M1 的机制承诺、消除 CSS 头注与实现的漂移面、把"两年后加第 4 页/第 4 demo 时节奏自动正确"从祈祷变成默认——它是所有发现里唯一一个"不修则约定永远靠人肉"的系统性单点。（faint 两行与 demo 计数 7 处都是 20 分钟的机械修，不会被人忘掉；register 不修就会被人忘掉。）
