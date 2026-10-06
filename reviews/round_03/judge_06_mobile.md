# Judge 06 · Mobile UX — Round 3 终审报告（CONCORDANCE / Generation 3）

> 首要权重：mobile_experience。方法：源码审读 + Playwright 触屏实测（isMobile+hasTouch，pointer:coarse 实测命中 `coarse:true`）+ 390/320/430/768 四档视口全路由扫描。
> 实测脚本：`reports/j6_overflow.mjs`、`j6_tap_targets.mjs`、`j6_interactions2.mjs`、`j6_trap.mjs`、`j6_debug.mjs`、`j6_menu_layout.mjs`、`j6_pal_trap.mjs`。
> 交互证据截图：`reviews/round_03/_j6_shots/`（A_menu_clean / B_palette_prefilled / B_palette_keyboard_viewport / C_sandbox_390_ranking / D_note_fold_open 等）。
> 渲染截图：`shots/gen3/*.mobile.*`（390）与 `*.tablet.*`（768）。

---

## 0. 结论速览

CONCORDANCE 是三代里第一个**真正为移动重新设计**的站点：MobileMenu 是全屏坐标目录而非缩小的桌面条，sandbox 在 390px 完整可玩，palette 在键盘弹出场景降级合理，390/430 全路由零横向溢出。**但 §4-G3 验收项"coarse pointer 下全部可点目标 ≥44px"属于部分纸面落实**：`index.css:669` 的 coarse 规则对 inline 锚点天然失效，页脚导航链接在**每一条路由**实测高度仅 14px；同时 MobileMenu 的焦点陷阱存在实测可复现的逃逸 bug。加上已核实的 768px 页脚塌陷（左栏实测 **0px** 宽）与 /connect 在 320px 的 22px 溢出——修复均为外科手术级（约一个文件一处），但终审不能对"验收项未真实达成"签字放行。

**verdict：NEEDS_WORK（边缘，距 PASS 一次半天修复）**

---

## 1. G3 复核 —— 触控目标 ≥44px（coarse pointer）

### 1.1 实测枚举（390×844，coarse:true，全部 10 路由，80~29 个可点目标/页）

**达标面（真实达标，非纸面）**：
- Header 三钮（品牌/搜索/菜单）44×44；ThemeToggle min-h-44
- `.u-btn`（sandbox 控件）实测 44；`.u-chip`（Home facet、Work 标签、Research adjoins）44 高
- MobileMenu 目录行实测 54px、底栏链接 44；`input[type=range]` 44 高
- palette option 按钮 min-h-44、输入框实测 56 高
- Connect 频道行 min-h-56；notes 边注 `<details>` summary 实测 44

**失守面（实测数值，同一脚本 `j6_tap_targets.mjs`）**：

| 目标 | 实测尺寸 | 位置 | 出现范围 |
|---|---|---|---|
| 页脚 §01–§07 导航链接 | **92–130 × 14px** | `Footer.tsx:32`（inline `<a>`，无 min-height 生效条件） | **全部 10 路由 × 双主题** |
| 正文 u-link（"Reproduce it in the Lab →" 等） | 117–319 × **18–19px** | `HomePage.tsx:57,107`、`NotesPage`、`WorkPage.tsx:81` | 多路由 |
| sandbox 正文 Q1 / Q2 回链 | **18 × 19px** | `CorruptionSandbox.tsx:181-188` | /lab、/lab/corruption-sandbox |
| Work 页 stack 标签检索钮（M3 入口） | **23 × 44px** | `WorkPage.tsx:133-141`（inline underline 样式，非 u-chip） | /work × 3 plates |

根因：`index.css:669-676` 的 `@media (pointer: coarse) { a, button, … { min-height: 44px } }`——**min-height 对非替换 inline 元素无效**。按钮类元素（inline-block/flex）被救起，inline 文本链接全部漏网。`DESIGN_NOTES.md:102` 声称"coarse pointer 全交互 44px（index.css:669）"——对导航与控件成立，对页脚/正文链接是**纸面落实**。页脚链接 14px 连 WCAG 2.5.8 AA 的 24px 下限都不及。

**连带发现（级联陷阱）**：该 coarse 规则未分层（unlayered），按 CSS cascade 规则压过 `@layer utilities` 的 Tailwind 任意值——MobileMenu 目录行写的 `min-h-[60px]`（`MobileMenu.tsx:144`，编译产物中存在）被实测压成 computed min-height 44px（渲染 54px 靠 padding 凑数）。当前无实害（54>44），但任何未来"想比 44 更高"的 utility 都会被静默吃掉，是长期维护的暗雷。

