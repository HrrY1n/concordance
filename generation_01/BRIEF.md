# 个人主页设计任务书（Shared Brief v1）

> 本文件是所有设计团队（Team A–H）与所有评委（Judge）的共享基线。
> 各团队必须在此基线上提出**截然不同**的设计方向。禁止 8 个方案实质上只是换配色。

---

## 1. 项目使命

从零设计一个**长期使用**的个人主页 / Portfolio Website。它不是简历网页，不是模板站，而是：

- 个人品牌展示
- 研究方向展示（Retrieval-Augmented Generation 方向）
- 学术成果展示（当前为空，需优雅处理）
- 项目作品集 / GitHub Open Source 展示
- 研究笔记 / Blog
- 求职 / 实习 / 学术交流的门面
- 长期个人数字档案（未来 5+ 年持续补充内容）

**第一印象目标：高级、干净、克制、现代、专业、有技术感、有原创设计感。**

## 2. 主人公身份（唯一真实信息，不得编造其他）

- Computer Science Graduate Student / AI Researcher / Developer
- 研究兴趣（真实，可展开描述）：
  - Retrieval-Augmented Generation (RAG)
  - RAG Robustness
  - Knowledge Poisoning（知识投毒与防御）
  - AI Security
  - LLM / AI Systems
  - Retrieval and Generation Interaction
- 以上是**全部**已知真实信息。姓名、学校、邮箱、GitHub ID、论文、奖项、工作经历等**一概未知**。

## 3. 内容策略（严格遵守）

1. **禁止编造任何个人履历事实**：论文、学校、公司、实习、奖项、专利、邮箱、电话、地址、GitHub username、Google Scholar、LinkedIn、ORCID。
2. 未提供的信息使用 placeholder / TODO / config，并让未来替换极其简单。
3. **允许且应当**使用 mock content 展示版式（例如 3–6 个 sample project、2–3 篇 sample note），但必须：
   - 不声称虚假credentials（sample project 描述能力与过程，不声称发表/获奖）；
   - 在数据文件中带 `sample: true` 标记，文档中说明“这些是示例，替换即可”；
4. **Publications 当前为空**，必须设计优雅的空状态（例如一行克制的 "Selected research will appear here."），绝不能显得“网站没做完”。
5. 某些模块若暂时无内容（如 Awards），可直接不渲染该模块 —— 空内容策略是本次设计的一等公民。

## 4. 站点信息架构（可调整，但需覆盖这些能力）

| 模块 | 内容 | 当前状态 |
|---|---|---|
| Home | 首屏。**禁止** "Hi, I'm XXX" 开场。方向参考：`Computer Science / Research × Engineering` 这类克制表达，具体文字由设计系统决定 | mock |
| About | 极简，无自我吹捧 | placeholder |
| Research | Research Interests / Current Research / Research Questions / Selected Experiments；未来可挂 paper / dataset / code / demo / method 图 | 可写真实兴趣方向 |
| Selected Work | 3–6 个重要项目；Title/Year/Role/Tech/GitHub/Demo/Case Study；**禁止普通三列卡片墙** | sample data |
| Publications | 论文列表 | **空**（优雅空状态） |
| Open Source | GitHub 项目展示；未来可接 GitHub API | sample data |
| Notes / Writing | 技术笔记、论文阅读、研究想法、Engineering Notes | 2–3 篇 sample |
| Playground / Lab | **特色模块**：实验、交互式流程、可视化、RAG demo、benchmark、小型 AI 实验。像一个“个人实验室入口”，不是 blog 列表 | 设计 2–3 个可离线运行的 demo 概念 |
| Timeline | Education / Research / Projects / Milestones；**禁止**传统简历时间轴样式 | placeholder |
| Contact | Email / GitHub / Scholar / ORCID / LinkedIn；没有的隐藏或占位 | 全部 placeholder |

## 5. 视觉与体验红线（禁止清单）

- 廉价渐变、满屏炫光、大量粒子、赛博朋克模板
- 到处玻璃拟态、无意义 3D、巨大头像占首屏
- 技能百分比进度条（"HTML 95%"）
- 千篇一律开发者模板味、满屏卡片、处处圆角矩形
- 过度 emoji、大面积无意义动画、疯狂滚动视差
- 每个元素都飞入、bouncing、妨碍阅读的动效

动效原则：**Subtle, intentional, smooth.** 动画必须服务于层级、导航反馈、内容进入、hover 反馈、主题切换。

## 6. 工程基线（已锁定，各团队设计须在此栈内可实施）

- Vite 7 + React 19 + TypeScript（严格模式）
- Tailwind CSS v4
- motion（Framer Motion 的新包名）用于动效
- react-router（如需多页）
- 内容全部数据驱动：`content/*.ts`（profile / projects / research / publications / writing / links…），改数据即改页面，**内容不写死在 JSX**
- Light / Dark / System 三态主题，用户选择持久化；两套主题都必须是**被设计的**，不是黑白反转
- SEO / Open Graph / Metadata / sitemap / favicon
- Accessibility：keyboard navigation、focus 管理、prefers-reduced-motion、语义化标签、对比度
- 性能：lazy loading、代码分割、字体子集化或系统栈
- 完整响应式：小手机 / 大手机 / 平板 / 笔记本 / 大桌面，移动端必须是重新设计而非缩放

## 7. 每个团队必须交付的设计文档章节

写入 `generation_01/team_<X>_<slug>.md`，包含且不限于：

1. **设计理念**（一段话灵魂 + 3 条设计原则）
2. **首页信息架构**（首屏放什么、section 顺序与理由）
3. **Typography**（字体选择与理由、完整字号阶梯、行高、字距、行宽控制、中英文兼容方案）
4. **颜色体系**（具体 token 表：background / surface / text / muted / divider / hover / accent / code / selection…，Light 与 Dark 各一套，给出 hex）
5. **Light / Dark Mode 策略**（两套各自的情绪、切换体验）
6. **布局系统**（网格、间距节奏、留白策略、section 之间的过渡）
7. **主要交互与动效**（导航、hover、进入、主题切换、signature interaction 至少 1 个）
8. **Projects 展示方式**（具体到布局描述，禁止三列卡片）
9. **Research 展示方式**（如何让研究兴趣/问题/实验显得清晰专业）
10. **Playground / Lab 概念**（入口形态 + 2–3 个 demo 的具体描述）
11. **移动端方案**（导航如何做、内容优先级、哪些体验是移动端特有的）
12. **空状态策略**
13. **与其他 7 个方案的差异**（逐个一句话说明“我不是什么”）
14. **风险与自我批评**（这个方向最容易翻车的地方）

## 8. 评审者会带着这些问题审视你

- 首屏是否有记忆点但不做作？
- 内容少时是否依然完整好看？内容多 10 倍后是否依然成立？
- Typography 是否达到获奖站水准？
- 项目展示是否俗套？
- 动效是否有意义？
- 移动端是否被真正重新设计？
- 是否适合研究者长期使用？是否有模板味？

## 9. 流程说明

- 本阶段**只写设计文档，不写代码**。
- 10 位评委（视觉 / UX / 排版 / 前端工程 / 无障碍 / 移动端 / 研究者视角 / 招聘者视角 / 产品设计师 / 原创性）将独立评分，选出 Top 3 进入第二轮实现。
- 落选方案的优秀思想也会被后续轮次吸收 —— 把最想被“偷走”的想法写得足够具体。
