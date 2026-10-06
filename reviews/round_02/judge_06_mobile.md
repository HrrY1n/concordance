# Round 2 评审报告 — Judge 06 · Mobile UX（移动端体验）

> 评审对象：Team A「Monograph」/ Team D「Offprint」/ Team H「检索系统」（generation_02 可运行实现）
> 视角：390px 真重设计、触控目标、移动内容优先级、lab demo 移动可用性、主题切换入口、安全区/横竖屏意识。mobile_experience 为本评委一票否决区，从严。

## 0. 验证方法与脚本运行记录

除截图证据（`shots/gen2/<team>/*.mobile.*`）外，运行了三套 Playwright 探针（390/430px、hasTouch、isMobile）：

1. `node reports/j6_mobile_verify.mjs` — 横向溢出 + 全页可交互元素 44px 触控审计 → `reviews/round_02/_crops/j6_tap_audit.json`
2. `node reports/j6_mobile_interact.mjs` — A 目录导航/沙盒、D reveal/边注折叠/Contents、H 菜单/palette → `_crops/j6i_*.png` + `j6i_log.txt`
3. `node reports/j6_mobile_extra.mjs`（本评委补写）— D/H 沙盒注入+防御实测、三案主题切换循环 → `_crops/j6x_*.png` + `j6x_log.txt`

脚本备注：`j6_mobile_interact.mjs` 原稿有 3 处 `page.tap(locator)` 误用（应为 `locator.tap()`）及 1 处 H palette 按钮选择器歧义（菜单打开后页头与菜单各有一个 "Search this site"），仅修脚本后跑通，未改任何应用代码。

**共性结论（三案）：**
- 390/430px **零横向溢出**、**零 console error / pageerror**（j6_tap_audit.json 三案六轮 `overflowPx: 0`、`pageErrors: []`）。
- 三案 hero 均用 `svh`（A `min-h-[100svh]`、D `82svh`/`70svh`、H `calc(100svh-4rem)`）——移动地址栏收缩处理正确。
- 三案 **均无 `env(safe-area-inset-*)` / `viewport-fit=cover`**（grep 三案 src+index.html 零命中）：固定头、全屏 overlay 与页脚在刘海/手势条机型上有被吞风险，属共同欠账。
- 三案均无横竖屏分支（竖向滚动站可接受）；768px 平板过渡均无断版（a2/d2/h2 tablet light 抽查）。
- 主题入口移动端全部常驻且实测可循环：A 头部 AUTO→LIGHT→DARK（`j6x_a_theme_after2taps.png`）、D `THEME: SYSTEM`→light（`j6x_d_theme_after1tap.png`）、H 头部 SYSTEM→LIGHT（`j6x_h_theme_after1tap.png`）。

---

## 1. Team A「Monograph」

**移动重设计验证：属实的真重设计。** 56px 头 + 章节指示条（导航后出现 "§05 — LAB"，`j6i_a_after_index_nav.png`）；全屏 Index 目录页 26px 大字章节 + 当前章 "HERE" accent 标记（`j6i_a_index.png`）；唯一做了 `scroll-padding-top: 96px`（src/index.css:54）保证锚点不被粘头吞掉的方案。

**优点**
1. **沙盒在手机上真实可玩**：`j6i_a_sandbox_injected.png` 显示 Inject 后 d8 POISONED 4.95 登顶、下有 `n MORE DOCUMENTS BELOW THE CUT` 读数；Toggle 按钮 `min-h-[44px]`（Lab.tsx:44），range 滑杆 CSS 里 44px 高（index.css:291-296）。
2. **Hero 移动端排印最强**：serif italic "before it breaks." + accent 光标条在 390px 双主题均成立（`a2.a2.home.mobile.light/dark.png`），身份传达 1 屏完成；Publications 空态 `0 RECORDS` + `RESERVED` ghost 行诚实且数据驱动（src/sections/Publications.tsx:17-40）。
3. 头部 SEARCH / AUTO / INDEX 三键全部 ≥44px（tap audit 未标记），mono 章节条让长页始终有位置感。

**缺点**
1. **旗舰 demo 的防御开关不改排序——诚实性硬伤**：`Lab.tsx:69-85` 先 `bm25Rank` 排序、再对分数乘 defense factor，导致开防御后显示 **01 d8 ×0.25 = 1.24 / 02 d1 = 2.46**——排名与分数自相矛盾（`j6i_a_sandbox_defense.png`、j6i_log），且 RankRow.tsx:27 `scaleX(2.46/1.24≈1.98)` 令 d1 分数条横向溢出轨道。对照组：D 与 H 的防御都正确重排。品牌是"让失效可见"，这条失效恰恰发生在自己身上。
2. **"触控目标 ≥44px"声明不成立**（DESIGN_NOTES.md:54）：tap audit 抓到 5 处正文内联链接 14–22px 高——"Selected Work ↘" 22px、"Lab ↘" 22px、"Open the instrument in the Lab ↘" 14px、"Inject it in the Lab ↘" 17px；无 `pointer: coarse` 适配。
3. "demo 控件全宽"声明与实现不符（按钮为内容宽度）；无 safe-area 处理（与全体共同欠账）。

