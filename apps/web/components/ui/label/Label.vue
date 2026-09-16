<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

// 注意：HTML 属性 for 是 JS 保留字，模板里不能裸写 :for="for"，
// 所以在 script 里用 computed 转一道，再用 `htmlFor` 引用。
const props = withDefaults(defineProps<{ class?: string; for?: string }>(), { class: '', for: '' })

const classes = computed(() =>
  cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    props.class,
  ),
)

const htmlFor = computed(() => props.for)
</script>

<template>
  <label :for="htmlFor" :class="classes">
    <slot />
  </label>
</template>