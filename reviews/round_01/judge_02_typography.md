# Judge 2：Typography（排印/字体评委）评审报告

## 评审视角

我做了二十年出版社书籍与刊物的排版，也做过字体设计授权与 webfont 工程。我看一份设计提案的 Typography，不是看它列了几个字号，而是看它是否构成一个**系统**。我的评分依据以下八条，其中前四条是从严项：

1. **字号阶梯是否成节奏**：相邻级差是否有可解释的比例关系（模数或光学递进），字距（tracking）是否随字号反向递变（大字收紧、小字放开），移动端是否有独立的镜像阶梯而不是简单缩放。我特别警惕"看起来像阶梯的数字列表"——一串 rem 数字若无比例逻辑、无 tracking 配套，就只是 CSS，不是排印。
2. **垂直节奏**：是否有基线网格或等效纪律（行高、段距、块距能否互约）。声称有基线网格的，我会逐 token 验算——大量提案声称 4px 基线，但 display 级行高一验算就破格。
3. **字体配对是否有角色分工的理由**：display/body/mono 各自"为什么是它"，包括被否决的备选（说出"为什么不是 X"的提案通常真想过）。是否滥用同气质字体堆叠（两个衬线、两个 grotesque 而无分工）。
4. **行宽与 measure 纪律**：是否给出具体 ch/px，是否对标题、正文、边注、代码分层设限，是否有"违反即 bug"级别的强制力。
5. **CJK 混排是否被认真对待**：fallback 栈层级、`lang` 驱动的行高/字距覆写、中文小字号发虚问题、斜体与全大写对 CJK 的陷阱（CJK 无斜体、汉字加 letter-spacing 会糊）、`text-autospace`/palt 等机制的真实浏览器支持度。
6. **光学细节**：opsz 轴使用、tabular-nums、暗色模式下的光渗（halation）补偿、FOUT/CLS 防护（size-adjust 度量校正）。
7. **许可与加载成本**：OFL 授权合规（本次 8 家全部 OFL，均合规）；但预算数字是否诚实——两个 variable 字体文件加起来写"<120KB"这种自相矛盾的账，我扣分。
8. **排印能否活过 5 年**：内容膨胀 10 倍后，这套版式是靠"英雄式克制"维持，还是靠可复用的语法（规则线层级、条目语法、基线网格）维持。

**一票否决区**：`typography` 与 `information_hierarchy`。这两项我按获奖站标准从严打分，其余维度按常规标准。

### 排印系统横向对比（我核对每个数字后的记录）

| | 家族数（Latin） | 阶梯 token 数 | 基线网格 | 声称预算 | 预算可信度 | measure 纪律 | CJK 深度 |
|---|---|---|---|---|---|---|---|
| A | 3（Inter/Newsreader/Plex Mono） | 13（桌面+移动双值） | 无（8px 间距节奏） | ≤260KB | 可信 | 66ch/52ch/68ch，分角色 | 中（系统栈+autospace 兜底） |
| B | 4（Fraunces/Newsreader/Instrument Sans/Plex Mono） | 17 | **有，4px**（display 破格未声明） | ≤260KB | 偏乐观（4 族+斜体） | 66ch/56ch/45ch 分层 | **最深**（按需子集/禁 drop cap/SimSun 风险） |
| C | 2（Inter/Plex Mono）+ Noto SC | 10 | 无（仅间距 8px） | Inter≈48KB+分片 | 可信 | 66ch/56ch/38ch | 中上（palt/字重对齐/cn-font-split） |
| D | 2（Newsreader/Plex Mono）+ Noto SC | 10 | 无（4px 间距） | latin 各 30–45KB | 可信 | **4-token 硬约束体系** | 深（lang 驱动 1.85/图注转黑体/60ch≈30 字换算） |
| E | 2（Plex Sans/Plex Mono 同族） | 10 | 无 | ≤3 字重 | 可信 | 40rem≈70ch，偏松 | 中（系统栈+0.01em+标点悬挂提及） |
| F | 3（Inter Tight/Inter/Plex Mono） | 11（编号跳号） | 声称 8px，正文自认破格 | <120KB | **自相矛盾**（双 Inter 变量文件装不下） | 65ch/38em | 中（size-adjust 调校意识好） |
| G | 3（Fraunces/Inter/Plex Mono） | 12 | 段距=行高整数倍（27.2≈27，四舍五入） | latin 子集+预载 | 可信 | 62–68ch 区间，最松 | 中（label-mono 的 :lang(zh) 覆写是好细节） |
| H | 3（Newsreader/Inter/Plex Mono） | **7（最薄）** | 无 | Newsreader≈30KB | 可信 | 68ch/38em/24ch | 中（中文禁斜体、行高分列，但 autospace 靠手工 span） |

