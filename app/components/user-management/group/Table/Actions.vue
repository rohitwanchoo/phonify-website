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

const emit = defineEmits(['delete'])
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child @click.stop>
      <Button variant="ghost" size="icon" @click.stop>
        <Icon name="lucide:ellipsis-vertical" size="20" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="">
      <DropdownMenuGroup>
        <DropdownMenuItem class="text-red-600 cursor-pointer hover:!text-red-500" @click="emit('delete')">
          <Icon name="mdi:trash-can" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
