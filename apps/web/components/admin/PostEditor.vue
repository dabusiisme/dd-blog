<script setup lang="ts">
import type { PostFrontmatter } from '~/types/post'

interface Props {
  initialSlug?: string
  initialFrontmatter?: Partial<PostFrontmatter>
  initialBody?: string
  submitLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialSlug: '',
  initialFrontmatter: () => ({}),
  initialBody: '',
  submitLabel: '保存',
})

const emit = defineEmits<{
  (e: 'save', payload: { slug: string; frontmatter: PostFrontmatter; body: string }): void
}>()

const slug = ref(props.initialSlug)
const title = ref(props.initialFrontmatter.title ?? '')
const description = ref(props.initialFrontmatter.description ?? '')
const publishedAt = ref(props.initialFrontmatter.publishedAt ?? new Date().toISOString().slice(0, 10))
const tags = ref((props.initialFrontmatter.tags ?? []).join(', '))
const draft = ref(props.initialFrontmatter.draft ?? false)
const body = ref(props.initialBody)
const submitting = ref(false)

function handleSubmit() {
  submitting.value = true
  emit('save', {
    slug: slug.value.trim(),
    frontmatter: {
      title: title.value.trim(),
      description: description.value.trim(),
      publishedAt: publishedAt.value,
      tags: tags.value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      draft: draft.value,
    },
    body: body.value,
  })
  submitting.value = false
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <label class="flex items-center gap-3 text-sm">
      <span class="w-20 shrink-0 text-gray-500">Slug</span>
      <input
        v-model="slug"
        required
        placeholder="hello-world"
        class="flex-1 rounded border px-3 py-2"
        :disabled="!!initialSlug"
      />
    </label>
    <label class="flex items-center gap-3 text-sm">
      <span class="w-20 shrink-0 text-gray-500">标题</span>
      <input v-model="title" required class="flex-1 rounded border px-3 py-2" />
    </label>
    <label class="flex items-center gap-3 text-sm">
      <span class="w-20 shrink-0 text-gray-500">摘要</span>
      <input v-model="description" class="flex-1 rounded border px-3 py-2" />
    </label>
    <div class="flex gap-4 text-sm">
      <label class="flex items-center gap-3">
        <span class="w-20 shrink-0 text-gray-500">发布日期</span>
        <input v-model="publishedAt" type="date" required class="rounded border px-3 py-2" />
      </label>
      <label class="flex items-center gap-3">
        <span class="w-20 shrink-0 text-gray-500">标签</span>
        <input v-model="tags" placeholder="逗号分隔" class="flex-1 rounded border px-3 py-2" />
      </label>
    </div>
    <label class="flex items-center gap-2 text-sm">
      <input v-model="draft" type="checkbox" />
      <span>保存为草稿（前台不可见）</span>
    </label>
    <textarea
      v-model="body"
      rows="18"
      placeholder="Markdown 正文"
      class="rounded border px-3 py-2 font-mono text-sm"
    />
    <div>
      <BaseButton type="submit" :disabled="submitting">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
