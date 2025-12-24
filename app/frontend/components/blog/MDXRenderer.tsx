import { compile, run } from '@mdx-js/mdx'
import { useEffect, useState } from 'react'
import * as runtime from 'react/jsx-runtime'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
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
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
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
    <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-p:text-base prose-p:leading-relaxed prose-p:my-6 prose-li:my-2 prose-pre:bg-muted prose-pre:border-2 prose-pre:border-border prose-pre:shadow-none prose-code:text-primary prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-[''] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:border-2 prose-img:border-border">
      <MDXContent />
    </article>
  )
}
