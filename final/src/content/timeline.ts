import type { TimelineEntry } from "./types";

/**
 * CONTENT_PACK §timeline —— 履历日志（Now / Log，中文优先）。
 *
 * 仅收录真实发生且可直接核验的时间节点；
 * 保持克制，杜绝浮夸。
 */
export const timeline = [
  {
    sample: false,
    year: "2026",
    kind: "milestone",
    title: "CONCORDANCE 档案正式上线",
    detail: "以语录索引隐喻构建的个人研究与作品档案开始持续记录。",
  },
] satisfies TimelineEntry[];
