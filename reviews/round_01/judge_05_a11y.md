# Judge 5：Accessibility Judge 评审报告

> 评审人：WCAG 2.2 / ARIA 专家，同时关注认知无障碍与运动敏感（前庭）用户。
> 评审日期：2026-10-05。评审对象：`generation_01/team_a…team_h` 共 8 份设计提案（已全文通读）。

## 评审视角

我的角色如何影响打分：

1. **一票否决区：`accessibility` 与 `ux`**。这两个维度我从严评分：一个方案如果在键盘路径、对比度、reduced-motion、语义结构上有硬伤，accessibility 不会高于 7；如果 hover 承载了不可替代的信息、或导航存在单点故障，ux 同理。其余 12 个维度按常规标准打分，但我天然对"动效越多、交互越奇、视觉越暗"的方案多一分怀疑。
2. **我不信任提案自报的对比度数字**。所有 8 份提案的 hex 我都用 WCAG 相对亮度公式重算了一遍（关键正文对/次要文本对/accent 对/装饰对，两套主题共 90+ 组配对），下文引用的对比度数值除特别注明外均为**我的实测值**，不是提案自报值。判定口径：正文文本 4.5:1（AA），大文本（≥24px/18.66px bold）3:1，UI 部件与图形 3:1，禁用态豁免、纯装饰豁免。
3. **四个专项审视**（我的角色指令）逐方案核查：(a) reduced-motion 是逐效果写了降级还是一句空话；(b) Canvas/交互装置对屏幕阅读器与键盘用户意味着什么；(c) 单键/和弦快捷键（`g`+`r`、`/`、`t`、数字键）与 SR 浏览模式快捷导航（NVDA/JAWS 的 `g`/`t`/`1–6` 都是快速导航键）及浏览器保留键的冲突；(d) hover-only 信息呈现是否有 focus/触屏等价物；(e) 空状态与 placeholder 是否会被误读。
4. 认知无障碍计入 ux：首访仪式成本、隐喻学习成本、快捷键记忆负担、空态文案语气，都在我的 ux 分里体现。

## 对比度实测核对表（关键结论）

| Team | 实测通过情况 | 实测不通过 / 与自报不符处 |
|---|---|---|
| A | Light: ink-1 16.69 / ink-2 7.94 / ink-3 4.81 / accent-ink 5.05 / accent 图形 3.29；Dark: ink-1 15.95 / ink-2 8.52 / ink-3 5.75 / accent-ink 7.37 —— 全部正文与 UI 级配对通过 | ink-4（Light 3.02 / Dark 3.00）被用作**代码注释色**——注释是文本，不满足 4.5:1 |
| B | Light: ink 16.36 / ink-soft 9.00 / accent 6.19；Dark: ink 14.63 / ink-soft 9.62 / accent 5.58 | ink-mute Light 实测 **4.44**（自报 ≥4.5，压线不过）；ink-mute 在 paper-deep 上 4.11；ink-faint（folio 页码/注释）Light 2.50 / Dark 3.08 |
| C | Light: text-1 16.34 / text-2 7.06 / accent 4.65 / accent-strong 6.62；Dark: text-1 15.94 / text-2 7.51 / accent 10.4+ | text-3：Light **4.08** / Dark **3.43**——策略上仅限"装饰性 micro"，但边界（版本号、年份、BUILD 行）未划定审计清单 |
| D | Light: ink 14.93 / ink-soft 5.35 / accent 5.91 / accent-2 5.90；Dark: ink-soft 6.93 / accent 6.86 / accent-2 7.63 —— 正文全过 | ink-faint（= 语法注释色 & placeholder 色）Light **2.66** / Dark 3.73 |
| E | Light: text 15.51 / muted 4.85 / accent-text 6.02 / stamp 5.88 / ok 5.76 / accent 图形 5.28；Dark: muted 5.78 / accent-text 8.51 / stamp 6.35 / ok 7.34 —— **我实测的全部配对无一不达标** | 无（唯一"零压线失败"的两套配色之一） |
| F | Light: ink 17.63 / muted 6.13 / accent 5.63；Dark: ink 16.40 / muted 7.40 / accent 5.65 | faint（Light 3.32 / Dark 3.66）被用在索引表的 **Role/Tags 信息列**——信息性文本不满足 4.5:1，这是明确违规而非策略问题 |
| G | Dark: text-1 15.45 / text-2 7.46 / accent 7.69 通过 | text-muted（图注）Dark **3.47** / Light **3.54**；text-faint（placeholder/示例注）Dark **1.99** / Light **2.10**；**Light accent 实测 4.42**（自报 ≈5.6）——链接与铭牌编号在 Light 下压线不过。8 套配色中最差 |
| H | Light: text 16.73 / muted 6.02 / accent 6.62 / signal 5.22 / ok 5.61；Dark: muted 6.94 / accent 8.27 / signal 9.12 / ok 10.38 —— **全部通过**；signal-soft 底上 signal 文字 4.62 亦通过 | 无硬性失败 |

