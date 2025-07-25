<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Button from '~/components/ui/button/Button.vue'
import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'

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
  <div class="h-full w-full rounded-[16px] bg-white">
    <div class="py-3 px-4 flex items-center justify-between border-b">
      <Icon name="lucide:arrow-left" size="20" />
      <div class="text-xs text-gray-400 flex items-center gap-x-3">
        1 of 24
        <div class="flex items-center gap-x-2">
          <Icon class="cursor-pointer hover:text-primary transition-colors duration-200 ease-in-out" size="18" name="lucide:chevron-left" />
          <Icon class="cursor-pointer hover:text-primary transition-colors duration-200 ease-in-out" size="18" name="lucide:chevron-right" />
        </div>
      </div>
    </div>
    <div class="py-3 px-4 flex gap-x-3 border-b">
      <Avatar class="h-10 w-10">
        <AvatarFallback :class="getRandomColorClass()">
          {{ userAvatarWord('Thomas Gray') }}
        </AvatarFallback>
      </Avatar>

      <div class="w-full">
        <div class="flex items-center justify-between text-xs w-full">
          <div class="text-primary">
            Thomas Gray <span class="text-gray-500">&lt;thomasgray123@gmail.com&gt;</span>
          </div>
          <div class="text-gray-500 flex items-center gap-x-2">
            11 Jul, 2025, 1:36PM
            <span class="flex items-center gap-x-1 text-primary">
              <Icon class="cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out" size="16" name="lucide:star" />
              <Icon class="cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out" size="16" name="material-symbols:undo" />
              <Icon class="cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out" size="16" name="material-symbols:more-vert" />
            </span>
          </div>
        </div>
        <div>
          <div class="text-xs text-wrap font-normal truncate">
            <span class="text-gray-500">From:</span> johndoe@phonify.com
          </div>
        </div>
      </div>
    </div>
    <div class="border-b overflow-y-auto max-h-[calc(100%-80px)] pb-10">
      <div class=" mx-auto px-4 py-8 space-y-5 text-gray-700">
        <h1 class="text-[16px] font-semibold text-gray-900">
          Lorem sapien velit ac lectus faucibus in elit aliquet.
        </h1>

        <div>
          <p class="font-semibold text-sm text-gray-800">
            Augue ornare eget,
          </p>
          <p class="mt-1 text-gray-600 text-sm">
            Augue ornare eget amet pretium nulla volutpat. Non mauris penatibus
            consectetur aliquet tortor sollicitudin arcu ac consectetur. Eget
            ultricies sit convallis dictum nascetur iaculis. Feugiat convallis mi et
            egestas velit tellus feugiat. Enim rhoncus a sit congue diam consectetur
            eu dictum feugiat. Vitae fermentum euismod ut orci sem consequat.
          </p>
        </div>

        <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm">
          <li>Ipsum fames placerat ac varius.</li>
          <li>Et dui tellus cras auctor auctor velit.</li>
          <li>Diam mollis praesent tortor praesent volutpat lacinia massa in.</li>
          <li>Id nunc ultrices morbi sollicitudin.</li>
        </ul>

        <p class="text-sm">
          Aenean morbi sapien turpis in in ut. Enim auctor nisl arcu lectus id gravida
          ipsum nulla pharetra.
        </p>

        <p class="text-sm">
          Ligula odio maecenas sed non. Nulla tortor consectetur lobortis est. Ut id
          viverra adipiscing lacus tellus varius et. Consectetur at tortor est at
          diam varius turpis non et. Neque adipiscing gravida neque magna id.
        </p>

        <p class="text-gray-700 text-sm">
          Risus purus leo,<br>
          <span class="font-semibold">volutpat posuere</span><br>
          <span class="font-semibold">pretium dolor viverra.</span>
        </p>

        <div>
          <div class="flex gap-x-2 overflow-y-auto">
            <div v-for="n in 4" :key="n" class="text-sm font-medium min-w-[200px] border rounded-lg overflow-hidden bg-[#f3faf9]">
              <div class="bg-white mx-4 mt-4 h-[131px]" />
              <div class="flex justify-between p-[16px] bg-white">
                <div>
                  <div class="flex items-center gap-x-2 text-sm">
                    <Icon name="vscode-icons:file-type-pdf2" />
                    New Leads April
                  </div>
                  <div class="text-xs text-gray-500 font-normal">
                    PDF • 2.3MB
                  </div>
                </div>
                <div>
                  <Button variant="ghost" size="icon">
                    <Icon name="lucide:download" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
