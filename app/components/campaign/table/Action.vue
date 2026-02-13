<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const emits = defineEmits(['delete', 'edit', 'reset', 'copy'])
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="h-8 w-8 hover:bg-gray-100">
        <Icon name="lucide:more-vertical" class="h-4 w-4 text-gray-500" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-48">
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer gap-2 py-2" @click="emits('copy')">
          <Icon name="lucide:copy" class="h-4 w-4 text-gray-500" />
          <span>Duplicate</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer gap-2 py-2" @click="emits('reset')">
          <Icon name="lucide:refresh-cw" class="h-4 w-4 text-gray-500" />
          <span>Reset Campaign</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer gap-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50" @click="emits('delete')">
        <Icon name="lucide:trash-2" class="h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