其他实测：各主题 hairline 复合后对比 1.16–1.30（hairline 属装饰分隔，可接受，但意味着 F 的"暴露网格"与 G 的"发丝线层级"对低视力用户**几乎不可见**——层级必须同时由明度差/字阶承载，两家均有说明）；各 accent-dim/subtle/wash 底上的正文均在 11–14:1，无"高亮底吃掉文字"问题。

---

## 逐方案评语

### Team A — Minimalism「Monograph 单行本」

- **优点**：
  1. **对比度纪律做到了 token 级**（§3.2/§4）：每档灰度标注用途与下限，"ink-4 仅限 ≥60px 装饰大字或 disabled"是一条可 lint 的规则——我实测其全部信息性配对（ink-3 4.81 起）确实通过，这是 8 份文档里把"对比度"写成**验收条款**而非口号的最佳范例。
  2. reduced-motion 三级降级写到了具体效果（caret 静态化、reveal 直接呈现、crossfade 因无位移风险而保留）——判断准确，不是一刀切。
  3. 零图标零 Canvas 零滚动动效的方案，天然把 SR/键盘/前庭风险面压到最小；focus ring 用 accent-ink（实测 5.05/7.37）、skip link、44px 目标、`aria-current` 都在 §7.4 落了地。
- **缺点/风险**：
  1. ink-4 同页被指定为代码注释色（§4.1 `code-comment: #9AA1A8`，实测 3.02）——注释是会被阅读的文本，AA 不豁免；至少需提到 ink-3 或明示"注释不得承载必读信息"。
  2. 移动端 `Index` 全屏 overlay（§11）未写焦点管理：focus trap、关闭后焦点归还、`aria-modal` 均缺位——这是 A 全文档唯一一处交互无障碍留白。
  3. 主题三态"文字按钮点击循环"（AUTO→LIGHT→DARK）对 SR 是反模式：状态变化依赖视觉，应改 radiogroup（D 的做法）或补 aria-live 播报；"Copied" 原地替换同理需要 live region。
- **最值得被偷走的想法**：**"对比度写进验收"的做法本身**——每个 token 附用途与最低对比值、装饰灰度白名单化。这套表格可以直接进任何团队的 CSS 审查清单。
- **进入实现前必须修正的 a11y 隐患清单**：
  1. `code-comment` 从 ink-4 提到 ≥4.5:1 的档位（或声明注释仅演示数据用）。
  2. 移动 Index overlay 补 focus trap + `aria-modal` + 关闭还焦。
  3. 主题控件改三选一语义（radiogroup 或 menuitemradio），替换 "Copied" 补 `aria-live="polite"`。
  4. caret 闪烁为常驻自动动画（>5s），建议给 `PAUSE` 级开关或严格限定为 reduced-motion 外仅装饰（现状可接受但要在验收里写明）。

### Team B — Editorial「Field & Retrieval 学刊」

- **优点**：
  1. **移动端边注降级是教科书级**（§11）：marginalia → 行内嵌入注（竖线块）→ 可折叠注，层级不丢；目录 overlay 写明了"焦点圈闭"。
  2. 排印系统对 SR 语义友好：规则线/留白承担层级而非色块，`text-transform` 处理 mono 大写对 CJK 天然安全，CJK 段落禁 drop cap（§3.2）——这些都是懂行细节。
  3. 空状态的"征稿中"（§12）在语义上是三行真实内容而非装饰骨架，SR 读出来是一句完整话；`showEmptyState` 开关可整页下线。