**如果只能改一处**：把 defense factor 放进排序键（先乘后排、条宽归一到防御后 max），修复 1.24 排在 2.46 之上的自相矛盾——这是移动端上唯一"看起来在撒谎"的读数。

---

## 2. Team D「Offprint」

**移动重设计验证：属实且降级策略最完整。** 头部收缩为 wordmark + `THEME: SYSTEM` + `CONTENTS`（d2 mobile）；边注三段降级落地为 `<details class="sn-fold">`——390px 实测 3 个折叠点、tap 展开正常（`j6i_d_sidenote_open.png`）；Contents 全屏目录大号 serif 行 + 诚实页脚计数（`j6i_d_contents.png`）。

**优点**
1. **三案中沙盒行为最正确**：`/lab/corruption-sandbox` 独立路由 + `← OFFPRINT` 返回链；注入+防御实测 **d8 跌至第 4、d3 5.11 居首，带 ▲/▼ CLIMBED/FELT 相对位移标记与 "1 FLAGGED BY HEURISTIC" 读数**（`j6x_d_sandbox_defense.png`、j6x_log），诚实声明以 wash 框常驻。
2. **唯一写了 `@media (pointer: coarse)` 的方案**（src/index.css:365-372：`.tap`/`button`/`summary`/`[role=radio]` min-height 44px）——audit 中 summary 均为 44px 高证明其真实生效。
3. 滚动 reveal 移动端正常触发（全节 opacity=1，j6i_log）；Work 案例行 390px 下堆叠干净（`j6i_d_work_scrolled.png`）。

**缺点**
1. **coarse 指针规则漏掉全部 `a` 链接**：audit 抓到 13 处 16px 高 mono 行（`↓ 01 — THE QUESTION LEDGER`、`→ READ THE LEDGER`、`→ RUN IT IN THE LAB`…）与 22px 宽的 "RAG" 按钮——DESIGN_NOTES.md:88 "coarse pointer 下 ≥44px" 只兑现了一半。
2. **深链死路**：路由仅 `/` 与 `/lab/corruption-sandbox`（App.tsx:37-39），`/work`、`/publications`、`/research` 直达全部落到 "The page you asked for is not in this edition."（`dp.dp.work/publications.mobile.*.png`）——404 文案本身优雅，但移动端分享/回访落地即死，Contents 是唯一入口。
3. 粘头下无 `scroll-margin-top`：目录导航落点章节标签被粘头切一半（`j6i_d_work_scrolled.png` 顶部 "TOO…" 残迹）；hero ghost Q1 数字在 390/768 均被右缘裁切，移动端视为噪音。

**如果只能改一处**：给 `pointer: coarse` 规则补上 `a`（或给 `.link-ink`/`.type-mono` 链接统一 `min-height:44px; display:inline-block`）——一行 CSS 消灭 13 处 16px 触控行。

---

## 3. Team H「检索系统」

**移动重设计验证：三案中移动导航概念最完整。** 头部为 logo + SYSTEM + 搜索 + 汉堡（`j6i_h_hero_resolved.png`）；全屏菜单 §01–§06 大字条目 + 每节诚实计数 + 底部 "Search this site" 与主题键（`j6i_h_menu.png`）；**palette 在纯触屏完整走通**——tap 菜单内搜索键 → 输入 "poisoning" → 分型结果（NOTE/TOPIC/DEMO + §地址）→ tap 首条实跳 `/notes`（`j6i_h_palette_query.png`、j6i_log）。

**优点**
1. **`min-h-[44px]` 纪律覆盖面最广**（Header/MobileMenu/SearchPalette/Hero/Lab 五个组件显式声明），audit 仅 4 处违规且多为 24px 正文链接。
2. **沙盒移动实测通过**：注入后 corpus 7→8、按钮变 "Remove the poisoned document"；开防御后 d8 被压出 top-5（`j6x_h_sandbox_injected/defense.png`、j6x_log "1 d1 1.90 || 2 d3 1.83…"）——与 DESIGN_NOTES.md:87-89 的验收声明一致。
3. **错误恢复是移动端范本**：`/lab/corruption-sandbox` 404 页 "The corpus has no record at this address. The address system covers §01–§06" + "Back to the resolved index →"（`hp.hp.labcorruption-sandbox.mobile.light.png`）；Publications 空态 "Nothing in print yet" + `reserved pub-01/pub-02` ghost 行 + "CALL FOR PAPERS"（`hp.hp.publications.mobile.light.png`）；六节全部有真路由，深链能力三案最佳。

**缺点**
1. 正文内联 `.u-link` 24px 高（"Open the sandbox →" 等 3 处）+ logo 链接 21px 宽——44px 纪律没管到正文链接层。
2. 首页即全 corpus（h2 mobile full 约 10+ 屏），移动端一次加载全站内容；mono meta 层密度偏高，小屏上"读数"与"内容"的层级偶尔打架。
3. 无 safe-area 处理；palette 底部 ↑↓/↵/ESC 键位提示在触屏上是桌面残留（无害但暴露方言）。

