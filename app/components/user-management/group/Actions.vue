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

const emits = defineEmits(['onDelete', 'onRename'])
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="h-[28px] w-[28px]">
        <Icon name="lucide:ellipsis-vertical" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem class="text-sm cursor-pointer" @click="emits('onRename')">
          <Icon name="material-symbols:edit-square-outline" />
          Rename Group
        </DropdownMenuItem>
        <DropdownMenuItem class="text-red-600 cursor-pointer hover:!text-red-500 text-sm" @click="emits('onDelete')">
          <Icon name="mdi:trash-can" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
