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
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger @click.stop as-child>
      <Button @click.stop variant="ghost" size="icon">
        <Icon name="lucide:ellipsis-vertical" size="20" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="">
      <DropdownMenuGroup>
        <DropdownMenuItem class="text-red-600 cursor-pointer hover:!text-red-500">
          <Icon name="mdi:trash-can" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