- **缺点/风险**：
  1. **对比度压线失败**：ink-mute 自报 ≥4.5 实测 4.44（11–13px 的 kicker/fig-label/meta 全在用）；在 paper-deep 上的注释更是 4.11。对一个"排印即界面"的方案，元数据层恰恰是使用密度最高的文本层，0.06 的差距会让它在真实屏幕上批量不达标。
  2. ink-faint（2.50/3.08）用于 folio 行（`VOL. I — NO. 4` 是信息不是装饰）与代码注释。
  3. Index 行 hover 的"标题 500 → 斜体交叉淡化"会因字形宽度变化产生微 layout shift，对运动敏感与低视力用户是持续的小刺激；`?` 求助层、快捷键冲突声明、SPA 路由焦点管理（移焦 h1）均未提及。
- **最值得被偷走的想法**：**"空栏目在目录里保留一行"**——Publications 以 `— CALL FOR PAPERS` 出现在 Contents 中，空状态获得导航存在感。这是空状态信息架构化，比"页面里画个框"高一个层级。
- **进入实现前必须修正的 a11y 隐患清单**：
  1. ink-mute 提亮至 ≥4.5（建议 #6F675A 一类），并覆盖 paper-deep 上的实例；folio 从 ink-faint 改 ink-mute。
  2. hover 斜体交叉淡改为**不改变字形宽度的等价反馈**（下划线/编号变色），或仅作 opacity 交叉。
  3. 补 SPA 路由焦点规范（移焦 h1 + 页名播报）、`:focus-visible` 具体规格、reduced-motion 下阅读进度线的处理说明。

### Team C — Modern AI「精密仪器」

- **优点**：
  1. **Relevance Lens 的禁用条件是 8 份文档里写得最完整的**（§7.3）：触屏、`prefers-reduced-motion`、条目 >12 三个条件全部写死，且明确"重排仅视觉层、DOM 顺序不变、Δ 读数 aria-hidden"——这是把 WCAG 2.2 的运动与顺序要求内化成了产品规则。
  2. ⌘K Palette 完整 ARIA combobox 模式 + 焦点圈闭 + 结果数播报；mono ≤10%、刻度 ≤3 组的"防滑条"同时是无障碍友好（减少噪音与认知负担）。
  3. 两套主题独立校准，Light accent 给了 14px 以下专用的 accent-strong（实测 6.62）——为小字号 mono-tag 单独设值是很多方案没想到的。
- **缺点/风险**：
  1. **主题切换的 circular reveal（§5）没有写 reduced-motion 降级**——只写了"不支持 VT 的浏览器降级交叉淡入"。clip-path 圆形扩散是大面积位移动画，这是全文档最明显的一处 reduced-motion 空话。
  2. Pipeline 微缩图用 SMIL `<animateMotion>`（§2.2）：SMIL **不受** `prefers-reduced-motion` CSS 控制，必须 JS 移除/pauseAnimations；且"每段 hover 显示真实注脚"是 hover-only 信息，SVG 段落未给键盘焦点等价物。
  3. text-3（实测 Light 4.08 / Dark 3.43）的"仅装饰"边界没有审计清单——`v0.4.1`、年份、BUILD hash 这些到底是必读还是装饰？没划清，实现时必然越界。
- **最值得被偷走的想法**：**禁用条件三元组**——任何动效/交互增强必须同时声明（输入方式豁免 | reduced-motion 豁免 | 规模阈值豁免）。这个格式应该成为所有方案的 signature interaction 模板。
- **进入实现前必须修正的 a11y 隐患清单**：
  1. 主题切换补 reduced-motion 降级（直接换色或 ≤150ms crossfade）。
  2. SMIL 读数点改为 JS 驱动或在 reduce 时移除；pipeline 五段补 `tabindex` + focus 等价的注脚呈现 + `role="img"` 总标注或 `aria-hidden`+文字副本。
  3. 为 text-3 出具"允许出现的字符串白名单"（建议：仅 `—` 占位与纯重复装饰读数；版本号/年份/BUILD 一律 text-2）。
  4. Relevance Lens 的 Δ/相关性信息补键盘等价（如行 focus 时显示 `RELATED: …` 行，其实在 Research ledger 已有 related 字段，需在 Work 区同样可达）。

### Team D — Academic「Offprint 抽印本」

- **优点**：
  1. **边注三段降级 + 原生降级路径**（§6.2）是全 8 份里对"信息分流如何随输入方式变化"最严肃的回答：桌面漂浮注 → 平板行内注 → 移动 `<button>` 折叠注（`aria-expanded`/`aria-controls` 齐全，无 JS 时 `<details>` 兜底）。
  2. Research Map 的无障碍规格完整（§9.2）：`role="img"` + `<title>/<desc>` + 图下文字版关系列表 + 移动竖版图；同时"地图上永远不出现论文数，只有问题分布"在内容层面规避了数据误读。
  3. 主题切换用 radiogroup + 方向键（§5）——8 份里唯一把主题控件语义写对的；平滑滚动在 reduced-motion 下直接跳转（§2.1）、进度线在 reduce 下保留并给出理由（功能性直接操纵反馈，§7.2）——判断成熟。
