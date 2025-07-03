<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const emits = defineEmits(['delete'])

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
        <Icon name="material-symbols:more-vert" size="24" class="cursor-pointer" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem class="text-red-600 cursor-pointer hover:!text-red-500" @click="emits('delete')">
        <Icon name="material-symbols:delete" size="16" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>