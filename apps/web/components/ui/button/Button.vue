<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'
import { buttonVariants, type ButtonVariants } from './index'
import Slot from '../Slot.vue'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    class?: string
    /** asChild：把按钮样式合并到唯一子节点上（用于 NuxtLink，避免 <a><button> 嵌套） */
    asChild?: boolean
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    size: 'default',
    class: '',
    asChild: false,
    type: 'button',
  },
)

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
)
</script>

<template>
  <Slot v-if="asChild" :class="classes">
    <slot />
  </Slot>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>