---

## 逐方案评语

### Team A —「Monograph 单行本」（Minimalism）

- **优点**：
  1. **字距阶梯是真正推导出来的**：display-1 −0.028em → display-2 −0.022em → title-1 −0.015em → title-2 −0.012em → title-3 −0.008em → body 0 → body-sm +0.004em → label +0.08em——负字距随字号递减、正字距在小字号与全大写处放开，这是一条完整的光学字距曲线，8 个方案里只有 A 和 B 做到了连续递变而非随手赋值。
  2. **全案最专业的一处排印细节在 §5 Dark 策略里**：暗色下 display 字重 500→470、字距放宽 +0.004em，预先补偿深底上的光渗（halation）。这是我本 expects 只有字体设计师才会写的段落——把可变字体的 wght 轴当作排版工具而非加载格式。
  3. "双语气"修辞（sans=事实 / serif italic=条件与人声，全站衬线斜体 ≤10 处）把字体稀缺性变成了可执行的编辑纪律；移动端正文反而放大到 17/30（"为拇指阅读重设"）是正确的移动排印观。`tabular-nums` 全站数字强制、ink-4 只许出现在 ≥60px 装饰字的对比度阶梯，都是获奖站级别的自我约束。
- **缺点/风险**：
  1. **没有基线网格**。8px 间距节奏管的是块间距，不管文本块内部的垂直节奏：lede 19/32、body 16/28、body-serif 19/34 三个行高互约性差（32/28/34 无法落到同一网格），长页滚动时章节接缝处的行位会"漂"。对一个自称"排印承担全部表达"的方案，这是最该补的一块。
  2. lede（19px/400）与 title-3（18px/500）只差 1px，同屏出现时层级要靠字重硬撑，阶梯在该区段有一步"假台阶"。
  3. code 取 13.5px 是一个半像素怪值（13 或 14 都更合理），与全案"每个数字都有理由"的自我要求不符。
- **最值得被偷走的想法**：**暗色模式下的可变字体光渗补偿**（wght −30、tracking +0.004em）——任何暗色方案都该抄这三行。

### Team B —「Field & Retrieval 个人学刊」（Editorial）

- **优点**：
  1. **8 个方案中唯一真正建立了基线网格**：§6.2 的 4px 基线单位 + "所有 line-height、段间距、区块 padding 为 4 的倍数" + 正文 18/28 落网格，并且诚实处理了图片/代码破格——"破格后下一个文本块必须重新落回基线，补差机制写进数据字段"。把基线网格从口号落成工程机制，这是教科书做法。
  2. **17-token 阶梯是目前最完整的角色分工**：masthead/hero/title-xl/l/m/s 五级 Fraunces 用同一变量文件的 opsz 轴区分（144 刊头 vs 72 内文，一份文件省一个字重族，工程上聪明）；deck/lede/body-serif/list-title/quote 五级 Newsreader 分管导语、正文、行题、引文；Instrument Sans 管 UI；Plex Mono 的 kicker/fig-label/meta 三级小字构成"机读层"。连规则线都做了三级语义（hairline/strong/double，double 全站仅两处，"稀缺即权威"）。
  3. **CJK 处理全场最深**：CJK 正文 ≥17px 且行高 28、中文段落禁用 drop cap、`text-transform` 大写天然不伤 CJK、Noto Serif SC 仅对标记 `zh` 的笔记按需子集、甚至预判了 Windows SimSun 小字发虚并给出规避。列出的选型理由有字体史脉络（Fraunces= Windsor/Goudy 一脉的当代重绘、Newsreader=Production Type 为屏幕长读而作），配对是"读过字体说明书"的写法。
