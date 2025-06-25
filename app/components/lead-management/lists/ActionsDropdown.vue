<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const emits = defineEmits(['edit', 'download', 'delete'])
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <Icon name="lucide:ellipsis-vertical" size="20" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer" @click="emits('edit')">
          <Icon name="material-symbols:edit-square-outline" size="16" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="emits('download')">
          <Icon name="lucide:download" size="16" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem class="text-red-600 cursor-pointer hover:!text-red-500" @click="emits('delete')">
          <Icon name="mdi:trash-can" size="16" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
