# Team A — Apple-like Minimalism：「Monograph 单行本」

> **方向**：极致克制、留白、强 Typography、几乎消除装饰的极简主义。这个网站不是"作品集模板"，而是一本**排好版的单行本（Monograph）**：文字是唯一材料，留白是唯一装饰，一条 accent 色是唯一观点。
>
> 本文档遵守 `BRIEF.md` 全部约束（§3 内容策略 / §5 禁止清单 / §6 工程基线 / §7 交付章节）。

**种子约束落点索引**（评委快速核对用）：

| 种子约束 | 落点 |
|---|---|
| 全站仅一个 accent 色 + 近单色阶 | §4（cool gray 冷灰体系 + 单一橙色相的两个功能值） |
| 全站禁止"卡片"容器 | §6.3「无表面原则」+ §8（行排版层级） |
| 首屏纯文字构图（字体即图像） | §2.1 + §3.4 |
| 动效预算 ≤3 个同屏动画元素 | §7.2 动效预算表 |
| Signature interaction 及"少即是多"论证 | §7.3「落墨 Settle」 |

---

## 1. 设计理念

**一段话灵魂**：一位研究 Retrieval-Augmented Generation 的人，职业习惯是"只陈述有证据的部分"。这个主页把这种习惯翻译成视觉语言：**删掉一切不能帮助阅读的东西**——没有卡片、没有图标、没有插图、没有滚动剧场——直到页面上只剩下文字、留白、hairline 与一个会说话的橙色信号点。当装饰被消除到极限，Typography 就被迫承担全部表达，这恰恰是最难也最出效果的设计：字的大小、字重、灰度与间距本身就是全部的视觉构图。首屏是一段被当作图像来排的正文；全站像一本会持续增补的单行本——有章节、有页眉、有目录，永远写不完，也永远不需要写完。

**三条设计原则**：

1. **类型即界面（Type is the interface）**。层级只允许通过字号、字重、灰度、间距与 hairline 表达，禁止通过容器表达。判断标准：把页面黑白打印在 A4 纸上，层级必须原封不动地成立。
2. **一色定调，色即语义（One hue, used as a signal）**。全站只有冷灰一个色阶系统 + 橙色一个色相。橙从不装饰——它只标记"活着的东西"：当前所在章节、正在运行的实验、被投毒的文档、键盘焦点。看到一个橙点，就等于读到一句"此处有信号"。
3. **动效即信息，预算即纪律（Motion is information）**。任何动画必须能用一句话回答"它向用户传递了什么信息"，回答不了的直接删除。全站同屏环境动画 ≤3 个，内容永远不随滚动飞入——滚动是阅读行为，不该被动画打断。

---

## 2. 首页信息架构

### 2.1 首屏：一段被当作图像排版的文字（100svh）

首屏禁止 "Hi, I'm XXX"，禁止图片/插画/3D——**构图完全由字号对比、灰度对比与中西字体对比完成**。桌面端构图（左对齐，占 col 1–10，垂直居中偏上）：

```
● RETRIEVAL / GENERATION / SECURITY — RESEARCH & ENGINEERING     ← mono-label 12px，ink-3，行首 6px 橙点

Retrieval-Augmented                                              ← display-1, ink-1, w500, Inter
Generation,                                                      ← display-1, ink-1, w500, Inter
    before it breaks.                                            ← display-1i, ink-3, w400, Newsreader Italic ▊
                                                                                                     ↑ 3×0.9em 橙色 caret
Graduate student in computer science. I build retrieval systems  ← lede 19/32, ink-2, max-width 52ch
and study how they fail — robustness, knowledge poisoning, and
the security of the retrieval–generation loop.

──────────────────────────────────────────────                   ← hairline，宽度 = lede 同宽
Selected Work ↘        Lab ↘                                     ← body-sm 14，两个锚点链接
```

**"字体即图像"的机制**：三行 display 大字构成一个视觉块——前两行是同一灰度的无衬线"陈述"，第三行突然换成衬线斜体并降低灰度，像论文里的一句限定条件。 sans = 系统与事实，serif italic = 人的语气与条件；这个"双语气"修辞贯穿全站（见 §3.5）。三行的缩进（第三行右缩进 1 列 ≈ 88px）让整块文字产生一个安静的斜向张力，不需要任何图形装置。橙色 caret 闪烁 = "这份档案仍在书写"——全站唯一的常驻动画（见 §7）。

