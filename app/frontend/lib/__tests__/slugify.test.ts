import { slugify } from '../slugify'

/**
 * Example usage of Vietnamese slug generator
 *
 * Run this in browser console or test to see examples
 */

// Vietnamese text examples
console.log(slugify('Xin chào Việt Nam'))
// Output: 'xin-chao-viet-nam'

console.log(slugify('Học lập trình React và Rails'))
// Output: 'hoc-lap-trinh-react-va-rails'

console.log(slugify('Hướng dẫn sử dụng MDX'))
// Output: 'huong-dan-su-dung-mdx'

console.log(slugify('Đây là bài viết về TypeScript'))
// Output: 'day-la-bai-viet-ve-typescript'

console.log(slugify('Những điều thú vị về Next.js'))
// Output: 'nhung-dieu-thu-vi-ve-nextjs'

// Mixed Vietnamese and English
console.log(slugify('Tutorial: Tạo Blog với Rails'))
// Output: 'tutorial-tao-blog-voi-rails'

// Special characters
console.log(slugify('Hello@World! #2024'))
// Output: 'helloworld-2024'

// Edge cases
console.log(slugify(''))
// Output: ''

console.log(slugify('   Multiple   Spaces   '))
// Output: 'multiple-spaces'

console.log(slugify('---Leading---and---Trailing---'))
// Output: 'leading-and-trailing'

export default {
  examples: [
    { input: 'Xin chào Việt Nam', output: 'xin-chao-viet-nam' },
    { input: 'Học lập trình React và Rails', output: 'hoc-lap-trinh-react-va-rails' },
    { input: 'Hướng dẫn sử dụng MDX', output: 'huong-dan-su-dung-mdx' },
    { input: 'Đây là bài viết về TypeScript', output: 'day-la-bai-viet-ve-typescript' },
  ],
}
