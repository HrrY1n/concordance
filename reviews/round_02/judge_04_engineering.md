# Round 2 评委报告 — #4 Frontend Engineering Judge（前端工程评委）

评审对象：`generation_02/team_a_monograph` / `team_d_offprint` / `team_h_retrieval`
证据：三案全部源码（逐文件审查关键路径）+ `shots/gen2/` 截图（三案 desktop/mobile × light/dark）+ 控制台报告 + **本机复跑 `npm run build` 与沙盒验收脚本** + **node 实测复现 UI 计算**。

## 0. 构建与依赖实测（一票否决区前置核验）

| 项 | A | D | H |
|---|---|---|---|
| `tsc --noEmit && vite build` | ✅ 669ms 零错误 | ✅ 1.28s 零错误 | ✅ 2.64s 零错误 |
| JS bundle | 385.24 KB / **gzip 121.94** | 430.03 KB / **gzip 135.84** | 439.74 KB / **gzip 138.12** |
| CSS | 37.65 KB / gzip 7.71 | 32.76 KB / gzip 7.24 | 31.67 KB / gzip 6.85 |
| 沙盒验收脚本复跑 | PASS（但见 §1.2：**脚本过、UI 不过**） | PASS 全部门槛 | PASS（排序正确） |
| 截图控制台报告 | `[]` 零错误 | `[]` 零错误 | `[]` 零错误 |
| 依赖审查 | ⚠️ `react-router-dom`、`lucide-react` 声明但**全 src 零 import**（grep 实证，tree-shake 掩盖了它） | ✅ 仅两个字体包，全部用到；无图标库（纯排版实现图标需求） | ⚠️ `lucide-react` 只为 3 个图标（Menu/Search/X），3 个 inline SVG 可省一个依赖 |
| 动效库使用 | motion 用于 Hero settle + Lab layout（合理） | motion 用于 Reveal/nav-underline/layout（**Reveal 是本报告最大缺陷载体**） | motion 用于 Hero intro/palette（合理，`MotionConfig reducedMotion="user"` 双保险） |

**Bundle 385–440KB（gzip 122–138）裁定：可接受，但三家都留了 30–40% 的白送空间。** 具体：
- `motion`（Framer）约占 gzip 35–40KB，而三案的动效预算都只有 ≤3 条 transform/opacity 动画——CSS + IntersectionObserver 两个原语即可全替，这是最大的单项裁剪。
- H 是唯一真正拥有 7 条路由却**零 code splitting** 的方案：`React.lazy` 按路由拆（Lab 页把 BM25 引擎 + 语料 + Context Budget 单独 chunk）是教科书式改进；D 拆 `SandboxPage`（唯一真路由）；A 单页无路由可拆，杠杆在字体——A 的 Newsreader 用了 **opsz 轴**（latin 132KB + italic 147KB），H 同字体用 wght 轴只要 58+64KB，A 白付约 190KB；且三家 fontsource 产物里 12 个 legacy `.woff`（~140KB）在 2026 年的浏览器基线下是纯死重。
- 分割处方（通用）：`manualChunks: { vendor-react: [react, react-dom, react-router-dom], vendor-motion: [motion] }` + H/D 的路由级 `React.lazy` + 字体轴降级与 `.woff` 剔除。做完后 gzip 可压到 ~95–110KB。

**一票否决区结论：三案均不触发否决**（构建全过、运行时零报错、无虚构数据），但 A 在技术正确性上有一处必须记录的实证缺陷（§1.2）。

---

## 1. Team A「Monograph」

### 1.1 做对了什么（工程视角）

