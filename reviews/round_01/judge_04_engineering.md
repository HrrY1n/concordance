# Judge 4：Frontend Engineering 评审报告

> 评审人视角：资深前端工程师。技术栈基线：Vite 7 + React 19 + TypeScript 严格模式 + Tailwind v4 + motion（`motion/react`）+ react-router。我评的不是"设计好不好看"，而是**设计文档里的每一句承诺，在工程上要花多少代价、埋了多少坑**。

## 评审视角

**我的打分逻辑**：

1. **一票否决区 = technical_feasibility / performance / long_term_maintainability**。这三个维度我按"实现者视角"从严评分：一个方案如果需要非标准 hack、每帧触发 layout/paint、或给 6 个月后的维护者留下"只有原作者敢改"的代码，我的分数会毫不犹豫地压下去，无论它视觉上多有野心。
2. **我逐项检查了每个 signature interaction 的合成器友好性**：哪些是 transform/opacity（可合成、可跳帧），哪些是 `filter`/`font-variation-settings`/`width`/`grid-template-rows`（主线程 paint/layout，动画帧率取决于元素面积与内容复杂度）。文档声称"compositor-only"但实际不是的，我会点名。
3. **我审查了每个方案的 `content/*.ts` schema**：空态、过滤、状态标注、导航重排、未来论文挂载——数据契约是否真的支撑文档承诺的功能。schema 是这个项目 5 年寿命的承重墙。
4. **工作量标注**：每个方案给出 S/M/L/XL（一个熟练前端 + AI 协作下，从本文档到像素级落地的真实人日量级）与"最大工程风险"一句话。S ≈ 1 周内，M ≈ 2–3 周，L ≈ 4–6 周，XL ≈ 6 周以上且存在不可压缩的调参长尾。

**本轮总体的工程印象**：8 份文档的工程素养整体高于典型设计竞赛——大多数团队主动写了降级链、预算表和数据契约。但有四类反复出现的"隐性成本"值得点名：① hover 态引发文本 reflow（B）；② 文档自我声明 transform/opacity-only 却混入 layout 动画（C、F 的手风琴，E 的行预览带）；③ 需要持续 JS 测量的布局机制（D 的边注对齐）；④ 唯一的真实逐帧渲染循环（E 的 Canvas 装置）。

---

## 逐方案评语

### Team A — Minimalism「Monograph 单行本」

**实现工作量：S。最大工程风险：工程上几乎无风险——它把全部赌注押在排版执行精度上，kerning/灰度任何一处失手，单色体系会无限放大瑕疵（这是设计风险，不是工程风险）。**

- 优点：
  1. **这是全部 8 个方案里唯一一个"性能天花板由架构保证"的方案**：首屏 = 纯文本 + 系统 CSS 动画，LCP 天然就是 Hero 首行文字；全站环境动画只有 caret 闪烁（`steps(2)` CSS 关键帧，零 JS）、导航下划线（`scaleX`）与主题 crossfade（color transition），全部合成器友好。§7.2 的"动效预算表"不是口号，是可以直接照抄进验收清单的。
  2. **Schema 与空态策略严丝合缝**：空数组 → 整个 section 与导航锚点构建期跳过（编号派生而非手写常量）；`TODO_` 前缀占位 + `sample: true` 标记；Publications 唯一保留的空态只有一行 lede。§12 的四条规则就是一份可直接实现的 `renderIf` 规范。
  3. Dark 模式用 variable 轴把 display 字重 500→470、字距 +0.004em 做光渗补偿——这是全轮唯一一个在**字体渲染物理层面**区分两套主题的方案，实现成本几乎为零（`font-variation-settings` 一行）但非常显功力。
- 缺点/风险：
  1. `text-autospace: normal` 在 2026 年的浏览器支持仍然不完整（Chromium 已支持、Safari/Firefox 部分支持），中英混排间距不能押在它身上，需要 `:lang()` + 手动 span 约定兜底——文档只写了"由它兜底"，属于把渐进增强当成了保证。
  2. Lab 三个 demo 虽小，但"投毒文档重排"用了 motion 的 `layout` prop——6 行内是安全的；风险在于文档没有写清 demo 与正文章节的代码分割边界（demo 应全部 lazy chunk），需在实现时补上。
  3. 禁卡片 + 行列表在 1216px 容器里的 hover 反馈全部依赖排版信号，键盘 focus 态与 hover 态的视觉一致性需要额外的样式纪律（focus ring 已定义，但行的 focus 态没写）。