### 1.2 safe-area（G3 后半项）——落实

- `index.html:5` `viewport-fit=cover` ✅
- Header：`paddingTop/Left/Right: env(safe-area-inset-*)`（`Header.tsx:96-100`）✅
- MobileMenu：四向 env()（`MobileMenu.tsx:111-116`）✅
- Footer：`marginBottom: env(safe-area-inset-bottom)`（`Footer.tsx:16`）✅
- `.wrap`：`max(1.5rem, env(left/right))`（`index.css:378-379`，768 起抬到 3rem）✅
- 实测无刘海模拟下 computed 值正确回退 0/max(24px)（`j6_interactions2.mjs` E1）。
- **残余缺口**：palette/help 两个 fixed 全屏 overlay 只用 `p-4/p-6`，无 env()（`SearchPalette.tsx:122,237`）。竖屏被 `mt-[8vh]≈67px` 间接救起（> 刘海 47–59px），小机型横屏时对话框边缘距屏幕 16–24px < 侧向 inset 44px，会探进刘海区。DESIGN_NOTES 未把 palette 列入 safe-area 清单，故不算虚假声明，但 G3 字面要求"fixed 全屏 overlay 加 env()"，此项**未闭环**。

---

## 2. 交互实测（hasTouch + isMobile）

### 2.1 MobileMenu（`MobileMenu.tsx`）——核心流程全过，焦点陷阱有 bug
- 开启：dialog/aria-modal/aria-label 完整；焦点 20ms 后落在 Close 钮（实测 `activeElement=Close site index`）；`html overflow:hidden` 滚动锁生效（A1）。
- 布局：全屏坐标目录，实测 header 行 top=0 h=64、nav 607、底栏 173，`_j6_shots/A_menu_clean.png` 干净正确。
- 行高 54px、7 链接，tap → 路由跳转 + 菜单关 + 滚动锁释放 + scrollY=0（A4）✅；Esc 关闭 ✅（A5）；主题 radiogroup tap（Dark→dark class ✅）与 ArrowRight roving（Dark→Sys，焦点随移 ✅，A7）。
- **焦点陷阱逃逸（实锤）**：连续 Tab 实测在第 11 步从菜单内逃到 `BODY → Skip link → Header`（`j6_trap.mjs` 序列）。根因：`src/lib/focus.ts:8-9` 的 FOCUSABLE 选择器用 `button:not([disabled])`，不排除 `tabindex="-1"`——radiogroup 的 Light/Dark 是 roving tabindex 的非可 Tab 按钮，却占据了 trap 的"最后节点"位；焦点停在 Sys（实际最后一个可 Tab 元素）时 `active === last` 永不成立，包裹失效。对照实验：**palette 的陷阱正常**（9 次 Tab 全部 IN 并回绕到输入框，`j6_pal_trap.mjs`）——因为它的最后一个 option 是真可 Tab 按钮。`DESIGN_NOTES.md:100-101`"三处 overlay + trapTab"对 MobileMenu 一项**实测不成立**。附带症状：焦点逃到 overlay 后层时浏览器滚动背景页，菜单视觉被顶开（`A_menu_open_dark.png` 的异常构图即此症状，`A_menu_clean.png` 为干净对照）。

### 2.2 SearchPalette 移动端（键盘场景降级）——好
- Home facet chip tap → palette 打开、预填 "RAG"、4 options、输入框 56px 高且自动聚焦（B1，`B_palette_prefilled.png`）。
- option tap → 导航 + 关闭（B2）；背景 tap 关闭（B4）。
- **键盘弹出模拟**（视口压到 390×300）：输入框实测 top=41/bottom=97 完全可见，容器 `overflow-y-auto` 可滚，首个 option（top 98–142）仍可达（B3/B3b，`B_palette_keyboard_viewport.png`）——`mt-[8vh]` + 可滚容器这一组合在小视口下降级正确，优于绝大多数"command palette"站。
- 小项：输入框无 `inputmode="search"` / `enterkeyhint`，移动键盘回车键文案不是"搜索"——打磨项。

