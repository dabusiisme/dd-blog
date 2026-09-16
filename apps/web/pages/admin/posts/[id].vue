<script setup lang="ts">
import type { PostFrontmatter } from '~/types/post'

const route = useRoute()
const slug = decodeURIComponent(route.params.id as string)

const { updatePost } = usePosts()
const error = ref('')
const saving = ref(false)

const requestFetch = useRequestFetch()
const { data: post, pending } = await useAsyncData(`admin-post-${slug}`, () =>
  requestFetch<{ data: { slug: string; frontmatter: PostFrontmatter; body: string } }>(
    `/api/admin/posts/${encodeURIComponent(slug)}`,
  ),
)

async function handleSave(payload: { slug: string; frontmatter: PostFrontmatter; body: string }) {
  saving.value = true
  error.value = ''
  try {
    await updatePost(slug, payload.frontmatter, payload.body)
    await navigateTo('/admin/posts')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败（Git 提交未成功）'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold">编辑文章</h1>
    <p v-if="pending" class="text-gray-400">加载中…</p>
    <template v-else-if="post?.data">
      <p v-if="error" class="mb-4 text-sm text-red-500">{{ error }}</p>
      <PostEditor
        :initial-slug="post.data.slug"
        :initial-frontmatter="post.data.frontmatter"
        :initial-body="post.data.body"
        :submit-label="saving ? '保存中…' : '保存'"
        @save="handleSave"
      />
    </template>
  </div>
</template>