文案存于 `content/profile.ts`（`hero.meta / hero.line1 / hero.line2 / hero.line3 / hero.lede`，均标注 `sample: true`）。备选第三行："studied where it fails." / "under adversarial pressure."

### 2.2 Section 顺序与理由

| # | Section | 放置理由 |
|---|---|---|
| 00 | Hero | 10 秒内用纯排版建立身份与研究方向 |
| 01 | About | 三句话身份陈述 + 六个研究兴趣词内联；紧贴 Hero 完成"我是谁" |
| 02 | Research | 学术主页的灵魂；招聘者与研究者的共同黄金路径 |
| 03 | Selected Work | 证据紧随主张：兴趣讲完立刻给作品 |
| 04 | Publications | 学术可信度的下一环，紧跟 Work；空状态设计见 §12 |
| 05 | Open Source | 从"精选作品"过渡到"日常工程"，颗粒度变细 |
| 06 | Notes | 从作品过渡到思考；阅读型内容 |
| 07 | Lab | 全站最有生命感的模块放在中后段作为"彩蛋"，前面越克制它越突出 |
| 08 | Chronology | 年表账簿作为档案层，临近结尾供深读者查阅 |
| 09 | Contact | 收尾；大字邮箱是全站最后一个 display 级元素 |

理由概括：**可信度链条（Research→Work→Publications→Open Source）必须连续不间断**；Notes→Lab 形成"从读到做"的递进；Chronology 是给深读者/招聘者的档案附录；Contact 用最大字号收尾，让访客带着一个可执行动作离开。

首页为单页长滚动 + 锚点导航；Notes 文章、Project case study、Lab demo 为独立路由（复用同一套章节模板）。Notes > 20 篇后拆分路由页，Home 仅保留最新 3 条（为 5 年内容增长预留）。

---

## 3. Typography

### 3.1 字体选择与理由

| 角色 | 字体 | 字重 | 理由 |
|---|---|---|---|
| 主字体（Display / UI / 正文） | **Inter 4（Variable）** | 300 / 400 / 500（variable 连续可用） | SF Pro 之外最接近 Apple 中性 grotesque 的免费字体；variable 的 `wght` 轴是本方案多个细节（hover 字重微变、Dark 补偿字重）的技术前提；4.0 的 `opsz` 轴让 display 与正文各得其所。识别度不来自字体猎奇，而来自 scale 的使用纪律 |
| 长文阅读 / 限定语气 | **Newsreader（Variable, opsz 6–72）** | 400 / 400 Italic | 光学字号轴使 19px 正文与 96px 首屏斜体都保持优雅；比 Georgia/Source Serif 更"文献感"，承担单行本的灵魂 |
| 代码 / 元信息 / 索引 | **IBM Plex Mono** | 400 / 500 | 比 JetBrains Mono 少一点"开发者模板味"，多一点"铅字编号感"；用于章节号、日期、技术栈标签 |
| 中文回退 | PingFang SC（macOS）/ Microsoft YaHei UI（Windows）/ Noto Sans CJK（Linux） | 400 / 500 | 站点主语言为英文，CJK 走系统栈，避免中文字体子集的体积负担；中文出现时自动获得 `-0.01em` 的标点挤压由 `text-autospace` 兜底 |

加载策略：Fontsource 自托管 + latin 子集 + `font-display: swap`；Inter/Newsreader 为 variable 单文件；总字体预算 ≤ 260KB。禁用任何 icon 字体与图标库（见 §6.4）。

### 3.2 完整字号阶梯（桌面 / 移动双值）

