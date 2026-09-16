<script setup lang="ts">
const { createPost } = usePosts()
const error = ref('')
const saving = ref(false)

async function handleSave(payload: { slug: string; frontmatter: import('~/types/post').PostFrontmatter; body: string }) {
  saving.value = true
  error.value = ''
  try {
    await createPost(payload.slug, payload.frontmatter, payload.body)
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
    <h1 class="mb-6 text-2xl font-bold">新建文章</h1>
    <p v-if="error" class="mb-4 text-sm text-red-500">{{ error }}</p>
    <PostEditor :submit-label="saving ? '保存中…' : '发布'" @save="handleSave" />
  </div>
</template>
