<script setup lang="ts">
import type { PostListItem } from '~/types/post'

const route = useRoute()
const tag = decodeURIComponent(route.params.tag as string)

const { data: posts } = await useAsyncData(`tag-${tag}`, () =>
  queryContent<PostListItem>('/posts')
    .where({ _draft: { $ne: true }, tags: { $contains: tag } })
    .only(['title', 'description', 'publishedAt', 'tags', '_path'])
    .sort({ publishedAt: -1 })
    .find(),
)

useBlogSeo({ title: `标签：${tag}`, description: `标签「${tag}」下的全部文章` })
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="mb-2 text-2xl font-bold">标签：{{ tag }}</h1>
    <PostCard v-for="post in posts ?? []" :key="post._path" :post="post" />
    <p v-if="!posts?.length" class="text-gray-400">该标签下暂无文章。</p>
  </div>
</template>
