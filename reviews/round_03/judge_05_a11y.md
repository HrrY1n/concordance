# Judge 05 · Accessibility（无障碍）— Round 3 终审报告

评审对象：CONCORDANCE（`generation_03/`，http://localhost:4183/）
证据基线：源码全读（App/focus/SearchPalette/MobileMenu/CorruptionSandbox/RankList/structure/contrast.test.ts/index.css/index.html）+ **Playwright 实测**（脚本：`reports/j5_a11y.mjs`、`reports/j5_a11y2.mjs`，全程只读未改 generation_03）+ 截图 `shots/gen3/`。
我的首要权重是 accessibility；其余 13 维基于实测/截图旁证给出，供 Meta 权重参考。

---

## 1. 结论先行

**a11y 底座是真材实料，但自查表在 A2/H1 两项上存在"纸面落实"。** 20 分钟键盘 + AT 语义实测发现：2 处信息性 `text-faint` 低于 AA（light 3.52:1 / dark 3.95:1）、palette placeholder 3.79:1、MobileMenu 焦点陷阱在 radiogroup 边界**破防**、/lab 三个 demo anchor id 全部重复且 `aria-labelledby` 自指、首载 focus 落在 main 使 skip link 退化为**反向 Tab 第 8 站**、三处 overlay 关闭后焦点全部丢失到 body。这些全是"一天内可修"的局部缺陷，不动摇架构——但 DESIGN_NOTES §4 自查表写"faint 的使用点均 aria-hidden 装饰"（A2/H1 行）与事实不符，这是本轮我最不能放过的一类问题：**守卫测试守住了 token 层，用法层漏了**。

---

## 2. §4 验收项逐项复核（a11y 相关项）

### G2（对比度 ≥4.5:1）— **部分落实，有 3 处用法级漏网**

**Token 层：落实，且是三案中最强的工程化落实。**
- `src/lib/__tests__/contrast.test.ts` 直接解析 `index.css` 的 `:root` / `.dark` 块，断言 `ink/ink-2/accent/signal/ok` × `bg/bg-inset/raised` × 双主题 = **30 格矩阵全部 ≥4.5:1**，并反断言 `faint` 必须 <4.5:1（防止有人把 faint"顺手调亮"给正文用——守卫方向聪明）。测试还覆盖 `::selection`。我实算复核：token 注释里的比值（ink 15.6、ink-2 6.9、accent 6.6 等）与公式一致，无注水。
- `prefers-contrast: more` 提级实测生效：faint #8b8168→#6d6449（在 bg 上 5.36:1），line 同步提亮（`index.css:144-151`）。

**用法层：漏网 3 处，恰好是 A2/H1 被点名的同类。**
| 位置 | 内容 | 实测比值 | 性质 |
|---|---|---|---|
| `ConnectPage.tsx:84-89` | "+ 5 SLOTS / GITHUB · SCHOLAR · ORCID · LINKEDIN · RSS — HIDDEN UNTIL CONFIGURED" | light **3.52** / dark **3.95** | **信息性文本，无 aria-hidden**。告诉用户哪些渠道存在，是内容不是装饰 |
| `PublicationsPage.tsx:28-33` | "RESERVED — THIS LINE AUTO-NUMBERS WHEN PUBLICATIONS.TS GROWS" | light **3.52** / dark **3.95** | 同上（仅 "[01]" 序号是 aria-hidden，正文 RESERVE 文本不是） |
| `SearchPalette.tsx:153` | `placeholder:text-faint`（"try a name, a topic, §…"） | **3.79**（raised #fffdf6 上） | placeholder 是可见文本，按 WCAG 1.4.3 计入 AA |

工程评委报的两处（ConnectPage:84 / PublicationsPage:28）**核实属实**；我全站 `text-faint` 扫描后确认：其余 9 处使用点全部带 `aria-hidden="true"`（RankList:30、structure:38、ResearchPage:99,147、HomePage:200、三个 demo 的图例行等——这些是合法的"装饰性回声"）。**结论：不是系统性滥用，是 2.5 个点的收尾失败**——但这 2.5 个点正落在 Round 2 处方 A2/H1 的同一品类上，且自查表声称已清零。

**测试矩阵完备性评估**：token 级矩阵完备（我未找到缺格）；真正的缺口是**token↔用法之间没有守卫**——`contrast.test.ts` 无法知道 `text-faint` 被用在了一个没有 aria-hidden 的 span 上。补法：一条 grep/vitest 用法级测试（`text-faint` 必须与 `aria-hidden` 同元素或属 placeholder 之外的可读 token）即可把这类回归永远关掉。

### G3（触控 ≥44px + safe-area）— **大部分落实，一处声明过誉**

