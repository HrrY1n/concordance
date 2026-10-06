# Judge 04 · Frontend Engineering — Round 3 Final Review

评审对象：`generation_03/`（CONCORDANCE，唯一 Gen 3 站点）
评审日期：2026-10-06
证据基线：本文件所有结论均来自本轮实际复跑 / 源码逐行 / dist 产物审计，DESIGN_NOTES §4 自查表逐项抽查验证（含负向验证）。

---

## 0. 三关复跑（真实输出）

| 关 | 命令 | 结果 | 耗时 |
|---|---|---|---|
| build | `npm run build`（tsc --noEmit && vite build） | **0 错误**，63 modules，**16 chunks** | vite 557ms，全链 ~5.3s |
| lint | `npm run lint`（eslint . --max-warnings 0） | **0 error / 0 warning** | 9.1s |
| test | `npm run test`（vitest run） | **5 文件 67 用例全过** | 680ms |

首屏 JS（gzip，来自 build 输出）：`index 77.29 + seo(vendor) 23.94 + rolldown-runtime 0.36 = **101.6KB**`（+CSS 7.96KB ≈ 109.6KB）——**≤140KB 预算达成，余量 ~27%**。自查表申报的 109KB 与实测一致。

冒烟（vite preview，本轮自测）：`/ /research /work /lab /lab/corruption-sandbox /notes /notes/n1 /notes/n2 /notes/n3 /publications /about /connect /nonexistent` 全部 200，字体/favicon/sitemap 200。
注意：本机 4173 端口上残留着一个 generation_02 Monograph 的旧 preview 进程（PID 5424），初测时曾误采——换端口后以 gen3 dist 的 `<title>Concordance — Research Archive</title>` 确认数据有效。评审其他同人在共享机器上跑服务时应警惕同类串扰。

## 1. dist 产物审计

- **chunk 映射真实**：App.tsx:14-24 HomePage eager + 10 个 lazy 路由；build 产物中 10 个页面 chunk 各自独立（0.66–2.57KB gzip），共享 vendor 落在 `seo-iLKEvxz8.js`（23.94KB，命名取自共享模块，实为 react-dom/router 所在 chunk，首屏 modulepreload）。路由级代码分割**不是纸面落实**。
- **字体**：`public/fonts/` 6 文件与 dist 完全一致；`index.css:36-95` 6 条 @font-face 一一对应（Inter latin/latin-ext normal、Newsreader latin/latin-ext × normal/italic），unicode-range 正确分层，`font-display: swap`。2 族、变量轴、latin+latin-ext 子集——H2 的"≤2 族"达成，"≤4 字重"以变量轴方式达成为 400/500/470（mono 系统栈）。`scripts/sync-fonts.mjs` 从 @fontsource 包拷贝，脚本有防 hoisting 上溯逻辑，注释清楚。
- **sitemap.xml**：12 条 URL 与路由表一致（含 /lab/corruption-sandbox 与 3 篇 notes 深链）；**但 notes 条目是手写的**——加一篇 n4 需要人肉记得改 sitemap（见 §4）。
- **robots.txt**：`Allow: /` + Sitemap 指向，正确。域名 `https://example.com` 为统一占位（与 canonical/site.url 一致，诚实不编造）。
- **favicon.svg**：内嵌 `prefers-color-scheme` 双主题自适应，正确。
- **index.html**：OG/Twitter/theme-color×2/JSON-LD Person（name 为 null 故不声明姓名字段——内容红线合规）；noscript 静态骨架完整（§ 列表 + 诚实声明）；首帧前主题解析 + `data-settled`（无 FOUC、回访无入场竞态）。
- **缺口**：全站无 `og:image` meta——`public/og.svg` 存在但 head 里根本没有引用它（DESIGN_NOTES §6.1 只承认"svg 需换 PNG"，没承认连引用都缺失）。

## 2. 验收清单复核（§4，抽查 + 负向验证）

