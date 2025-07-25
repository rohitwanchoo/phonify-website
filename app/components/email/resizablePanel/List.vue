<script lang="ts" setup>
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Button from '~/components/ui/button/Button.vue'
import Checkbox from '~/components/ui/checkbox/Checkbox.vue'
import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'

const enableSelect = ref(false)
const messages = [
  {
    name: 'Mary Kelly',
    time: '10 minutes ago',
    subject: 'Vestibulum ante ipsum primis in faucibus orci luctus',
    preview: 'Proin sit amet risus ac arcu fermentum tincidunt. Int',
  },
  {
    name: 'Robert Brown',
    time: '15 minutes ago',
    subject: 'Etiam gravida leo ac felis scelerisque, id porta nulla',
    preview: 'Suspendisse potenti. Sed vel neque ut mi faucibus',
  },
  {
    name: 'Sarah Carter',
    time: '20 minutes ago',
    subject: 'Phasellus a libero et felis eleifend facilisis non ac o',
    preview: 'Aenean euismod nunc ut nisl feugiat, ut tempor nun',
  },
  {
    name: 'Alex Lee',
    time: '25 minutes ago',
    subject: 'Integer in ligula sed leo consectetur tincidunt vitae',
    preview: 'Curabitur posuere, massa eget euismod semper, nu',
  },
  {
    name: 'David Miller',
    time: '30 minutes ago',
    subject: 'Donec a purus vel mi fringilla mollis vitae a turpis.',
    preview: 'Sed vestibulum, felis ut luctus feugiat, odio diam co',
  },
  {
    name: 'Clara Thomas',
    time: '35 minutes ago',
    subject: 'Mauris eget urna vitae velit cursus suscipit ut ut nu',
    preview: 'Nam dictum tincidunt feugiat. Fusce convallis, arcu',
  },
  {
    name: 'Jessica Park',
    time: '40 minutes ago',
    subject: 'Ut pretium orci vel ante pellentesque, non rutrum d',
    preview: 'Pellentesque habitant morbi tristique senectus et n',
  },
  {
    name: 'Thomas Gray',
    time: '45 minutes ago',
    subject: 'Sed vitae tortor sit amet augue pharetra efficitur e',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Emma Wilson',
    time: '50 minutes ago',
    subject: 'Quisque consequat erat et vehicula dignissim.',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Jessica Park',
    time: '40 minutes ago',
    subject: 'Ut pretium orci vel ante pellentesque, non rutrum d',
    preview: 'Pellentesque habitant morbi tristique senectus et n',
  },
  {
    name: 'Thomas Gray',
    time: '45 minutes ago',
    subject: 'Sed vitae tortor sit amet augue pharetra efficitur e',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Emma Wilson',
    time: '50 minutes ago',
    subject: 'Quisque consequat erat et vehicula dignissim.',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Jessica Park',
    time: '40 minutes ago',
    subject: 'Ut pretium orci vel ante pellentesque, non rutrum d',
    preview: 'Pellentesque habitant morbi tristique senectus et n',
  },
  {
    name: 'Thomas Gray',
    time: '45 minutes ago',
    subject: 'Sed vitae tortor sit amet augue pharetra efficitur e',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Emma Wilson',
    time: '50 minutes ago',
    subject: 'Quisque consequat erat et vehicula dignissim.',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Jessica Park',
    time: '40 minutes ago',
    subject: 'Ut pretium orci vel ante pellentesque, non rutrum d',
    preview: 'Pellentesque habitant morbi tristique senectus et n',
  },
  {
    name: 'Thomas Gray',
    time: '45 minutes ago',
    subject: 'Sed vitae tortor sit amet augue pharetra efficitur e',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Emma Wilson',
    time: '50 minutes ago',
    subject: 'Quisque consequat erat et vehicula dignissim.',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Jessica Park',
    time: '40 minutes ago',
    subject: 'Ut pretium orci vel ante pellentesque, non rutrum d',
    preview: 'Pellentesque habitant morbi tristique senectus et n',
  },
  {
    name: 'Thomas Gray',
    time: '45 minutes ago',
    subject: 'Sed vitae tortor sit amet augue pharetra efficitur e',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Emma Wilson',
    time: '50 minutes ago',
    subject: 'Quisque consequat erat et vehicula dignissim.',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Jessica Park',
    time: '40 minutes ago',
    subject: 'Ut pretium orci vel ante pellentesque, non rutrum d',
    preview: 'Pellentesque habitant morbi tristique senectus et n',
  },
  {
    name: 'Thomas Gray',
    time: '45 minutes ago',
    subject: 'Sed vitae tortor sit amet augue pharetra efficitur e',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
  {
    name: 'Emma Wilson',
    time: '50 minutes ago',
    subject: 'Quisque consequat erat et vehicula dignissim.',
    preview: 'Vivamus non leo eu nisl egestas iaculis. Fusce ac ips',
  },
]

function getRandomColorClass() {
  const colors = [
    'bg-red-100 text-red-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<template>
  <div class="w-full">
    <!-- Header -->
    <div class="flex items-center justify-between border-b p-5">
      <div v-auto-animate class="flex items-center gap-x-2">
        <Checkbox v-if="enableSelect" />
        <div>
          <div class="text-[16px] font-medium">
            Sent
          </div>
          <div class="text-xs font-normal text-gray-500 text-nowrap">
            245 mails
          </div>
        </div>
      </div>
      <div class="flex gap-x-1">
        <Button variant="ghost" size="icon" @click="enableSelect = !enableSelect">
          <Icon :name="enableSelect ? 'material-symbols:format-list-bulleted' : 'material-symbols:checklist'" size="20" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon name="material-symbols:filter-list" size="20" />
        </Button>
      </div>
    </div>
    <!-- List -->
    <ScrollArea class="overflow-y-auto max-h-full">
      <div>
        <div v-for="item in messages" :key="item.name" v-auto-animate class="flex py-3 px-4 gap-x-3 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-200 ease-in-out">
          <Checkbox v-if="enableSelect" />

          <Avatar v-else class="h-10 w-10">
            <AvatarFallback :class="getRandomColorClass()">
              {{ userAvatarWord(item.name) }}
            </AvatarFallback>
          </Avatar>
          <div class="w-full">
            <div class="flex items-center justify-between text-xs w-full">
              <div class="text-primary">
                To: {{ item.name }}
              </div>
              <div class="text-gray-500">
                {{ item.time }}
              </div>
            </div>
            <div>
              <div class="text-xs text-wrap font-medium truncate">
                {{ item.subject }}
              </div>
              <div class="text-xs text-wrap font-normal truncate">
                {{ item.preview }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