### 2.3 Corruption Sandbox @390（旗舰演示）——完整可用，D2/A1 全套生效
- Inject → d8 排名第 1、score 3.73、corpus 出现 ▲poisoned 标记、rank 条实时渲染（实测 scaleX(1)/0.508/…，390px 下条轨 129px 宽，窄但可读）。
- Enable toy defense → aria-live 实测播报 "Toy defense on: the poisoned document is demoted to rank 6. Top result is d1."（重排后取 top-5 的正确语义）；×0.1 声明行在场。
- Remove → "Clean corpus restored."。控件按钮实测 44px 高，堆叠不挤（C2–C5，`C_sandbox_390_ranking.png`）。

### 2.4 Notes 文章页 @390 —— 达标
- 边注按处方折叠为 `<details>`（n1 实测 2 处，summary 44px，tap 展开正常，D1–D2，`D_note_fold_open.png`）；正文量测 342px（=390−2×24 wrap padding），行宽贴合屏幕、字号未缩。

### 2.5 Connect @390/430 —— 达标（320 除外，见 §3）
- 频道行 min-h-56、mailto 槽位可见诚实；触控无障碍。

---

## 3. 溢出扫描（document.scrollWidth ≡ 视口？）

脚本 `j6_overflow.mjs`，13 路由（含 404 与 /notes/n2、n3）：

| 视口 | 结果 |
|---|---|
| **390×844** | **13/13 全过**（scrollWidth=390 恒成立） |
| **430×932** | 全过（抽查 /connect） |
| **320×568** | **12/13；/connect FAIL：scrollWidth=342 vs 320（22px 横向溢出）** |
| **768×1024** | 13/13 全过 |

320px /connect 根因：mailto 空态行 `grid-cols-[8rem_1fr]`（128px 固定标签列 + 24px gap）后，值列仅 120px，而 `address@example.com ↗` 为不可断字符串（`ConnectPage.tsx:73-81`，无 `break-all/min-w-0`）。iPhone SE 一代/小 Android 实机必现。修复一处：值 span 加 `break-all`（或 320 以下标签列改 auto）。

---

## 4. 768px 平板档

1. **Footer 塌陷——核实成立并量化加重**：视觉评委报告的方向正确，实测更严重：`getComputedStyle(grid).gridTemplateColumns` = **"0px 632px"**（`j6_debug.mjs`）——`Footer.tsx:18` 的 `md:grid-cols-[minmax(0,1fr)_auto]` 在 768px 下右侧 auto 导航吃掉 632/672px 可用宽，左栏被压到 **0px**，tagline 实测 168px 高的一行一词竖条。`shots/gen3/concordance.concordance.home.tablet.light.full.png` 与 `publications.tablet.light.png` 均可见。9 路由 × 2 主题 × tablet 全带病。
2. **其余平板档排查（/work、/research 窄列扫描 + 全部 tablet 截图过目）**：未发现第二个同类受害者——Work 的 evidence chain、Research 台账行、About 时间线在 768 均正常。About/Publications/notesn1 tablet 版面干净。
3. 768 下导航依赖汉堡菜单（`lg:hidden` 直到 1024px），MobileMenu 在 768×1024 同样工作（同套 54px 行）——可接受。

---

## 5. 内容优先级：移动端 Home 是重排还是堆叠？

**是真实的移动编排**（`HomePage.tsx:142-216` DOM 顺序即移动顺序）：Hero（双语气 + caret）→ FIG.01（thesis 图，双栏 FIG 在 <sm 自动单列堆叠，`grid gap-8 sm:grid-cols-2`）→ 读数行 → 全站索引 aside → §01 LEDGER → §02 PLATE → §03 LEDGER(FIG.02) → §04 ESSAY → §07 PLATE → 页脚。三 Register 交替在移动端依然成立（密度节奏没有被单列抹平）；facet chips 换行成 2 行但保持 44px；ledger 行的 mono 元标签在移动端换行到第二列（`max-md:col-start-2`）而非挤压。密度偏"桌面堆叠"的唯一疑点是 aside 全站索引出现在 FIG.01 之后（第 4 屏才出现目录）——但 MobileMenu 本身就是常驻目录，此处作为页内快捷方式靠后无害。**无异议。**

---

## 6. 性能感知（390 实测）

