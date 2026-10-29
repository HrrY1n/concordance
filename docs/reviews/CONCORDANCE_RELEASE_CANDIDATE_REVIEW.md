# CONCORDANCE — Release Candidate Review（发布前独立验收报告）

日期：2026-10-30 · 工作目录：`D:\Codex\Vibe Coding\portfolio`
方法声明：本报告全部结论来自本轮独立取证（真实 git 历史、源码直读、无 SPA 回退静态服务器实测、
Playwright/axe 复跑、PerformanceObserver 实测），不引用上一轮报告作为证据。

---

## A. 最终状态

| 项 | 值 |
|---|---|
| 工作目录 | `D:\Codex\Vibe Coding\portfolio`（remote 已核实 github.com/HrrY1n/concordance） |
| 分支 | `codex/concordance-real-content-cases` |
| main / origin/main | `5d404c9`（两者一致，未动） |
| 分支 HEAD（评审开始时） | `7ae9845` |
| 分支提交链（评审开始时） | `ff995e9` → `cb08c92` → `bf453c6` → `7ae9845`（共 4 个提交） |
| 本轮新增提交 | 1 个（RC 修复 + 本报告，见 F） |
| 工作树 | 评审开始时干净；本轮修复后提交并回到干净 |
| 推送/合并/部署 | 均未执行 |

## B. 上一轮报告复核（逐项）

| 上一轮声明 | 独立裁决 |
|---|---|
| 删除虚构 sample 项目和笔记 | **证实**（源码直读：projects/notes/research 现为三真实项目 + 一真实笔记 + 空问题台账；契约测试守卫） |
| `profile.handle="HrrY1n"` | **证实**（profile.ts + 类型注释 + handle↔github 一致性测试；name/location 仍 null，JSON-LD 构建 logic 仍走 WebSite 分支） |
| 三件真实作品 | **证实**（三个公开 repo 链接均 https://github.com/HrrY1n/… 格式，item-storage/soundisle 内容本轮逐事实复核，见 C） |
| `/work/item-storage-app`、`/work/soundisle` | **证实**（路由、模板、内容、截图、references 全部在源码与 dist 落地） |
| 真实工程笔记 | **证实且予以保留**（裁决见 C.5） |
| 案例数据模型与模板 | **证实**（cases.ts + CasePage 单模板；projectId 编译期关联） |
| sitemap 路由独立静态 HTML | **证实但修正**：实测 **12** 条（9 静态 + 2 案例 + 1 笔记），上轮报告写"13"系笔误——已在原报告原地修正并标注；9+2+1=12 与你的推算一致 |
| 静态深链 HTTP 状态 | **证实**：无 SPA 回退静态服务器实测，12 路由全部 200 + 逐路由 head 正确；ghost slug 与随机路径 404；上轮"HTTP 状态属部署行为未实测"的缺口本轮已在本地补齐（线上复核仍属部署后动作） |
| 修复 MobileMenu 与 backdrop 焦点问题 | **证实**（App.tsx openMenu 助手 + 两处 preventDefault；4 场景回归套件本轮复跑通过） |
| 95 项 Vitest、15 项 Playwright | **证实并增长**：本轮 96 vitest（+1 sandbox-head 守卫）、15 playwright，全部复跑绿 |
| 多视口双主题截图 | **证实**（34 张矩阵本轮重采：0 控制台错误、0 横向溢出） |
| 未推送、未合并、未部署 | **证实**（main/origin/main 均 5d404c9） |
| "四个提交"与报告列出 3 个 SHA | **澄清**：第 4 个提交 = `7ae9845`（验收证据 + 报告归档），上轮报告 A 节写"+ 本报告与 shots 归档提交"但未给 SHA，H 节亦未列——表述不严谨，非历史不一致；原报告已补记 |

## C. 内容最终验收

### C.1 个人定位 — PASS
identity 行 "Computer Science — Master's · RAG robustness · knowledge poisoning · AI security · Independent software"：硕士身份、研究兴趣（兴趣措辞，非成果声称）、独立软件三要素齐备；about（英/中）为第一人称兴趣陈述，无奖项/单位/成果夸大；`handle` 只作 @署名渲染（About "kept by @HrrY1n — the public signature; a legal name stays unpublished"）；name/location null；links.github = https://github.com/HrrY1n（测试强制与 handle 一致）；email/Scholar/ORCID/LinkedIn 保持空态；JSON-LD = WebSite schema。

### C.2 三个公开项目 — PASS
Private Item Library（active · v0.1.0）、SoundIsle·声屿（maintained）、Concordance（active），每条带证据链； fabricated 三条目（poison-sandbox/retrieval-lens/robust-eval-kit）确认不存在且有防回归断言。

### C.3 两篇案例事实矩阵（本轮逐条复核摘要）