- **缺点/风险**：
  1. ink-faint 一色三用（装饰 ghost、代码注释 tok-com、placeholder 文字）——注释实测 Light 2.66，placeholder 文字是用户可能需要读的内容，均不达标。
  2. Map 节点可点击过滤但未声明键盘可达（节点应为 focusable button）；双 SVG 双断点都要在 DOM 里，需明确隐藏的一份 `aria-hidden`/`display:none`，否则 SR 读两遍。
  3. 长期维护对无障碍是隐性风险（自我批评 §14.5 已承认）：`upd. 2026-10`、RESTING 状态一旦失更，"诚实现场"变"荒废证据"——状态语义对 SR 用户同样失效。
- **最值得被偷走的想法**：**"降级链里必须有一步是无 JS 的原生 HTML"**——`<details>` 作为折叠注兜底、`<noscript>` 全文可达。把渐进增强写成内容策略而非技术补丁。
- **进入实现前必须修正的 a11y 隐患清单**：
  1. tok-com 与 placeholder 不用 ink-faint：注释 ≥4.5（Light），placeholder 至少 ink-soft（5.35）并保持 mono。
  2. Map 节点 keyboard 可聚焦（`<a>`/`<button>` + focus 等价 hover 高亮）；隐藏 SVG 断点分支加 `aria-hidden`。
  3. Question Ledger 展开的 40ms stagger 在 reduce 下瞬时；反链 chip 的过滤状态用 `aria-live` 播报（"filtered by Poisoning, 2 questions"）。

### Team E — Creative Dev「BENCH / 工作台」

- **优点**：
  1. **首屏 Canvas 装置的无障碍规格是本次竞赛的天花板**（§2.2）：SR 可读词表 `<ul>` 兜底 + 键盘虚拟光标（方向键/Enter/Esc 全路径）+ 常驻 `PAUSE`（localStorage 持久化）+ reduced-motion 下由**同一个 `renderStatic()`** 渲染被设计的静态快照（不是截图）+ 无 JS 输出静态 SVG + "装置永远有不用它也不损失信息的兜底"。降级与本体同一天设计、同一双手画出——这正是我的角色信条。
  2. hover 永不承载必读信息：Bench Row 的 hover 预览带有完整键盘/触屏等价物（Enter/点击展开同一预览带 + `aria-expanded`，§8 版式二）；快捷键体系配了三层发现性 + `?` 全键位浮层 + "仅非输入焦点生效、浏览器保留键不劫持"（§7.1–7.3）。
  3. 工程化验收：Lighthouse 移动端 A11y 100 写成目标、路由切换移焦 h1、SPA `aria-live` 播报、`:focus-visible` 被设计成"四角刻度变亮"（统一视觉语言而非默认 outline）。配色是我实测的唯一"零压线失败"之一。
- **缺点/风险**：
  1. 装置用 `role="img"` + aria-label 是**自相矛盾的语义**：role="img" 把整个区域宣告为静态图像，其上的键盘交互 SR 不会进入，指令文本也会被吞。应改 `role="application"`（仅 canvas 节点）+ 外部说明，或干脆 `aria-hidden` canvas + 让词表/按钮承担全部语义。
  2. 和弦键（`g`+`r`）与 `t` 在 SR 浏览模式下会被 NVDA/JAWS 的快速导航键（g=图形、t=表格）截走——键盘 SR 用户实际用不到这些和弦。因为一切都有可见路径所以可接受，但 `?` 帮助层与首次 toast 必须明示"也可全部用 Tab/菜单完成"，不能把和弦呈现为主路径。
  3. Schematic Session 的 12ms/字符打字效果即使有 reduce 静态版，对认知负荷仍是噪音；三台 demo + 装置 + palette 的键盘交互总量对短时记忆是负担（发现性三层缓解了，但验收时要测）。
