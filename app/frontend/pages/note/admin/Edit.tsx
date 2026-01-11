import { Head, Link, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { note_admin_index_path } from '@/lib/routes'
import type { Post } from '@/types'

interface EditProps {
  post: Post
  categories: string[]
  tags?: string[]
}

type PostFormData = {
  title: string
  slug: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  published: boolean
  featuredImage: string
  content: string
}

export default function Edit({ post, categories }: EditProps) {
  const [tagsInput, setTagsInput] = useState((post.tags || []).join(', '))

  const { data, setData, processing, errors } = useForm<PostFormData>({
    title: post.title,
    slug: post.slug,
    date: post.date.split('T')[0],
    excerpt: post.excerpt || '',
    category: post.category || '',
    tags: post.tags || [],
    author: post.author || '',
    published: post.published !== false,
    featuredImage: post.featuredImage || '',
    content: post.content,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Parse tags from input string before submitting
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    // Submit with parsed tags included
    router.patch(`/note/me/${post.slug}`, {
      ...data,
      tags: parsedTags,
    })
  }

  return (
    <>
      <Head title={`Edit: ${post.title}`} />

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 w-full max-w-4xl">
        <Link href={note_admin_index_path()}>
          <Button variant="ghost" className="mb-4">
            ← Back to Admin
          </Button>
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">Edit Post</h1>
        <p className="text-muted-foreground mb-8">Editing: {post.title}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              required
              placeholder="Enter post title"
            />
            {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={data.slug}
              onChange={(e) => setData('slug', e.target.value)}
              required
              placeholder="post-slug"
            />
            <p className="text-sm text-muted-foreground">
              URL-friendly identifier (only lowercase letters, numbers, dashes)
            </p>
            {data.slug !== post.slug && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Warning: Changing the slug will change the post's URL
              </p>
            )}
            {errors.slug && <p className="text-destructive text-sm">{errors.slug}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => setData('date', e.target.value)}
              required
            />
            {errors.date && <p className="text-destructive text-sm">{errors.date}</p>}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={data.excerpt}
              onChange={(e) => setData('excerpt', e.target.value)}
              rows={3}
              placeholder="Brief description of the post"
            />
            {errors.excerpt && <p className="text-destructive text-sm">{errors.excerpt}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={data.category}
              onChange={(e) => setData('category', e.target.value)}
              placeholder="e.g., Tutorial, News, Guide"
              list="categories"
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {errors.category && <p className="text-destructive text-sm">{errors.category}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="rails, react, tutorial (comma-separated)"
            />
            <p className="text-sm text-muted-foreground">Comma-separated tags</p>
            {errors.tags && <p className="text-destructive text-sm">{errors.tags}</p>}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={data.author}
              onChange={(e) => setData('author', e.target.value)}
              placeholder="Your name"
            />
            {errors.author && <p className="text-destructive text-sm">{errors.author}</p>}
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              type="url"
              value={data.featuredImage}
              onChange={(e) => setData('featuredImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {errors.featuredImage && (
              <p className="text-destructive text-sm">{errors.featuredImage}</p>
            )}
          </div>

          {/* Published */}
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={data.published}
              onCheckedChange={(checked) => setData('published', checked)}
            />
            <Label htmlFor="published" className="cursor-pointer">
              Published
            </Label>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content (MDX) *</Label>
            <Textarea
              id="content"
              value={data.content}
              onChange={(e) => setData('content', e.target.value)}
              rows={20}
              className="font-mono text-sm"
              placeholder="Write your MDX content here..."
              required
            />
            <p className="text-sm text-muted-foreground">
              MDX supports markdown with React components. Use standard markdown syntax for
              formatting.
            </p>
            {errors.content && <p className="text-destructive text-sm">{errors.content}</p>}
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={processing} size="lg">
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href={note_admin_index_path()}>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