| Token | 字号 / 行高（桌面） | 字号 / 行高（移动） | 字距 | 字重 | 用途 |
|---|---|---|---|---|---|
| display-1 | clamp(48px, 7.2vw, 96px) / 1.04 | clamp(40px, 11vw, 56px) / 1.06 | −0.028em | 500 | Hero 主行 |
| display-1i | 同 display-1，Newsreader Italic | 同左 | −0.012em | 400 | Hero 限定语 |
| display-2 | clamp(32px, 4.5vw, 56px) / 1.1 | clamp(28px, 7vw, 36px) / 1.14 | −0.022em | 500 | Contact 大字、Lab demo 标题 |
| title-1 | 32 / 40 | 26 / 34 | −0.015em | 500 | Case study / 文章页标题 |
| title-2 | 22 / 30 | 20 / 28 | −0.012em | 500 | 条目标题（项目行 / 文章行） |
| title-3 | 18 / 26 | 17 / 25 | −0.008em | 500 | 组标题、Research 词条 |
| lede | 19 / 32 | 18 / 30 | 0 | 400 | 章节导语 |
| body | 16 / 28 | 17 / 30 | 0 | 400 | 正文（移动端反而更大，为拇指阅读重设） |
| body-serif | Newsreader 19 / 34（opsz 16） | 18 / 32 | 0 | 400 | Notes 长文正文 |
| body-sm | 14 / 22 | 14 / 22 | 0.004em | 400 | 辅助说明 |
| label | 12 / 16 | 11 / 15 | +0.08em, 大写 | 500 | sans 元标签（"SELECTED WORK"） |
| mono-label | IBM Plex Mono 12 / 16 | 11 / 15 | +0.04em | 400 | 章节号、日期、技术栈 |
| code | IBM Plex Mono 13.5 / 22 | 13 / 21 | 0 | 400 | 行内与块级代码 |

规则：**任何信息性文字（含 meta/mono-label）对比度 ≥ 4.5:1**；低于此灰度的 ink-4 只允许出现在 ≥ 60px 的装饰性大字或 disabled 状态。数字（年份、序号、star 数）一律 `font-variant-numeric: tabular-nums`。

### 3.3 行宽控制

- 无衬线正文 measure = **66ch（max-width 660px）**；lede = 52ch；衬线长文 = **68ch（690px）**。
- display 大字不限宽但受网格列约束（Hero 占 col 1–10）。
- 禁止两端对齐（justify），禁用连字符断词；`text-wrap: balance` 用于所有 ≤ 3 行的标题。

### 3.4 中英文兼容

英文为主语言；中文出现于（未来的）中文 Notes。方案：CJK 回退到系统黑体/宋体，中文正文在 serif 语境回退宋体系（Songti SC / SimSun → 不额外加载）；中英混排间距交给 `text-autospace: normal`，标题混排时对 CJK 额外 `letter-spacing: +0.01em` 抵消黑体偏窄的灰度。

### 3.5 全站修辞："双语气"（The Two Voices）

- **sans（Inter）= 事实与系统**：所有结构性文字。
- **serif italic（Newsreader Italic）= 条件与人的声音**：只出现在三处——Hero 第三行、每篇 Notes 的首句引语、引用块。全站衬线斜体的出现总量不超过 10 处，稀缺性就是它的力量。

---

## 4. 颜色体系

近单色阶选定 **cool gray（色相 215–225，饱和度 ≤ 4%）**——冷灰的技术感与橙色构成 Braun/Apple 式的经典对位。accent 只有一个色相（橙 20° 左右），给出两个功能值：`accent`（非文字图形：点、caret、下划线、曲线）与 `accent-ink`（同色相加深/提亮到 AA 的文字安全版）。

### 4.1 Light —「Daylight Paper」

| Token | Hex | 用途 / 对比度 |
|---|---|---|
| bg | `#FCFCFD` | 页面底，近白微冷 |
| bg-inset | `#F4F6F8` | 代码块底（唯一允许的"面"，radius 0，无阴影无边框） |
| ink-1 | `#191C1F` | 主文字，16.1:1 |
| ink-2 | `#4A5058` | 次级文字 / lede，7.6:1 |
| ink-3 | `#6B7178` | meta / 说明文字，4.9:1（信息性文字的下限） |
| ink-4 | `#9AA1A8` | 仅装饰（超大字、disabled、代码注释），2.5:1 |
| line-1 | `#E3E6E9` | 默认 hairline（1px） |
| line-2 | `#CFD4D9` | hover / 强调 hairline |
| accent | `#FF4A00` | 图形信号：状态点、caret、live 下划线、曲线当前点 |
| accent-ink | `#C2410C` | 文字安全 accent（5.2:1）：focus ring、当前导航文字、"Copied" |
| wash | `#FFE5DA` | selection 底 / 证据高亮底（配 ink-1 文字） |
| code-bg / code-ink | `#F4F6F8` / `#2E3338` | 代码底 / 代码正文 |
| code-string | `#C2410C` | 代码字符串（accent 的语义：字符串是"被检索进来的证据"） |
| code-comment | `#9AA1A8` italic | 注释 |
| selection | bg `#FFE5DA` / text `#191C1F` | 选区 |