- 最值得被偷走的想法：**"占位即数据"的 `TODO_` 前缀协议 + 构建期导航编号自动派生**——所有方案都要处理 placeholder 与空 section，这是其中最干净、最不需要维护的协议。

### Team B — Editorial「Field & Retrieval 学刊」

**实现工作量：M。最大工程风险：四族可变字体（Fraunces + Newsreader + Instrument Sans + Plex Mono）的载荷与子集化管线，以及严格基线网格在真实内容（图片/代码块高度不可控）下的长期维护成本。**

- 优点：
  1. **Contents 表 = 路由表 = 目录 = 空态标注位**，一份 schema 同时服务导航、IA 和"CALL FOR PAPERS"空态，这是全轮最优雅的"数据驱动导航"设计之一，且 `showEmptyState` 开关给了整体退路。
  2. 动效章节的纪律真实可信：≤400ms、transform/opacity/color、`once: true`、reduced-motion 逐项退化；阅读进度线用 `scaleX` 而非宽度；marginalia → 行内 aside → 移动端折叠的三段降级路径清楚。
  3. 对字体工程的自我认知准确（§14.3）：`text=` 动态子集预载 masthead 字符串、CJK 按需子集、SimSun 小字发虚的预案——这是设计文档里少见的、真的会被实现的字体管线思考。
- 缺点/风险：
  1. **两个 hover 交互会在主线程引发 layout**：§7.4 "标题在 180ms 内由 Newsreader 500 交叉淡化为斜体"——italic 字形宽度与正体不同，hover 瞬间该行文本会 reflow，行内右对齐的 meta 也会随之抖动；§7.2 WONK hover 动画的是 `font-variation-settings`，这不是合成器属性，是每帧 paint，152px 的 masthead 每帧重绘——虽然仅 hover 且 280ms，"成本几乎为零"的说法言过其实。WONK 应改为静态启用（加载即 WONK 1）或用透明度/位移替代动画。
  2. **`baselineComp` 字段把布局元数据写进了内容数据**（§6.2），这是 schema 反模式：内容作者被迫理解排版补偿，6 个月后没人记得这个字段为什么存在。更现实的降级是文档自己给的 B 方案（只保证行高与间距为 4 的倍数），建议直接定为 v1 范围。
  3. 四族字体 × 可变轴 × 真斜体的实际 woff2 载荷大概率突破 260KB 预算（Fraunces 单 opsz+wght 轴 latin 已 ~100KB，斜体是独立文件），需要更激进的静态实例化（只留用到的 3–4 个实例）。
- 最值得被偷走的想法：**空栏目在目录里以"— CALL FOR PAPERS"斜体标注获得"在场感"**——空态不是一页留白，而是目录结构的一个正式成员，这个模式任何方案都能低成本复用。

### Team C — Modern AI「精密仪器」

**实现工作量：M。最大工程风险：仪器"chrome"的表面积（读数块、刻度、版本号、架构微图、AFFINITY 矩阵）是全轮第二大的组件数量，mono 密度一旦失控就滑向终端模板——纪律写进了文档，但执行要靠逐条验收。**

- 优点：
  1. **全轮最好的数据契约**：`ProjectEntry` 是一份真的可以编译通过的 TypeScript interface，`outputs: []` 为未来论文预留"结构先于内容"的挂载点，`enabled` 标志 + 导航编号派生重排、`sim(a,b)` 用 Jaccard(tags) 构建期预计算——schema 不只支撑当前功能，还支撑了 Relevance Lens 和 5 年后的内容生长。这是唯一一个我可以拿去直接开 scaffold 的方案。
  2. **Relevance Lens 的 FLIP 工程是教科书级的克制**：transform-only、构建期 O(n²) 预计算、条目定高、>12 条/触屏/reduced-motion 三重禁用写死、DOM 顺序不变保证键盘与读屏顺序恒定——把"条目多时的 FLIP 成本"这个我本来准备重点质疑的问题，提前在文档里解掉了。
  3. ⌘K Palette 的性能账算得诚实：MiniSearch 独立 chunk（~12KB）首次按键才加载、debounce 80ms、`memo` 化结果渲染、`0ms NETWORK` 读数本身就是性能声明的自我审计。
