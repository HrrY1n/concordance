import { Link } from "react-router-dom";
import { sections } from "@/lib/sections";
import { useDocumentMeta } from "@/lib/seo";
import { useSearch } from "@/lib/palette";

/**
 * 404 — 语录坐标系统的诚实失效边界：该地址在编目中未收录。
 */
export default function NotFoundPage({ kind = "page" }: { kind?: "page" | "note" | "case" }) {
  useDocumentMeta("404 — 坐标未命中", "本档案中尚无此地址的收录记录。全部可达页面均已登记在全站索引中。");
  const { openSearch } = useSearch();

  const kindMap = {
    note: "未找到对应笔记",
    case: "未找到对应项目案例",
    page: "该章节坐标下尚无记录",
  };

  return (
    <div className="wrap flex min-h-[60vh] flex-col justify-center pb-20 pt-16">
      <p className="t-meta t-caps text-ink-2 font-mono">
        404 · {kindMap[kind] ?? kindMap.page} (no record at this address)
      </p>
      <h1 className="t-h1 mt-4 max-w-[24ch]">本语录索引中尚未收录此坐标。</h1>
      <p className="t-small text-ink-2 mt-5 max-w-[54ch] leading-relaxed">
        全站章节坐标体系涵盖 §01–§07。所有可达路径与已收录作品均登记在索引中 —— 亦可直接呼出命令面板进行全文检索。
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
        <button type="button" className="u-chip" onClick={() => openSearch()}>
          检索全站档案 <span aria-hidden="true">⌕</span>
        </button>
        <Link to="/" className="u-link t-small font-medium">
          返回前扉主页 <span aria-hidden="true">→</span>
        </Link>
      </div>
      <p className="t-meta text-ink-2 mt-8 font-mono text-xs">
        可用坐标索引：{sections.map((s) => `§${s.num} ${s.title}`).join(" · ")}
      </p>
    </div>
  );
}