- **缺点/风险**：
  1. **display 级破了自家规矩却没声明**：阶梯表头写着"行高全部为 4px 倍数以贴合基线网格"，但 masthead 0.98×152≈149px、hero 1.04×88≈91.5px 都不是 4 的倍数。大字破格是排印惯例（基线网格只锁正文流），但既然 §6.2 给图片写了破格补差条款，display 就该有同样的豁免声明，否则验收时扯皮。
  2. **四族 + 真斜体是全场最重的字体载荷**：Fraunces 全轴（opsz+wght+SOFT+WONK）+ 其真斜体 + Newsreader 斜体 + Instrument Sans 变量 + Plex Mono 两字重，260KB 预算非常紧；Instrument Sans 是四族里最可砍的一族（Inter 或系统栈可替代且省 40KB+）。
  3. masthead −0.02em 对 152px 高对比衬线偏保守（这一档通常 −0.025 ~ −0.03em），WONK 1 常开 + hover 再动 WONK，注意 WONK 在正文轴上恒 0 的承诺要落到实现。
- **最值得被偷走的想法**：**4px 基线网格 + 破格补差机制（`baselineComp` 字段）**——把垂直节奏做成可持续维护的工程契约，5 年内容增长后这条最值钱。

### Team C —「精密仪器」（Modern AI）

- **优点**：
  1. **mono 使用占比 ≤10% 的硬约束是我见过的最好的"排印预算"表达**：mono 只许出现在 tag/读数/索引/代码，正文标题导航一律 Inter——用一条可验收的红线防住了"终端模板味"，这比任何形容词都有效。
  2. CJK 细节超出本类方案平均水准：CJK 文本 tracking 归零（+0.08em 只施于拉丁 mono）、title 级中文开 `palt` 收标点、中西文字重 500/500 对齐、Noto Sans SC 用 cn-font-split 分片、fallback 用 `size-adjust` 校正抖动——工程端排印意识完整。
  3. Inter 550 作为"仪器灰度字重"用在 display，是对可变轴的正确使用；display-1 每页最多 1 处的使用限制也是层级纪律。
- **缺点/风险**：
  1. **行高数字露出了"随手"的痕迹**：body-lg 1.76、body 1.73、body-sm 1.6——1.73/1.76 这类小数行高既非比例推导也非网格产物，两个相邻 token 差 0.03 毫无光学意义。这是"看起来像阶梯的数字列表"的轻度症状（字号本身 64→44→30→21→17 还算有节奏）。
  2. 正文基准 15px 对一个以阅读和研究陈述为主的站点偏小（同类获奖站正文普遍 16–18px），且移动端未放大，与 A 的"移动端重设"意识形成反差。
  3. 没有衬线层，全站一个 sans 声部——仪器隐喻自洽，但长文（README、dossier 案例研究、Notes）全靠 1.73 行高硬扛，5 年后文章多了会显单调。
- **最值得被偷走的想法**：**mono 占比 ≤10% 的可验收排印预算**——写进 lint 的排印纪律，任何工程感方案都该抄。

### Team D —「Offprint 抽印本」（Academic）

- **优点**：
  1. **全场最严格的行宽纪律**：全站只有 4 个 measure token（正文 60ch / 标题 28ch / 边注 21ch / 图表 81ch），并写明"文字永不越出 60ch，违反此规则的版面视为 bug"——把 measure 从建议升级为合同。28ch 标题 measure 强制标题在语义单元处断行，是少数懂"标题也需要 measure"的方案。60ch≈30 字/行的 CJK 换算正确（25–35 字舒适区）。
  2. **只有两个 Latin 家族且分工理由清晰**：Newsreader（opsz 轴小字放开、大字收紧，对 opsz 的理解是准确的）承担正文+标题，Plex Mono 承担编号/kicker/状态——"印刷品里机器标注"的隐喻让 mono 有了存在理由；明确写出"不用 Fraunces（展示性）、不用 Playfair（装饰性）"的否决理由，配对是真选过的。
  3. CJK 的两个专家级细节：`:lang(zh)` 下行高升至 1.85、标题负字距归零（负字距对 CJK 无效，说得对）；**图注层 CJK 从宋体切到黑体**（11–13px 中文宋体发虚）——这是常年排中文小字才会知道的坑。