- 实测 mobile（390×844, hasTouch）：MobileMenu 导航行 **54px**、主题 radio **44px**、sandbox 按钮/u-btn 全部 ≥44。safe-area 全套真实存在（Header.tsx:96-100、MobileMenu.tsx:111-116、Footer.tsx:16、wrap `index.css:377-385`）。
- **但** `@media (pointer:coarse){ a{min-height:44px} }`（`index.css:669-675`）对**行内 `<a>` 无效**（min-height 不作用于非替换行内元素）：实测 sandbox 正文里 Q1/Q2 链接 **19px**、页脚 §01–§07 链接 **14px**。按 WCAG 2.5.8 行内豁免不算失败，但 DESIGN_NOTES"coarse pointer 全交互 44px"的声明过誉，应改口径或给行内链接加 padding 扩展命中区。

### G1（noscript / 默认可见 / 打印）— **settle 与打印是真落实；noscript 是"骨架"而非"核心内容"**

- 无 opacity:0 入场：settle 全 transform（实测 reduced-motion 下 `animation: 0s`、caret 1e-05s、smooth→auto，全站动效开关真实生效）。
- 打印样式完整（`index.css:703-745`，token 重映射为纯纸黑白）。
- **noscript**（`index.html:73-97`）：禁 JS 实测渲染出 676 字符的静态骨架——一段简介 + §01–§07 文字清单（**无链接**）。作为 SPA 降级说明是诚实且体面的，但严格对照验收原文"无 JS 时**核心内容**完整可读"：研究问题、笔记正文、demo 均不可达，只有目录摘要。**判：部分落实**（SPA 客观上限，但应在 DESIGN_NOTES 明说"noscript=摘要级"而不是把它记作 G1 达成）。

### H3（palette combobox 键盘语义）— **核心语义满分，两个边角**

实测（`/` 打开 → 输入 "rag"）：
- ✅ `role=combobox` + `aria-expanded=true` + `aria-controls=palette-list` + `aria-activedescendant` 随 ↑↓ 正确步进/回绕；`aria-selected` 同步；Enter 正确导航（→ /work）且焦点落 main。
- ✅ 空结果 live region 真实播报："no documents matched "zzzzqqq""；footer 常驻 `aria-live` 播报索引规模。
- ⚠️ **两个偏差**：(a) option 是 `<button role=option>`（`SearchPalette.tsx:160-170`），**仍在 Tab 序里**（实测 Tab 从 input 直落第一个 option）——APG combobox（aria-activedescendant 模式）要求 option 不进 Tab 序，双机制并存属于非规范实现（AT 可用，语义冗余）；(b) listbox 的 `<li>` 包裹层未标 `role=presentation`，listbox 直接子元素应为 option。
- ❌ **Esc 关闭后焦点丢失到 body**（实测确认）——见 §3-3。

### D2（sandbox 播报）— **满分项，全站最佳实践**

`CorruptionSandbox.tsx:57-69,161`：实测注入→"Poisoned document injected: it ranks 1 with score 3.73."；开防御→"Toy defense on: the poisoned document is demoted to rank 6. Top result is d1."。**分场景、带排名与分数的自然语言播报**，▲▼ delta 标记 aria-hidden（数据由 live region 承载，正确分工），aria-pressed 双开关，poisoned 行 ▲ POISONED 文字+signal 色+左边框三重编码（RankList.tsx:33-40）——颜色从来不是唯一载体。这一模块可以直接当 a11y 教材。

### 语义结构 / landmarks — **基本盘优秀，一处硬伤**

- 11 条路由实测：每页 **h1 唯一**、header/nav/main/footer 全 landmark、`lang=en`、逐路由 title、**0 个无名按钮/链接、0 个正 tabindex**、0 console error。
- ❌ **/lab 三个 demo anchor id 全部重复**（实测 `duplicateIds: [demo-corruption-sandbox, demo-context-budget, demo-rankers-side-by-side]`）：`LabPage.tsx:25-27` 把同一个 id 同时给了 `<section id>` 和 `<h2 id>`，而 `aria-labelledby` 指向它 → `getElementById` 命中**第一个**（section 自身）→ section 的可访问名 = **318 词的整个子树**。这是无效 HTML + landmark 名失控，工程评委的报告属实，且比他说的更重（不只是"影响 labelledby"，是 accname 计算直接被污染）。修法一行：h2 改 `id={anchor + "-title"}`。

---

## 3. Playwright 实测发现的完整缺陷清单（按严重度）

