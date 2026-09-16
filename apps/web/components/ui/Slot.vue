<script setup lang="ts">
import { cloneVNode, computed, useSlots } from 'vue'
import { cn } from '~/utils/cn'

/** shadcn-vue Slot 原始实现：克隆唯一子节点并合并 class（用于 asChild 模式） */
const props = defineProps<{ class?: string }>()
const slots = useSlots()

const cloned = computed(() => {
  const children = slots.default?.() ?? []
  const child = children[0]
  if (!child) return null
  return cloneVNode(child, { class: cn(child.props?.class, props.class) })
})
</script>

<template>
  <component :is="cloned" />
</template>