- **缺点/风险**：
  1. 同 A，没有基线网格（17/1.75≈29.75px 行高不在任何网格上），间距 token 与行高互不咬合；对"阅读是界面"的方案，垂直节奏的缺席比 A 更伤，因为 D 的正文密度更高。
  2. display 封顶 68px 是全场最收敛的首屏字号——学术上得体，但"论文标题区"的记忆点很大程度押在这行字上，44px 下限略显温吞，建议 clamp 上限给到 76–80px。
  3. Newsreader 兼任 display 与 body 依赖 opsz 自动切换，但提案未给 display 端指定 opsz 值（B 就明确写了 opsz 144/72），实现时容易漏掉 optical sizing 的手动锁定（`font-optical-sizing: auto` 依赖浏览器，需验证）。
- **最值得被偷走的想法**：**4-token measure 体系 + "越界即 bug"条款**——全场最能防内容膨胀的行宽纪律，所有阅读优先方案都该抄。

### Team E —「BENCH 工作台」（Creative Dev）

- **优点**：
  1. **Plex Sans + Plex Mono 同族配对是立场明确的选型**："mono 与 sans 同源，台面刻度与正文天然是同一种材料"——为工作台隐喻找到了最省力的字体论据；同时明确否决了 serif display（B/D 的领地）和 Space Grotesk（AI 模板味），选型有排除法。
  2. 细节层有真正的排版关怀：正文 `text-wrap: pretty`、`orphans/widows: 3`、标题 `text-wrap: balance`（A 也写了 balance）——这三个属性同时出现的方案不多，说明作者真的在乎段落成色。
  3. `:lang(zh)` 加 0.01em 并提到"标点悬挂"，CJK 方向感正确。
- **缺点/风险**：
  1. **16.5px 正文是个暴露随意性的数字**：在 16 与 17 之间取半像素值，既非 4px 网格产物也无光学理由；全案阶梯（88→56→28→20→17→16.5→15→13→11→11）是最缺乏比例逻辑的一份——display 到 title-1 断崖（88→28），title-2 到 body 又贴太近（20→17→16.5），label 与 micro 同为 11px 两个 token。这是典型的"看起来像阶梯的数字列表"。
  2. 40rem≈70ch 的正文行宽是全场最松（66ch 上下是公认上限区），justify 未提及、连字符策略未提及。
  3. IBM Plex Sans 在 88px/600 的 display 表现平庸（它是为文档/UI 设计的文字字体，大字号下缺乏张力），工作台气质反而更依赖 mono 刻字——display 层是全场少数"选型与用途错位"的组合。
- **最值得被偷走的想法**：**同族 sans+mono"同一种材料"的配对策略**——当品牌感需要从字体一致性而非对比性来建立时，这是最稳的解法。

### Team F —「坐标系统」（Swiss）

- **优点**：
  1. **Poster 层使用规范是全场唯一的 display 级"立法"**：T0 只许 3 处（首屏/404/ghost）、禁止用于正文强调与用户可控文本、红字只许单词级、移动端 Poster 上限 72px 最多 2 行——给最大的字写使用条款，正是 Swiss 传承里"字的大小即纪律"的正确当代化。
  2. **Inter Tight（display）/ Inter（body）的手动光学尺寸分工**理由成立（Tight 小字偏紧，正文回退标准 Inter），是"穷人版 opsz 轴"的正确做法；`tabular-nums` 全表格强制、`:lang(zh)` 回正字距、`size-adjust` 防 fallback 跳行——三个坑都提前踩了。
  3. Ghost 编号 280px outline 层 opacity ≤0.07 且 aria-hidden——装饰字层有可访问性条款，少见。
- **缺点/风险**：
  1. **字体预算自相矛盾**：栈里同时有 Inter Tight variable 与 Inter variable 两个拉丁变量文件（合计 ≈160–200KB），却声称总体 <120KB woff2。要么砍掉一个 Inter，要么改静态字重实例，否则这个数字在实现日必然被打破。
  2. 阶梯编号跳号（T0、T0.5、T2、T3…没有 T1），暴露体系是后期拼补的；正文基准 15px 偏小且 15×1.75=26.25px 自认破格——"BASELINE 8"写在首屏标尺上，正文行高却不在 8px 网格里，标尺的承诺与排印现实不符。
  3. 全案无衬线无斜体声部，表格语法重复 8 个 section 后文字的"温度"全压在 Notes 写作上（提案自己承认）——排印刷场对长文阅读不够友好。
- **最值得被偷走的想法**：**Poster 层使用规范（允许/禁止清单）**——每个方案都该为自己的 display 字号写一份这样的治理条款。

### Team G —「Dimmer Room 暗室与晨光」（Dark Premium）