**语法高亮规则**：单色语法高亮——关键字 ink-1 w500、正文 code-ink、字符串 accent-ink、注释 ink-4 italic。全站代码块里也只有一种颜色，这是"一色定调"在代码里的执行。

### 4.2 Dark —「Night Proof」

| Token | Hex | 用途 / 对比度 |
|---|---|---|
| bg | `#0E1013` | 冷调近黑（不用纯黑，保留灰阶表现空间） |
| bg-inset | `#14171B` | 代码块底 |
| ink-1 | `#E9EBEE` | 主文字 / 标题，14.8:1 |
| ink-2 | `#A8AEB6` | 次级文字；**Dark 长文正文用它**（7.2:1，降低光晕 halation） |
| ink-3 | `#878E96` | meta 文字，4.6:1 |
| ink-4 | `#5A6068` | 仅装饰 |
| line-1 | `#23272D` | 默认 hairline |
| line-2 | `#383E45` | hover hairline |
| accent | `#FF5A1F` | 图形信号（暗底提亮一档） |
| accent-ink | `#FF7A45` | 文字安全 accent（6.5:1） |
| wash | `rgba(255,90,31,0.14)` | 高亮/活动底 |
| selection | bg `rgba(255,90,31,0.30)` / text `#E9EBEE` | 选区 |
| code-bg / code-ink | `#14171B` / `#D6D9DD` | 代码底 / 正文 |
| code-string | `#FF8A57` | 字符串 |

### 4.3 Accent 使用纪律（违反即 bug）

允许出现 accent 的位置全表：① 导航当前章节的 2px 下划线与文字；② Hero caret；③ 章节状态点（实验 running）；④ Lab 中被投毒文档 / 曲线当前点 / 证据高亮；⑤ focus ring；⑥ "Copied" 反馈文字。**除此之外的任何地方出现橙色都视为缺陷。** 任意视口内 accent 覆盖面积 < 1%。

---

## 5. Light / Dark Mode 策略

- **Light = 日光校样**：像清晨打印出来的校样纸。灰阶偏冷、hairline 清晰，唯一暖色是橙色信号。情绪：清醒、客观、评审视角。
- **Dark = 夜间改稿**：不是黑白反转，而是一套重新调过的版面——长文正文降为 ink-2 以抑制光晕；**display 标题通过 variable 轴把字重从 500 降到 470、字距放宽 +0.004em**（光渗会让字显胖，预先补偿）；hairline 保持 1px 但颜色加深一档感知；accent 全系提亮。情绪：安静、内省、写作时。
- 切换体验：`AUTO / LIGHT / DARK` 三态 mono 文字控件（无太阳/月亮图标），点击循环，240ms 颜色 crossfade（background/color/border-color 过渡，无位移无缩放）；`<html>` 内联脚本防 FOUC，选择持久化 localStorage + `prefers-color-scheme` 兜底。
- 两套主题在 §4 各有完整 token 表；验收标准：同一屏截图并排，两套必须都被认出是"被设计的"，而非反色。

---

## 6. 布局系统

### 6.1 网格

| 断点 | 列数 | Gutter | 容器边距 | 容器 max-width |
|---|---|---|---|---|
| < 768（移动） | 4 | 16px | 24px | 100% |
| 768–1279（平板） | 8 | 20px | 48px | 100% |
| ≥ 1280（桌面） | 12 | 24px | 80px | 1216px |

### 6.2 章节骨架：书页双栏（左页眉栏 + 右内容栏）

桌面端每个 section 采用同一骨架：

- **左栏（col 1–3，≈ 272px）sticky**：章节号（mono-label，`02`）、章节标题（title-3）、一句导语（body-sm, ink-3）。像书页的页眉，滚动时保持在视口内。
- **右栏（col 4 起）**：内容区。阅读块从 col 4 起，最长到 col 10（≈ 880px 内再限制 660px measure）；**col 11–12 永远留白**——右侧的呼吸位是全站留白策略的锚。
- 章节间距：桌面 `padding-block: 160px`，移动 96px；每个章节顶部一条全容器宽 hairline（line-1）。

### 6.3 无表面原则（禁卡片的执行细则）

