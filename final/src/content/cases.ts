import type { ProjectId } from "./projects";

/**
 * CONTENT_PACK §cases —— 案例深度复盘（中文优先与视觉强化版）。
 *
 * 单一模板（pages/CasePage.tsx）渲染全部案例，保留 PLATE→ESSAY→LEDGER 律动。
 * 遵循严格的真实性契约：
 *   - 每张截图均为真实运行界面的实测采集，标注精确的采集时间与环境溯源
 *   - 所有数字均源自当前代码库或公开历史留档，杜绝虚假宣称
 *   - 绝不放置指向不存在部署环境的虚假在线 Demo 按钮
 */

export interface CaseFigure {
  /** 位于 public/cases/<slug>/ 下的图片文件名 */
  file: string;
  alt: string;
  caption: string;
  /** "half" 用于桌面端两列并排对比排版 */
  variant?: "half";
  w: number;
  h: number;
}

export interface CaseSection {
  heading: string;
  headingEn?: string;
  body: string[];
  figures?: CaseFigure[];
  /** 关键亮点小结，用于打破大段文字沉闷，形成生动的视觉节奏 */
  callout?: {
    label: string;
    text: string;
  };
}

export interface CaseReference {
  label: string;
  href: string;
  note?: string;
}

export interface CaseStudy {
  slug: string;
  projectId: ProjectId;
  title: string;
  subtitle: string;
  kicker: string;
  summary: string;
  role: string;
  year: number;
  status: string;
  stack: string[];
  repoUrl: string;
  hero: CaseFigure;
  sections: CaseSection[];
  references: CaseReference[];
  provenance: string;
}

