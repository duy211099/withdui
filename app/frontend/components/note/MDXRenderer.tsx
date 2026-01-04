import { compile, run } from '@mdx-js/mdx'
import { useEffect, useState } from 'react'
import * as runtime from 'react/jsx-runtime'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

interface MDXRendererProps {
  content: string
}

// Note: Custom component styling is handled by Tailwind Typography prose classes
// If you need to customize individual MDX elements in the future, you can uncomment and
// modify the components object below and pass it to <MDXContent components={components} />

export default function MDXRenderer({ content }: MDXRendererProps) {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const compileAndRun = async () => {
      try {
        setError(null)
        const code = String(
          await compile(content, {
            outputFormat: 'function-body',
            development: false,
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeHighlight],
          })
        )
        const { default: Component } = await run(code, {
          ...runtime,
          baseUrl: import.meta.url,
        })
        setMDXContent(() => Component)
      } catch (err) {
        console.error('MDX compilation error:', err)
        setError(err instanceof Error ? err.message : 'Failed to compile MDX content')
      }
    }

    compileAndRun()
  }, [content])

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
        <h3 className="font-bold mb-2">Error rendering content</h3>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (!MDXContent) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading content...</div>
      </div>
    )
  }

  return (
    <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-p:text-base prose-p:leading-relaxed prose-p:my-6 prose-li:my-2 prose-pre:bg-transparent! prose-pre:border-2 prose-pre:border-border prose-pre:shadow-none prose-pre:rounded-lg prose-pre:p-4 prose-code:text-primary prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-[''] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-primary/5 prose-pre>code:!bg-transparent prose-pre>code:p-0 prose-pre>code:text-foreground prose-h1>code:text-4xl! prose-h2>code:text-3xl! prose-h3>code:text-2xl! prose-h4>code:text-xl! prose-h5>code:text-lg! prose-h6>code:text-base! prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:border-2 prose-img:border-border [&_h1_code]:text-4xl! [&_h2_code]:text-3xl! [&_h3_code]:text-2xl! [&_h4_code]:text-xl! [&_h5_code]:text-lg! [&_h6_code]:text-base! [&_pre]:bg-transparent! [&_pre_code]:bg-transparent!">
      <MDXContent />
    </article>
  )
}