- **最值得被偷走的想法**：**"降级态与本体由同一个渲染函数生成"**（`renderStatic()`）——它从工程上保证降级形态不是事后补丁，永远不会"降级态长得像没做"。这一条值得写进竞赛的工程基线。
- **进入实现前必须修正的 a11y 隐患清单**：
  1. 重构装置语义：canvas `role="img"` → `role="application"`+`aria-roledescription`，或 canvas `aria-hidden` + 显式"以列表查看"切换作为一等入口（文档已提到此切换，应升格为默认 SR 路径）。
  2. `?` 帮助浮层与快捷键 toast 中声明 SR 用户路径（Tab + 可见菜单等效）。
  3. palette 空结果、demo 结果的 `aria-live` 播报节流（避免逐帧 announce）；demo 控件（滑杆/开关/Reset）补 visible label 关联。

### Team F — Swiss「Coordinate System」

- **优点**：
  1. 索引表行的语义正确（§8）：整行是 `<button>`、`aria-expanded`/`aria-controls` 齐全、Tab 逐行聚焦 + Enter 展开、focus-visible 红 outline——行展开模式没有埋雷。
  2. Ghost 编号（T0.5, 280px outline）主动 `aria-hidden`；坐标读数声明"触屏/键盘显示最后已知坐标，静止即可，不算动效"——对装饰性读数的克制是对的。
  3. reduced-motion 逐效果处理（网格呼吸退化为 150ms 交叉淡化、进入动画替代、主题脉冲为 opacity）；实现规定动效仅 transform/opacity。
- **缺点/风险**：
  1. **faint 色被用于信息性文本**：索引表的 Role/Tags 列（T9 mono, faint，§8）实测 Light 3.32 / Dark 3.66——"HARNESS · EVAL"是帮助用户判断项目性质的信息，不是装饰。faint 的"装饰性 mono 标注"定位与实际用法冲突，这是明确 AA 违规。
  2. 首屏 Poster 层 1.5px text-stroke 描边字对低视力用户可读性差（笔画细、无填充），虽有 ink 高对比，但 152px 的三行构图在 200% 缩放下依赖描边渲染，需实测 `text-stroke` 各浏览器差异与 forced-colors 下的回退。
  3. hairline 复合对比仅 1.16–1.30：方案声称"层级靠 hairline 与 surface 明度差"，但对低视力用户 hairline 几乎不可见——暴露网格的构图价值可以保留，但层级信息（章节边界、表头线）必须同时有字阶/间距冗余表达（§6 部分做到了，验收时要查）。
- **最值得被偷走的想法**：**"空状态 = 表格里的一行"**（`P— | Selected research will appear here. | — | —`）——空行沿用满行的全部语义结构，SR 读出来是一行完整的表格行。这是最优雅的空状态语义化。
- **进入实现前必须修正的 a11y 隐患清单**：
  1. 索引表 Role/Tags 列、FIG 注释等一切信息性 mono 改用 muted（≥6:1）；faint 白名单化（仅 ghost/对角线/装饰标注）。
  2. Poster 层在 forced-colors / 高对比模式下的回退（描边→实心 ink）；200% 缩放实测。
  3. 主题三态控件补 radiogroup 语义；主题切换红脉冲在 reduce 下完全移除（opacity 脉冲对光敏用户仍是闪烁）。

### Team G — Dark Premium「Dimmer Room」

- **优点**：
  1. **动效降级链是 8 份里工程上最完备的**：First Light（reduce → 光晕 300ms 淡入驻留，"灯已经亮着"）、Dimmer Switch（VT → 色彩过渡 → 即时，reduce → 150ms crossfade）、`mix-blend-mode` 不支持时只播光晕——每条 signature 都有三级出口。
  2. 细节意识：图片压暗在 `forced-colors` 与打印样式下强制原图（§14.3）；`theme-color` meta 同步；切换不打断 focus；空展位"hover/focus 无任何变化——空位也是展品，不需要引诱点击"（§12）——对"空状态不该是伪交互"的理解到位。
  3. 图表双主题 token 序列 + `currentColor` SVG 纪律，暗底图表可读性有制度保障。