- **优点**：
  1. **Fraunces 的使用是懂行的**：锁定 opsz 144、wght 340–420、SOFT=0 WONK=0——明确禁用两个"性格轴"以保奢华感的一致，还预留了 Newsreader 作为同成本替换备选（知道自己在赌什么）。340/380/420 非整数字重显示对可变轴的熟悉度，与 B 同级。
  2. **抓到了一个真实的 CJK 陷阱**：label-mono（11px +0.12em 全大写）在 `:lang(zh)` 下取消 letter-spacing 和 uppercase 改 0.02em——汉字加宽字距会糊，全大写对 CJK 无意义，这条覆写规则很多工程团队上线一年都不会发现。
  3. "正文段落间距 = 行高整数倍（27px）"是有基线意识的表述（16×1.7=27.2，取整到 27）；代码块 measure ≤80 字符、display 允许破栅格至 10 列的边界声明都清楚。
- **缺点/风险**：
  1. **measure 给的是 62–68ch 的区间**——全场最松的行宽纪律。区间意味着没有决定：正文容器到底 620px 还是 660px，交给实现者就等于没人负责。13px 图注 +0.005em、11px label +0.12em 尚可，但 caption 与 label 的字号只差 2px 而角色差异大，中段阶梯（24/20/18/17/16）偏密。
  2. 阶梯整体是"高端站模板级"的合格线：每级都对，但没有一级让人眼前一亮；display-1 clamp 上限 76px 配 Fraunces 高对比衬线可以更大胆（88–96px）。
  3. FOUT 策略只做到"尺寸锁定无 CLS"，未做 `size-adjust` 度量匹配——Georgia 兜底的 Fraunces 行宽差异仍会造成标题折行位置跳变。
- **最值得被偷走的想法**：**:lang(zh) 下 label-mono 的字距/大写覆写**——一张所有方案都该抄的"CJK 排版陷阱覆写清单"。

### Team H —「A Retrievable Self」（Experimental）

- **优点**：
  1. **CJK 行高单独成列**（display 1.22、display-2 1.3、body 1.85）且"中文不使用斜体（改色点强调）"、"中文标题禁用负字距"——三条都是正确的 CJK 排印判断，在实验型方案里难得。
  2. 行宽分了三层：散文 68ch/38em、证据链问题句 24ch 强制短句——用 measure 去塑造"问题句必须像问题句"的节奏，是排印服务内容的正面例子。
  3. 对 `text-autospace` 的浏览器支持现实有清醒认知（"不普及，用 :lang(zh)+手工 span 约定"），没有像有些方案那样把它当银弹。
- **缺点/风险**：
  1. **阶梯是全场最薄且内部不自洽的**：全案只有 7 个 token，且自称"基准 16px、比例 1.25"，实际阶梯是 76/44/24/17/14/13/12——44→24 是 1.83，24→17 是 1.41，所谓 1.25 模数在任何一个相邻级差上都不成立。small(14)/label(13)/micro(12) 三级每级只差 1px，同屏无法形成可感知层级。这是"看起来像阶梯的数字列表"的最典型样本：比例是装饰性台词，不是推导依据。
  2. mono/code 层规格缺失：没有 code token（行高、字号、语法高亮字号），label 13px +0.08em 与 micro 12px +0.04em 的分工描述含糊；对一个把"检索式、编号、状态词"作为核心视觉的方案，mono 层恰恰是最该精排的层。
  3. 无衬线层的 display 用 Newsreader、正文用 Inter，与 A/D 同构但理由最薄（"气质"两个字撑不起选型）；标题 measure、balance/pretty 等 wrape 策略只提了 balance。
- **最值得被偷走的想法**：**"中文不用斜体、以色点强调"的 CJK 强调规范**——所有打算在中文站用衬线斜体的方案都该改成这条。

---

## 排名与理由

**Top 3：B（Editorial）> A（Minimalism）> D（Academic）**