| 项 | 结论 | 证据 / 反证 |
|---|---|---|
| G1 默认可见 | ✅ | `index.css:598-616` settle 仅 transform、注释明确 no opacity:0；`html[data-settled]` 首帧前关停；print 全套（703-745）；noscript 骨架 |
| G2 对比度 | ✅（token 层） | contrast.test.ts 双主题×5 token×3 底色全矩阵实测 ≥4.5:1，且反向断言 faint 必须 <4.5。**但 usage 层失守两处**（见 §3-T5b） |
| G3 触控/safe-area | ✅ | `index.css` coarse pointer 全局 44px；u-btn/u-chip 44；Header/MobileMenu/Footer/wrap safe-area 全套 |
| G4 深链/404 | ✅ | 13 路由 preview 全 200 + NotFoundPage 客户端兜底（`*` 路由 + NotePage slug 兜底双保险） |
| G5 三态主题 | ⚠️ | 持久化/无 FOUC/470 补偿/:lang(zh) 全部真实；**但状态管理有真 bug**（§3-T2） |
| G6 图表双主题 | ✅ | 无位图；全 token 化；favicon 双主题；print 重映射 |
| A1 防御后重排 | ✅ | `bm25.ts:73-87` 乘 factor 后统一 sort（读源码确认，非仅靠测试）；RankList 条宽归一到防御后 top-1 |
| A2 低对比清查 | ⚠️ | 诚实读数行多数 `text-ink-2`；**残留 2 处内容性 text-faint**（§3-T5b） |
| A3 依赖一致 | ⚠️ | 无死依赖、无未用 import（逐包核对）；但 `@fontsource-variable/*` 放在 `dependencies` 而运行时零 import——它们只是 sync-fonts 的拷贝源，语义上应为 devDependencies |
| D1 边注 | ✅ | `Sidenote.tsx` 三段降级（grid 行 / inline aside / details），网格定位结构性杜绝叠印 |
| D2 sandbox 全套 | ✅ | ▲▼ delta、aria-live 分场景文案（configKey 派生模式）、0.02 下限、overflow clamp 全部在源码核实 |
| D3 编译期防呆 | ✅ **真实** | **负向验证**：临时构造 `relatedDemo: "corruption-sandboxx"` 与 `topic: "graph-neural-networks"`，tsc 均拒绝（TS2820 带纠错建议、TS2322），删临时文件后恢复干净。7 个 content 文件全部 `satisfies`，`Record<ProjectId, EvidenceChain>` 漏写即编译错 |
| H1 声明行迁出 faint | ✅（大部分） | sandbox/palette footer 均 ink-2/ink；残留见 T5b |
| H2 分割+字体预算 | ✅ | 101.6KB gzip ≤140KB；2 族 6 文件 |
| H3 palette combobox | ✅ | `SearchPalette.tsx:144-147` role/aria-expanded/controls/activedescendant 全套，↑↓/Enter/Esc，`?q=` 深链预填 |
| M1 第二次变奏 | ❌ **机制半虚** | 见 §3-T3：PageShell register prop 是死代码，CSS 头注承诺的 `.r-*` 类不存在 |
| M2 FIG 全站语法 | ✅ | Figure 组件 + FIG.01/02/R1/W1/N1 全部浏览器内实算（读源码逐一核对） |
| M3 facet=检索入口 | ✅ | openSearch(short) 三处接线（hero chips / work tags / research adjoins），palette 支持程序化预填 |
| M4 无自伤标签 | ✅ | 无 SAMPLE ENTRIES 面贴；sample 只在数据层；colophon 单一声明 |
| M5 Connect 行动导向 | ✅ | "Fastest signal right now" + 显式 mailto 槽 + 5 个诚实隐藏槽 |

21 项中 **18 真、2 部分失守（G5 状态管理 / A2-H1 两处 faint）、1 机制半虚（M1）**。

## 3. 主要发现（按严重度）

