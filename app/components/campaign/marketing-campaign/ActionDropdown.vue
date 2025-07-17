<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const emit = defineEmits(['edit', 'addTextSchedule', 'addEmailSchedule', 'delete'])

function handleEdit() {
  emit('edit')
}

function handleAddTextSchedule() {
  emit('addTextSchedule')
}

function handleAddEmailSchedule() {
  emit('addEmailSchedule')
}

function handleDelete() {
  emit('delete')
}
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
        <DropdownMenuItem class="cursor-pointer" @click="handleEdit">
          <Icon name="material-symbols:edit-square-outline" size="16" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="handleAddTextSchedule">
          <Icon name="material-symbols:chat-add-on-outline" size="20" />
          Add Text Schedule
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="handleAddEmailSchedule">
          <Icon name="lucide:mail-plus" size="16" />
          Add Email Schedule
        </DropdownMenuItem>
        <DropdownMenuItem class="text-red-600 cursor-pointer hover:!text-red-500" @click="handleDelete">
          <Icon name="mdi:trash-can" size="16" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>