1. **MobileMenu 焦点陷阱破防（focus.ts:8-27 × MobileMenu.tsx:27-57）**。trapTab 的 FOCUSABLE 选择器 `button:not([disabled])` 会把 roving tabindex 的 `tabindex="-1"` radio 也收进节点表——实测 trap 表 13 节点，"表尾"是 t=-1 的 Dark radio，而真实最后一个可 Tab 元素是 t=0 的 Sys。于是 Tab 从 Sys 前进时 `active === last` 不成立、不回绕 → **焦点逃出仍在全屏打开、滚动锁定的 modal**（实测逃到页面 skip link）。修法：FOCUSABLE 排除 `[tabindex="-1"]` 的 button（把 `button:not([disabled])` 改为 `button:not([disabled]):not([tabindex="-1"])`）。
2. **首载 focus 在 main，skip link 退化为反向第 8 站（App.tsx:39-53）**。ScrollManager 在**首次 mount 也执行** `main.focus()`：实测首载后 Tab 前进直接落 hero chips，skip link 与 header 导航只能靠 Shift+Tab×2/×8 找回。路由变更聚焦 main 是对的，**首载不该聚焦**——加一个"是否首次"判断即可。UX 评委的报告属实。
3. **三处 overlay 关闭/打开的焦点管理缺口**：palette Esc 关 → 焦点丢 body（实测）；MobileMenu Esc 关 → 焦点丢 body（实测）；HelpOverlay（`?`）**打开时根本不接收焦点**（实测 activeElement=BODY），其 trap 直到 Tab 走进 dialog 才生效。需补"记住唤起元素、关闭时归还"+"打开时 focus 进 dialog 首元素"。
4. **G2 用法级漏网 3 处**（§2 表：Connect 3.52 / Publications 3.52 / placeholder 3.79）。
5. **/lab 重复 anchor id ×3 + aria-labelledby 自指**（§2）。
6. **hash 深链只滚不聚焦**（/research#q1 实测 scrollY=1690、focus=BODY）——SR 用户无上下文迁移。低危。
7. **coarse 行内链接 <44px**（§2 G3）。低危。

## 4. 明确的真实亮点（防止压分误伤）

- contrast.test.ts 的"解析样式表本体"方案 + faint 反断言——三案中唯一的**防漂移守卫**，值得写进模板。
- Sandbox 播报（D2）与 poisoned 三重编码——颜色永不单独承载语义。
- 11 路由语义零硬伤（除 dup id 外）：h1 唯一、landmark 全、无名控件为零、正 tabindex 为零。
- reduced-motion / prefers-contrast / print / selection 全部实测生效，不是纸面声明。
- focus-visible 全局环（accent 色 2px）+ `[tabindex="-1"]:focus` 去环，细节到位。

## 5. 评分（14 维，1–10）

| 维度 | 分 | 依据 |
|---|---|---|
| visual_quality | 8.5 | 双主题统一排印语言，无拼接感（截图旁证；非我的权威维度） |
| originality | 8.5 | concordance 概念贯穿到检索/坐标/live FIG |
| typography | 8.5 | 字阶纪律 + 三 Register 变奏可见 |
| information_hierarchy | 8.5 | §坐标 + 读数行 + 图版层级清晰 |
| ux | 7 | 键盘流三处缺口（首载焦点/焦点归还/陷阱破防） |
| mobile_experience | 8 | 真重构 + safe-area；行内链接命中区欠账 |
| technical_feasibility | 9 | build/lint/test 全绿，0 console error（实测） |
| long_term_maintainability | 8.5 | content 契约 + 守卫测试 + 单样式表 |
| research_presentation | 9 | ledger + 证据回链 + 诚实 sandbox |
| portfolio_presentation | 8 | 空态体面；真实履历为空是诚实代价 |
| light_mode | 8.5 | 除 2 处 faint 用法外全部 AA |
| dark_mode | 8.5 | 470 补偿真实存在；faint 3.95 同病 |
| performance | 9 | 路由分割 + 2 族字体；首屏 109KB（自查，未见反证） |
| **accessibility** | **7** | 底座 8.5 水准，被 3 处 AA 用法漏网 + 陷阱破防 + accname 污染 + 自查表失实压到 7 |

## 6. Verdict：**PASS（有条件）**

所有缺陷均为局部、一天量级、不动架构的修复，应**随 Meta Designer 打磨阶段强制执行**，不构成打回重做的理由。但以下 5 项是打磨阶段的**必做项**，不是可选项：
1. ConnectPage/PublicationsPage 两处信息性 faint → `text-ink-2`；palette placeholder → `text-ink-2` 或专用 placeholder token（≥4.5:1）。
2. focus.ts FOCUSABLE 排除 `[tabindex="-1"]` 按钮，修 MobileMenu 陷阱。
3. ScrollManager 首载不聚焦 main（仅路由变更聚焦）。
4. LabPage h2 id 加 `-title` 后缀，消除重复 id 与 aria-labelledby 自指。
5. 三个 overlay 补焦点归还（关闭时回到唤起元素）；HelpOverlay 打开时聚焦入内。
另建议（非必须）：补一条"用法级"守卫测试（`text-faint` 必须伴随 aria-hidden），并把 DESIGN_NOTES 中 A2/H1、G3、G1-noscript 三行自查口径改诚实。

**如果只能改一处**：把"对比度契约"从 token 层延伸到用法层——先修 3 处漏网（两行 className + 一条测试），再让守卫测试永久看住它。理由：AA 是硬性法规级要求且属 Round 2 处方原点；其余键盘问题影响的是少数路径的体验，而对比度漏网影响的是所有 SR/低视力用户对"诚实声明"本身的阅读——这个站的灵魂恰恰是诚实。

---

*实测脚本与原始输出：`reports/j5_a11y.mjs`、`reports/j5_a11y2.mjs`（可复跑）。截图证据：`shots/gen3/concordance.concordance.connect.desktop.light.png`（可见 faint 槽位行）、`concordance.concordance.home.desktop.{light,dark}.png`。*