- 冷加载 `/`：8 个请求、约 527KB 未压缩（主 chunk 244KB raw ≈ 声明的 gzip ~77KB；+seo chunk 64KB raw）；与 DESIGN_NOTES"首屏 gzip ≈109KB"口径一致，预算内。
- 字体：按 unicode-range **实际只拉 3/6 个文件**（167KB raw woff2），latin-ext 未命中不下载——正确的自适应。
- 位图：0。全部图形为 CSS token（rank 条 scaleX、context fill 堆叠条）——无移动端图片税。
- 动画风险点：settle 仅 transform 4 行 480ms；caret blink 仅 hero 在场时（steps(2) opacity，合成器友好）；sandbox FLIP transform-only 且 reduced-motion 全禁；无 filter/blur/parallax。**未发现低端机卡顿风险点。**

---

## 7. 评分（14 维，1–10）

| 维度 | 分 | 依据摘要 |
|---|---|---|
| visual_quality | 8 | 390 渲染干净；768 页脚塌陷是全站共享渲染失败 |
| originality | 8 | 全屏坐标目录菜单、语词索引隐喻贯彻到移动 |
| typography | 8.5 | 390 字阶不缩水、暗色 470 补偿生效；塌陷属布局病 |
| information_hierarchy | 8 | 移动六段 Register 交替真实成立 |
| ux | 7.5 | 核心流程全通；trap 逃逸 + 双主题控件冗余 |
| **mobile_experience** | **7** | 390 日常体验三代最佳，但 G3 验收项实测部分失守（全路由 14px 页脚链接）+ 320 溢出 + 768 塌陷 |
| technical_feasibility | 9 | 实测即所得，构建/测试齐全 |
| long_term_maintainability | 8 | 单样式表 + 编译期契约；coarse 规则压 utility 的级联暗雷 − |
| research_presentation | 8.5 | sandbox/FIG 移动端完整可玩 |
| portfolio_presentation | 8 | — |
| light_mode | 8.5 | — |
| dark_mode | 8.5 | 390 暗色 halation 补偿实测无 halation |
| performance | 9 | 8 请求/0 位图/3 字体按需/transform-only |
| accessibility | 7 | combobox/aria-live/对比度测试优秀；MobileMenu trap 逃逸 + 14px 目标直接扣 |

**verdict：NEEDS_WORK** —— 依据：G3 是 Round 2 §4 明文验收项，实测"部分纸面落实"；且焦点陷阱逃逸使"三处 overlay trapTab"的自查声明之一不成立。二者均可一次外科手术修复，修复后此项即够 PASS 线。

## 8. top_issues（按严重度）

1. **G3 触控目标失守（全路由）**：页脚 §01–§07 链接实测 14px 高（`Footer.tsx:32` + `index.css:669-676` 对 inline 锚点无效）；Work 标签检索钮 23px 宽（`WorkPage.tsx:133-141`）；sandbox Q1/Q2 回链 18×19px（`CorruptionSandbox.tsx:181-188`）。`DESIGN_NOTES.md:102` 为纸面落实。
2. **MobileMenu 焦点陷阱逃逸**：`focus.ts:8-9` FOCUSABLE 不排除 `tabindex="-1"`，roving radiogroup 占位"最后节点"，实测 Tab 11 步逃出 modal（`j6_trap.mjs`）。
3. **768px 页脚塌陷**：`Footer.tsx:18` 网格实测解算为 "0px 632px"，左栏 0px 宽、tagline 一行一词 168px 高（证实 judge_01）。
4. **/connect 320px 横向溢出**：`ConnectPage.tsx:73-81` 不可断邮箱 + 8rem 标签列，scrollWidth 342>320。
5. **打磨项**：MobileMenu 底栏主题双控件冗余（compact toggle "syst" + radiogroup 并排，`MobileMenu.tsx:161-177`）；palette/help overlay 未加 env(safe-area-inset)（`SearchPalette.tsx:122,237`）；palette 输入无 `enterkeyhint="search"`。

## 9. 如果只能改一处

**改 `Footer.tsx`（一个文件同时修两个实测缺陷）**：① `md:grid-cols-[minmax(0,1fr)_auto]` → `md:grid-cols-[minmax(0,1fr)_minmax(0,auto)]`（或断点抬到 lg），消灭 768px 一行一词塌陷；② 给 §01–§07 链接加 `inline-flex min-h-[44px] items-center`（flex-wrap 列表内零布局风险）。页脚是每条路由每个主题的收尾，一处修改让全部 54 张证据截图的最后一屏和全路由的 G3 合规同时翻绿。