- 全站 `border-radius: 0`。零阴影（除导航 backdrop blur 外零 blur 面板）。
- 禁止任何"背景色 + 圆角 + 阴影"的内容容器；层级五件套 = **字号阶梯 / 灰度阶梯 / 8px 间距节奏 / hairline / 留白**。
- 唯一允许的"面"：代码块的 `bg-inset`（功能性识别，radius 0）与 selection/wash 高亮（瞬态状态，非容器）。

### 6.4 图标禁令

全站零图标、零 logo 图形、零插画。唯一允许的图形字符：`→` `↘` `↗`（箭头，作为文字的一部分）与 6px 圆形状态点（CSS 绘制）。导航的"菜单"是文字按钮 `Index`，主题切换是文字控件，返回是文字链接。品牌标记 = 导航左侧一枚 8×8px 橙色方块（全站唯一的"logo"，与 caret 同语义：这里活着）。

### 6.5 留白策略

留白按"阅读节奏"分配而非均匀撒：章节间 160px（换章呼吸）> 条目行间 28px（条目内聚）> 行内 8px。大留白只出现在三个位置：Hero 下半、col 11–12、每章标题上方——克制不等于处处空，而是把空白集中成可以感知的"页边距"。

---

## 7. 主要交互与动效

### 7.1 动效参数 tokens

| Token | 值 | 用途 |
|---|---|---|
| ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` | 所有运动 |
| dur-hover | 160ms | hover/press 状态 |
| dur-theme | 240ms | 主题 crossfade |
| dur-hero | 560ms + 90ms stagger | 首屏 reveal |
| caret-blink | 1.1s `steps(2, start)` infinite | Hero caret |

### 7.2 动效预算表（同屏环境动画 ≤ 3）

| # | 动画 | 触发 | 一句话信息功能 |
|---|---|---|---|
| 1 | Hero caret 闪烁（仅 Hero 可见 ≥ 50% 时运行） | 常驻 | "这份档案仍在被书写"——长期性承诺 |
| 2 | 导航当前章节下划线/文字切换 | 滚动到新章节时 160ms | "你在这里"——位置反馈 |
| 3 | 主题 crossfade | 用户切换主题时 240ms | "状态已改变"——切换确认 |

**红线**：内容元素禁止任何 scroll-reveal / 视差 / 飞入；hover/press 属用户触发的状态反馈（160ms 内完成），不计入环境预算但同样只允许 opacity/color/transform。`prefers-reduced-motion: reduce` 时：caret 不闪烁（静态橙块）、reveal 直接呈现、crossfade 保留（无位移风险）。

### 7.3 Signature Interaction：「落墨 Settle」— 首屏逐行落版 + 活字 caret

**行为**：首次进站（session 内仅一次，`sessionStorage` 控制），Hero 四行文字自上而下逐行"落版"——每行 `opacity 0→1`、`translateY(14px)→0`，560ms，行间 stagger 90ms，ease-out。最后一行 "before it breaks." 落定后，行尾橙色 caret 开始以 1.1s 节奏闪烁。第二行与第三行之间因字体切换（sans → serif italic）产生一次"语气转换"的微停顿感（由 stagger 自然形成，不额外加时）。reduced-motion：四行静态直接呈现。

**为什么它"少即是多"**：① 它不是装饰动画，而是**把阅读顺序演了一遍**——访客的眼睛被引导着按作者安排的顺序读完第一段话，等于做了一次 1.8 秒的阅读训练；② 全站其他地方再无进入动画，正因为总量趋近于零，这 1.8 秒才成为整站唯一的"仪式"，记忆成本极低；③ caret 一个 3×0.9em 的橙块同时解决了"网站未完成感"的空状态焦虑（§12）——用最小的元素传达"此站长期生长"，不需要任何"coming soon"横幅。

### 7.4 其他主要交互行为

- **导航**：固定 64px；滚动 > 24px 后浮现 `color-mix(in srgb, var(--bg) 92%, transparent)` 底 + 12px backdrop-blur + 底部 hairline（功能性，非玻璃拟态装饰）。锚点 hover：ink-3 → ink-1 + 底部 1px hairline 从左向右 `scaleX 0→1`（160ms）。当前章节：ink-1 文字 + 2px accent 下划线（accent 语义："你现在在这里"）。
- **链接 hover 词汇表（全站统一）**：正文内链接 = ink-2→ink-1 + 下划线 hairline 由 line-1 变 line-2；条目标题 = 下划线生长 + 行尾箭头右移 4px；meta 文字不响应 hover。触屏设备 hover 全部映射为 `:active`（整行 ink-1 + wash 底瞬时反馈）。
- **Contact 复制邮箱**：点击文字按钮 `Copy`，原地文字替换为 `Copied`（accent-ink），1.2s 后还原。**不用 toast**——反浮层是本方案的立场。
- **主题控件**：三态文字循环 `AUTO → LIGHT → DARK`，当前态 ink-1，其余 ink-3。
- **键盘可达性**：focus ring 统一 `outline: 2px solid var(--accent-ink); outline-offset: 3px`（accent 语义的最后一处：焦点 = 界面的活点）；skip-to-content 链接；全部交互元素 ≥ 44px 触控目标；章节标题用语义 heading 层级。

---

## 8. Projects 展示方式（Selected Work）

**形态：目录索引行（Index Rows）**——像单行本的条目目录，禁止三列卡片墙。

桌面端每行网格（整行是一个 `<a>`，`padding-block: 28px`，行间 hairline）：

```
col 1        col 2–8                          col 9–11            col 12
01           Poisoning the Corpus             RAG · PYTHON · PyTorch    2025 ↗
(mono)       Can five forged documents        (mono-label, 右对齐)       (tabular)
             bend a grounded answer? —
             robustness benchmark & defense
             (body-sm, ink-3)
