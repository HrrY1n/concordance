import { publications } from "@/content/publications";
import { site } from "@/content/site";
import { useDocumentMeta } from "@/lib/seo";
import { PageShell } from "@/components/structure";
import { sectionByRoute } from "@/lib/sections";

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function PublicationsPage() {
  useDocumentMeta(
    "学术发表与文献记录",
    "学术论文与同行评审收录。所有发表记录与证据链按真实存在呈现 —— 绝不预填空洞的承诺。",
  );
  const meta = sectionByRoute("/publications")!;

  return (
    <PageShell meta={meta} lede="记录确凿成果，不列空泛预期。本页面严格如实渲染当前已归档的学术论文数据。">
      <p className="t-meta text-ink-2 font-mono text-xs">收录记录：{publications.length} 篇</p>

      {publications.length === 0 ? (
        <div className="mt-8 border-l-2 border-line-strong pl-6 py-2">
          <h2 className="t-h3 text-xl font-medium text-ink">{site.publicationsEmptyTitle}</h2>
          <p className="t-body text-ink-2 mt-3 max-w-[58ch] leading-relaxed text-sm md:text-base">
            {site.publicationsEmptyBody}
          </p>
        </div>
      ) : null}

      <ol className="mt-12">
        {publications.map((pub, i) => (
          <li key={pub.id} className="grid gap-x-6 gap-y-1 border-t border-line py-5 md:grid-cols-[4rem_1fr]">
            <span className="t-meta text-accent font-mono" aria-hidden="true">
              [{pad2(i + 1)}]
            </span>
            <div>
              <h3 className="t-h4 max-w-[46ch] font-medium">{pub.title}</h3>
              <p className="t-meta text-ink-2 mt-2">
                {pub.authors.join(" · ")} — {pub.venue}, {pub.year}
              </p>
              {pub.links.pdf || pub.links.code || pub.links.doi ? (
                <p className="t-small mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  {pub.links.pdf ? (
                    <a href={pub.links.pdf} className="u-link inline-flex min-h-[44px] items-center">
                      PDF 下载 <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {pub.links.code ? (
                    <a href={pub.links.code} className="u-link inline-flex min-h-[44px] items-center">
                      开源代码 <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {pub.links.doi ? (
                    <a href={pub.links.doi} className="u-link inline-flex min-h-[44px] items-center">
                      DOI 索引 <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </p>
              ) : null}
            </div>
          </li>
        ))}

        {/* 自动编号保留位（Ghost Row） */}
        <li className="flex items-baseline gap-4 border-t border-dashed border-line-strong py-5 text-ink-2 font-mono text-xs">
          <span aria-hidden="true">
            [{pad2(publications.length + 1)}]
          </span>
          <span className="text-ink-2">{site.publicationsReserved}</span>
        </li>
      </ol>

      <div className="t-meta text-ink-2 mt-10 border-t border-line pt-6 text-xs leading-relaxed max-w-[62ch]">
        <p>
          本栏目后续收录范围：同行评审论文、附带持久化 DOI 的正式预印本、基准评测数据集与开源 Benchmark ——
          每一篇均需附带完整代码、数据证据链与对应攻坚的科学问题。
        </p>
      </div>
    </PageShell>
  );
}
