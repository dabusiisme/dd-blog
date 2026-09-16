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
    <div class="flex items-center gap-3 text-sm">
      <Label for="post-slug" class="w-20 shrink-0 text-muted-foreground">Slug</Label>
      <Input
        id="post-slug"
        v-model="slug"
        required
        placeholder="hello-world"
        :disabled="!!initialSlug"
        class="flex-1"
      />
    </div>
    <div class="flex items-center gap-3 text-sm">
      <Label for="post-title" class="w-20 shrink-0 text-muted-foreground">标题</Label>
      <Input id="post-title" v-model="title" required class="flex-1" />
    </div>
    <div class="flex items-center gap-3 text-sm">
      <Label for="post-desc" class="w-20 shrink-0 text-muted-foreground">摘要</Label>
      <Input id="post-desc" v-model="description" class="flex-1" />
    </div>
    <div class="flex gap-4 text-sm">
      <div class="flex items-center gap-3">
        <Label for="post-date" class="w-20 shrink-0 text-muted-foreground">发布日期</Label>
        <Input id="post-date" v-model="publishedAt" type="date" required />
      </div>
      <div class="flex flex-1 items-center gap-3">
        <Label for="post-tags" class="w-20 shrink-0 text-muted-foreground">标签</Label>
        <Input id="post-tags" v-model="tags" placeholder="逗号分隔" class="flex-1" />
      </div>
    </div>
    <div class="flex items-center gap-2 text-sm">
      <input id="post-draft" v-model="draft" type="checkbox" class="h-4 w-4 rounded border-input" />
      <Label for="post-draft">保存为草稿（前台不可见）</Label>
    </div>
    <Textarea
      v-model="body"
      :rows="18"
      placeholder="Markdown 正文"
      class="font-mono"
    />
    <div>
      <Button type="submit" :disabled="submitting">{{ submitLabel }}</Button>
    </div>
  </form>
</template>