```

- **hover**：标题出现生长下划线，描述 ink-3→ink-2，箭头右移 4px，行间 hairline 变 line-2。无背景、无抬升、无阴影——行的"激活感"只靠这些排版信号。
- **点击**：前 3 个项目进入 case study 路由（复用章节骨架：title-1 标题 → meta 行 → Problem / Approach / What I learned 三段 body 文字，允许最多 1 张全宽截图，用上下 hairline 夹住、radius 0、无阴影）；其余链接到 GitHub（TODO placeholder）。
- **移动端**：行折叠为两行文本块——第一行 `01 ——— 2025`（mono 两端对齐），第二行标题，第三行描述；触控目标整行 48px。
- Sample data：`content/projects.ts`，6 条，均带 `sample: true` 与注释 `// 示例条目——替换 title/desc/links 即可`；描述只声称过程与能力（"built / benchmarked / reverse-engineered"），不声称发表或获奖。

---

## 9. Research 展示方式

三个子块，全部账簿式排版，无图无卡：

1. **Interests（兴趣账簿）**：6 个真实兴趣方向做成"词条 / 一句话释义"的两栏账簿行（词条 title-3 左，释义 body-sm ink-3 右，行间 hairline）。例：`Knowledge Poisoning — what happens when the corpus itself is the attacker`（释义为 sample，词条为真实方向）。
2. **Open Questions（开放问题）**：Q1/Q2/Q3 悬挂编号排版——mono 编号 `Q1` 悬挂在左（col 4 之外），问题正文 body 用 660px measure。问题是真实的领域问题（RAG robustness / poisoning 防御），标 `sample: true`（它们是"当前在想的问题"而非成果声明）。这一块的排版模仿论文的 questions 节，让学术访客 30 秒判断"这个人的问题意识"。
3. **In Progress（进行中实验）**：每行 = 6px 状态点（running 用 accent，paused 用 ink-4）+ 实验名 title-3 + 一行说明 + `notes ↘` 链接。状态点是 accent 的又一语义落点："现在活着的研究"。

Research 不放仪表盘、不放关键词云、不放雷达图——研究者的专业度由问题的表述质量体现，而不是由可视化装饰体现。

---

## 10. Playground / Lab 概念

**入口形态**：章节导语一句话——"Small, offline instruments for the ideas in §02. No backend, no GPU: every demo ships its data."（sample）。下面是三个"实验台"行，沿用全站索引行语法，但行首带 accent 状态点与 mono 标注 `INTERACTIVE · OFFLINE`。

三个 demo（全部纯前端、数据捆绑、可离线运行）：

