<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const emits = defineEmits(['delete', 'edit', 'reset', 'unlock', 'changePassword'])
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <Icon name="lucide:ellipsis-vertical" size="20" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="">
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer" @click="emits('edit')">
          <Icon name="material-symbols:edit-square-outline" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="emits('changePassword')">
          <Icon name="material-symbols:password" />
          Change Password
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="emits('unlock')">
          <Icon name="material-symbols:lock-open-outline" />
          Unlock Extension
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="emits('reset')">
          <Icon name="material-symbols:refresh" />
          Reset Extension
        </DropdownMenuItem>
        <DropdownMenuItem class="text-red-600 cursor-pointer hover:!text-red-500" @click="emits('delete')">
          <Icon name="mdi:trash-can" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