- 缺点/风险：
  1. **§8 Dossier 手风琴用 `grid-template-rows` 动画 400ms，与自家"全站动效仅 transform/opacity/color"的红线直接矛盾**——grid-rows 0fr→1fr 是 layout 动画，展开面板内含 SVG 架构微图时每帧都在 reflow。应改为 `transform: scaleY` + 定高或接受明确的例外条款。
  2. pipeline 读数点用 SMIL `<animateMotion>`——SMIL 在 2026 年仍可用但 Chrome 多次表露过移除意向，且 SMIL 无法被 reduced-motion 查询控制；一行 `offset-path` CSS 就能替代并解决两者，建议换。
  3. Vite `define` 注入 `__GIT_HASH__` 依赖 CI 环境（本地无 git 或 shallow clone 时为空），RECORDS 计数要求构建时 import 全部 content 模块——都能做，但文档没写"本地构建显示什么"的降级，验收时会出现本地/CI 读数不一致的困惑。
- 最值得被偷走的想法：**`outputs: []` 的"结构先于内容"模式**——Research 条目预留 OUTPUTS 读数行、Publications 留 ghost 槽位，未来第一篇论文入库时版式零改动。这是所有方案里对"5 年内容生长"最工程化的回答。

### Team D — Academic「Offprint 抽印本」

**实现工作量：M。最大工程风险：Tufte 边注的对齐引擎——"absolute 定位到锚点 + max-height 校验 + 越界自动 fallback"意味着每个边注锚点都要 JS 测量与 ResizeObserver 监听，这是全轮维护成本最高的布局机制。**

- 优点：
  1. **Question Ledger 是全轮最好的研究展示 schema**：`{ id, text, area, status, followups[], updated }` 天然支撑状态 chip、领域过滤、地图节点计数（`Q×n` 从 questions[] 派生）和 RESTING 这种"诚实的空"，五条 seeded 问题连内容质量都到位。
  2. **measure token 体系（60/28/21/81ch）是全轮最可执行的排版纪律**——四个 CSS 变量 + 一条"文字永不越 60ch"的规则，比 B 的基线补偿机制便宜一个数量级，却能守住同样的排印品质。
  3. 边注的三段降级（桌面漂浮 → 平板行内 → 移动 `<details>`/grid-rows 折叠，含 `aria-expanded`/`aria-controls` 与无 JS 原生降级）是真正的移动端重设计，不是缩放。
- 缺点/风险：
  1. **边注对齐选错了实现路径**：文档描述的"absolute 定位 + 越界校验"需要 JS 逐锚点测量、处理字体加载后 reflow、resize、以及边注比正文长时的级联——Tufte CSS 用 `float: right; clear: right` + 负 margin 就能在纯 CSS 下把边注锚定到段落且天然无碰撞（溢出时自动下移）。建议 v1 直接采用 float 方案，把 JS 校验从 spec 里删掉，维护成本立降。
  2. **Research Map 的两套手写坐标 SVG（桌面 920×560 + 移动 360×760）都在 DOM 中**，节点半径 ∝ 未决问题数但坐标手工——团队自己在 §14.4 承认领域增长要重排。两份 SVG 双份维护是双倍税；应让坐标由 `content/research.ts` 的 edges 数据派生（哪怕简单的 force 一次 + 落盘静态值），或 v1 只保留一套 + 移动端缩放裁切。
  3. 移动端折叠注用 grid-template-rows 200ms——又是 layout 动画（面积小，可接受，但同样与"动效宪法 transform/opacity only"的表述不一致）。
- 最值得被偷走的想法：**`upd. 2026-10` + OPEN / IN PROGRESS / RESTING 状态协议**——把"最后修订日期"变成内容 schema 的一等字段，让"这站还活着吗"可以被数据回答。所有研究展示都该偷这个。

### Team E — Creative Dev「BENCH 工作台」

**实现工作量：L（Hero Canvas 装置 + Palette + 3 demo + 全键盘体系）。最大工程风险：P-00 Canvas 装置是全轮唯一的逐帧渲染循环，低端安卓的 14ms 帧预算即使有全部缓解措施也只是"borderline"，存在一整周调参长尾且不保证 60fps。**

