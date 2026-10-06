# Round 3 终审报告 — design_review_round_03.md

> Generation 3 **CONCORDANCE**（`generation_03/`）是三轮竞赛的融合产物：H 的架构骨架（真路由/检索 palette/无障碍工程）× A 的视觉工艺（字阶/双语气 Hero/单 accent 语义/PLATE 图版）× D 的研究语法（Question Ledger/证据回链），概念为「Concordance（语词索引）——既是书又是检索系统」。
> 10 位评委基于 60 张渲染截图 + Playwright 交互实测 + 源码全读 + DESIGN_NOTES 自查表抽查完成终审。

## 1. 总评

| 指标 | 结果 |
|---|---|
| 评委裁定 | **PASS ×9，NEEDS_WORK ×1**（移动端） |
| 14 维均分 | **8.56 / 10**（全部维度 ≥ 8.0） |
| 各维度 | 可行性 8.90 · Light 8.90 · Performance 8.90 · Research 8.75 · Typography 8.70 · 信息层级 8.60 · Originality 8.50 · Visual 8.40 · A11y 8.45 · Mobile 8.30 · Portfolio 8.30 · Maintainability 8.30 · Dark 8.80 · UX 8.10 |
| 工程三关 | build 0 错（16 chunks）/ lint 0-0 / **67 测试全过**；首屏 JS gzip ≈ 101.6KB（预算 140KB） |
| 交互实测 | palette/facet/sandbox/移动导航/深链五条任务流全通；0 console error |

**评委共识**：CONCORDANCE 是"一个语言而非三张皮"——坐标系统、三档 Register、mono 读数、单 accent 语义全站闭合；对比度测试、BM25+防御重排、编译期白名单等关键承诺经实测为真。终审结论：**进入 Meta Designer 打磨阶段**，但必须先完成下表修复。

## 2. Meta Designer 工作清单（终审全员 fix 汇总）

### P0 — 用户可见缺陷 / 承诺未兑现（必修）
| # | 修复 | 证据 |
|---|---|---|
| 1 | Footer 768px 塌陷：`md:grid-cols-[minmax(0,1fr)_auto]` 实测解算为 0px/632px，左栏一词一行（18 张截图带病）；同时给 §01–§07 页脚链接加 `inline-flex min-h-[44px] items-center`（实测 14px 高，全路由触控失守） | j1/j6 · Footer.tsx:18,32 |
| 2 | hash 深链冷加载不滚动：ScrollManager 在懒加载路由 resolve 前 getElementById 落空且不重试（`/research#q1` 刷新 3.5s 仍 scrollY=0）——"坐标即地址"核心承诺只在刷新时失灵 | j3 · App.tsx:39-51 |
| 3 | FLIP 重排动画被提前掐断：flip.ts:50 双 rAF 清理移除 transition 属性，280ms 动画 ~1-2 帧即止（规范推演，高置信）——旗舰 demo "watch the ranking rewrite itself" 真机不可见 | j4 · flip.ts:44-52（transitionend once + 300ms 兜底） |
| 4 | useTheme 四处独立实例化失步：Header 标签陈旧、Shell 可静默回滚用户选择 → 单一 source of truth（context 或模块级 store） | j4 · App/Header/MobileMenu/Shell |
| 5 | MobileMenu 焦点陷阱逃逸：focus.ts FOCUSABLE 未排除 tabindex=-1，roving radio 占位"最后节点" | j5/j6 · focus.ts:8-9 |
| 6 | 首载 focus 落 main 使 skip link 形同虚设：去掉首载 focus，保留 route-change focus | j3/j5 · App.tsx:39-53 |
| 7 | /connect 320px 横向溢出 22px：不可断邮箱 + 8rem 固定标签列 | j6 · ConnectPage.tsx:73-81 |
| 8 | /lab 三个 anchor id 重复（section 与 h2 同 id）：aria-labelledby 自指、无效 HTML | j4/j5 · LabPage.tsx:25-27 |
| 9 | palette 空 query 时 slice(0,8) 吞掉 "Back to top" action（现行 bug）+ 截断无提示 | j9 · search.ts:150,168 |
| 10 | ESSAY 档名实不符：.essay 未设 serif font-family + 段距规则漏 `p + .sn-row`（n1 截图段落粘连）+ figure 硬编码 mt-5 | j1/j2/j7 · index.css:535-547 |
| 11 | 内容性 text-faint 违反自家 AA 契约：ConnectPage:84（3.52:1）、PublicationsPage:28、SearchPalette placeholder（3.79:1）；联动修正 contrast.test.ts 的不变量与"faint 必须 aria-hidden"用法守卫 | j5/j9 · 三处 + 测试 |
| 12 | MobileMenu 主题控件冗余 + "syst" 断词：compact toggle 与 radiogroup 并排二选一，修 slice 断词 | j3/j6 · Header.tsx:34、MobileMenu.tsx:161-177 |
| 13 | HelpOverlay 打开不接收焦点；palette/MobileMenu Esc 关闭后焦点丢 body → 关闭归还触发元素 | j5 |
| 14 | Work 标签检索钮 23×44、sandbox Q1/Q2 回链 18×19px → 补 44px 触控目标 | j6 · WorkPage.tsx:133-141、CorruptionSandbox.tsx:181-188 |

