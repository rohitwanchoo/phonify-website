<script setup lang="ts">
import { ref } from 'vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '~/components/ui/button'
import Label from '~/components/ui/label/Label.vue'
import { Switch } from '~/components/ui/switch'

const enableEdit = ref(false)
const accordion = ref('item-1')

const accordion2 = ref('item-2')
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class="border-b p-5 flex items-center justify-between">
      <div class="text-[16px] font-medium text-primary/100">
        Time Based Calling
      </div>
      <div v-if="!enableEdit" class="flex items-center gap-x-2">
        <Button variant="outline" size="sm" class="rounded" @click="enableEdit = true">
          <Icon name="icons:edit-box" /> Edit
        </Button>
      </div>
      <div v-else class="flex gap-x-2">
        <Button variant="outline" size="sm" class="rounded" @click="enableEdit = false ">
          <Icon name="lucide:x" />
          Cancel
        </Button>
        <Button class="w-[105px] rounded" size="sm">
          <Icon name="material-symbols:save-rounded" />
          Save
        </Button>
      </div>
    </div>

    <div v-if="enableEdit" class="p-5">
      <Accordion v-model="accordion" collapsible>
        <AccordionItem value="item-1" class="">
          <div class="flex items-center justify-between px-5" :class="accordion === 'item-1' && 'border-b'">
            <div class="text-[16px] font-medium text-primary/100">
              Time Based Calling
            </div>
            <AccordionTrigger>
              <template #icon>
                <Switch class="data-[state=checked]:bg-green-600" />
              </template>
            </AccordionTrigger>
          </div>
          <AccordionContent class="p-5">
            <Accordion v-model="accordion2" collapsible class="">
              <AccordionItem value="item-2" class="">
                <AccordionTrigger class=" border rounded-lg h-11 px-3 py-[14px] flex items-center hover:no-underline text-muted-foreground text-xs font-normal">
                  Select a Call Time
                </AccordionTrigger>

                <AccordionContent class="p-3 border rounded-lg mt-1 ">
                  <Button class="w-full rounded-[8px]">
                    Create Custom Call Time <Icon name="lucide:plus" />
                  </Button>
                  <div class="max-h-[300px] overflow-y-auto">
                    <div v-for="n in 10" :key="n" class="text-xs flex items-center justify-between border-b last:border-b-0 py-3">
                      Call Time #1
                      <Button size="icon" variant="outline">
                        <Icon name="mdi:eye" />
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
    <div v-else class="p-5 flex w-full gap-5 ">
      <div class="w-1/2">
        <Label class="text-xs font-normal">
          Time Based Calling
        </Label>
        <div class="text-[16px] font-normal text-green-600 mt-1">
          Yes
        </div>
      </div>
      <div class="w-1/2">
        <Label class="text-xs font-normal">
          Call Time
        </Label>
        <div class="text-[16px] font-normal text-green-600 mt-1">
          Custom Call Time #5
        </div>
      </div>
    </div>
  </div>
</template>