- 优点：
  1. **§2.2 的性能预算表是全轮唯一一份可以原样进验收合同的文档**：节点数按 `deviceMemory` 缩减、文字预渲染 sprite（OffscreenCanvas 图集）每帧只 `drawImage`、O(n²) 邻接构建期算一次、单 rAF、`visibilitychange` + IntersectionObserver 双停机、连续 30 帧 <45fps 自动降级为半速漂移+隐藏连线——这套缓解组合拳是对的，写出了别的方案没有的工程诚意。
  2. **降级是一等公民的执行最彻底**：reduced-motion 静态快照与动态形态出自同一个 `renderStatic()` 函数（不是两张截图）、PAUSE 常驻且持久化、无 JS 输出构建期 SVG 快照、`role="img"` + 视觉隐藏词表 `<ul>` 保底——把"装置不挡路"翻译成了可测的验收项。
  3. `lib/retrieval-core.ts` 共享检索核（分词/TF-IDF/cosine 纯函数）+ 单测 + 三台 Lab 装置和 Palette 复用它——这是全轮最好的"交互代码长期保持正确"的架构决策。
- 缺点/风险：
  1. **Canvas 装置的真实帧率风险必须说透**：220 个 sprite + 每帧数百条带 alpha 的发丝线，桌面独显毫无压力；移动端降到 90 节点后，Moto G 级设备的 Canvas 2D 全屏高频重绘（尤其 DPR 2 下 420px 高面板 = 实际像素翻倍）大概率在 45–60fps 之间震荡，且**持续 rAF 待机漂移就是持续耗电**——PAUSE 按钮是用户侧补救，工程侧应有"移动端默认静止、交互时才运行动画"的第四档（文档只有降帧档）。sprite 图集在主题切换/DPR 变化时需要重建，这条没有写。
  2. **Bench Row 的 hover 预览带（行下方滑出 200px 高）没有声明定位方式**——若 in-flow 就是 hover 引发整页 layout shift + 后续行跳动；必须是 absolute/fixed overlay 或预留占位。一句话的事，但文档漏了。
  3. 5 年维护税最高：装置渲染循环 + sprite 管理 + 降级状态机 + 三台装置 + Palette + 和弦系统 ≈ 全轮最大的自研交互代码面。共享检索核救了 demo 的正确性，救不了装置的陈旧化——6 个月后的维护者改主题色时要记得同步重生成 sprite 图集，这类隐性耦合必须写进 README。
- 最值得被偷走的想法：**"每个降级形态与特性本体由同一双手画出"**——reduced-motion/无 JS/触屏形态不是补丁而是设计产物，且强制进入设计评审。这是把无障碍从合规变成工程文化的那句话。

### Team F — Swiss「Coordinate System」

**实现工作量：M。最大工程风险：索引表语法在 8 个 section 重复使用的视觉单调性（设计风险），工程上则是坐标读数的 mousemove 文本更新需要 rAF 节流——漏写就是一个隐性 paint 热。**

- 优点：
  1. **"空 = 表格里的一行"是全轮最工程友好的空态协议**：Publications 空态复用同一张表的表头 + 一行宣言 + `// auto-renders from content/publications.ts` 脚注，空与满共享同一渲染路径，零特判组件；`keep: true` + 编号自动重排让 section 增删不碰导航代码。schema 简单到不需要文档。
  2. **性能直觉全对**：hairline 用 `border` + 绝对定位容器而非 box-shadow（自己点名了重绘风险）、Grid Breathing 全部 `scaleX/scaleY` transform、动效 ≤300ms、进入动画一次性、`<1600px` 网格密度分档减少 DOM 线条。这份文档的每一条动效声明我都挑不出合成器问题。
  3. 移动端"12 列坐标纸塌缩为 1 根脊线 + 红色 tick（transform 跟随）"是真正的重设计且实现极轻——一根线换回全部位置感。
