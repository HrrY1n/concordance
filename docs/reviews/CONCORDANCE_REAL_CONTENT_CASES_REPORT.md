# CONCORDANCE — Real Content & Cases Pass 交付报告

日期：2026-10-30 · 执行环境：本地 `D:\Codex\Vibe Coding\portfolio`（用户迁移后的实际仓库位置）

---

## A. 实施摘要

| 项 | 值 |
|---|---|
| 分支 | `codex/concordance-real-content-cases`（自 main@5d404c9 切出） |
| 基线 SHA | `5d404c9b21d07e385dea24fbfc058ba76a906dad` |
| 最终 SHA | `bf453c6`（+ 本报告与 shots 归档提交） |
| Git 状态 | 分支内三段式提交（见 H）；未推送、未合并、未部署 |
| 提交历史 | `ff995e9` 焦点修复+回归 → `cb08c92` 真实内容+案例系统 → `bf453c6` 静态深链+文档清理 |
| 改动规模 | 46 文件，+1241 / −422（不含截图资产与报告） |
| 位置说明 | 旧目录 `D:\Codex\play` 系用户主动迁移；本仓库在 `D:\Codex\Vibe Coding\portfolio`，remote 已核实为 github.com/HrrY1n/concordance |

**新增功能**：案例系统（`cases.ts` + `/work/:slug` 单模板）、深链静态输出（HTTP 200 + 逐路由 head）、CASE 搜索记录、公开署名（handle）体系、焦点回归套件、逐路由 head 派生器（routeHead）。

## B. 真实内容变化

**删除（不是改名重包装）**：
- sample 项目 `poison-sandbox` / `retrieval-lens` / `robust-eval-kit` 及其虚构证据链（"inspection notebooks (private)" 一类不可核验声明随之消失）
- 第一人称样例笔记 n1–n3（首页预览行 P0 漏网随之消失）
- 样例研究问题 q1–q4 → 台账诚实空态（EmptyState 语法；分布图 n=0 时隐藏）
- Context Budget 语料的 "Note n1/n3" 来源引用 → "hand-written for this demo"
- poison-sandbox 以真实身份保留：Lab 仪器（§03，Corruption Sandbox），不再是独立项目履历

**新增（全部可核验）**：
- 三件真实作品：**Private Item Library**（github.com/HrrY1n/item-storage-app，active）、**SoundIsle·声屿**（github.com/HrrY1n/soundisle，maintained）、**Concordance**（本站）
- 一篇真实工程笔记 `/notes/archive-as-instrument`（"The archive is the instrument"）——所有声明对着本仓库可验证；**发布前可整体删除（一个数组项），不产生悬挂引用**
- 两篇完整案例：`/work/item-storage-app`、`/work/soundisle`
- 时间线新增一条真实里程碑（两案例上线）

**保持空态（用户未提供，一律未填）**：真实姓名（profile.name=null）、城市/学校、email、Scholar/ORCID/LinkedIn、publications（空态页保留）。**未公开**：任何 rag 私有研究仓的内容、未发表方法细节（rag_poisoning_bench 仅在审计层确认不可见，站内零出现——契约测试在守）。

**定位落地**：`profile.handle="HrrY1n"`（公开署名新字段，类型注释明确"不得进入 Person JSON-LD"）；identity 行、hero 双声部、about（中英）按已确认定位重写；GitHub 入口启用且与 handle 一致性受契约测试约束；JSON-LD 保持 **WebSite** schema。

## C. 案例系统

- **路由**：`/work/:slug`（lazy），App.tsx 注册；未知 slug 渲染 404（与 /notes/:slug 同语法）；浏览器前进后退、ScrollManager、移动端、键盘导航全走既有机制
- **数据模型**：`content/cases.ts`——`projectId` 用编译期 union 关联 projects（案例不能脱离真实项目存在）；单模板 `pages/CasePage.tsx` 渲染所有案例，零 TSX 复制
- **register 节奏**：PLATE（hero+元数据+provenance）→ ESSAY（叙述+实拍）→ LEDGER（可核验 references）→ PLATE（next case）
- **截图来源**（全部真实运行画面，零 mockup/重绘）：
  - item-storage-app：复用其仓库自带 `docs/screenshots/current/`（README 记录溯源：2026-10-19 隔离浏览器示例数据、390×844@2x / 1440×1000）
  - soundisle：本轮从克隆副本运行实拍（headless Edge/Chromium），种子状态 JSON 存于 `public/cases/soundisle/provenance/`；**soundisle 仓库本身零改动、未部署**
- **搜索/sitemap**：CASE 记录入索引（"local-first""web audio"可检索）；PROJECT 记录在存在案例时直链案例；sitemap 派生 `/work/:slug`
- **数字溯源**：220 图标（=public/icons/items webp 实数）、7+49 分类、6 通道合成、32 用例、35.24KB JS（gzip 12.39）、−34.2dB/−10dBFS（R6 实测）、7 轮迭代（README 的"五轮"过时，案例以 docs/iterations.md 实数为准）、LGPL 不涉及；item-storage 的 Cloudflare Workers/D1 由 wrangler.jsonc 证实

## D. 视觉成果

