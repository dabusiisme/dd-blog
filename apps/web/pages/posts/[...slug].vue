<script setup lang="ts">
import type { Post } from '~/types/post'

const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, async () => {
  // 注意：不要在此追加 .where()，否则路径匹配会从精确匹配退化为前缀正则匹配
  const doc = await queryContent<Post>(route.path).findOne()
  // 生产环境内容查询默认过滤 _draft，这里兜底保证开发环境行为一致
  return doc?._draft ? null : doc
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在', fatal: true })
}

useBlogSeo({
  title: post.value.title ?? '文章',
  description: post.value.description ?? '',
  path: route.path,
  image: post.value.cover,
})
</script>

<template>
  <article v-if="post" class="mx-auto max-w-3xl">
    <header class="mb-8">
      <h1 class="mb-3 text-3xl font-bold">{{ post.title }}</h1>
      <div class="flex items-center gap-3 text-sm text-gray-400">
        <time>发布于 {{ formatDate(post.publishedAt) }}</time>
        <time v-if="post.updatedAt">更新于 {{ formatDate(post.updatedAt) }}</time>
        <div class="flex gap-2">
          <Tag v-for="tag in post.tags" :key="tag" :tag="tag" />
        </div>
      </div>
    </header>

    <!-- TODO: 侧边 TOC（P1，基于 queryContent 返回的 body.toc） -->
    <div class="prose max-w-none">
      <ContentRenderer :value="post" />
    </div>

    <!-- TODO: Giscus 评论（P1，读取 runtimeConfig.public.giscus） -->
  </article>
</template>