**item-storage-app** — 全部 VERIFIED / SUPPORTED：
| 文案声明 | 证据 | 判定 |
|---|---|---|
| local-first、IndexedDB/Dexie、离线默认 | package.json dexie 4.4 + README"数据默认保存在当前设备" | VERIFIED |
| 校验 ZIP 备份（JSZip，含业务数据+用户资产） | jszip 依赖 + backupService.ts + README | VERIFIED |
| 恢复码配对的可选云同步（Workers/D1） | syncService.ts"绝不自动 push/pull" + wrangler.jsonc d1_databases + README 恢复码 | VERIFIED |
| 生命周期 心愿→持有→已处置（售/弃/其他） | README | VERIFIED |
| 220 图标（768×768 透明插画）、九类、中英别名搜索 | public/icons/items 220 webp 实数 + icons.ts 注释 + README | VERIFIED |
| 7+49 分类、保修 3/6/12/24/自定义 | README | VERIFIED |
| 迁移/仓库/备份/同步有 fake-indexeddb 测试 | src/db/migration*.test.ts 等 10+ 测试文件 + devDeps | VERIFIED |
| 安全更新（保留编辑、操作完成再刷新） | pwaUpdateTransition.ts + README | VERIFIED |
| 截图为 2026-10-19 / v0.1.0 期采集（隔离浏览器示例数据） | README 界面预览节明载 | VERIFIED（caption 已去掉"220"字样避免版本错配——截图为 217 图标期，现状 220 以正文为准） |
| 反思段：合并语义保守、AI 配额暂停、图标按需增长 | 审计取证 + README/ai-recognition.md | SUPPORTED（诚实表述，无夸大） |

**soundisle** — 全部 VERIFIED / SUPPORTED：
| 文案声明 | 证据 | 判定 |
|---|---|---|
| 六通道全合成、零音频素材 | 仓库 find 零音频文件 + hero 截图六通道 UI | VERIFIED |
| 雨/炉火/风的合成配方（滤波噪声/事件声/双 LFO） | docs/iterations + 源码（取证 Agent file:line） | VERIFIED |
| 浪层绑定启用通道的实时频谱；静音 dim 38% | canvas 渲染源码 | VERIFIED |
| 场景预设（雨夜阅读/炉火冬夜/森林清晨/夏夜庭院） | hero 截图可见 | VERIFIED |
| 通道图（HP 24Hz→LP 9kHz→压缩器→分析器）、DC 去除+60ms 交叉淡化 | 源码 | VERIFIED |
| Date.now 锚定计时器、25/5·50/10·90/15·自定义、FM 铃声、标题倒计时 | FocusTimer 源码 | VERIFIED |
| 35.24KB JS（gzip 12.39）、单一字体依赖、无框架 | 构建实测 + package.json（唯一运行时依赖 @fontsource） | VERIFIED（数字随后续提交会漂移，但可随时复测） |
| 七轮迭代+Code Review；R6 实测 −10dBFS→−34.2dB 零削波 | docs/iterations.md（README 的"五轮"过时，正文以文档实数为准） | VERIFIED |
| 32 Vitest 用例（计时器/统计/存储/预设） | 实跑 vitest 1.47s 全过 | VERIFIED |
| 反思段：setTimeout 调度、无混响/单声道、移动端防御浅、reduced-motion 静帧 | 源码 + 取证 | SUPPORTED（诚实局限） |
| 截图 provenance（headless 渲染、种子状态 JSON 同目录保存） | provenance/ 两 JSON | VERIFIED（本轮已修剪其中的合成使用统计字段——避免被误读为真实使用记录，仅保留场景相关 theme/channels/mode） |

**部署状态**：两案例均如实不提供 live demo 链接（soundisle Pages 实测 404；item-storage 无公开部署）。无"未上线写成线上可用"的表述。

### C.4 研究方向与联系方式 — PASS
六个研究方向保留（公开主题定位，不含未发表实验内容）；问题台账诚实空态；rag 私有仓零出现（泄漏扫描含 chains/cases/lab 数据守卫）。

### C.5 工程笔记裁决 — **保留**
"The archive is the instrument"（/notes/archive-as-instrument）：① 有独立知识价值（typed-content → 编译期交叉引用 → 派生读数 → BM25/KWIC 引文层 → sitemap 派生，是一条完整可迁移的工程论述）；② 技术解释全部可对照本仓库验证（正文代码块即 sitemap.ts 真实函数）；③ 与 Concordance 案例不重复（本站无案例页，Work 页为 "you are standing in it"）；④ 无虚构第一人称经历（描述的是当下、在场、可验证的站点本身）；⑤ 不是为填空而生——删除它 Notes 页有合格空态，但该文是 Notes 语法（ESSAY register）目前唯一的真实内容载体。**结论：保留，无需精简（六段、两个 sidenote、一个真实代码块，密度合格）。**