- **缺点/风险**：
  1. **对比度是 8 套配色中最差的**（实测）：text-muted（图注/弱化文本）Dark 3.47 / Light 3.54——图注是必读文本；text-faint（placeholder、示例注释）Dark **1.99** / Light **2.10**——几乎不可读；Light accent 自报 5.6 实测 **4.42**，链接在 Light 下压线不过。方案只自查了 text-1/2/accent 三档，恰好漏掉了出问题的两档。
  2. "旋钮式拨杆开关"（machined dial）作为主题控件未声明键盘语义（radiogroup？三个刻度是否可 Tab？），拟物控件最容易在实现时变成纯鼠标件；切换期间"锁输入 700ms"对运动障碍用户是敌意设计（连点切换被吞）。
  3. Dark 默认且 "无偏好用户也默认 Dark"（§4.1）——推翻 `prefers-color-scheme: light` 用户的系统偏好是一个立场，但`prefers-contrast: more` 与强光环境用户（低视力常见）被迫进暗房，Light 一等公民性打折扣。
- **最值得被偷走的想法**：**"reduced-motion 不是删掉动效，而是给出该动效的'已到达终点态'"**（First Light 直接淡入到驻留态光晕）——降级后画面依然是"被设计过的状态"而非空白。
- **进入实现前必须修正的 a11y 隐患清单**：
  1. 重调 text-muted ≥4.5、text-faint 淘汰出一切可读文本（仅禁用态）；Light accent 换 `--accent-hover` 档（实测 6.33）或重新取值至 ≥4.5。
  2. 拨杆开关补 `role="radiogroup"` + 三档可聚焦 + 状态播报；去掉 700ms 输入锁（或降到 ≤200ms 且不吞第二次切换）。
  3. 尊重系统 Light 偏好作为首访默认（System 缺省），"默认 Dark"降级为品牌推荐而非强制。
  4. 2% 噪点纹理、inner-highlight 等纯装饰层统一 `aria-hidden`（已知装饰，但要防实现时挂上语义）。

### Team H — Experimental「A Retrievable Self」

- **优点**：
  1. **§15 是一份真正的验收清单而非态度声明**：键盘全图（含 focus trap、roving tabindex、Esc 还焦）、reduced-motion 全量降级表（六行，逐动效对应）、无 JS 下全部内容为服务端真实 HTML、`prefers-contrast: more` 关闭遮蔽 + divider 加深、信号状态"永不用纯色编码（配 ▲ 与文字标签）"、玩具结果 `aria-live="polite"`。把 `prefers-contrast` 写进规格的只有这一家。
  2. 遮蔽装置的关键决定正确（§2.2）：全部文字真实在 DOM、遮蔽是 aria-hidden 装饰层、`prefers-contrast` 直接关闭、完成态记忆、装置外常驻"跳过"锚点——并在 §14.5 主动把"为什么不干脆不遮蔽"列为接受挑战的问题。这种自我对抗是无障碍意识的最好证据。
  3. `--signal`/`--accent` 双色语义系统（攻击 vs 可信路径）强制"凡 signal 必有文字说明"——用配色教访客读研究，同时不依赖色觉。配色实测两主题全过（signal 5.22/9.12）。
- **缺点/风险**：
  1. blur 遮蔽对**不用 SR 的低视力用户**仍是实质伤害：5px blur + 0.35 opacity 的摘要在他们眼里不可读，而他们往往不会设置 `prefers-contrast`。跳过锚点 + 首次输入即揭示缓解了，但默认路径对这批用户就是"先操作才能读"，认知与运动双重成本。
  2. 快捷键 `→`/`←`/`1–4`：数字键 1–4 在 NVDA 浏览模式是标题快速导航键，会被截走；滚动驱动的逐条揭示用 `aria-live` 播报"facet 2 of 4 revealed"在连续滚动时会连珠炮——需节流/合并播报。
  3. Timeline 模块被整体废除（§13.6），BRIEF §4 要求的能力缺了一个维度；palette 的 combobox 语义（`aria-activedescendant`/`option` 结构）只写了 roving tabindex，规格差半步。
- **最值得被偷走的想法**：**"每个实验特性必须带'目的 / 降级方案 / 可用性守护'三件套"**（§1 原则 1 + 全文档执行）——把无障碍从验收阶段的检查项变成特性立项时的第三个字段。这是本届提案中对"降级是一等公民"最彻底的制度化。
- **进入实现前必须修正的 a11y 隐患清单**：
  1. 为低视力（非 SR）用户提供默认可读路径：`prefers-contrast: more` 之外，建议对任何用户在装置聚焦/悬停时即时去遮蔽，或把遮蔽强度降为 2px + 说明性"已就绪可揭示"文案。
  2. 揭示播报节流（合并为"3 of 4 revealed"单次播报）；数字键路径在 SR 下不可依赖，`?`/帮助说明中明示。
  3. palette 补完整 combobox ARIA（`role="combobox"` + `listbox` + `option` + `aria-activedescendant`）。
  4. 主题三态控件语义（radiogroup）补齐；Timeline 缺位要么恢复为归档行（可复用 F 的"空 = 表格一行"），要么在差异声明中向评委明确放弃该模块的代价。

