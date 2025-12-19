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
    <article className="prose prose-lg max-w-none dark:prose-invert">
      <MDXContent />
    </article>
  )
}