## D. 视觉最终验收 — PASS

- 本轮重采 34 张矩阵（11 路由 × 1440/390 全页 + 双主题 + 1280/768/360 + palette/移动菜单交互态）：**0 控制台错误、0 横向溢出**；上轮 26 张精选已入仓 `shots/real-content-cases/`
- 深浅双主题目检（首页全页 light+dark）：阅读室主题下案例图版对比与层次成立，无布局漂移
- Work→案例入口、两案例视觉差异（产品界面证据排版 vs 沉浸夜海场景）在截图与实测导航中确认（work→case→back→forward 链路通过）
- **本轮唯一视觉相关回归风险**（Suspense 骨架，见 F.3）经 axe 与全矩阵复跑确认无影响

## E. 工程最终验收

| 门禁 | 本轮结果 |
|---|---|
| `npm run typecheck` | ✓ |
| `npm run lint` | ✓ 0/0 |
| `npm test` | ✓ **96**（新增 /lab/corruption-sandbox head 守卫） |
| `npx playwright test` | ✓ **15**（11 页 axe 零 critical/serious + 4 焦点回归） |
| `npm run build`（base /） | ✓ |
| `VITE_BASE=/concordance/` 构建 | ✓ |
| `npm run build:single` | ✓ 842KB 自包含；无路由目录泄漏；HashRouter 切换保留 |
| **无 SPA 回退静态服务器全路由验证** | ✓ 12/12 路由 200（含无斜杠 301→200）；逐路由 title/description/canonical/og:url/og:title/og:description 断言通过；`/work/ghost-slug` 与随机路径真实 404；案例图/og.png/robots/sitemap 资源 200；`/concordance/assets/*.js` 加载 200 |
| 控制台 | 0 错误（全部巡检轮次） |
| **性能（PerformanceObserver 实测，localhost）** | LCP：首页 72-200ms、案例 376-480ms、notes/research ~340ms；**CLS：全部路由 0**（修复前案例页 0.393、notes 0.232，见 F.3）；传输量：home ~278KB、item-storage 案例图 ~3.0MB（7 图，1 eager + 6 lazy）、soundisle ~1.2MB——本地缓存致 transferSize 失真，采用 encodedBodySize 口径 |
| INP / Lighthouse | 未测（INP 需真实交互数据；不引入重型依赖——按任务书边界） |

**SEO 边界（保持准确表述）**：静态 head 输出（逐路由 title/description/canonical/OG）+ SPA 客户端渲染正文——非完整 prerender；README 已如实标注。

## F. 修复清单（本轮全部实际修改）

1. **时间线里程碑出清**（P0-诚实性）：删除"Two case studies published"条目——分支未合并未部署，"published"不成立；只保留真实的"This site went online"。文件：`final/src/content/timeline.ts`。验证：源码直读 + 内容契约测试仍绿。
2. **colophon 绝对化声明收敛**（P1-文案）：`"everything this archive lists is real."` → `"work links to its public repositories, Lab demos run on hand-written teaching data, and details not yet configured stay empty."`——覆盖三项语义（作品可溯源/教学数据明确/未配置留空），不再作全站绝对担保。文件：`final/src/lib/sections.ts`。验证：vitest（"No sample entries remain" 前缀断言仍过）+ 首页目检。
3. **懒路由 CLS 修复**（P1-性能，实测 0.393→0）：根因是 `<Suspense fallback={null}>` 使懒路由 chunk 到达前整个 main 为空（footer 从 y≈64 跳至页底，位移源取证确认）。修复：首屏高度骨架 fallback。文件：`final/src/App.tsx`。验证：PerformanceObserver 复测 case-item-storage / case-soundisle / notes / research / work **CLS 全部 0**；axe 15 项与 34 张矩阵复跑无回归。
4. **/lab/corruption-sandbox 静态 head 兜底缺陷**（P1-SEO）：该路由不在 STATIC_PAGE_META，title/og:title 落到裸品牌 "Concordance"。修复：补路由元数据（title + SandboxPage 同款 description）；新增守卫测试断言**所有 sitemap 路由不得使用裸品牌兜底标题**。文件：`final/src/lib/sitemap.ts`、`final/src/lib/__tests__/sitemap.test.ts`。验证：无回退静态服务器 12 路由 head 断言全过 + vitest 96 绿。
5. **案例图 CLS 加固**（P1-性能）：11 张案例图补 intrinsic width/height（数据层 `w`/`h` 字段 + 组件属性，CSS h-auto max-w-full 保持响应式与不放大）。文件：`final/src/content/cases.ts`、`final/src/pages/CasePage.tsx`。验证：与 F.3 合并复测 CLS=0；34 张矩阵无图片变形。
6. **provenance 隐私修剪**（P1-隐私）：storage-hearth.json 移除合成使用统计（日期+秒数可能被误读为站长真实使用记录），保留场景相关 theme/channels/mode。文件：`final/public/cases/soundisle/provenance/*.json`。验证：JSON 直读复核，无路径/令牌/机器信息。
7. **图标数版本错配**（P1-文案）：icon-picker 截图（2026-10-19、217 图标期）的 caption 去掉 "220" 字样；220 现状值保留在正文（源码实数）。文件：`final/src/content/cases.ts`。验证：README 界面预览节 + icons.ts git 历史（截图后确有新增图标提交）。
8. **上轮报告两处笔误**：sitemap 13→12（原地修正并标注）；第 4 提交 SHA `7ae9845` 补记。文件：`docs/reviews/CONCORDANCE_REAL_CONTENT_CASES_REPORT.md`。

