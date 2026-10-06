# Round 2 评审任务书（实现评审）

你是一场设计竞赛第二轮的评委。三个方向（Team A「Monograph」/ Team D「Offprint」/ Team H「检索系统」）已从提案进入**可运行实现**，位于：

```
D:\Codex\play\portfolio\generation_02\
├── team_a_monograph\    (React 源码 + DESIGN_NOTES.md)
├── team_d_offprint\     (React 源码 + DESIGN_NOTES.md)
└── team_h_retrieval\    (React 源码 + DESIGN_NOTES.md)
```

每个方向的**渲染截图**（1440/768/390 宽 × light/dark）在 `D:\Codex\play\portfolio\shots\gen2\<dir>\` 下，PNG 文件名含方向/视口/主题。控制台错误报告在同目录 `*.console.json`。

## 你要做的

1. **先看图**：三个方向都看（desktop+mobile，light+dark 至少各看 home）。截图是评委的主要视觉证据；源码与 DESIGN_NOTES 是辅助。
2. **读 DESIGN_NOTES.md**：他们声明改了什么、偷了什么。验证声明是否属实（抽查源码）。
3. **读关键源码**：`src/content/`（数据契约）、主题实现、demo 组件、动效实现。不用逐行读全站。
4. 以你的专业视角对三案 × 14 维度打分（1–10，可 0.5）。14 维度同 Round 1（见下）。
5. 为每案写：优点 2–3 条（具体到截图/代码证据）、缺点 2–3 条（可执行）、"如果只能改一处"建议。
6. 给出 Top 排名（1/2/3）。

## Round 1 背景与进化靶点（评判进化是否成功）

- Round 1 报告：`D:\Codex\play\portfolio\design_review_round_01.md`
- Team A 进化靶点：originality（−0.52）、portfolio_presentation（−0.87）由负转正，同时保住 performance/feasibility 优势
- Team D 进化靶点：technical_feasibility（−0.96）、long_term_maintainability（−1.15）、visual_quality（−0.78）、portfolio_presentation（−0.93）改善，保住 research_presentation 优势
- Team H 进化靶点：typography（−0.97）、visual_quality（−1.29）由负转正，保住 originality/a11y 优势
- 三案都必须实现：三态主题无 FOUC、390px 真重设计、Corruption Sandbox demo（功能一致：注入投毒文档改变 BM25 排名 + 玩具防御开关 + 诚实声明）、Publications 空态、内容数据驱动。

## 14 个评分维度

visual_quality, originality, typography, information_hierarchy, ux, mobile_experience, technical_feasibility, long_term_maintainability, research_presentation, portfolio_presentation, light_mode, dark_mode, performance, accessibility

## 产出

报告写入 `D:\Codex\play\portfolio\reviews\round_02\judge_<编号>_<角色>.md`，含逐案评语（带证据路径）与排名。

最终回复 = 3 行以内自述 + 一个 JSON 代码块：

```json
{
  "judge": "<角色缩写>",
  "scores": {
    "A": {"visual_quality": 0, "...": "14 维同 round 1"},
    "D": {},
    "H": {}
  },
  "top3": ["第一", "第二", "第三"],
  "fixes": { "A": "如果只能改一处", "D": "...", "H": "..." }
}
```
