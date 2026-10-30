import { profile } from "@/content/profile";
import { timeline } from "@/content/timeline";
import type { TimelineEntry } from "@/content/types";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell, XRef } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";

const KIND_LABEL: Record<TimelineEntry["kind"], string> = {
  education: "教育背景",
  research: "学术研究",
  milestone: "重要里程碑",
  elsewhere: "其他履历",
};

export default function AboutPage() {
  useDocumentMeta(
    "关于主理人与档案",
    "计算机科学硕士研究生，聚焦检索增强生成（RAG）及其安全鲁棒性，同时独立研发真实软件产品 —— 本档案是两者相交汇的坐标系。",
  );
  const meta = sectionByRoute("/about")!;
  const sorted = timeline.filter((entry) => !entry.sample).slice().reverse();

  return (
    <PageShell meta={meta} register="essay" lede="保持克制：档案本身所承载的作品与实验，是更详尽的注脚。">
      <div className="u-measure">
        {/* 主体阐述段落 */}
        <div className="space-y-5 text-base md:text-lg leading-relaxed text-ink font-serif">
          {profile.about.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* 身份识别读数栏 */}
        <div className="mt-8 border-t border-line pt-6 space-y-2 font-mono text-xs text-ink-2">
          {profile.location ? (
            <p>所在地：{profile.location}</p>
          ) : null}
          <p className="flex items-center gap-2">
            <span>档案主理：</span>
            <a
              className="u-link text-ink font-medium"
              href={`https://github.com/${profile.handle}`}
              target="_blank"
              rel="noreferrer"
            >
              @{profile.handle}
            </a>
            <span className="text-ink-2">（公开 GitHub 签名 · 法律姓名等隐私未予登记）</span>
          </p>
        </div>
      </div>

      {/* 履历记录日志（Now/Log） */}
      {sorted.length > 0 ? (
        <section aria-labelledby="about-log" className="mt-16 max-w-[54rem]">
          <h2 id="about-log" className="t-kicker text-ink-2">
            演进日志与时间轨迹 (Now and Then)
          </h2>
          <ul className="mt-5">
            {sorted.map((entry, i) => (
              <li
                key={`${entry.year}-${entry.title}-${i}`}
                className="grid grid-cols-[5.5rem_1fr] gap-x-6 border-t border-line py-5 first:border-t-0"
              >
                <span className="t-meta text-accent font-mono font-medium">{entry.year}</span>
                <div>
                  <p className="t-small text-ink font-medium">
                    <span className="t-meta text-ink-2 mr-3 font-mono text-xs">
                      [{KIND_LABEL[entry.kind] ?? entry.kind}]
                    </span>
                    {entry.title}
                  </p>
                  <p className="t-small text-ink-2 mt-1.5 leading-relaxed">{entry.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="t-meta text-ink-2 mt-6 max-w-[58ch] font-mono text-xs">
            日志遵循更新记录体例（Changelog Grammar）：最新事件排在首位，杜绝任何未经核验的虚饰履历。
          </p>
        </section>
      ) : null}

      <div className="mt-14 pt-8 border-t border-line max-w-[54rem] flex flex-wrap gap-6 items-center">
        <XRef to="/work">浏览精选作品与完整案例 →</XRef>
        <XRef to="/research">查看当前 6 大研究方向 →</XRef>
      </div>
    </PageShell>
  );
}
