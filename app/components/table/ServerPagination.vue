<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
  defaultPage: {
    type: Number,
    default: 1,
  },
})

const emits = defineEmits(['pageChange'])

function changePage(page: number) {
  if (page > 0 && page <= props.lastPage) {
    emits('pageChange', page)
  }
}
</script>

<template>
  <Pagination v-slot="{ page }" :page="currentPage" :show-edges="true" :items-per-page="itemsPerPage" :total="totalItems" :default-page="defaultPage">
    <PaginationContent v-slot="{ items }">
      <PaginationFirst class="w-7 h-7 sm:w-10 sm:h-10 p-0" data-cy="pagination-first" @click="changePage(1)">
        <Button variant="outline" size="icon">
          <Icon name="lucide:chevrons-left" size="20" />
        </Button>
      </PaginationFirst>

      <PaginationPrevious class="w-7 h-7 sm:w-10 sm:h-10 p-0" @click="changePage(currentPage - 1)">
        <Button variant="outline" size="icon">
          <Icon name="lucide:chevron-left" size="20" />
        </Button>
      </PaginationPrevious>

      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === page"
        >
          {{ item.value }}
        </PaginationItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext class="w-7 h-7 sm:w-10 sm:h-10 p-0" @click="changePage(currentPage + 1)">
        <Button variant="outline" size="icon">
          <Icon name="lucide:chevron-right" size="20" />
        </Button>
      </PaginationNext>
      <PaginationLast class="w-7 h-7 sm:w-10 sm:h-10 p-0 " data-cy="pagination-last" @click="changePage(lastPage)">
        <Button variant="outline" size="icon">
          <Icon name="lucide:chevrons-right" size="20" />
        </Button>
      </PaginationLast>
    </PaginationContent>
  </Pagination>
  <!-- <Pagination
    v-slot="{ page }" :page="currentPage" :total="totalItems" :sibling-count="1" :show-edges="false" :items-per-page="itemsPerPage"
    :default-page="defaultPage" class=""
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1 max-w-[330px] sm:max-w-full mx:auto">
      <PaginationFirst class="w-7 h-7 sm:w-10 sm:h-10 p-0 " data-cy="pagination-first" @click="changePage(1)" />
      <PaginationPrev class="w-7 h-7 sm:w-10 sm:h-10 p-0" data-cy="pagination-prev" @click="changePage(currentPage - 1)" />

      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
          <Button
            :data-cy="`page-${index + 1}`"
            class="w-7 h-7 sm:w-10 sm:h-10 p-1 min-w-fit" :variant="item.value === page ? 'default' : 'outline'"
            @click="changePage(item.value)"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext class="w-7 h-7 sm:w-10 sm:h-10 p-0 " data-cy="pagination-next" @click="changePage(currentPage + 1)" />
      <PaginationLast class="w-7 h-7 sm:w-10 sm:h-10 p-0 " data-cy="pagination-last" @click="changePage(lastPage)" />
    </PaginationList>
  </Pagination> -->
</template>