### T1（高·动效正确性）FLIP 清理时机会把 280ms 重排动画在 ~1-2 帧内掐断
`src/lib/flip.ts:50` —— `requestAnimationFrame(() => requestAnimationFrame(cleanup))` 使 cleanup 在过渡开始后 ~16-32ms 执行；cleanup 将 `el.style.transition = ""`。按 CSS Transitions 规范（Chrome/FF 均如此实现），**移除 transition 属性会取消运行中的过渡**，属性直接跳到终值。也就是说 sandbox 行重排的 280ms 滑动实际只播 ~1-2 帧就瞬移完成——"watch the ranking rewrite itself" 这个旗舰卖点在真机上基本不可见。静态截图与 console 检查均捕获不到此类缺陷，解释了为何前轮视觉 QA 未发现。
*方法学声明：本轮 subagent 环境无浏览器可用，此结论为 CSS 规范推演（高置信）而非浏览器实证；修复后用 devtools 或录屏 30 秒即可复核。*
**修法**：`el.addEventListener("transitionend", cleanup, { once: true })`（配 300ms 兜底 setTimeout），或干脆不清 inline 样式（下次运行会覆盖）。

### T2（高·状态管理）`useTheme()` 被 4 个组件各自实例化，主题状态四源不同步
`App.tsx:61`、`Header.tsx:25`、`MobileMenu.tsx:19`（ThemeRadiogroup）+ `MobileMenu.tsx:173`（复用 Header 的 ThemeToggle）——各自 `useState(readStoredChoice(localStorage))`，无任何同步。已核实的症状链：
1. **同屏失步**：MobileMenu 里用 radiogroup 选 "Dark"，上方 compact ThemeToggle（自己的实例）仍显示旧 choice；经 palette（Shell 的 cycle）切换后 Header 按钮的可见文本 `Header.tsx:34` 渲染 `{choice}` 及 aria-label 同样陈旧——对 AT 用户是事实性错误读数。
2. **静默回滚**：Shell 实例的 `systemDark` 监听（`theme.ts:54-59`）在 OS 主题变化时用**它自己的陈旧 resolved** 重写 DOM——用户在 Header 明确选过的 dark 会被 revert（localStorage 已写 dark，刷新后行为又不同）。
这正是 React 文档警告的 duplicated-state 反模式，lint 无法捕获。**修法**：Shell 持有唯一 useTheme，经 context 下发（仓库内已有 PaletteProvider 同款模式，10 行改动）。

### T3（高·死代码 + 自查表失实）M1 register 机制一半是 vaporware
- `structure.tsx:94`：`` `${register === "plate" ? "" : ""}` `` ——**两个分支同为空串**，PageShell 的 register prop 是彻底的死代码。而 ConnectPage:37(plate)、AboutPage:29(essay)、NotesPage:66(essay)、WorkPage:100(plate) 都在传。
- `index.css:8-16` 头注承诺 `.r-ledger/.r-plate/.r-essay` 三个类——**全样式表与全部 TSX 中不存在**（grep 证实）。
- DESIGN_NOTES §1.3 引用 `AboutPage.tsx:29 / NotesPage.tsx:66 / WorkPage.tsx:100` 作为"整页 ESSAY/PLATE"证据——**引用的是不产生任何效果的代码**。实际 shipped 的 register 系统只有：Section 的 REGISTER_PAD 垂直 padding 三档 + 一个从未被 CSS 消费的 `data-register` 属性。
这正是"纸面落实"的样本：截图上 Section 段落的节奏差异是真的（Home 六段），但页面级变奏与三档排印质感（mono-first/display-serif/66ch measure 的系统性差异）主要靠各页面手工类名堆出来，而非注册表驱动。Meta Designer 打磨前应先决定：要么补全机制（PageShell 消费 register + data-register CSS 钩子），要么删 prop 删注释改文档。