- 缺点/风险：
  1. **live 坐标读数（`X:07 Y:03`）随 mousemove 更新文本**——文档没写节流；高频 DOM 文本突变会持续触发该节点的 paint（好在面积小）。实现时必须 rAF 合帧 + 仅在格坐标变化时写 DOM，这条要进验收。
  2. 展开区 320ms 高度动画（§8）与 Grid Breathing 一样属于 layout 动画——面板内含图片时更明显；建议 grid-rows 换 transform 或限定最大展开高度。
  3. `-webkit-text-stroke` 描边字与 280px Ghost 编号在低 DPI 屏（1x Windows 显示器）上会出现明显的锯齿描边——需要 `paint-order`/减细描边或高 DPI 检测降级，文档未提。
- 最值得被偷走的想法：**主题切换时全站 hairline 红色脉冲 160ms**——用品牌结构元素本身（而非浮层/toast）做状态确认，成本低、隐喻准、任何 hairline 体系都能复用。

### Team G — Dark Premium「Dimmer Room」

**实现工作量：M。最大工程风险：First Light 的光泽扫过依赖 `mix-blend-mode: plus-lighter`，该属性强制 H1 区域进入混合合成，扫动期间每帧重绘 H1 面积，且在不同 GPU/浏览器上渲染结果不一致——文档写的"主线程 0 阻塞"不完全成立（好在仅 1.1s、每会话一次）。**

- 优点：
  1. **View Transitions API 的兼容性回答是我准备重点审查的问题里答得最现实的**：主路径 VT + 圆心 clip-path（Chrome/Edge/Safari 18+ 均已支持 same-document VT），Firefox 明确进降级链（320ms 关键元素 CSS transition + `.theming` class 定时移除），再退到瞬时切换，reduced-motion 再退一档——四级降级链完整且每级都真实可实现。这是全轮对"新 API 兼容性"最负责任的一份答卷。
  2. **§4.3"两套主题中行为不同的元素"矩阵**把 Dark/Lark 的每一处差异（图片 filter、阴影方向、hairline、scrim、theme-color meta）列成了一张可逐项验收的表——这是防止 Light 沦为 Dark 附庸的最硬工程约束。
  3. 图片纪律（Dark 压暗 0.86 + hover 400ms 恢复、`forced-colors` 与打印强制原图、固定宽高比防 CLS、`srcset` 两档、coarse pointer 禁 blur>8px）每条都踩在真实痛点上。
- 缺点/风险：
  1. **"切换期间锁输入 700ms"是可访问性硬伤**——700ms 输入冻结对键盘用户和快速切换者是可感知的卡顿，VT 本身不锁输入也不需要锁（DOM 保持、focus 不丢）；这一条应该删掉，最多 150ms 防抖连击。
  2. `::view-transition-new(root)` 上叠 120ms `filter: brightness()` "灯具过零闪烁"——根快照上加 filter 动画会整屏重合成，低端设备上主题切换瞬间可能掉帧；这是装饰叙事越过性能直觉的一处，建议砍。
  3. 维护面上，e1/e2/e3 三级 elevation × 双主题 × inner-highlight/软阴影两套机制 + 黄铜使用位置 lint——token 表面积全轮最大（虽然文档写得极清楚）。6 个月后的维护者需要这份文档常在手边；文档不在，体系就散了。
- 最值得被偷走的想法：**`theme-color` meta 随主题切换 JS 同步更新 + 移动端地址栏/状态栏与页面底色无缝**——一行代码的细节，所有方案都该默认做，只有 G 写了。

### Team H — Experimental「可检索的人」

**实现工作量：L（装置状态机 + Palette + 3 玩具 + §15 全套守护）。最大工程风险：滚动映射的 Beam 装置在 iOS 弹性滚动/快速滚动的边界行为（progress 抖动导致揭示状态闪烁），以及 blur 遮蔽层在部分安卓 WebView 上的性能，都需要真机调参。**

- 优点：
  1. **§15 可用性守护清单是全轮最好的验收文档**：键盘地图逐键列全、reduced-motion 逐动效列降级、无 JS 路径（`.no-js` 移除遮蔽）、`prefers-contrast: more` 关闭 blur、JSON-LD 全 TODO 占位、LCP 是真实文本节点——这份清单拿去就能当 Definition of Done。
  2. **装置的可用性架构避开了我预期的所有坑**：遮蔽是 `aria-hidden` 装饰层而非内容层（真实文本永远在 DOM）、滚动映射不 `preventDefault` 不 pin（viewport progress 线性映射）、`resolved` 态 localStorage 记忆 + replay 按钮（回访零成本）、首次输入 ≤1.5s 内第 1 行可读的量化承诺。
  3. 证据链 + Query Log 的关联 schema（W-01 ↔ Q02 ↔ Lab ↔ Notes 双向引用）让 Palette 的搜索可以引用坐标（"Q03 → §02"）——内容关系图进了数据层，这是"检索隐喻"唯一站得住的工程落点。