1. **BM25 引擎诚实且实现正确**（`src/lib/retrieval.ts`）：标准 Okapi 变体（idf = ln(1 + (N−df+0.5)/(df+0.5))，k1=1.5/b=0.75），crude stemming 在注释里自我声明为 toy，stopwords 表干净。**语料偏差（d2–d7 加自然重叠词、d8 关键词堆叠）有 pack 条款背书并写在 lab.ts 注释里，属于"调语料不调打分器"的合规改法。** 三案中 A 的 corpus 注释是最早主动声明的。
2. **FIG.1 现场计算成本：可忽略，设计正确。** `Work.tsx` 的 PlateFigure 用 `useMemo(() => bm25Rank(query, cleanCorpus), [])`——9 篇文档 × ~25 token，单次 mount 一次性计算，实测量级 <0.1ms，不构成任何性能论点；与 Lab 共享同一引擎（零重复实现），figcaption 声明 "COMPUTED IN YOUR BROWSER · SAME ENGINE AS THE LAB"。**"数据即图像"在工程上完全站得住。**
3. **Re-ink 三级降级是真实现，且 CSS 写得干净**（`src/index.css` L244–269）：L1 `::view-transition-old(root){animation:none}` + new 状态 `clip-path: inset` 自上而下扫描（420ms，避开圆形光圈趋同款）；L2 `html.theming` 窗口内按**属性**分延迟（bg 0ms → text 60ms → lines 180ms，specificity 计算正确压得过 Tailwind 的 `transition-colors`）；L3 JS 侧 reduced-motion 直接跳过两条路径；无 FOUC 由 index.html 内联脚本兜底（三态 + theme-color meta 同步更新）。三级都有代码实证，不是声明。
4. **搜索索引与内容零漂移**（`src/lib/search.ts`）：索引由渲染页面的同一批数组 map 出来，RECORDS 行、Publications 空态计数同理——"加一条数据，索引/读数自动跟上"，这是数据契约里最值钱的性质。

### 1.2 致命发现：旗舰 demo 在 UI 里是坏的（node 实证）

`src/sections/Lab.tsx` 的 `CorruptionSandbox`（L69–85）：defense 因子在 `bm25Rank` **排序之后**用 `.map()` 乘上去，**之后再无 sort**：

```
UI 实测复现（inject ON + defense ON，用 A 的出厂代码逐行复刻）：
  rank 1: d8  score=1.238  bar=scaleX(1.00)
  rank 2: d1  score=2.459  bar=scaleX(1.99)   ← 分数比 rank1 大却排在下面
  rank 3: d3  score=2.034  bar=scaleX(1.64)   ← 且 bar 溢出轨道 ~2 倍宽
  rank 4: d4  score=1.884  bar=scaleX(1.52)
  rank 5: d6  score=1.320  bar=scaleX(1.07)
```

两个连锁 bug：
- **不重排**：DESIGN_NOTES §4 验收句"d8 跌出 top-3、排名第 5"只在 `scripts/verify-sandbox.ts` 里成立（那个脚本第 43 行有 `defended.sort(...)`）——**验收脚本与 UI 代码路径不一致，脚本证明了一个用户看不到的结论**。访客在界面上看到的是：防御开了，投毒文档还挂着第 1 名，只是数字变小了。demo 的整条论证线（"防御把伪造文档压下去"）在 UI 里没有发生。
- **bar 溢出**：`RankRow` 的 `ratio = Math.max(score/max, 0)` 未做 `Math.min(1,·)` 截断，且轨道 div（`h-[3px] w-full bg-line-1`）没有 `overflow-hidden`——defense 后 max 取的是被降级的 d8（1.238），d1 的分数条以 scaleX(1.99) 横穿到分数列。
- 修复成本极低：map 后补一行 `.sort((a,b)=>b.score-a.score)`，RankRow 补 clamp + overflow-hidden。

### 1.3 其他工程扣分

- **死依赖**：`react-router-dom` 与 `lucide-react` 在 package.json 里，src 内零 import（A 是纯单页锚点站）。不影响产物体积但属于依赖卫生失分——README 级别的"依赖即清单"纪律被破坏。
- **setState updater 内做副作用**（`src/hooks/useTheme.ts` L60–84）：`applyTheme`/`startViewTransition`/`localStorage.setItem` 全写进 `setMode(prev => …)` 的 updater。React StrictMode 开发态 updater 双调用会产生嵌套 View Transition；正确形态是在 effect/callback 里做副作用。H 的 `theme.ts` 同病（见 §3.3）。
- **无 `<noscript>`**：A 的 index.html 是三案唯一没有 no-JS 兜底声明的（D 一句话、H 整块静态骨架）。SPA 无 JS 都白屏，但"如实声明"本身就是这三案的身份资产。

