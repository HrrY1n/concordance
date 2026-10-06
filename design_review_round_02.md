# Round 2 评审报告 — design_review_round_02.md

> Top 3（A「Monograph」/ D「Offprint」/ H「检索系统」）已从提案进入**可运行实现**（`generation_02/`）。
> 10 位评委基于渲染截图（1440/768/390 × light/dark × 6 页面）、交互验证脚本、源码抽查与 DESIGN_NOTES 核验独立评分。
> 逐案详评见 `reviews/round_02/judge_*.md`；分数数据 `reports/round_02_scores.json`；聚合输出 `reports/round_02_aggregate.md`。

## 1. 评审设置

- 证据：三案各 42 张渲染截图（home 整页 ×6、research/work/lab/lab-corruption-sandbox/publications ×30）+ Round 1 首屏截图；三案 `*.console.json` 全部为空（0 error / 0 warning）。
- 方法：先截图后源码；移动端评委实跑 390/430px 触屏交互脚本（24 张证据截图）；无障碍评委 token 级对比度实算；工程评委本机复跑 `npm run build` 与 sandbox 验收脚本。
- 归一化与 Round 1 相同（评委内 z-score + Top3 票点）。

## 2. 总排名

| 排名 | Team | 归一化总分 | 原始均分 | Top3 票点 |
|---|---|---|---|---|
| 1 | **A「Monograph」** | 3.99 | 8.31 | 20 |
| 2 | **H「检索系统」** | 1.38 | 8.29 | **25** |
| 3 | **D「Offprint」** | −5.37 | 8.05 | 15 |

| 评委 | Top 3 |
|---|---|
| 视觉 | A > H > D |
| 排印 | A > H > D |
| UX | H > A > D |
| 工程 | H > D > A |
| 无障碍 | H > A > D |
| 移动端 | H > A > D |
| 研究者 | D > H > A |
| 招聘者 | D > H > A |
| 产品设计师 | A > H > D |
| 原创性 | H > A > D |

**读法**：A 是"没有短板的完整执行"（5 位评委排第一）；H 是"最有记得住的灵魂 + 最完整的可用性工程"（Top3 票点全场第一，6 位评委排第一）；D 的研究展示仍是天花板，但其两处渲染层缺陷（见 §4）使其在"通用证据管线"（整页截图/打印/慢机）上系统性失分。

## 3. 共识结论（三案进化验证）

### A「Monograph」— Round 1 两个负分靶点确认转正
- originality −0.52 → 本轮视觉/排印/产品/原创评委均确认 FIG.1「数据即颜料」与 accent 语义图例构成可认领的签名；portfolio_presentation −0.87 → Plate 图版语法全程在场。
- 排印评委："字距曲线/双语气/暗色补偿全部兑现"；产品评委："决策→代码转化率与整页完整性双第一"。
- 残留短板：single-page 无真路由（研究者评委否决性短板："章节锚点必须是真实 URL"）；research 台账偏薄；Lab 旗舰 demo 的防御开关**不改排序**（rank01=1.24 < rank02=2.46，`Lab.tsx:69-85`）——诚实性硬伤（工程+移动评委实证）；`ink-4`（2.55:1）造成四处 AA 硬失败；死依赖（react-router-dom/lucide-react 零 import）。

### H「检索系统」— 进化幅度最大，架构资产全场最值钱
- Round 1 最弱两维度翻正：typography（真字阶重建）与 visual_quality（减法去噪）；originality/a11y/ux 保持全场第一。
- 架构资产：真路由扩容架构（7 路由）、唯一完整 combobox 检索（SearchPalette）、唯一 prefers-contrast + noscript 骨架、唯一把防御开关做成"重排后再取 top5"的正确 demo（`bm25.ts:73-79`）、skip 四路、Self-Query 降级终态化。
- 残留短板：Work 段偏干（视觉评委："距第一只差 Work 段一次重排"）；faint token（3.49–3.83:1）泄漏到诚实声明行等可读文本；移动端无 safe-area 处理；7 路由零代码分割（138KB 单 bundle）。

### D「Offprint」— 概念最强、渲染层两处用户可见失败
- research_presentation 1.20 仍为第一（Question Ledger + 状态图例 + relatedDemo 稳定 id 回链 + 全场最佳 sandbox 工程）。
- **缺陷 1（系统性）**：`chrome.tsx:56-78` 的 Reveal 组件用 whileInView + initial opacity:0 门控所有正文 —— 整页截图/打印/无 IO 场景 60% 内容隐形；`ul>motion.div>li` 非法 DOM；~60 个 observer 增长负担。
- **缺陷 2（单点）**：边注 `sn-float` 负 margin 逃逸造成与台账图例叠印（light 首屏可见）。
- 连带后果：信息层级与 UX 被三位评委压到 6.5–7.0（"带病存活、限期修复"——UX 评委原话："两处都是一行修复，修完即回到第一梯队竞争"）。
- 其余资产：朱批（数据驱动的 margin note）、幽灵编号空态、radiogroup/aria-live、SSR 冒烟脚本、编译期 content 白名单契约。