- 截图库：`shots/real-content-cases/`（26 张精选：11 路由 × 1440/390 全页 + 双主题 + 1280/768/360 视口 + palette/移动菜单交互态）
- 完整矩阵（34 张，含 5 视口×双主题）在仓库外 `D:\Codex\play\conc_impl_work\acceptance\`
- 首页对比：身份行实名化、双声部 hero、PLATE 01 = Private Item Library + "Read the case study →"、Connect 条启用 GitHub、colophon 自动翻转为 "No sample entries remain — everything this archive lists is real."
- 案例页：旗舰案例如杂志式证据排版（桌面 hero + 两组移动双栏）；SoundIsle 以夜海 hero + 混音=风景双图 + 375px 移动图形成与旗舰的视觉差异；图片 `max-w-full` 不放大（手机截图不糊）
- 双主题一致：案例图版在暖纸/阅读室两主题下均为"贴在纸面的图版"；零横向溢出（110 次加载实测）

## E. 工程验证

| 门禁 | 结果 |
|---|---|
| `npm run typecheck` | ✓ |
| `npm run lint` | ✓ 0 error 0 warning |
| `npm test` | ✓ **95**（基线 84 → 新契约改写 + routeHead/案例/资产在盘/泄漏扫描扩展） |
| `npm run build`（base / 与 VITE_BASE 双构型） | ✓ |
| `npx playwright test` | ✓ **15**（11 页 axe 零 critical/serious + 4 项焦点回归） |
| 控制台错误 | 0（110 次页面加载巡检） |
| 深链 HTTP 状态 | 本地 vite preview 下 `/work/item-storage-app` 等输出为静态目录（200）；**线上 Pages 状态码属部署行为，按"不部署"约束未实测（见 G）** |
| Lighthouse | 未运行（避免引入新依赖；页面级指标列入后续可选） |

**审计纠错落实**（任务书第三节）：焦点归还主路径（App.tsx P0-13）经浏览器 6 场景验证**本来就在**——上一轮审计"完全未实现"系漏查 App.tsx 的误报。浏览器实测发现并修复的是两个**不同**的真缺陷：① MobileMenu 开启绕过 rememberTrigger（Esc 后焦点落 body）；② palette/help backdrop `mousedown` 缺 `preventDefault`（默认焦点转移在 restore 之后执行抹掉恢复）。修复 + `e2e/focus.spec.ts` 四场景回归（palette 点击/Esc、backdrop、mobile menu、Enter 导航后 main 聚焦）。

**深链方案说明**：构建期把 sitemap 每条路径写成 `dist<route>/index.html`（共享 SPA 外壳 + `routeHead()` 派生的逐路由 title/description/canonical/og:url/og:title/og:description）。**如实声明：这是静态 head 输出，不是完整 body prerender**——正文仍由客户端渲染，404.html SPA 回退保留为兜底。routeHead 全部派生自内容层（sitemap.test.ts 新套件守卫），dist 实测逐路由 title/canonical/og:description 正确。

## F. 已知限制

1. **HTTP 状态码未在线上验证**——需部署后 `curl -I` 复核（本轮禁止部署）。
2. 静态 head ≠ 完整 prerender：社交爬虫拿到正确 head，但正文快照需 JS；若未来需要完整正文快照，再评估 renderToString 方案。
3. soundisle 无公开线上 demo：案例页如实只放仓库链接（README 404 实测），未放假 demo 按钮。
4. item-storage-app 无 LICENSE：报告标注，未代为选择许可证（本轮未改任何其他仓库）。
5. Lighthouse/真实设备手感未测量。
6. `reports/qa-matrix.mjs` 修复了 `NAME[undefined]` 笔误与硬编码旧绝对路径（迁移后必崩），未做更大 QA 基建重构（按任务书边界）。

## G. 发布前事项（需用户处理）

**状态：开发完成、测试通过、待用户审核、不部署。**

1. 审阅两篇案例内容（`final/src/content/cases.ts`）与真实笔记（`final/src/content/notes.ts`）——文案语气、范围、数字引用是否符合你的预期；笔记可整体删除
2. 审阅 about/hero 文案（profile.ts / site.ts）与 `handle` 署名方式
3. 部署后复核：深链 200（`curl -I https://hrry1n.github.io/concordance/work/item-storage-app`）、sitemap 13 条 URL、分享预览图
4. 决策项：item-storage-app 是否补 LICENSE（其仓库）；soundisle 是否部署 Pages（案例可后补 demo 链接）
5. og.png 仍是无名版本（1200×630，site.name 品牌）——名字公开后再刷新

## H. 最终交接

- **提交**：分支 `codex/concordance-real-content-cases`，`ff995e9` → `cb08c92` → `bf453c6`（+ 本报告提交）；main 与 origin 未动
- **本地预览**：`cd final && npm run dev`（5173）；生产预览 `npm run build && npm run preview`（4173）；单文件 `npm run build:single`
- **主要页面**：`/` · `/work` · `/work/item-storage-app` · `/work/soundisle` · `/research` · `/notes` · `/notes/archive-as-instrument` · `/about` · `/connect` · `/lab` · `/work/ghost-slug`（404 态）
- **截图**：仓库 `shots/real-content-cases/`（26 张）；全矩阵 `D:\Codex\play\conc_impl_work\acceptance\`（34 张）
- **报告**：`docs/reviews/CONCORDANCE_REAL_CONTENT_CASES_REPORT.md`（本文件）
- **测试**：typecheck ✓ · lint 0/0 · vitest 95 ✓ · axe 11 页 + 焦点 4 项 ✓ · 双构型 build ✓
- **阻断问题**：无（部署后需复核线上状态码，见 G）
- **其他仓库**：item-storage-app / soundisle / LeeGym / Java-AI-Learning-Roadmap 零改动（仅克隆读取取证）；隔离副本在 `D:\Codex\play\conc_impl_work\`