---

## 排名与理由

**Top 3：**

1. **Team E（BENCH / 工作台）**——唯一把"高风险交互"（Canvas 装置、hover 预览、快捷键体系、三台 demo）逐个给出 SR/键盘/reduced-motion/无 JS 四重答案的方案，且降级形态由同一渲染函数生成、hover 永不承载必读信息、Lighthouse A11y 100 写成验收。ux 维度同样第一：双路径导航（palette + 可见索引）意味着没有任何单点故障。它的隐患（role="img" 语义、和弦与 SR 浏览模式冲突）都是实现期可修的规格错误，而非设计错误。
2. **Team A（Monograph 单行本）**——把对比度做成 token 级验收条款、把动效预算砍到接近零，是"最少犯错的方案"；实测配色几乎无瑕疵。它输给 E 的地方在于：低风险方案的低风险有一部分来自"没做多少交互"——Index overlay 焦点管理、主题控件语义、"Copied" 播报这些细节还没有被同等地设计。作为无障碍评委，我尊重这种克制，但 E 证明了"复杂交互也能被驯服"，这在方法论上更有价值。
3. **Team H（A Retrievable Self）**——§15 验收清单 + `prefers-contrast` + signal 永不纯色编码，是制度最完整的无障碍设计；Query Log 的信息结构也极大降低了研究内容的认知门槛。它的 blur 遮蔽是一个"明知有伤害、已把伤害参数化并开放质疑"的决定，我给它的分数扣在这里：默认路径不应让任何用户群"先操作才能阅读"。

**第四名（落选说明）：Team D**——边注三段降级与 SVG 地图规格是我见过最完整的学术排版无障碍方案，Question Ledger 甚至降低了研究者内容的理解成本；输在 ink-faint 一色三用（注释/placeholder 不达标）与地图键盘路径未写明——都是一晚上的修复量，但 Round 1 按文档评分。

**一票否决区对照**：无方案触及否决线（硬性不可达/信息锁死在 Canvas/对比度全面崩坏）。G 的配色是最大单点风险（三档文本实测不达标 + Light 链接压线），若进入 Round 2 必须先修色板；F 的 faint 用法同理但范围小。

---

## 附：14 维度评分表（我的完整打分）

| 维度 | A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|---|
| visual_quality | 8.5 | 8.5 | 8 | 8 | 8 | 8 | 9 | 8 |
| originality | 7.5 | 8 | 8 | 8 | 8.5 | 8 | 8 | 9 |
| typography | 9 | 9.5 | 8 | 9 | 8 | 8 | 8.5 | 8 |
| information_hierarchy | 9 | 8.5 | 8.5 | 9 | 8.5 | 8.5 | 8 | 8.5 |
| **ux** | 8 | 8 | 8 | 8.5 | **9** | 7.5 | 7.5 | 8 |
| mobile_experience | 8.5 | 8.5 | 8 | 8.5 | 8.5 | 8 | 8 | 8.5 |
| technical_feasibility | 9 | 7.5 | 8.5 | 8 | 7.5 | 9 | 8 | 8.5 |
| long_term_maintainability | 8.5 | 8 | 8.5 | 7.5 | 7.5 | 8.5 | 7.5 | 8 |
| research_presentation | 8.5 | 8.5 | 8.5 | 9.5 | 8.5 | 7.5 | 7.5 | 9 |
| portfolio_presentation | 8 | 8 | 8.5 | 8 | 9 | 7.5 | 8.5 | 8.5 |
| light_mode | 9 | 9 | 8 | 9 | 8.5 | 8.5 | 7.5 | 8.5 |
| dark_mode | 8.5 | 8.5 | 9 | 8.5 | 8.5 | 8 | 8 | 8.5 |
| performance | 9.5 | 7.5 | 8.5 | 9 | 8 | 9 | 8 | 9 |
| **accessibility** | **9** | 7.5 | 7 | 8.5 | **9** | 6.5 | 6.5 | 8.5 |
| 总分 | 120.5 | 115.5 | 115 | 119 | 117 | 112.5 | 110.5 | 118.5 |