未修改项（无证据不动）：案例正文数字（全部有源）、Notes 保留裁决、双主题/字体、README 深链事实段（上一轮已改对）。

## G. 发布就绪判定

# **READY FOR RELEASE APPROVAL**

依据：本轮 P0 全部清零（唯一 P0 候选——时间线"已发布"虚构——已删除）；P1 修复完成且全部复测通过（96 vitest / 15 playwright / 双构型 build / 无回退静态服务器 12 路由全验证 / CLS 0 / 零控制台错误 / 零溢出）；内容事实矩阵无 INCORRECT 项；个人信息零泄漏；其他仓库零改动。**不依据"构建成功"下结论**——判定基于上述逐项实测。剩余事项均为部署后动作或用户决策（见 H），不构成发布前阻断。

## H. 发布准备事项（仅流程，不执行）

1. **合并**：用户审阅本报告与 `docs/reviews/CONCORDANCE_REAL_CONTENT_CASES_REPORT.md` 后，在本地 `git checkout main && git merge --no-ff codex/concordance-real-content-cases`（保留分支历史；合并前 `git status` 确认干净）。
2. **触发部署**：`git push origin main`——现有 `.github/workflows/deploy.yml` 自动构建（VITE_BASE=/concordance/）并发布 GitHub Pages。
3. **确认部署 SHA**：GitHub → Actions 最新 run 的 commit 应为合并后的 main SHA；或部署完成后对比线上 colophon 的 build 日期与 `https://hrry1n.github.io/concordance/` 的 `og:url`。
4. **深链验收**（部署后）：
   `curl -sI https://hrry1n.github.io/concordance/work/item-storage-app`（期望 HTTP 200）
   `curl -sI https://hrry1n.github.io/concordance/work/soundisle`（同上）
   `curl -s https://hrry1n.github.io/concordance/sitemap.xml | grep -c "<loc>"`（期望 12）
   浏览器打开两个案例深链，确认渲染与 title/canonical。
5. **分享预览**：og:image 为 1200×630 的 `og.png`（无名版本，名字定稿后可重制）；用 WhatsApp/Slack 粘贴链接核对 og:title/description 出逐路由文案。
6. **回滚**：若部署异常，`git revert` 合并提交（或 `git reset --hard 5d404c9 && git push --force-with-lease origin main`——后者会重写远端 main，需明确确认后使用）；Pages 亦可暂时回退到 Actions 中上一个成功的部署 run（Re-run previous workflow）。

## I. 最终交接

- **报告**：`docs/reviews/CONCORDANCE_RELEASE_CANDIDATE_REVIEW.md`（本文件）
- **提交**：分支 HEAD = RC 修复提交（7ae9845 + 1）；链：ff995e9 → cb08c92 → bf453c6 → 7ae9845 → RC
- **主要源码改动（本轮）**：App.tsx（Suspense 骨架）、sections.ts（colophon）、sitemap.ts + 测试（sandbox head + 守卫）、cases.ts（w/h、caption、provenance 修剪）、CasePage.tsx（width/height）、timeline.ts（里程碑出清）、上轮报告修正
- **验证结果**：见 E 表——typecheck/lint/96 vitest/15 playwright/双构型 build/静态 12 路由/CLS 0/0 控制台错误
- **截图**：`shots/real-content-cases/`（26 张入仓）+ `D:\Codex\play\conc_impl_work\acceptance\`（34 张全矩阵）
- **本地运行**：`cd final && npm run dev`（5173）· `npm run build && npm run preview`（4173）
- **阻断问题**：无
- **其他仓库**：item-storage-app / soundisle / LeeGym / Java-AI-Learning-Roadmap 零改动（隔离副本仅读取）

**本轮到此停止**：未推送、未合并、未部署；等待用户批准发布流程。
