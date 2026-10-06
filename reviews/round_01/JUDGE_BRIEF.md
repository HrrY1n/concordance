# Round 1 评审任务书（Judge Brief）

你是一场设计竞赛的独立评委。8 个设计团队已各自提交了一份完整的设计提案文档，位于：

```
D:\Codex\play\portfolio\generation_01\
├── team_a_minimalism.md    (Team A - Apple-like Minimalism)
├── team_b_editorial.md     (Team B - Editorial / Magazine)
├── team_c_modern_ai.md     (Team C - Modern AI / Future)
├── team_d_academic.md      (Team D - Academic Researcher)
├── team_e_creative_dev.md  (Team E - Creative Developer)
├── team_f_swiss.md         (Team F - Swiss / International Style)
├── team_g_dark_premium.md  (Team G - Dark Premium)
└── team_h_experimental.md  (Team H - Experimental Interaction)
```

共享任务书（评审基准）在 `D:\Codex\play\portfolio\generation_01\BRIEF.md` —— 请先读它，再读全部 8 份提案。

## 你的评分方式

1. **通读全部 8 份提案**（每份都完整读，不能只读摘要）。
2. 以你的**专业视角**为每个方案打分。14 个维度都要打分（1–10 分，可用 0.5），但你的角色决定了哪些维度是你的一票否决区（你的专业维度应从严评分，其他维度按常规标准）。
3. 为每个方案写：2–3 条优点（具体到章节/细节）、2–3 条缺点或风险（具体、可执行）、1 条"最值得被其他方案偷走的想法"。
4. 给出你的 Top 3 排名（第一/第二/第三）。
5. 独立评审：不要试图猜测其他评委会怎么打分。

## 14 个评分维度

| key | 维度 | 说明 |
|---|---|---|
| visual_quality | Visual Quality | 视觉品质、完成度想象、记忆点 |
| originality | Originality | 原创性、反模板程度 |
| typography | Typography | 字体策略、字阶、排印纪律 |
| information_hierarchy | Information Hierarchy | 信息层级、首屏、节奏 |
| ux | UX | 可用性、导航、任务完成效率 |
| mobile_experience | Mobile Experience | 移动端是否真正重新设计 |
| technical_feasibility | Technical Feasibility | 在 Vite+React+TS+Tailwind 栈内可实施性、性能风险 |
| long_term_maintainability | Long-term Maintainability | 5 年内容生长下的可持续性 |
| research_presentation | Research Presentation | 研究方向/问题/实验的展示力 |
| portfolio_presentation | Portfolio Presentation | 项目作品集的展示力 |
| light_mode | Light Mode | 日间模式品质 |
| dark_mode | Dark Mode | 暗色模式品质 |
| performance | Performance | 动效/字体/渲染的性能预算合理性 |
| accessibility | Accessibility | 键盘、对比度、reduced-motion、语义 |

## 产出

将完整评审报告写入 `D:\Codex\play\portfolio\reviews\round_01\judge_<编号>_<你的角色缩写>.md`，结构：

```markdown
# Judge <编号>：<角色> 评审报告

## 评审视角
（你的角色如何影响打分，一票否决区是什么）

## 逐方案评语
### Team A
- 优点：…
- 缺点/风险：…
- 最值得偷走的想法：…
（… B 到 H 同样）

## 排名与理由
Top 3：…
```

并在最终回复消息末尾附上如下 JSON 代码块（用于自动汇总）：

```json
{
  "judge": "<角色缩写，如 visual>",
  "scores": {
    "A": {"visual_quality": 0, "originality": 0, "typography": 0, "information_hierarchy": 0, "ux": 0, "mobile_experience": 0, "technical_feasibility": 0, "long_term_maintainability": 0, "research_presentation": 0, "portfolio_presentation": 0, "light_mode": 0, "dark_mode": 0, "performance": 0, "accessibility": 0},
    "B": {"...": "同结构 14 维度"},
    "C": {},
    "D": {},
    "E": {},
    "F": {},
    "G": {},
    "H": {}
  },
  "top3": ["第一", "第二", "第三"]
}
```

注意：最终回复消息 = 3 行以内的角色自述 + 完整 JSON 代码块。完整评语写进文件，不要贴在回复里。
