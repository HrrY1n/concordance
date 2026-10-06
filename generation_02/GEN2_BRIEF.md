# Generation 2 共享进化规格（GEN2 BRIEF）

> 进入第二轮的三个方向：**A「Monograph」、D「Offprint」、H「检索系统」**。
> 规则：不允许简单延续原方案。你必须：吸收 Round 1 评审规定的"被偷想法"、修复本方向的负分维度、并交付一个**可运行的网站**。
> 评审依据：`../design_review_round_01.md`（必读）。

## 0. 必读材料（按顺序）

1. `../design_review_round_01.md` —— 评审结论与你的进化靶点
2. 你自己方向的第一代提案（`../generation_01/team_x_*.md`）
3. 指定要"偷"的方案（见你的团队任务书）
4. 共享内容包 `CONTENT_PACK.md`（本项目所有 mock 内容的唯一来源）
5. （可选深挖）`../reviews/round_01/judge_*.md` 中提到你方案的负面评语

## 1. 技术基线（强制）

- 已就绪的 workspace 模板：复制 `../_template/` 全部内容到你的目录（`generation_02/<你的目录名>/`），已共享安装：React 19、Vite 7、TypeScript、Tailwind CSS v4（CSS-first，`@custom-variant dark` 已配）、motion、react-router-dom、lucide-react。
- 不要在根目录跑 `npm install` 新依赖；如需额外依赖（字体包等）用 `npm install -w generation_02/<你的目录名> <pkg>`，并在 DESIGN_NOTES.md 里说明理由。
- `npm run build` 必须零错误通过（tsc --noEmit + vite build）。`npm run dev` 可跑。
- 字体：需要 web 字体时用 @fontsource 包自托管（例如 `@fontsource-variable/inter`、`@fontsource/newsreader`、`@fontsource/ibm-plex-mono`），禁止运行时请求 Google Fonts。CJK 走系统栈 fallback（"Noto Sans SC"/"Noto Serif SC"/PingFang/微软雅黑 等系统引用，不打包 CJK 字体文件）。

## 2. 页面与功能范围

单页滚动 or 多路由由你的设计语言决定，但必须覆盖：

| 模块 | 要求 |
|---|---|
| Home / Hero | 你的方向的首屏设计；10 秒内传达身份与研究方向 |
| Research | 研究方向（6 条真实兴趣，内容来自 CONTENT_PACK）+ 研究问题（Question Ledger 式或你的等价物） |
| Selected Work | 4 个项目（CONTENT_PACK 数据），**禁止三列卡片墙**，用你的版式语法 |
| Publications | **空状态**（数据为空数组时优雅呈现，礼仪感） |
| Lab / Playground | **至少 1 个真实可玩的交互 demo**：Corruption Sandbox（见 CONTENT_PACK §demo），外加你的方向的 0–2 个额外 demo |
| About + Connect | 简短 about；links 全为 null 时显示克制的占位说明 |
| Notes | 3 篇 sample note 的列表呈现 |
| 主题 | System / Light / Dark 三态，localStorage 持久化，**首帧无 FOUC**（index.html 内联脚本），切换有"事件感"但必须带 prefers-reduced-motion 与不支持的浏览器降级 |
| 移动端 | 390px 宽度下真正重新设计的布局与导航（不是缩小版）；触摸目标 ≥44px |
| 无障碍 | 跳转链接、focus 可见、键盘完整可达、reduced-motion 全局降级、语义化 landmark、对比度按 token 验收 |
| SEO | index.html 完整 meta + Open Graph + JSON-LD；路由级 document.title；`public/robots.txt` + `public/sitemap.xml`（用占位域名 `https://example.com`） |
| 性能 | 无未使用依赖；图片无则不需要；字体子集；动效 transform/opacity 优先 |

## 3. 内容纪律（强制）

- 所有内容来自 `CONTENT_PACK.md`，写入 `src/content/` 下的 TS 文件（profile / research / projects / publications / writing / links…）+ `types.ts` 类型契约。
- **禁止编造**论文、学校、邮箱、GitHub ID 等。links 全部 null，UI 显示克制占位。
- sample 数据带 `sample: true`，UI 上不需要给用户看"sample"徽章（这是数据层的诚实，不是展示层）——但 Publications 的空与 Lab demo 的"Illustrative"声明必须对用户诚实可见。

## 4. 交付物

1. `generation_02/<你的目录名>/` 完整可运行应用
2. `generation_02/<你的目录名>/DESIGN_NOTES.md`：相对第一代改了什么、为什么、偷了谁的什么、拒绝了什么、遗留风险
3. `npm run build` 通过 + `npm run dev` 手动自查无 console error

## 5. 质量自检清单（完成后逐条过）

- [ ] 首屏 10 秒传达身份；有记忆点但不做作
- [ ] Publications 空态优雅；仅 1 个项目时版式依然成立（试着删数据自查）
- [ ] Light / Dark 各检查：bg / surface / text / muted / divider / hover / accent / selection / scrollbar / 代码块
- [ ] 390px / 768px / 1280px / 1600px 四档走查无横向滚动、无断行灾难
- [ ] 全键盘走查：Tab 顺序、focus 可见、demo 可键盘操作
- [ ] reduced-motion 下所有动画静态优雅
- [ ] build 零错误、无 console error/warn
- [ ] 无硬编码内容散落在 JSX（全部走 content/）
- [ ] 中文 fallback 不破版（在 about 里放一句中文测试句自查渲染）