### P1 — 诚实系统自洽（站点自身宪法，必修）
| # | 修复 | 证据 |
|---|---|---|
| 15 | **Publications 增长路径修通**：PublicationsPage 渲染 publications.map()（编号/venue/year/null 链接隐藏），空态用 length===0 门控，幽灵行计数派生；content-contract.test.ts 空断言改为长度无关契约——当前加一篇论文会让全站三处文案说谎 + 测试变红 | j7 · PublicationsPage.tsx |
| 16 | 手写计数清零：'3 DEMOS'/'Three' ×7 处（sections.ts:47,94、lab.ts:115、LabPage.tsx:18、HomePage.tsx:291,296-297、index.html:87）+ FIG.01 '7 documents'（HomePage.tsx:40，:28 已算出）→ 全部从数据派生 | j4/j7/j9 |
| 17 | 台账↔demo/笔记回链从数据派生：SandboxPage 'RE: Q1 · Q2'、NotePage 全部链 q1 → researchQuestions.relatedDemo/relatedNotes 派生；ResearchPage:158 topic 渲染显示名而非 slug | j7 |
| 18 | sitemap.xml 手工 n1/n2/n3 → 构建时生成（vite 插件或脚本）+ 同步守卫测试 | j7/j9 |

### P2 — Meta 级升级（终审 fix 共识，做）
| # | 升级 | 证据 |
|---|---|---|
| 19 | **Register 机制化**（4 位评委收敛指向同一处）：index.css 兑现 .r-ledger/.r-plate/.r-essay，structure.tsx:94 死三元改 `data-register={register}`，PageShell 顶部留白按 register 区分（LEDGER 页不享受 PLATE 的 200px 呼吸），加"Home 相邻段 register 互异"护栏测试 | j1/j4/j9/j10 |
| 20 | **palette 成为真正的 concordance**：buildIndex 纳入 notes 正文与 lab 语料，检索用已 shipped 的 bm25Rank，命中渲染为 KWIC 引文行（命中句 + §坐标/日期）——一针三雕：站名成真、FIG 获得第二基因型、签名交互配得上位置 | j10 · search.ts |
| 21 | 用户可见文案中的开发者路径清零（5 处 "Replace in src/content/…"）→ 移入 title/注释，用户层换人话 | j8 |
| 22 | About 裸占位升级为全站等价的空态语法；About LOG 的 TODO 行排序后置（真实里程碑优先） | j1/j8 |
| 23 | og:image：生成 PNG（og.svg 爬虫不收）+ index.html 引用 | j4/j8 |
| 24 | 字体工程：preload 两个主 woff2 + fallback size-adjust 度量对齐（消除 80px hero FOUT/CLS）；.dark .t-display 特异性压过 ：lang(zh) 修正；@fontsource-variable/* 移到 devDependencies | j2/j4 |
| 25 | '0ms network' 口头禅化 → 变体改写（保留一处原文） | j3 |
| 26 | Token 结构层：删死 token --signal-wash；z-index 收敛为 token；图版宽度 9 种 ad-hoc 收编为 2-3 档；.essay h2/kbd/sn-num 脱阶尺寸收编 | j9 |

### 不做（评委提出但否决）
- 无。

## 3. Meta Designer 阶段计划

1. `generation_03/` → `final/`（全新目录，npm install 后独立 workspace）。
2. 执行 §2 全部 26 项，DESIGN_NOTES 升级为最终版自查表。
3. 交付四份文档：README.md / CONTENT_GUIDE.md / DESIGN_SYSTEM.md / PROJECT_STRUCTURE.md（项目根目录）。
4. 终验：build/lint/test 全绿 + 全路由截图复拍 + console 清零 + §2 逐项复核。