### 1.4 如果只能改一处

**给 `CorruptionSandbox` 的 useMemo 末尾补上 defense 后重排序，并给 RankRow 的 ratio 加 `Math.min(1,·)` + 轨道 `overflow-hidden`**——两行修复，让"防御把伪造文档压出 top-3"第一次真正发生在访客眼前；同时让验收脚本与 UI 走同一条代码路径。

---

## 2. Team D「Offprint」

### 2.1 做对了什么

1. **三案中最好的沙盒工程**（`src/lib/bm25.ts` + `pages/SandboxPage.tsx`）：`applyToyDefense` 降权后**重新 sort**（A 的反面）；`maxScore` 取自当前排名实算（bar 永不溢出），0.02 下限保证零分行可见；▲▼ delta 用 ref 存上一态纯数据推导；`aria-live` 播报分场景文案；全部 9 行可见（rank>5 用 opacity 降权而非隐藏）。数值验收 + **`scripts/ssr-smoke.tsx` renderToString 冒烟**——D 是唯一提交了 SSR 级运行时证明的方案。
2. **边注三段降级兑现了 Round 1 的处方**（`chrome.tsx` Noted + index.css）：≥70rem 纯 CSS float（删掉了 JS 测量引擎）、中屏 inline、移动端原生 `<details>` 零 JS 零动画；`useMediaQuery` 保证**每个断点只有一种 DOM**，无双份 DOM 负债。方向完全正确。
3. **对比度纪律是资产**：DESIGN_NOTES 的逐 token 对比表 + `index.css` 每个色 token 注释标注用途与门槛（含 ghost 行 "仅装饰 ≥3:1" 的降级豁免声明）——这是可持续的设计系统实践，不是一次性表演。

### 2.2 实证缺陷 #1：Reveal 的 opacity:0 门控（截图为证）

`chrome.tsx` 的 `Reveal`：`initial={{opacity:0, y:12}} whileInView={{...}} viewport={{once:true, margin:"0px 0px -10% 0px"}}`，全站 section 级套用。后果链**已在提交的截图里发生**：
- `shots/gen2/team_d_offprint/d.d.home.desktop.light.full.png` 与 `...mobile.light.full.png`：首屏以下**大段空白**——全页截图不触发 IntersectionObserver，内容永远停在 opacity:0。A/H 的同位截图内容完整，对比刺眼。
- **打印**：无 `@media print` 覆盖，Chrome 打印长页时折叠区内容大概率空白——对一个自称"offprint（抽印本）"的站点，打印路径失明是语义级讽刺。
- **SEO/渲染器**：内容在 DOM 里（Google 能拿到），但 evergreen renderer 是否滚动触发 IO 不受你控制，且 `margin:-10%` 进一步收窄触发区。
- **LCP**：Hero 的 `type-display` h1 被 `Reveal` 包住（`Hero.tsx` L31–33），LCP 元素从 t=0 不可见，LCP 被推迟到 0.32s 动画完成——H 明确做了相反的事（"标题 t=0 可见，LCP 是真文本"）。

**根治处方**（不牺牲入场感）：内容**默认可见**，门控反转——(a) 最小改法：`Reveal` 只保留 y:12→0 的 transform 入场、去掉 opacity 门（或 initial opacity 从 0.999 起步的等价写法），并补 `@media print { [data-reveal]{opacity:1!important; transform:none!important} }`；(b) 激进改法：`@supports (animation-timeline: view())` 渐进增强做 scroll-driven 入场，不支持的原生静态。核心原则：**内容可见性永远不依赖 JS 是否跑了 IO。**

### 2.3 实证缺陷 #2：边注 float 的叠印根因与根治