export const cases: CaseStudy[] = [
  {
    slug: "item-storage-app",
    projectId: "item-storage-app",
    title: "Private Item Library",
    subtitle: "本地优先的个人私密物资与资产管理 PWA",
    kicker: "LOCAL-FIRST INVENTORY PWA",
    summary:
      "基于 React 19、TypeScript 与 Dexie / IndexedDB 构建的本地优先个人物品归置工具。数据完全驻留设备端，支持生命周期状态追踪、持有成本核算、点阵保修倒计时、校验 ZIP 备份恢复与一次性配对码增量同步。",
    role: "独立全栈研发（产品设计 · 前端架构 · 状态管理 · 交互规范）",
    year: 2026,
    status: "持续维护 · v0.1.0",
    stack: [
      "React 19",
      "TypeScript",
      "Dexie 4 (IndexedDB)",
      "Vite 7",
      "PWA / Service Worker",
      "Tailwind CSS",
      "Vitest (fake-indexeddb)",
    ],
    repoUrl: "https://github.com/HrrY1n/item-storage-app",
    hero: {
      file: "09-desktop-home-light.png",
      alt: "Private Item Library 桌面端概览：左侧常驻导航、宽屏资产与成本统计面板、物品卡片网格与保修提醒。",
      caption: "桌面端概览布局（1440×1000）：侧栏导航、宽屏成本数据看板、按分类整理的物品图版与保修点阵。",
      w: 1440,
      h: 1000,
    },
    provenance:
      "所有界面截图均源自仓库正式归档（docs/screenshots/current/），于 2026-10-19 在隔离无痕浏览器中利用干净测试数据实测采集（移动端 390×844@2×，桌面端 1440×1000）。全过程无任何私人真实物品信息介入。",
    sections: [
      {
        heading: "现实痛点与问题意识",
        headingEn: "Problem & Motivation",
        body: [
          "在数字化记录泛滥的今天，几乎所有在线记账或资产管理 SaaS 都试图将用户的私有物品数据收束进中心化服务器：你购买了什么、花费多少、放在哪个抽屉、何时过保。然而，这种依赖不仅带来了隐私泄露的顾虑，更让工具在网络信号缺失时彻底瘫痪，并在服务关停时面临数据归零的风险。",
          "Private Item Library 的核心目标非常聚焦：能否让一个人的全量资产数据完全属于其个人设备本身？在不强制依赖任何云端后端的前提下，不仅满足离线秒开、实时检索与细粒度成本追踪，同时通过用户完全自主可控的备份机制，抵御单点设备故障与版本升级带来的数据损坏？",
        ],
        callout: {
          label: "核心设计原则",
          text: "本地优先（Local-first）是产品的基石，而非可选的功能开关。一切功能均默认离线可用，云端仅作为可选的端到端恢复通道。",
        },
      },
      {
        heading: "产品设计与数据模型",
        headingEn: "Design & Information Architecture",
        body: [
          "在信息架构上，系统抽象了物品真实的物理流转过程：建立「心愿清单 → 当前持有 → 已处置（转售/废弃/赠予）」的完整生命周期状态机。在开销统计上，摒弃单纯的静态买入价，引入包含购置原价、附加维修配件支出在内的「实际持有总投入」，并根据持有天数实时推算「日均持有成本」，直观量化每件物品的实际服役价值。",
          "保修管理针对现实痛点进行了特殊考量：在物品卡片上以常驻的物理点阵进度条呈现保修状态，剩余天数与百分比清晰可见；即便是保修期超长或无法推算具体截止日的特殊物件，界面也会保持整齐的信息槽位，杜绝残缺的布局跳动。",
          "为了消除文字录入的沉闷感，系统内置了一套精心分类的立体实物图标库：涵盖数码设备、办公外设、服饰穿搭、家居生活等 9 大类，支持中英文名称、品牌俗称与别名全局模糊搜索，浅色与深色主题无缝共用一套高清透明资产。",
        ],
        figures: [
          {
            file: "01-home-light.png",
            alt: "移动端概览视图：顶部资产投入与日均开销、实物图标汇总、保修到期预警与最近添加列表。",
            caption: "移动端资产看板：资产总投入、日均持有成本与临近过保提醒一目了然。",
            variant: "half",
            w: 780,
            h: 1688,
          },
          {
            file: "03-detail-light.png",
            alt: "物品详情视图：购买渠道平台、购入日期、成本构成细则与图形化保修期限指示器。",
            caption: "物品详情页：原价、附加开销与点阵保修状态在单张档案内整合呈现。",
            variant: "half",
            w: 780,
            h: 1688,
          },
        ],
      },
      {
        heading: "前端工程与架构实现",
        headingEn: "Engineering & Architecture",
        body: [
          "持久化层选用 Dexie 对底层原生 IndexedDB 进行现代化封装，并通过 dexie-react-hooks 将数据库状态转化为响应式数据流。UI 组件对数据的订阅天然保持最新，从根本上消除了手动管理数据状态同步的复杂度。",
          "针对本地应用最致命的「Schema 升级致数据丢失」风险，工程上制定了严格的版本迁移管理机制。所有的迁移脚本都在基于 fake-indexeddb 的自动化测试环境下经过严格的断言验证，确保从 v1 到最新版本的平滑升级绝对零损耗。",
          "为了保证离线资产的安全性，设计了基于 JSZip 的全量数据无损导出与恢复系统：将结构化数据表与用户上传的多媒体资产打包为附带 SHA 校验和的加密归档文件。可选的云端同步则依托一次性设备配对密钥与云端临时中继空间，采用保守的增量拉取策略，且在未显式开启时绝不向网络发起任何请求。",
        ],
        figures: [
          {
            file: "07-categories-light.png",
            alt: "多层级分类浏览：7 个一级大类与 49 个二级细分子类，显示各分类图标与当前收录物品统计。",
            caption: "树状分类导航：7 大一级分类与 49 个子类，真实反映私有资产分布规模。",
            variant: "half",
            w: 780,
            h: 1688,
          },
          {
            file: "05-icon-picker-light.png",
            alt: "图标选择器弹窗：九大品类卡片切换与中英文别名全局实时检索展示。",
            caption: "预置图标检索体系：支持中文别名与俗称模糊搜索，极速赋予物品视觉识别度。",
            variant: "half",
            w: 780,
            h: 1688,
          },
        ],
      },
      {
        heading: "多端响应与主题表现",
        headingEn: "Responsive Experience & Theming",
        body: [
          "针对现代多设备工作流，应用进行了真正的响应式重构，而非简单的手机端缩放：在移动设备上采用单手友好的底部导航与抽屉式卡片；在桌面宽屏下则自适应重组为左侧固钉导航、双栏布局与侧滑面板，充分释放大屏的信息承载力。",
          "色彩系统经过深度调试，完美支持浅色清新与深色极客双主题。深色模式下通过精准调和的表面阶梯（Surface tokens）消除纯黑带来的刺眼对比，立体图标在暗调底色上依旧通透自然。",
        ],
        figures: [
          {
            file: "08-home-dark.png",
            alt: "深色模式下的移动端概览：暗调背景上通透自然的实物立体图标与低刺激高对比度文字。",
            caption: "移动端深色主题：暗室环境下的柔和对比度与通透立体质感。",
            variant: "half",
            w: 780,
            h: 1688,
          },
          {
            file: "10-desktop-detail-dark.png",
            alt: "深色模式下的桌面端双栏详情视图：左侧卡片列表、右侧宽幅详情与成本折算面板。",
            caption: "桌面端深色双栏工作台：大屏幕下物品列表与明细详情分栏并置。",
            variant: "half",
            w: 1440,
            h: 1000,
          },
        ],
      },
      {
        heading: "真实证据与质量保障",
        headingEn: "Evidence & Quality Signals",
        body: [
          "本案例所陈述的所有技术特性均在开源代码库中可一一验证：完整的类型定义位于 src/types/，持久化数据迁移位于 src/db/migrations/，自动化测试套件涵盖仓库、备份与状态流转；项目具备完整的 PWA manifest 与 Service Worker 离线缓存生命周期治理。",
        ],
        figures: [
          {
            file: "02-items-light.png",
            alt: "物品清单列表：网格与列表切换、成本明细单选展开、全量物品点阵保修条。",
            caption: "物品清单页：支持独立展开成本构成与状态筛选，保修状态全局直观监控。",
            w: 780,
            h: 1688,
          },
        ],
      },
      {
        heading: "客观局限与后续演进",
        headingEn: "Reflection & Limitations",
        body: [
          "在 v0.1.0 阶段，本着实事求是的工程态度，团队坦承当前版本的边界：两端同步采用基于时间戳的保守合并策略，未引入复杂的无锁 CRDT 算法，在双端高频并发修改时建议单向覆盖；AI 辅助图片识别采用严格配额管理，防止滥用；目前图标库虽已覆盖绝大多数日用物资，但仍按实际需求持续增补中。",
        ],
      },
    ],
    references: [
      {
        label: "公开代码仓库",
        href: "https://github.com/HrrY1n/item-storage-app",
        note: "完整前端源码、架构设计文档与单元测试套件",
      },
      {
        label: "界面证据归档目录",
        href: "https://github.com/HrrY1n/item-storage-app/tree/main/docs/screenshots/current",
        note: "多视口与双主题真实采集实证（含日期与数据说明）",
      },
      {
        label: "AI 识别架构设计文档",
        href: "https://github.com/HrrY1n/item-storage-app/blob/main/docs/ai-recognition.md",
        note: "本地安全裁剪与配额控制实现细节",
      },
    ],
  },
  {
    slug: "soundisle",
    projectId: "soundisle",
    title: "SoundIsle · 声屿",
    subtitle: "纯前端 Web Audio 实时程序化合成的声音专注工作台",
    kicker: "ZERO-ASSET WEB AUDIO SOUND GARDEN",
    summary:
      "完全基于浏览器原生 Web Audio API 与 Canvas 2D 构建的环境声专注空间。不依赖任何外部音频文件，以数学振荡器与滤波噪声实时程序化合成 6 路环境音轨，夜海波浪物理动态随各声道频谱实时律动，包含防后台节流漂移的番茄钟计时器。",
    role: "独立全栈研发（声学合成算法 · Canvas 物理渲染 · 交互架构）",
    year: 2026,
    status: "持续维护",
    stack: [
      "TypeScript (Strict)",
      "Web Audio API (Native)",
      "Canvas 2D Context",
      "Vite 6",
      "Vitest",
      "无外部 UI 框架依赖",
    ],
    repoUrl: "https://github.com/HrrY1n/soundisle",
    hero: {
      file: "hero-night-sea.png",
      alt: "SoundIsle 默认夜海全景视图：明月与星空倒映在暗浪之上，中央为 25:00 极简环形计时器，底部为雨声、篝火、山风、溪流、夜虫与鸟鸣 6 轨推子面板。",
      caption: "静谧夜海全景（1280×800）：明月倒影、粒子余烬、25 分钟专注计时器与六声道环境声推子混音台。",
      w: 1280,
      h: 800,
    },
    provenance:
      "所有视觉材料均在隔离开发环境中通过 headless Chromium（Edge 渲染内核）针对真实运行的 SoundIsle 单页应用无损采集（2026-10-30）。所截取的夜海波纹与粒子运动皆由当前混音台的实时频谱参数真实渲染，无任何图像后期或伪造。",
    sections: [
      {
        heading: "现实痛点与问题意识",
        headingEn: "Problem & Motivation",
        body: [
          "市面上绝大多数白噪音或专注声音类网页都采用「加载几兆 MP3 音频切片并循环播放」的传统实现。这种做法带来了一系列顽固弊端：首次加载缓慢、循环衔接处不可避免的爆音卡顿、音色机械单调，以及视觉场景与声音完全割裂——画面只是一段循环播放的无辜预录视频，根本无法对用户耳朵听到的混音作出哪怕一丝一毫的真实反应。",
          "SoundIsle 发起了一场激进的创意编程实验：能否在项目中做到「零外部音频文件加载（Zero-Asset）」，完全依靠原生 Web Audio 节点，以毫秒级数学算法实时生成雨声、篝火、夏夜林风等六组富含随机呼吸感的声音？并让屏幕上的 Canvas 画面成为声音真实的物理示波器？",
        ],
        callout: {
          label: "极致轻量化成果",
          text: "零音频文件打包下载！整站全部 JavaScript 代码仅 35 KB（Gzip 压缩后 12 KB），冷启动秒开，内存占用微乎其微。",
        },
      },
      {
        heading: "纯算法声音合成引擎",
        headingEn: "Procedural Sound Synthesis",
        body: [
          "每个声道的声音均源自精巧的数字信号处理（DSP）配方：",
          "• 雨声（Rain）：基于双层带通滤波白噪声营造背景稠密雨幕，叠加随机触发的微小正弦波离散事件模拟水滴落水，并配合低频棕色噪声缓慢扫频形成逼真的远雷涌动；",
          "• 篝火（Fire）：以低通滤波棕色噪声为主体，叠加 0.13 Hz 的极慢调制低频振荡器（LFO）模拟木炭受热膨胀，并通过带通滤波器捕捉噼啪爆裂的随机瞬间；",
          "• 山风（Wind）：使用粉红噪声结合两组相位错开的超慢速 LFO 扫频，模拟阵风掠过山谷时的自然起伏；",
          "• 溪流与林禽：通过带通滤波与随机频率上扫调制产生涓涓气泡声与婉转鸟鸣。",
          "为了根治长时间循环下的噪音爆音缺陷，工程上实现了去直流偏置（DC Offset）与 60ms 环绕交叉淡化算法，让声流在极低 CPU 开销下永续平滑流淌。",
        ],
        figures: [
          {
            file: "mix-hearth.png",
            alt: "多声道混音生效态：篝火、林风与夜虫共同开启，波浪受声学频谱驱动染上温暖橙金与深邃幽蓝，空气中弥漫余烬光斑。",
            caption: "混音即画卷：当点亮篝火与夜虫，波浪高度随低频实时激荡，色相依声道能量动态浸染。",
            variant: "half",
            w: 1280,
            h: 800,
          },
          {
            file: "morning-light.png",
            alt: "晨光浅色主题：同一套 Web Audio 实时声学架构在清新亮色调下的优雅视觉呈现。",
            caption: "晨曦浅色主题：同一套声音数学节点，渲染出破晓晨光般的轻盈阅读纸感。",
            variant: "half",
            w: 1280,
            h: 800,
          },
        ],
      },
      {
        heading: "音画联动与 Canvas 渲染",
        headingEn: "Audio-Visual Reactive Canvas",
        body: [
          "SoundIsle 的 Canvas 夜海场景绝非预设动画，而是声音的视觉投影：主音频图在每个声道输出端均挂载了 AnalyserNode 分析器，在 requestAnimationFrame 每一帧提取频域数据（getByteFrequencyData）。",
          "夜海的三层波浪分别与特定音轨通道绑定：篝火的跳动直接转化为浪峰的瞬时物理振幅，山风的宽频能量决定了波浪的波长跨度，多轨叠加时的合成能量则实时映射为月径碎光与波浪层级的色相渐变。当全局静音时，海面自然消隐降光至 38% 归于深沉沉睡。",
          "全站严格坚持单屏零滚动原则（Single-Screen Zero-Scroll）：专注工具的职责是帮用户收束心智，任何需要翻滚页面的交互都是对专注的干扰。",
        ],
        figures: [
          {
            file: "mobile-375.png",
            alt: "移动端 375px 竖屏紧凑单屏工作台：计时器在上方清晰运转，混音推子整齐排列在拇指热区。",
            caption: "移动端紧凑排版（375 px）：竖屏单屏零滚动，所有声道调节与计时控制触手可及。",
            w: 375,
            h: 667,
          },
        ],
      },
      {
        heading: "工程质量与七轮迭代实录",
        headingEn: "Engineering Quality & Iterations",
        body: [
          "SoundIsle 的工程历程以极其诚实的姿态记录在仓库文档中（docs/iterations.md）：经历了整整 7 轮深入的批评与重构——从早期 R1 节点未触发 start() 导致的无声，到 R3 Chromium 环境下 cancelAndHoldAtTime 吞噬音频事件的时序攻坚；在最为关键的 R6 迭代中，借助音频采样测量仪定位到雨滴突发瞬态冲击在 0 dBFS 处的硬削波失真，通过增益链重构使信号电平严格稳定在安全的 −34.2 dB 范围内，实现了零底噪与清澈听感。",
          "针对移动浏览器在进入后台标签页时对时钟定时器的降频节流问题，专注计时器摒弃了简单的 setInterval 累加，完全锚定系统绝对时间戳 Date.now 进行状态校验，彻底杜绝计时偏差；4 个核心逻辑文件与 32 项自动化测试全面守护状态机的绝对健壮。",
        ],
      },
      {
        heading: "客观局限与后续演进",
        headingEn: "Reflection & Limitations",
        body: [
          "在真实性维度上，SoundIsle 保持着清醒的边界认知：由于纯前端合成算法未引入沉重的全局脉冲响应混响（Convolution Reverb），当前声场的空间深度主要由立体声声像和多级滤波拉开；在极少数低端移动设备上，开启全部 6 声道配合复杂粒子可能带来轻微发热；当访客系统开启「减少动态（prefers-reduced-motion）」时，海浪将克制地降级为静止形态，守护无障碍体验。",
        ],
      },
    ],
    references: [
      {
        label: "公开代码仓库",
        href: "https://github.com/HrrY1n/soundisle",
        note: "全部声学算法、Canvas 渲染器与自动化测试源码",
      },
      {
        label: "七轮声学与交互工程迭代日志",
        href: "https://github.com/HrrY1n/soundisle/blob/main/docs/iterations.md",
        note: "详尽记录削波失真解决、时钟防漂移与声音设计的完整演进过程",
      },
    ],
  },
];

export const caseBySlug = (slug: string | undefined): CaseStudy | undefined =>
  cases.find((c) => c.slug === slug);

export const caseByProjectId = (projectId: ProjectId): CaseStudy | undefined =>
  cases.find((c) => c.projectId === projectId);
