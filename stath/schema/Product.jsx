import {defineType, defineField} from 'sanity'

const slugify = (input) => {
  const title = typeof input === 'string' ? input : input.title
  const timestamp = new Date().getTime().toString()
  const slug = `${title}-${timestamp}`
  return slug.replace(/ \s+/g, '-')
}

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Keep the title relative to product',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: slugify,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'image',
      description: 'Placeholder Image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'category',
      title: 'Product Category',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'specials',
      title: 'Product Specials',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'specials'}]}],
    }),
    defineField({
      name: 'collection',
      title: 'Product Collection',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'collection'}]}],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'discountedprice',
      title: 'Discount Price',
      type: 'number',
    }),
    defineField({
      name: 'ratings',
      title: 'Ratings',
      type: 'number',
      description: 'Ratings must be equal or below 5',
    }),
    defineField({
      name: 'trending',
      title: 'Trending',
      type: 'boolean',
    }),
    defineField({
      name: 'limited',
      title: 'Limited',
      type: 'boolean',
    }),
    defineField({
      name: 'popular',
      title: 'Popular',
      type: 'boolean',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
    }),
    defineField({
      name: 'grade',
      title: 'Grade',
      type: 'string',
    }),
    defineField({
      name: 'gram',
      title: 'Gram',
      type: 'string',
    }),
    defineField({
      name: 'holesize',
      title: 'Hole Size',
      type: 'string',
    }),
    defineField({
      name: 'compatibility',
      title: 'Style Compatibility',
      type: 'string',
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
    }),
    defineField({
      name: 'productQuantity',
      title: 'Product Quantity to be ordered',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      position: 'position',
    },
  },
})