### T4（中·维护性）"counted, never hand-written" 教义被自己的文案违反
站点教义（sections.ts 头注、HomePage.tsx:125"never hand-written"）要求读数从数据计算，但：
- `HomePage.tsx:40` "clean corpus — **7 documents**" 硬编码（sandboxCorpus 清洗后数量变了就说谎；旁边 RankList 是实算的）；
- `sections.ts:47` "3 DEMOS · 0MS NETWORK" 与 `sections.ts:94` corpusReading 的 "LAB 3 DEMOS" 硬编码（其余全为 `${...length}`）——**加第 4 个 demo（brief 明示的两年后场景）这两处必说谎**，且 DEMO_REGISTRY.length 现成可用；
- `HomePage.tsx:291,296` "Three offline instruments / L-01…L-03" 手写清单（可由 DEMO_REGISTRY 生成）；WorkPage FIG.W1 method 里 "full 8-doc corpus" 同类；
- `sitemap.xml` 三条 /notes/n1-n3 手写——加笔记需人肉同步。
单处都小，但它们集中在"诚实读数"这个站点核心卖点上，属于自我打脸型隐患。

### T5（低·杂项）
a. `LabPage.tsx:29-34`：`<section id={anchor} aria-labelledby={anchor}>` 与内部 `<h2 id={anchor}>` **共享同一 id**——DOM 重复 id（invalid HTML），aria-labelledby 按树序解析到第一个（section 容器自身），AT 可能读出整节文本作为可访问名。
b. **内容性 text-faint 两处**：`ConnectPage.tsx:84`（"+ 5 slots … hidden until configured"）与 `PublicationsPage.tsx:28`（"RESERVED — this line auto-numbers…"）——都承载语义，却用 3.5:1 的 faint。违反站点自己的 G2/H1 契约（faint=decorative-only）。contrast.test.ts 守卫 token 不守卫 usage，所以测不出。
c. `package.json`：`@fontsource-variable/inter|newsreader` 在 `dependencies`，运行时零 import（仅 sync-fonts.mjs 拷贝源）→ 应为 devDependencies。
d. 全站无 og:image 引用（§1）。
e. `sections.ts` 各页 `sectionByRoute(...)!` / `sections.find(...)!` 非空断言——静态安全但属脆弱模式，Registry 化更稳。

## 4. 两年后维护演练（brief 指定思考题）

- **加一篇论文**：publications.ts 追加 → 页面/计数/palette 全自动；成本极低。✅
- **加一篇笔记**：notes.ts 追加 + **手改 sitemap.xml**；NotePage/Sidenote/契约测试自动。成本中（sitemap 是唯一坑）。
- **加第 4 个 lab demo**：DEMO_IDS + DEMO_REGISTRY（Record 强制补全 meta，编译期防呆到位）→ palette/索引自动；但 T4 列的 3 处 "3 DEMOS/Three instruments" 文案要人肉找（无测试守卫）。成本中。
- **换研究方向**：TOPIC_IDS 改动会波及 research.ts 的 satisfies 检查（编译器兜底）+ STATUS_LEGEND 与 topic 无耦合。成本低。
- **换 typescript-eslint**：TS 5.9.3 嵌套 + ts-api-utils@2.4.0 精确钉住的**风险已被正确文档化**（DESIGN_NOTES §2 + §6.5：peer `<6.1.0`、根 workspace TS 7.0.2 是 Go tsc、升级时复核 pin）——本轮实测嵌套真实存在（gen3/node_modules 下 ts 5.9.3、ts-api-utils 2.4.0）。决策合理、文档到位，属于可接受的技术债。
- **总评**：content 契约与测试让"加内容"基本安全；风险集中在**散落的手写计数与文案**和 sitemap，是纯维护性失分点。

## 5. 测试质量（67 用例逐文件读毕）

