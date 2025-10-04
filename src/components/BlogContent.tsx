'use client';

interface BlogContentProps {
  htmlContent: string;
}

export default function BlogContent({ htmlContent }: BlogContentProps) {
  return (
    <div 
      className="prose prose-lg max-w-none dark:prose-invert
               prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
               prose-p:text-gray-700 dark:prose-p:text-gray-300
               prose-a:text-primary prose-a:no-underline hover:prose-a:underline
               prose-code:text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
               prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-800 dark:prose-pre:text-gray-200
               prose-img:rounded-lg prose-img:shadow-md
               prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
               prose-math:text-gray-900 dark:prose-math:text-gray-100
               prose-math:bg-gray-100 dark:prose-math:bg-gray-800 prose-math:px-2 prose-math:py-1 prose-math:rounded"
    >
      {<div dangerouslySetInnerHTML={{ __html: htmlContent }} />}
    </div>
  );
} 