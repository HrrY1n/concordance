import { Link } from "react-router-dom";
import { DEMO_REGISTRY } from "@/content/ids";
import { sandboxHonesty } from "@/content/lab";
import { researchQuestions } from "@/content/research";
import { useDocumentMeta } from "@/lib/seo";
import { XRef } from "@/components/structure";
import { CorruptionSandbox } from "@/demos/CorruptionSandbox";

declare const __BUILD_DATE__: string;

/**
 * 知识投毒模拟沙盒独立深链页面 (/lab/corruption-sandbox)。
 */
export default function SandboxPage() {
  useDocumentMeta(
    "知识投毒模拟沙盒 (Corruption Sandbox)",
    "向手写语料库中注入一段伪造段落，实时观察 BM25 排序如何被颠覆；随后开启启发式过滤策略，观察排序再次重组。所有运算均在浏览器本地执行。",
  );
  const demo = DEMO_REGISTRY["corruption-sandbox"];
  const feeding = researchQuestions.filter((q) => q.relatedDemo === demo.id);

  return (
    <div className="min-h-[80vh]">
      <div className="wrap pb-16 pt-10 md:pt-16">
        <nav aria-label="沙盒导航" className="flex items-center gap-2 t-meta text-ink-2 text-xs font-mono">
          <Link to="/" className="hover:text-ink transition-colors">前扉</Link>
          <span>/</span>
          <Link to="/lab" className="hover:text-ink transition-colors">实验室</Link>
          <span>/</span>
          <span className="text-accent">{demo.index}</span>
        </nav>

        <p className="t-meta text-ink-2 font-mono text-xs mt-6">
          {demo.index}
          {feeding.length > 0 ? <> · 关联研究问题：{feeding.map((q) => q.id.toUpperCase()).join(" · ")}</> : null}{" "}
          · 构建版本 {__BUILD_DATE__}
        </p>
        <h1 className="t-h1 mt-3 text-3xl md:text-4xl font-medium tracking-tight">{demo.title}</h1>
        <p className="t-lede text-ink-2 mt-4 max-w-[58ch] leading-relaxed text-base md:text-lg">{demo.blurb}</p>
        <p className="t-meta text-accent mt-5 max-w-[64ch] font-mono text-xs">{sandboxHonesty}</p>

        <div className="mt-10">
          <CorruptionSandbox detailed />
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-xs">
          <XRef to="/research">← 返回研究方向总览</XRef>
          <XRef to="/lab">← 返回全部实验室仪器</XRef>
          <Link to="/" className="u-link t-small">
            返回前扉首页 →
          </Link>
        </div>
      </div>
    </div>
  );
}
