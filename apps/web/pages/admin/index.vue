<script setup lang="ts">
const { listPosts } = usePosts()

const { data: posts, pending, error } = await useAsyncData('admin-posts', () => listPosts())

const publishedCount = computed(() => posts.value?.filter((p) => !p.frontmatter.draft).length ?? 0)
const draftCount = computed(() => posts.value?.filter((p) => p.frontmatter.draft).length ?? 0)
const tagCount = computed(
  () => new Set(posts.value?.flatMap((p) => p.frontmatter.tags) ?? []).size,
)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">仪表盘</h1>
      <NuxtLink to="/admin/posts/new">
        <BaseButton>新建文章</BaseButton>
      </NuxtLink>
    </div>

    <p v-if="error" class="mb-4 text-sm text-red-500">文章数据加载失败：{{ error.message }}</p>

    <div class="grid grid-cols-3 gap-4">
      <DashboardCard label="已发布" :value="pending ? '…' : publishedCount" />
      <DashboardCard label="草稿" :value="pending ? '…' : draftCount" />
      <DashboardCard label="标签数" :value="pending ? '…' : tagCount" />
    </div>
  </div>
</template>
