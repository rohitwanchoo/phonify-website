<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'

// props
interface Props {
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search List',
  class: '',
})
const model = defineModel<string>()
</script>

<template>
  <div :class="cn('relative', props.class)">
    <Input v-model="model" :placeholder="props.placeholder" class="w-full h-11" />
    <Icon name="lucide:search" class="absolute top-1/2  right-0 -translate-x-1/2  -translate-y-1/2" />
  </div>
</template>