- **bm25.test.ts（10）**：真数学——防御语义断言到 `score ≈ raw×0.1`（10 位小数）；tf·idf 与 BM25 的分歧用构造语料精确断言两端 top-1。✅
- **sandbox-acceptance.test.ts（5）**：CONTENT_PACK 验收门进测试套（注入 d8=#1、防御后出 top-3、落下半区、clean top-1 合理性）。✅ 这是"改语料必跑测试调语料"的正确姿势。
- **content-contract.test.ts（13）**：sample 贯穿、null 诚实、空 publications、白名单复核、证据链、sidenote 编号唯一、palette 路由合法性、空 query 菜单行为。✅
- **theme.test.ts（6）**：resolveTheme/index.html 内联脚本同源决策、循环闭包、存储异常降级。纯函数层——hook 本身（正是 T2 的病灶）无测试，node 环境下可理解，但 T2 恰说明集成层缺一盏灯。
- **contrast.test.ts（33）**：解析 index.css 源文件做全矩阵计算。**健壮性评估**：括号配平的块提取 + `^:root {`/`^\.dark {` 行首锚定防后续覆写污染，设计到位；关键的是"token 存在性"断言兜住了正则只认 6 位 hex 的盲区（改成 oklch 会先报 missing 而非静默通过）。未覆盖 --code-bg 底色矩阵与 prefers-contrast 覆写层（后者是提值方向，风险低）。**判定：这是全仓库最有工程价值的一个测试文件**，弱点在测 token 不测 usage（T5b 因此漏网）。

## 6. 14 维评分

| 维度 | 分 | 一句话依据 |
|---|---|---|
| visual_quality | 8.0 | 工程视角：系统自洽、截图渲染无误；视觉判断以视觉评委为准 |
| originality | 8.5 | concordance 概念 + 全站实算 FIG 语法在实现层是真的 |
| typography | 8.5 | 一条 1.25 字阶、变量轴 470 暗色补偿、:lang(zh) 三禁、mono 语义分层 |
| information_hierarchy | 8.0 | 坐标系统 + FIG 编号真；M1 register 机制半虚拖了后腿（T3） |
| ux | 8.0 | palette/键盘/44px/`?` 帮助层全；主题控件失步直接可见（T2） |
| mobile_experience | 8.5 | coarse 全局 44px、safe-area 四向、MobileMenu 真重设计 |
| technical_feasibility | 8.0 | 三关干净、契约真实；FLIP 动效失效与主题四源是实打实的实现 bug |
| long_term_maintainability | 7.0 | 契约+测试优秀；手写计数、死代码、自查表失实、sitemap 手维护拉低 |
| research_presentation | 8.5 | ledger/sandbox/证据链/回链在数据层全部可验证 |
| portfolio_presentation | 8.0 | 空态/诚实声明工程化到位（内容红线合规：name/links 全 null） |
| light_mode | 9.0 | token 矩阵实测 + print 重映射 + selection 独立 |
| dark_mode | 9.0 | 重调非反色、halation 470、全 token 同构 |
| performance | 9.0 | 101.6KB gzip 首屏、10 chunk 真分割、transform-only、passive、memo 全套 |
| accessibility | 8.5 | combobox/trap/aria-live/skip 全套；LabPage 重复 id + 控件失步是仅有的污点 |

## 7. 结论

**PASS** —— 有条件进入 Meta Designer 打磨。三关全绿、性能预算达成、D3 契约经负向验证为真、无内容红线问题；但 T1（FLIP 动画被掐断）与 T2（主题四源失步）是两处**功能级**缺陷而非打磨项，T3 的死代码+vaporware 文档必须在 Meta 阶段清理，否则"排印精确"的人设会被工程真相反噬。

**如果只能改一处**：修 `flip.ts:44-52` 的清理时机（transitionend + 兜底，约 4 行）。旗舰 demo 的"看着排名重写自己"是整站论点的现场证明，现在它在真机上几乎不可见——这比任何重构都更直接地修复"站点承诺了但没兑现"的部分。