**如果只能改一处**：给正文 `.u-link` 补 coarse-pointer 44px 高度、全站 fixed 层加 `env(safe-area-inset-bottom)`——两行 CSS 级修补，补齐移动端最后一块短板。

---

## 4. 评分表（14 维度，1–10，0.5 步进）

| 维度 | A | D | H | 评分依据（移动视角） |
|---|---|---|---|---|
| visual_quality | 8.5 | 7.5 | 7.5 | A 移动排印最干净；D 克制但 ghost 数字裁切添噪；H 比 R1 收敛仍偏密 |
| originality | 7.0 | 7.0 | 9.5 | H 把"访客是 query"落到菜单/palette/404 三层交互；A/D 概念成立但交互层常规 |
| typography | 9.0 | 8.5 | 8.0 | A 390px hero 字阶最强；D serif 显示好、mono 行距密；H 真字阶已建立 |
| information_hierarchy | 8.5 | 8.5 | 8.5 | 三案各有编号/计数体系；A 章节条、D 状态语义、H 分型结果 |
| ux | 8.0 | 7.5 | 8.5 | H palette 导航在触屏最顺手；D 深链死路扣分；A 单页 + overlay 稳 |
| **mobile_experience** | **7.5** | **8.0** | **8.5** | A demo 排序 bug + 5 处小目标；D 边注折叠/沙盒最正确但链接层漏 44px + 深链死路；H 菜单/palette/404/空态全面且 44px 纪律最广 |
| technical_feasibility | 9.0 | 7.5 | 7.5 | A 纯函数引擎最稳；D/H 的动画层与索引层复杂度更高但已跑通 |
| long_term_maintainability | 8.5 | 7.5 | 7.5 | A content/ 数据驱动最干净；D 状态台账需养护；H 隐喻执法成本高 |
| research_presentation | 8.0 | 9.0 | 8.5 | D Question Ledger 仍是研究叙事天花板；H 主题/问题结构好 |
| portfolio_presentation | 8.0 | 8.0 | 8.0 | 三案 Work 均有"可运行证据"链接；D 的 TRY IT NOW 直达沙盒最佳 |
| light_mode | 8.5 | 8.5 | 8.0 | D 的 cream/ink 移动端最舒服；A 近似；H 色阶略灰 |
| dark_mode | 8.5 | 8.0 | 8.0 | A 字重补偿在移动 dark 上见效（a2 mobile dark）；D/H 无 halation |
| performance | 8.5 | 8.0 | 7.5 | A 自托管字体+无重库；H 三字体+首访动画略重 |
| accessibility | 8.5 | 8.0 | 9.0 | H skip/aria/降级纪律最完整；A aria-live/aria-pressed 到位；D 有 coarse CSS 但漏 a |

**均分**：A 8.29 / H 8.25 / D 7.96

## 5. Top 排名（本评委）

1. **H「检索系统」** — 移动导航是唯一被"重新发明"而非"收缩"的：菜单、palette、404、空态四件套在 390px 全部成立且可实测复现，44px 纪律覆盖最广。
2. **A「Monograph」** — 目录 overlay + 章节指示条 + scroll-padding 显示真重设计诚意，但旗舰 demo 的防御开关在移动端暴露出"排名与分数自相矛盾"的诚实性硬伤，正文触控目标未达标。
3. **D「Offprint」** — 沙盒行为正确性第一、边注折叠与 coarse-pointer 意识全场唯一，但 13 处 16px 触控行与三节深链 404 让"移动优先"停在降级而非重构。

## 6. 关键证据索引

- 脚本输出：`reviews/round_02/_crops/j6_tap_audit.json`（44px 审计 + 溢出）、`j6i_log.txt`（A 导航/沙盒、D reveal/折叠、H palette）、`j6x_log.txt`（D/H 沙盒排名、三案主题循环）
- A：`_crops/j6i_a_index.png`、`j6i_a_sandbox_injected.png`、`j6i_a_sandbox_defense.png`（bug 现场）、`j6x_a_theme_after2taps.png`；`shots/gen2/team_a_monograph/a2.a2.home.mobile.{light,dark}.png`
- D：`_crops/j6i_d_contents.png`、`j6i_d_sidenote_open.png`、`j6i_d_work_scrolled.png`、`j6x_d_sandbox_defense.png`；`shots/gen2/team_d_offprint/dp.dp.work.mobile.light.png`（404 现场）、`dp.dp.labcorruption-sandbox.mobile.light.png`
- H：`_crops/j6i_h_menu.png`、`j6i_h_palette_query.png`、`j6x_h_sandbox_injected.png`；`shots/gen2/team_h_retrieval/hp.hp.publications.mobile.light.png`、`hp.hp.labcorruption-sandbox.mobile.light.png`（404 现场）
- 源码定位：A `generation_02/team_a_monograph/src/sections/Lab.tsx:69-85`、`src/components/RankRow.tsx:27`、`src/index.css:54`；D `generation_02/team_d_offprint/src/index.css:365-372`、`src/App.tsx:37-39`；H `generation_02/team_h_retrieval/src/components/Header.tsx:7-18`