已知叠印 bug 的工程根因：`.sn-float { float:right; clear:right; margin-right:-26ch }` 从 `.measure`（max-width:60ch）**负 margin 逃逸**，而逃逸出来的 26ch 带**没有任何结构性预留**——同 section 的 grid 行（`lg:grid-cols-[minmax(0,60ch)_minmax(0,21ch)]`）把活内容（ADJOINS 按钮、年份、chips、§num）放在同一条水平带上，float 撞上就叠印；连续两个 `Noted` 时 `clear:right` 还会让短段落的注漂移到锚点下方很远。

**根治方案（零 JS，三步）**：
1. **结构预留**：prose 容器升级为两列 grid——`.prose-grid { display:grid; grid-template-columns: minmax(0,60ch) minmax(0,21ch); column-gap: 64px }`，注列在版式上**永远存在且为注保留**；
2. **消灭逃逸**：`Noted` 改渲染成同一 grid 行的两个 item（`<p class="col1">` + `<aside class="col2">`，自动放置即同行配对）——注对齐段落顶行。负 margin、clear、漂移、叠印四个问题同时消失，因为"逃逸"这个动作不存在了。代价是放弃字符级锚点对齐（Tufte float 的唯一剩余优势，用行内 `NoteMark` 上标补语义即可）；
3. **兜底**：`.shell { overflow-x: clip }`（1120–1200px 过渡带宽度的横向溢出保险）+ `@media print` 边注转 inline（float 本来就不适配分页）。若坚持保留 float 路径，最低限度也要给 right-rail 有内容的 section 禁用 float 档（数据驱动开关），并把 26ch 逃逸量改为 `min(-26ch, 实际预留带宽)`。

### 2.4 如果只能改一处

**拆掉 Reveal 的 opacity:0 门控（默认可见 + transform-only 入场 + @media print 强制可见）**——一处修复同时救回全页截图、打印、LCP 和"渲染坏掉不可区分"的风险；边注 grid 根治排第二。

---

## 3. Team H「检索系统」

### 3.1 做对了什么

1. **三案中唯一"排序永远正确"的 BM25 路径**（`src/lib/bm25.ts` L73–79）：toy defense 作为 `RankOptions` 进引擎、在最终 `sort` **之前**乘因子——防御后重排是结构保证而非调用方自觉。`scripts/verify-sandbox.mjs` 复跑 PASS（d8 注入后 3.73 第 1 → ×0.1 后 0.37 第 6）。语料调整（d2–d7 自然重叠、d8 堆砌）同样有 pack 条款背书。
2. **Self-Query skip 机制健壮性：全案最稳**（`sections/Hero.tsx`）：回访 localStorage 直通（try/catch 降级为"重播一次"，可接受）；Esc 由 `isOverlayOpen()` 守卫（`body[data-overlay]` 标志位，palette/help/menu 与 hero 的 Esc 所有权不双花）；完成回调挂在**最后一个 facet** 的 `onAnimationComplete`（而非裸 setTimeout，动画暂停不会假完成）；skip 按钮 t=0 可见且用透明占位符**预留槽位零 CLS**；reduced-motion 静态直通且状态行文案同步（"resolved"而非"resolving…"，细节诚实）。唯一边角：`facets.length===0` 时 intro 永不完成——仅当内容编辑改坏 `facetIds` 才触发，建议加一行 fallback。
3. **验证文化最强**：`audit-console.mjs`（7 路由零报错/失败请求）+ `audit-ux.mjs`（skip/深链/reduced-motion/390px 横向滚动探针）+ verify-sandbox 三件套，是无浏览器环境下能做到的近乎完备的自动化证据链——这些脚本本身就是长期维护资产。
4. **字体决策最省**：Newsreader 用 wght 轴而非 opsz 轴（比 A/D 省 ~190KB），`index.html` 的 media 级双 `theme-color`、以及三案唯一"整块静态骨架"的 noscript。

### 3.2 palette combobox 语义裁定

