<script lang="ts" setup>
import { findAncestor } from 'typescript';
import Button from '~/components/ui/button/Button.vue'
const addCalendarEventDialog = ref(false)

function editEvent(){
  addCalendarEventDialog.value= true
}
</script>

<template>
  <BaseHeader title="Calendar">
    <template #actions>
      <CalendarAddEvent v-model:open="addCalendarEventDialog" />
    </template>
  </BaseHeader>
  <Calendar @on-edit="editEvent" />
</template>