1. **Poison Rate p**：24 篇预计算文档的玩具语料（相似度矩阵捆绑为 JSON，无任何模型推理）。滑杆 `p: 0–25%` 控制注入语料的投毒文档数量，文档列表即时重排（200ms 唯一动效），**被投毒文档以 accent 文字标记**，mono 读数实时显示 `p = 8% → 3 / 5 retrieved are poisoned`。这是 §02 "Knowledge Poisoning" 的可触摸版本——accent 的"风险信号"语义在这里达到全站最强表达。
2. **Chunk Size vs Recall**：预计算的 recall / noise 曲线（玩具 QA 集），滑杆 `128–1024 tokens`，Canvas 用单色 ink 画曲线、accent 画当前工作点。读数：`chunk = 512 → recall 0.81, noise 0.17`。说明"工程直觉可以外包给一张可拖动的图"。
3. **Evidence Trace**：固定一个 demo 问题与 5 段检索文档；点击答案中的任意句子，其来源句在文档中以 wash 高亮。把"答案应可追溯"变成一次 10 秒的交互。

Lab 的视觉纪律与其他章节完全一致（无卡片，行 + hairline + 留白），唯一区别是它有状态点与读数——**全站最安静的地方拥有最多的"活信号"，反差本身就是设计**。

---

## 11. 移动端方案（重设计，非缩放）

- **导航**：顶栏 = 橙色 tick + 名字（左）、`Index` 文字按钮（右）。点击后全屏 overlay：纯 bg 色（无 blur 无遮罩图案），9 个章节以 display-2（44/54px）纵向列出，每行前置 mono 章节号；overlay 以 200ms fade 开合，**无 stagger 动画**（预算纪律）；`Close` 文字按钮 / Esc / 点击任意章节关闭。这相当于把整站目录做成一页"总目录页"——移动端特有。
- **章节指示器**：顶栏下方左侧一枚 mono 10px 的 `02 — RESEARCH`，随 IntersectionObserver 切换（150ms fade）。桌面端由 sticky 左栏承担的"你在哪"，移动端由它承担——这是被重新设计的信息架构，不是缩小。
- **内容优先级**：Hero 四行构图保留（字号走 clamp 下限）；About 三句话置顶；Work 行改为两端对齐的两行式（§8）；Research 账簿退化为单栏堆叠（词条行在上、释义在下）；Chronology 的年份列改为行内前缀。
- **移动端特有体验**：① `Index` 总目录页；② 章节指示器；③ Lab 滑杆换用 44px 高的原生 `input[type=range]`，thumb 为 accent 方块（-radius 0 的品牌一致性）；④ 正文 17/30（比桌面更大），measure 全宽减 24px 边距。
- 性能：字体子集 + 内容路由级代码分割；LCP 目标 = Hero 首行文字（无图片，天然 < 1.2s）。

---

## 12. 空状态策略

1. **默认不渲染**：`content/*.ts` 中数组为空的 section（当前如 Awards）整体不输出，导航锚点与编号在构建时自动跳过——空内容的第一策略是"不存在"。
2. **唯一保留在场的空状态是 Publications**（因为"正在准备"本身就是真实信息）：hairline 之下只有一行 lede——"Selected publications will appear here."，配合 caret 的"仍在书写"语义，读起来是承诺而不是缺席。禁止"敬请期待"横幅、禁止占位骨架屏。
3. **占位即数据**：所有未知字段（姓名、邮箱、GitHub ID、Scholar）在 `content/profile.ts` 中以 `TODO_` 前缀 + 注释标注，渲染为中性 placeholder（如 `your-handle`），替换 = 改一个文件；Contact 渠道行按"配置了才渲染"逐行处理。
4. **长期生长的表达**：mono-label `LAST UPDATED {build date}` 出现在 Publications 与 Chronology 底部——档案的诚实元数据。

---

## 13. 与其他 7 个方案的差异（我不是什么）