## 4. Final Review 前必须修复的缺陷清单（Gen 3 验收项）

**全局（三案共有）：**
- [ ] G1 所有正文内容**默认可见**：任何入场动画只允许 transform/字重，禁止 opacity:0 初始态；无 JS（noscript）时核心内容完整可读；打印样式完整。
- [ ] G2 可读文本对比度 ≥ 4.5:1（AA）：逐 token 实算并写入 DESIGN_SYSTEM；装饰性元素才允许用 faint 级 token。
- [ ] G3 触控目标 ≥ 44px（pointer: coarse 下全部交互行/链接/按钮）；fixed 头部/全屏 overlay/页脚加 `env(safe-area-inset-*)`。
- [ ] G4 每个章节/页面有真实 URL（深链刷新不 404），404 页面兜底。
- [ ] G5 主题三态（System/Light/Dark）持久化、无 FOUC；dark 长文字重/灰度补偿；`:lang(zh)` 生效。
- [ ] G6 图片/图表双主题行为有明文规范。

**按案吸收的正确实现：**
- [ ] A1 修复 demo 防御逻辑：防御后**重新排序**再取 top5，条宽归一到防御后 max，overflow clamp（参照 D 的 `bm25.ts` 正确实现）。
- [ ] A2 `ink-4` 类低对比 token 全站清查，可读文本落点换 ≥4.5:1 token。
- [ ] A3 删除死依赖，依赖清单与 import 一致。
- [ ] D1 边注系统建 BFC/改网格定位，杜绝叠印；移动端折叠为 details 或行内。
- [ ] D2 sandbox 保留"重排式防御"+ ▲▼ delta + aria-live 分场景文案 + 0.02 下限（D 已验证正确的全套）。
- [ ] D3 content 契约升级为编译期防呆（`keyof typeof` 字面量联合替代自由字符串引用）。
- [ ] H1 诚实声明行/读数文本迁出 faint 级 token。
- [ ] H2 路由级代码分割 + 字体子集收敛（目标首屏 JS ≤ H 的 138KB，字体 ≤2 族 4 字重）。
- [ ] H3 palette 保持 combobox 完整键盘语义（aria-expanded/activedescendant 全套）。

**Meta 级（视觉/原创评委对 Round 3 的处方）：**
- [ ] M1 差异化不再来自"又一个诚实读数"，而是**单色系统内的第二次变奏**：每案被点名的升级方向——A 的第二构图、D 的第二版式密度、H 的第二段落质感——Gen 3 需要在统一语言内做出节奏变奏（段落密度、构图、图版形态的层级），消除"从 Research 到 Connect 全是同一种 mono+hairline 组合拳"的单调。
- [ ] M2 FIG「数据即颜料」从特例升级为全站语法（凡有数据可算处，用浏览器内实时计算的真数据图）。
- [ ] M3 首屏 facet/关键词从表态链接升级为真检索入口（点击即以该词为 query 打开 palette）。
- [ ] M4 删除自伤型标签（如 Question Ledger 的 "SAMPLE ENTRIES"——诚实靠页面底部的统一声明，不靠贴在每个内容模块脸上）。
- [ ] M5 Connect 空态行动导向（"Fastest signal right now: …" + 显式 mailto 槽位）。

## 5. Generation 3 指令

**定位：不再比较三案，而是产出唯一的完整站点** —— 以 H 的**架构骨架**（真路由 / palette 检索 / a11y 工程 / sandbox 正确性）为底座，注入 A 的**视觉工艺系统**（字阶纪律 / 双语气 Hero / PLATE 图版 + FIG 真数据图语法 / 色彩契约），采用 D 的**研究展示语法**（Question Ledger / 研究证据回链，低维护化改造），执行 §4 全部修复项。

必须完成的全模块：Home、Research（含 Question Ledger）、Work（PLATE 语法）、Open Source、Lab（Corruption Sandbox 旗舰 demo + ≥2 个辅助 demo）、Publications（优雅空态）、Notes（列表 + 文章版式）、About、Connect、404。数据驱动（content/*.ts 编译期契约）、双主题全 token、移动端真重设计、SEO 全套（per-route meta/OG/sitemap/robots/favicon/JSON-LD）、性能预算（首屏 JS ≤ 140KB / 字体 ≤ 2 族）、vitest 测试（sandbox 数学 / content 契约 / 主题逻辑）、eslint 零警告。

## 6. Final Review 计划

Gen 3 完成后：全页面截图（6 页 × 3 视口 × 2 主题 + 整页）+ console 检查 + 10 评委终审（对照 §4 验收项）+ 视觉 QA agent。终审通过后由 Meta Designer 做最终统一化打磨，产出 `final/`。
