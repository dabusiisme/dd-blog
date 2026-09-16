<script setup lang="ts">
import type { PostListItem } from '~/types/post'

interface Props {
  post: PostListItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click', post: PostListItem): void
}>()
</script>

<template>
  <NuxtLink :to="props.post._path" class="block" @click="emit('click', props.post)">
    <article class="rounded-lg border bg-white p-5 transition hover:shadow-md">
      <h2 class="mb-2 text-lg font-semibold">{{ post.title }}</h2>
      <p class="mb-3 line-clamp-2 text-sm text-gray-500">{{ post.description }}</p>
      <div class="flex items-center gap-3 text-xs text-gray-400">
        <time>{{ formatDate(post.publishedAt) }}</time>
        <div class="flex gap-2">
          <Tag v-for="tag in post.tags" :key="tag" :tag="tag" />
        </div>
      </div>
    </article>
  </NuxtLink>
</template>