1. **我不是 Team F 的"坐标纸"**：F 让网格成为可见图形（标尺、准星、描边字、鼠标坐标读数），网格是它的主角；我把网格完全隐去，页面上没有一件"网格家具"。同用 hairline 与编号，F 的编号是构图元素，我的编号是书目元素；F 的红是版面支点，我的橙是语义信号。
2. **我不是 Team H 的"可检索装置"**：H 把主页做成隐喻化的检索系统、允许打破常规交互；我零装置、零隐喻——克制本身就是我的实验，而且我敢把动效预算砍到它的十分之一。
3. **我不是新粗野主义（Neo-Brutalism）**：不用高饱和撞色、粗黑描边、生硬位移和"暴露结构"的姿态；我的粗野只有一种形式——敢把整个页面留成空白。
4. **我不是编辑杂志风（Editorial）**：不依赖大图、图文混排、多栏节奏与印刷装饰；我的页面即使一张图都不加载也必须完整成立（事实上 Hero 就没有图）。
5. **我不是暗黑科技风（Aurora / Glassmorphism / Terminal）**：无渐变、无光晕、无玻璃面板（导航 12px 功能性 blur 除外）、无赛博绿与等宽字体狂欢。
6. **我不是 3D / 空间叙事产品页**：无 WebGL、无视差、无滚动剧场；滚动在这站只做一件事——阅读。
7. **我不是温暖手作风（Organic / Craft）**：不用纸质纹理、手写字与衬线大标题的"手工感"回潮；我的衬线只服务于长文阅读和一个限定语气，且总量不超过 10 处。

---

## 14. 风险与自我批评

1. **"看不出设计"的风险（最大风险）**：极简方案最怕被 10 秒扫描式评审判为"没有设计动作/像默认 README"。本方案的成败完全押在 Hero 排版功力与行级排版的一致性上——kerning、行高、灰度任何一处失误都会被单色无限放大；落选的最大可能不是方向错了，而是执行差了 5%。
2. **与 Team F 的表面相似**：同用 hairline、编号、单 accent、radius 0。若 accent 的"语义信号"逻辑不被评委读到，会被误认为换色版 Swiss——本文档 §4.3 与 §13.1 就是为这个风险写的。
3. **禁卡片在大屏的单调风险**：Work/Open Source 的行列表在 1216px 宽度下节奏容易摊平；目前靠"左栏 sticky + 右侧 col 11–12 留白 + hover 微反馈"撑住，若内容少于 4 条会显薄，预案是给 case study 增补 "Problem/Approach/Learned" 段落密度。
4. **accent 纪律的执行风险**：caret、状态点、focus、导航、demo 五处都合法使用橙色，同时入镜（Hero + Lab demo）就会破功；需要实现时建立 lint 级自查。
5. **社交分享无记忆点**：纯文字首屏在 OG 卡片场景天然吃亏；缓解：构建期用同一套 token 静态生成一张排版式 OG 图（深底 + Hero 三行字 + 橙 caret）。
6. **"零滚动动效"的感知风险**：2026 年的评委可能把安静误读为"未完成"；caret、章节下划线与 LAST UPDATED 元数据承担"这站是活的"的证明，必须实现到位。
7. **Dark mode 的灰阶风险**：ink-2 长文 + 提亮 accent 的组合若调校失手会显"褪色"；两套主题都要用真实内容截图验收，而不是色板验收。

---

## 附录 A：工程落点（Tailwind v4 / 内容 / 动效）

**`@theme` tokens（节选）**：

```css
@theme {
  --color-bg: #FCFCFD;      --color-ink-1: #191C1F;   --color-ink-3: #6B7178;
  --color-line-1: #E3E6E9;  --color-accent: #FF4A00;  --color-accent-ink: #C2410C;
  --color-wash: #FFE5DA;    --radius-*: initial;       /* 全局 radius 0 */
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
}
.dark { --color-bg: #0E1013; --color-ink-1: #E9EBEE; --color-accent: #FF5A1F; /* …全表见 §4.2 */ }
```

**内容文件**：`content/profile.ts`（hero/about/contact，`TODO_` 前缀占位）、`content/projects.ts`（6 条 `sample: true`）、`content/research.ts`（真实兴趣 + `sample: true` 的开放问题）、`content/publications.ts`（空数组 → 不渲染列表，仅空状态行）、`content/repos.ts`（4 条 sample，预留 GitHub API 接口）、`content/notes.ts`（3 篇 sample）、`content/timeline.ts`（sample）。

**motion（`motion/react`）**：仅用于 Hero Settle（`AnimatePresence` + stagger）与导航下划线；列表重排用 `layout` prop（Lab 投毒重排，200ms）；其余交互全部 CSS transition（160/240ms）。

**无障碍清单**：语义 heading（h1 仅 Hero）、skip link、focus-visible 统一 accent-ink ring、`prefers-reduced-motion` 三级降级（§7.2）、全文字对比度 ≥ 4.5:1（ink-4 仅装饰）、触控目标 ≥ 44px、`aria-current` 标注当前章节。
