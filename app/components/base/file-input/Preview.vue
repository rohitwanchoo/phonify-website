<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/ui'

const props = defineProps({
  file: {
    type: [String, File],
    default: '',
  },
  preview: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'image',
  },
  class: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  ext: {
    type: String,
    default: '',
  },
})

function openAttachment() {
  const _file = props.file
  const isPdfOrHtml = (filename: string) => {
    const ext = props.ext?.toLowerCase() || filename?.split('.').pop()?.toLowerCase()
    return ['pdf', 'html'].includes(ext!)
  }

  const triggerDownload = (url: string, filename: string | undefined) => {
    // Create hidden iframe instead of new window
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    // Create download link
    const a = document.createElement('a')
    a.href = url
    a.download = filename ?? ''
    a.target = '_blank'

    // Trigger download
    document.body.appendChild(a)
    a.click()

    // Cleanup after short delay
    setTimeout(() => {
      document.body.removeChild(a)
      document.body.removeChild(iframe)
    }, 1000)
  }

  if (_file instanceof File) {
    if (isPdfOrHtml(_file.name)) {
      window.open(props.preview, '_blank')
    }
    else {
      const url = URL.createObjectURL(_file)
      triggerDownload(url, _file.name)
      URL.revokeObjectURL(url)
    }
  }
  else if (typeof _file === 'string') {
    if (isPdfOrHtml(_file)) {
      window.open(_file, '_blank')
    }
    else {
      triggerDownload(_file, _file.split('/').pop())
    }
  }
}

const fileType = computed(() => {
  const ext = props.ext
  switch (true) {
    case ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'svg'].includes(ext):
      return 'image'
    case ['tiff'].includes(ext):
      return 'browser-unsupported-image'
    case ['mp3', 'wav', 'ogg'].includes(ext):
      return 'audio'
    case ['mp4', 'webm'].includes(ext):
      return 'video'
    case ['avi', 'mpeg', 'mov'].includes(ext):
      return 'browser-unsupported-video'
    case ext === 'pdf':
      return 'pdf'
    case ext === 'txt':
      return 'text'
    case ext === 'html':
      return 'html'
    case ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext):
      return 'office'
    case ext === 'csv':
      return 'csv'
    default:
      return 'unknown'
  }
})
</script>

<template>
  <div :class="cn('w-60', props.class)">
    <template v-if="fileType === 'image'">
      <img :src="preview" class="mx-auto  w-full !object-contain ">
    </template>

    <template v-else-if="fileType === 'video'">
      <video class="-scale-100 rotate-180 mx-auto w-full !object-contain" :src="preview" controls />
    </template>

    <template v-else-if="fileType === 'audio'">
      <audio :src="preview" controls class=" w-full !object-contain  h-10" />
    </template>

    <template v-else>
      <div class="bg-[#FFF] p-2 rounded-1 flex justify-between items-center gap-2  relative  border-1 rounded-lg ">
        <div class="flex gap-x-2 items-center truncate">
          <Icon v-if="fileType === 'browser-unsupported-video'" name="lucide:file-video" class="text-secondary" size="20" />
          <Icon v-else-if="fileType === 'browser-unsupported-image'" name="lucide:file-image" class="text-secondary" size="20" />
          <Icon v-else name="fe:document" class="text-secondary" size="20" />
          <span class="text-[#1F1E1C] text-xs text-start !break-words truncate-left max-w-42">{{ name || 'Download Attachment' }}</span>
        </div>
        <Button variant="secondary" @click="openAttachment">
          <Icon name="fluent:open-16-filled" size="20" />
        </Button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.truncate-left {
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  white-space: nowrap;
}

.truncate-left * {
  direction: ltr;
}
</style>