1. **Team B**：唯一把垂直节奏做成工程契约（4px 基线 + 破格补差）、拥有最完整 17-token 角色分工、最深 CJK 条款、且配对理由带字体史脉络的方案。它的排印不是"参数写得好"，而是**一套能承载 5 年内容生长的语法**——规则线三级语义、条目语法、基线网格都是可复用部件。display 破格未声明与 260KB 载荷是可修的执行层问题，不动摇体系。这是全场唯一我愿意直接签字付印的排印规格。
2. **Team A**：字距曲线完整、暗色光渗补偿是全场最专业的一处细节、双语气稀缺性是真正的编辑纪律；失分在没有基线网格——一个自称"字体即图像"的方案，文本块内部节奏却无网格托底，5 年后新增页面将依赖每一页的英雄式自觉。体系稳健性略逊 B，居第二。
3. **Team D**：4-token measure 硬约束是全场最强行宽纪律，CJK 图注转黑体、lang 驱动行高是专家级细节，双家族极简栈对长期维护最友好；失分在垂直节奏同样缺席、display 字号偏保守。第三名实至名归。

未入 Top 3 但值得记录：F 的 Poster 治理条款与 Inter Tight/Inter 光学分工是体系级好想法，但预算数字自相矛盾与阶梯跳号显示体系未经终审；C 的 mono 占比红线是全场最好的排印预算工具；E 与 H 的阶梯分别是"最无比例逻辑"与"最薄"，H 自称的 1.25 模数与实际数字不符，是我从严打分的直接原因。

```json
{
  "judge": "typography",
  "scores": {
    "A": {"visual_quality": 9, "originality": 8.5, "typography": 9.5, "information_hierarchy": 9, "ux": 8, "mobile_experience": 8.5, "technical_feasibility": 9, "long_term_maintainability": 9, "research_presentation": 8.5, "portfolio_presentation": 8, "light_mode": 9, "dark_mode": 9.5, "performance": 9.5, "accessibility": 9},
    "B": {"visual_quality": 9, "originality": 8.5, "typography": 9.5, "information_hierarchy": 9, "ux": 8, "mobile_experience": 8.5, "technical_feasibility": 7.5, "long_term_maintainability": 9, "research_presentation": 9, "portfolio_presentation": 8.5, "light_mode": 9, "dark_mode": 8.5, "performance": 7, "accessibility": 8.5},
    "C": {"visual_quality": 8.5, "originality": 8.5, "typography": 7.5, "information_hierarchy": 7.5, "ux": 8.5, "mobile_experience": 8.5, "technical_feasibility": 8.5, "long_term_maintainability": 8.5, "research_presentation": 8.5, "portfolio_presentation": 8.5, "light_mode": 8.5, "dark_mode": 9, "performance": 8.5, "accessibility": 8},
    "D": {"visual_quality": 8.5, "originality": 8.5, "typography": 9, "information_hierarchy": 9, "ux": 8, "mobile_experience": 9, "technical_feasibility": 8, "long_term_maintainability": 8, "research_presentation": 9.5, "portfolio_presentation": 8, "light_mode": 9, "dark_mode": 8.5, "performance": 9, "accessibility": 8.5},
    "E": {"visual_quality": 8, "originality": 8.5, "typography": 7, "information_hierarchy": 8, "ux": 9, "mobile_experience": 8.5, "technical_feasibility": 8, "long_term_maintainability": 8.5, "research_presentation": 8, "portfolio_presentation": 9, "light_mode": 8, "dark_mode": 8, "performance": 7.5, "accessibility": 9},
    "F": {"visual_quality": 8.5, "originality": 8, "typography": 8.5, "information_hierarchy": 8.5, "ux": 8, "mobile_experience": 8.5, "technical_feasibility": 9, "long_term_maintainability": 9, "research_presentation": 8, "portfolio_presentation": 7.5, "light_mode": 8.5, "dark_mode": 8.5, "performance": 9, "accessibility": 8.5},
    "G": {"visual_quality": 8.5, "originality": 7.5, "typography": 8, "information_hierarchy": 8.5, "ux": 8, "mobile_experience": 8, "technical_feasibility": 8.5, "long_term_maintainability": 8.5, "research_presentation": 8, "portfolio_presentation": 8.5, "light_mode": 8.5, "dark_mode": 9.5, "performance": 8, "accessibility": 8},
    "H": {"visual_quality": 8, "originality": 9, "typography": 6.5, "information_hierarchy": 8, "ux": 8.5, "mobile_experience": 8.5, "technical_feasibility": 8.5, "long_term_maintainability": 8, "research_presentation": 9, "portfolio_presentation": 8.5, "light_mode": 8, "dark_mode": 8.5, "performance": 8, "accessibility": 9}
  },
  "top3": ["B", "A", "D"]
}
```