`SearchPalette.tsx`：`input[role=combobox]` + `aria-expanded` + `aria-controls` + `aria-activedescendant` + `listbox`/`option` + `onMouseDown preventDefault` 防焦点抢夺 + Esc 焦点归还——**主体正确，是三案唯一做到 combobox 半步以上的**。两处语义残留：`ul[role=listbox]` 与 `button[role=option]` 之间的 `<li>` **缺 `role="none"`**（ARIA 1.2 要求 option 由 listbox 直接 owned，或中间层 presentation——补 3 个字符即合规）；缺 `aria-autocomplete="list"` 与 Home/End 键（次要）。裁定：合格线之上，一次小修即满分结构。

### 3.3 扣分项

- **最大 bundle + 零分割**：439.74KB/gzip 138 是三案最大，而 H 恰好是唯一有 7 条真路由的方案——没有 `React.lazy` 是最不应该的缺席。Home 全量长滚动（七个 section 全渲染）也放大了首屏 JS/渲染成本（DESIGN_NOTES 自己承认了这一条）。
- **`useTheme.cycle` 与 A 同病**：localStorage 写入 + classList 切换 + setTimeout 全在 `setChoice` updater 里（`lib/theme.ts` L52–68），StrictMode 双调用会双跑 theme-anim。
- **`chain`（EvidenceChain）是隐性维护负债**：`problem/method/artifacts` 三个自由文本字段与 `summary` 平行手写，没有任何一致性约束——六个月后 summary 改了 chain 忘改，漂移无声发生。它是三案中**每条记录需要维护的并行文案最多**的契约（见 §4）。
- `lucide-react` 为 3 个图标引库（tree-shaken 影响小，纯卫生分）。

### 3.4 如果只能改一处

**给 7 条路由上 `React.lazy` + `manualChunks`（vendor-react / vendor-motion 分包）**——把 138KB gzip 的首屏负担拆成"首屏真正需要的部分"，这是 H 作为多路由方案唯一欠下的结构性工程债；顺手给 palette 的 `li` 补 `role="none"`。

---

## 4. 内容数据契约对比（"6 个月后非前端用户安全加内容"）

| 判据 | A | D | H |
|---|---|---|---|
| 派生只读量 | **最强**：搜索索引、RECORDS 行、章节计数全部由同一批数组实时构建（"永不漂移"写进注释并兑现） | 强：Q×n 计数、过滤、ADJOINS、`updated:null 不渲染` 全派生 | 强：palette 索引、footer 计数全派生 |
| 必填一致性约束 | 弱（extension 全 optional，忘填字段=优雅降级，错得无声但无害） | **强**：`topic`/`adjoins`/`relatedDemo` 必填，TS 强制新数据带上关系——但引用是**自由字符串**，`adjoins` 拼错编译照过、按钮静默消失 | 中：`facetLine` optional；`chain` 三字段与 summary 平行手写，**无一致性约束，漂移无声** |
| 每条记录的写作负担 | 最低（pack 契约 + 2 个可选 extension） | 中（多 topic 标注 + 邻接声明） | **最高**（chain 的 problem/method/artifacts 每项目三段并行文案） |
| null 语义文档 | 逐字段注释（`null = 未提供，UI 需优雅处理`） | 同级，且 `updated:null → 什么都不渲染` 是全案最干净的空值语义 | 同级 |
| 加新内容的代码接触面 | 加一条 project/question = 纯数据；加新章节需动 chapters 注册表（结构性扩展才碰代码） | 同左；加 lab 仪器需 `LabInstrument.path` 对齐路由 | 同左 |

**裁定：A 最接近目标。** 决定性理由是"索引/读数与内容同源"被工程化为不可漂移的结构（D 无搜索面，H 的 chain 引入手写漂移面）；D 的必填关系约束是三者中最好的"编译期防呆"，但自由字符串引用的静默失效抵消了一部分（改为 `keyof typeof researchTopics` 字面量联合即可补齐，届时 D 可反超）；H 的 chain 是为展示力支付的长期税。

---

## 5. 评分（14 维，1–10，可 0.5）

