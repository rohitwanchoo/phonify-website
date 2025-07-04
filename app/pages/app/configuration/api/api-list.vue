<script setup lang="ts">
import { useRoute } from 'vue-router'
import ConfigurationApiInformation from '@/components/configuration/API/Information.vue'
import ConfigurationApiParameters from '@/components/configuration/API/Parameters.vue'
import { Button } from '@/components/ui/button'

const route = useRoute()

const isAddMode = computed(() => route.query.mode === 'add')

const { stepper, formState, resetFormState } = useCreateCampaign()

const breadcrumbs = [
  {
    label: 'API List',
    href: '/app/configuration/api',
  },
  {
    label: isAddMode.value ? 'Add API List' : 'Edit API List',
    href: '/app/configuration/api/api-list',
  },
]
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-110px)] overflow-auto">
    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto">
      <BaseHeader :title="isAddMode ? 'Add API List' : 'Edit API List'" :breadcrumbs="breadcrumbs" />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4">
        <div class="lg:col-span-12">
          <ConfigurationApiInformation />
        </div>
        <div class="lg:col-span-12">
          <ConfigurationApiParameters />
        </div>
      </div>
    </div>

    <!-- Sticky footer button -->
    <div
      class="sticky bottom-0 bg-white w-full flex justify-end items-center gap-4 p-4 border-t border-gray-200 z-10 "
    >
      <Button
        type="submit"
        class="px-8 py-3 h-12 w-full "
        @click="() => {}"
      >
        <Icon name="material-symbols:check" size="20" />
        Submit
      </Button>
    </div>
  </div>
</template>