- 缺点/风险：
  1. **blur(5px→0) 揭示动画的是 `filter`**——现代浏览器对 blur 有 GPU 加速，但连续 4 行 × 240ms 的 filter 过渡在低端设备上仍是 paint 密集操作；`will-change: filter` 只能救一个元素。好在行数少、有 contrast 媒体查询逃生门，风险有界。
  2. "aria-hidden 的重复视觉层"（内容层 + 遮蔽装饰层双份文本）是 DOM 双份维护——文案改一处要同步两处或用 CSS mask 单层实现（`mask-image` 线性渐变即可达成同样视觉且无重复 DOM），建议 v1 改用 mask 方案。
  3. Palette 的 Actions（Toggle theme / Copy email）+ 和弦键 + 装置键盘路径三套键盘语义并存，`/` 与 `→`/`1–4` 的作用域规则（"首屏焦点内"）在实现里极易出边界 bug——需要一张状态机表而不是散落的 keydown 监听。
- 最值得被偷走的想法：**"每个实验性操作都有一个确定性出口"的双通道原则**——实验是增量不是门票，这条原则应该写进第二轮所有入选方案的实现宪法。

---

## 排名与理由

**Top 3：Team A > Team C > Team F**

1. **Team A（Monograph）**——一票否决区三个维度全部 9.5，全轮唯一。它的工程故事是"架构保证的性能"：无逐帧循环、无 layout 动画、无 JS 测量的布局机制、schema 足以支撑全部承诺功能、维护面最小。6 个月后的维护者拿到它只需要改 `content/*.ts`。它也是唯一一个工作量 S 却不显得偷工减料的方案——省下的每一分复杂度都变成了可靠性。
2. **Team C（精密仪器）**——最好的数据契约（可编译的 TS interface、`outputs: []` 前瞻、构建期预计算）、被三重禁用条件驯服的 FLIP、诚实的 ⌘K 性能账。扣分点（grid-rows 手风琴自相矛盾、SMIL、本地构建读数降级）都是一天内可修的局部问题，不动摇体系。它的 schema 是 5 年内容生长下最耐用的。
3. **Team F（Coordinate System）**——"空 = 表格一行" + 编号派生 + 统一表格语法构成了全轮第二可维护的内容系统；动效全部合成器友好，性能直觉几乎零失误。输给 C 是因为研究/作品展示力偏弱（表格语法对 case study 的承载力有限）与两处未写明的实现细节（坐标读数节流、描边字低 DPI 锯齿）。

**未进 Top 3 的关键理由**：Team D 的边注对齐引擎与手写双 SVG 地图是两个持续的维护税源（但 Question Ledger 全轮最佳，值得整段偷走）；Team E 的工程雄心与工程风险同为本轮之最——预算表写得最好，但 Canvas 装置的调参长尾和全轮最大的自研代码面让 L 的工期不确定性最高，它的 a11y 章节与共享检索核架构则值得全部入选方案继承；Team B 的 hover reflow 与基线补偿 schema 是两处真实的工程债，四族字体管线是工期暗礁；Team G 的降级链最完整，但输入锁与根快照 filter 两处细节越过了我作为性能评委的线；Team H 的守护清单最完整，但装置 + 玩具 + 三套键盘语义的调试面在 L 工期里风险集中。

**给第二轮的实现忠告（不论谁入选）**：① 所有手风琴/展开一律 transform 或接受明确的 layout-animation 例外条款；② hover 态永不改变字形宽度（禁 italic swap）；③ 新 API（VT、text-autospace、SMIL）一律写四级降级链；④ 内容数据里禁止出现布局补偿字段；⑤ 谁的方案里有逐帧渲染循环，谁就要在验收合同里写帧预算与自动降级。
