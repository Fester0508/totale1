"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

export function BlogArticleContent({
  content,
  slug,
}: {
  content: string;
  slug: string;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("blog-view", { article: slug });
    }
  }, [slug]);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-table:text-sm prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