| 维度 | A | D | H | 工程裁定依据 |
|---|---|---|---|---|
| visual_quality | 7.5 | 7.5 | 7 | D 的渲染态成立（截图空白是 Reveal 缺陷、记 feasibility/a11y 侧）；H 稳但"安静"风险仍在 |
| originality | 7.5 | 7 | 8 | FIG.1 数据即图像 + Re-ink wipe 属实；朱批/幽灵编号属实；Self-Query 终态化最完整 |
| typography | 8 | 8 | 8 | 三案均达标：A 的 scale 系统、D 的 4px 基线+对比表、H 的 1.25 诚实执行 |
| information_hierarchy | 7.5 | 7.5 | 8 | H 的主线 + 索引栏 + 坐标语言工程上最清晰 |
| ux | 7 | 7 | 7.5 | H 的 skip 四路 + palette 深链；D 的单向过滤降维正确 |
| mobile_experience | 7 | 7 | 7 | A 的 56px 头+Index 层、D 的原生 details、H 的 MobileMenu 都真实重设计 |
| **technical_feasibility**（否决区） | **7** | **7.5** | **8.5** | A：旗舰 demo UI 正确性缺陷实证；D：Reveal 门控系统性缺陷+边注叠印已知 bug；H：三重验证+排序结构正确 |
| **long_term_maintainability**（否决区） | **7** | **7.5** | **7** | A：死依赖+updater 副作用但契约最瘦；D：float 简化+SSR 冒烟+契约强制；H：审计脚本资产但 chain 漂移+零分割 |
| research_presentation | 7.5 | 8.5 | 8 | D 的问题-证据链（relatedDemo 稳定 id 回链）最完整 |
| portfolio_presentation | 7.5 | 7.5 | 7 | A 的 Plate+FIG.1 与 D 的行内行动线都成立 |
| light_mode | 8 | 8 | 7.5 | — |
| dark_mode | 8 | 8 | 8 | 三案都有字重补偿（A 470/D 470/H 470+0.002em），A/D 的 opsz halation 防御更细 |
| **performance**（否决区） | **7.5** | **7** | **7** | A：JS 最小但字体最重（opsz+双备份 woff）；D：Reveal 推迟 LCP+430KB；H：138KB 最大+7 路由零分割（字体最省） |
| accessibility | 7.5 | 7.5 | 8 | A：焦点管理好但无 noscript；D：radiogroup/aria-live 全但 opacity 门控伤低视力/打印路径；H：combobox 主体正确+noscript 骨架 |

**排名（工程视角）：1. H — 2. D — 3. A**
H 赢在"每一处关键算法路径排序结构正确 + 最强的可复验证据链"；D 赢在沙盒工程与验证文化，输给一个系统性但可一处修复的 Reveal 门控；A 的 bundle 纪律与数据契约最好，但唯一一个"用户看得到的核心功能坏了"发生在 A——工程评委无法把技术可行性 8 分以上给一个旗舰 demo 在 UI 里不成立的方案。三者均未触发一票否决。

## 6. 证据索引

- 构建：三案 `npm run build` 本机复跑（见 §0 表）
- A 的 UI 缺陷复现：`generation_02/team_a_monograph/src/sections/Lab.tsx` L69–85（无重排）、`src/components/RankRow.tsx` L27/L46（无 clamp/无 overflow-hidden）、`scripts/verify-sandbox.ts` L43（脚本有 sort → 脚本/UI 不一致）；node 复现输出见本报告 §1.2
- D 的截图实证：`shots/gen2/team_d_offprint/d.d.home.desktop.light.full.png`、`d.d.home.mobile.light.full.png`（折叠区空白）；`src/components/chrome.tsx` L56–78（Reveal）、`src/index.css` L307–317（sn-float 负 margin 逃逸）
- H 的核验：`src/lib/bm25.ts` L73–79（defense 进排序）、`src/components/SearchPalette.tsx`（combobox）、`src/sections/Hero.tsx`（skip 四路）、`index.html`（noscript 骨架）
- A 死依赖：`generation_02/team_a_monograph/package.json` vs `grep -r "react-router\|lucide-react" src/`（零命中）
