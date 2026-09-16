<script setup lang="ts">
const { listPosts, deletePost } = usePosts()

const {
  data: posts,
  pending,
  error: listError,
  refresh,
} = await useAsyncData('admin-posts-list', () => listPosts())

const error = ref('')

async function handleDelete(slug: string) {
  if (!confirm(`确认删除文章「${slug}」？此操作会提交到 Git 仓库。`)) return
  try {
    await deletePost(slug)
    await refresh()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">文章</h1>
      <NuxtLink to="/admin/posts/new">
        <BaseButton>新建文章</BaseButton>
      </NuxtLink>
    </div>

    <p v-if="error" class="mb-4 text-sm text-red-500">{{ error }}</p>
    <p v-if="listError" class="mb-4 text-sm text-red-500">文章列表加载失败：{{ listError.message }}</p>
    <p v-if="pending" class="text-gray-400">加载中…</p>

    <table v-else-if="posts?.length" class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b text-left text-gray-500">
          <th class="py-2">标题</th>
          <th class="py-2">状态</th>
          <th class="py-2">发布日期</th>
          <th class="py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts ?? []" :key="post.slug" class="border-b">
          <td class="py-2">{{ post.frontmatter.title }}</td>
          <td class="py-2">
            <span :class="post.frontmatter.draft ? 'text-gray-400' : 'text-green-600'">
              {{ post.frontmatter.draft ? '草稿' : '已发布' }}
            </span>
          </td>
          <td class="py-2">{{ formatDate(post.frontmatter.publishedAt) }}</td>
          <td class="flex gap-3 py-2">
            <NuxtLink :to="`/admin/posts/${encodeURIComponent(post.slug)}`" class="text-blue-600">
              编辑
            </NuxtLink>
            <button class="text-red-500" @click="handleDelete(post.slug)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-gray-400">暂无文章。</p>
  </div>
</template>
