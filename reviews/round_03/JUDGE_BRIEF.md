# Round 3（Final Review）评审任务书

你是 Round 3 的评委。Generation 3 是前两轮竞赛（8 案提案 → Top 3 实现 → 复审）之后产出的**唯一完整站点**，位于 `D:\Codex\play\portfolio\generation_03\`。它融合了三个方向：H 的架构骨架（路由/检索/无障碍工程）、A 的视觉工艺（字阶/双语气 Hero/PLATE 图版/FIG 真数据图）、D 的研究语法（Question Ledger/证据回链），并承诺执行 Round 2 的全部修复项。

## 输入

1. `D:\Codex\play\portfolio\generation_03\` —— 站点源码 + DESIGN_NOTES.md（含 §4 验收自查表）
2. `D:\Codex\play\portfolio\design_review_round_02.md` —— §4 修复清单（G1-G6/A1-A3/D1-D3/H1-H3/M1-M5）与 Gen 3 指令
3. 渲染截图：`D:\Codex\play\portfolio\shots\gen3\<prefix>\`（6 路由 × desktop/tablet/mobile × light/dark + home 整页图）+ `*.console.json`
4. 可选对照：`generation_02/` 三案源码

## 评审重点

1. **验收清单复核**：Round 2 §4 的 21 项修复是否真实落实（DESIGN_NOTES 自查表要抽查验证，防"纸面落实"）。
2. **统一语言检查**：H 骨架 + A 工艺 + D 语法是否融为一种语言，还是三 张皮拼接？（这是 Meta 级风险）
3. **14 维度评分**（1–10，可 0.5），同前两轮维度。
4. **长期使用测试**：想象你两年后维护这个站——加一篇论文、换一个研究方向、增加第 4 个 lab demo，成本如何？
5. **内容红线**：是否有编造履历（姓名/学校/邮箱/论文/奖项）？sample 标记是否诚实？

## 产出

报告写入 `D:\Codex\play\portfolio\reviews\round_03\judge_<编号>_<角色>.md`，含证据路径、逐项验收结论、"如果只能改一处"。

最终回复 = 3 行内自述 + JSON 代码块：

```json
{
  "judge": "<角色>",
  "scores": {
    "G3": {"visual_quality": 0, "originality": 0, "typography": 0, "information_hierarchy": 0, "ux": 0, "mobile_experience": 0, "technical_feasibility": 0, "long_term_maintainability": 0, "research_presentation": 0, "portfolio_presentation": 0, "light_mode": 0, "dark_mode": 0, "performance": 0, "accessibility": 0}
  },
  "verdict": "PASS 或 NEEDS_WORK",
  "top_issues": ["最多 5 条，按严重度排序，每条带文件:行号或截图证据"],
  "fix": "如果只能改一处"
}
```

评审纪律同前两轮：诚实压分、可证伪证据、模板味零容忍。你是终审——你的 verdict 决定这个站是否进入 Meta Designer 打磨阶段。
