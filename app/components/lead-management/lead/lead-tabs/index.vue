<script setup lang="ts">
import { LeadManagementLeadLeadTabsActivity } from '#components'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const props = defineProps({
  activityData: Object,
  activityLoading: Boolean,
  leadData: Object,
})
</script>

<template>
  <div class="border rounded-lg">
    <Tabs default-value="activity" class="w-full gap-0">
      <div class=" border-b pb-4 p-2 md:p-4">
        <TabsList class="grid w-full grid-cols-4 p-0">
          <TabsTrigger value="activity" class="data-[state=active]:bg-black data-[state=active]:text-[#FAFAFA] font-light text-xs md:text-sm">
            <p>Activity</p>
          </TabsTrigger>
          <TabsTrigger value="text" class="data-[state=active]:bg-black data-[state=active]:text-white font-light text-xs md:text-sm">
            <p>Send Text</p>
          </TabsTrigger>
          <TabsTrigger value="email" class="data-[state=active]:bg-black data-[state=active]:text-white font-light text-xs md:text-sm">
            <p>Send Email</p>
          </TabsTrigger>
          <TabsTrigger value="fax" class="data-[state=active]:bg-black data-[state=active]:text-white font-light text-xs md:text-sm">
            <p>Send Fax</p>
          </TabsTrigger>
        </TabsList>
      </div>

      <div class="p-2 bg-[#FAFAFA] h-full lg:max-h-[calc(100vh-230px)] overflow-y-auto">
        <TabsContent value="activity">
          <div class="bg-white rounded-md">
            <LeadManagementLeadLeadTabsActivity :activity-loading="activityLoading" :lead-activity-data="activityData" />
          </div>
        </TabsContent>
        <TabsContent value="text">
          <LeadManagementLeadLeadTabsSendText :lead-data="leadData" />
        </TabsContent>
        <TabsContent value="email">
          <LeadManagementLeadLeadTabsSendEmail :lead-data="leadData" />
        </TabsContent>
        <TabsContent value="fax">
          <LeadManagementLeadLeadTabsSendFax :lead-data="leadData" />
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>
