<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const model = defineModel<string | number | undefined>()

const props = withDefaults(
  defineProps<{
    class?: string
    type?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
    id?: string
    name?: string
    autocomplete?: string
  }>(),
  { type: 'text', class: '', placeholder: '', id: '', name: '', autocomplete: '' },
)

const classes = computed(() =>
  cn(
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  ),
)
</script>

<template>
  <input
    v-model="model"
    :type="type"
    :required="required"
    :placeholder="placeholder"
    :disabled="disabled"
    :id="id"
    :name="name"
    :autocomplete="autocomplete"
    :class="classes"
  />
</template>