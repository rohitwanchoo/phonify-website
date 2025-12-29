<script setup lang="ts">
import { computedAsync } from '@vueuse/core'
import { HoverCardArrow } from 'reka-ui'
import { parseFilename } from 'ufo'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { mimeTypes } from '@/constants/files'

const props = defineProps({
  modelValue: {
    type: [File, String, Object, null],
    required: false,
    default: '',
  },
  id: {
    type: String,
    default: 'file-input',
  },
  title: {
    type: String,
  },
  previewLabel: {
    type: String,
    default: ' Selected File',
  },
  maxSize: {
    type: Number,
    default: 3000000,
  },
  maxSizeByType: {
    type: Object,
    default: null,
  },
  icon: {
    type: String,
    default: 'mdi:image-add',
  },
  supportedExtensions: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hidePreview: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue', 'remove', 'select'])

interface Attachment {
  file?: File | string
  preview?: string
  type?: string
  ext?: string
  name?: string
}

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    try {
      const preview = URL.createObjectURL(file)
      const name = file.name
      const type = file.type
      const ext = name.split('.').pop()?.toLowerCase() || ''
      resolve({ file, preview, type, ext, name })
    }
    catch (error) {
      reject(error)
    }
  })
}

function readUrl(url: string) {
  return new Promise((resolve, reject) => {
    try {
      const name = parseFilename(url, { strict: true })
      const file = url
      const preview = url
      const ext = name?.split('.').pop()?.toLowerCase() || ''
      const type = (mimeTypes as Record<string, string>)[ext] || 'application/octet-stream'
      resolve({ name, file, preview, type, ext })
    }
    catch (error) {
      reject(error)
    }
  })
}

// COMPUTED FUNCTIONS

const file = computed({
  get: () => (props.modelValue),
  set: (value: object) => {
    emits('update:modelValue', value)
  },
})

const accept = computed(() => {
  const extensions = props.supportedExtensions.length ? props.supportedExtensions : Object.keys(mimeTypes)
  return extensions.map(ext => (mimeTypes as Record<string, string>)[ext as string])
})

const attachment = computedAsync<Attachment>(
  async () => {
    const val = file.value
    if (val instanceof File) {
      return await readFile(val) as Attachment
    }
    else if (typeof val === 'string' && val.length) {
      return await readUrl(val) as Attachment
    }
    else {
      return {}
    }
  },
  {},
)

// METHODS
function removeAttachment() {
  file.value = null
  emits('remove')
}

function selectAttachment(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files)
    return

  const selectedFile = target.files[0]
  const fileExtension = selectedFile?.name?.split('.').pop()?.toLowerCase() || ''

  if (!accept.value.includes(target.files[0]?.type) && !props.supportedExtensions.includes(fileExtension)) {
    showToast({
      message: 'Please select a supported file type',
      type: 'error',
    })
    file.value = ''
    return
  }

  let maxAllowedSize = props.maxSize

  // Only apply type-based size limits if maxSizeByType is provided
  if (props.maxSizeByType) {
    const fileType = selectedFile?.type?.split('/')[0] // Gets 'image', 'video', 'audio', etc.
    maxAllowedSize = props.maxSizeByType[fileType as keyof typeof props.maxSizeByType] || props.maxSizeByType.default || props.maxSize
  }

  if (selectedFile && selectedFile.size > maxAllowedSize) {
    showToast({
      message: `Please keep your file size under ${formatFileSize(maxAllowedSize)}`,
      type: 'error',
    })
    file.value = ''
    return
  }

  function formatFileSize(bytes: number): string {
    return bytes >= 1000000 ? `${bytes / 1000000}MB` : `${bytes / 1000}KB`
  }
  file.value = selectedFile
  emits('select', selectedFile)
}
</script>

<template>
  <div class="flex">
    <HoverCard :open-delay="50" class="w-full">
      <HoverCardTrigger class="w-full">
        <template v-if="loading">
          <slot name="loading">
            <label
              :for="id"
              class="text-xs text-gray-normal font-400 cursor-pointer"
            >
              {{ attachment?.name || "Loading..." }}
              <Icon name="svg-spinners:270-ring" size="18" class="text-primary mx-2" />
            </label>
          </slot>
        </template>
        <template v-else-if="attachment?.preview">
          <slot name="preview" v-bind="{ attachment, removeAttachment, selectAttachment }">
            <label
              :for="id"
              class="text-xs text-gray-normal font-400 cursor-pointer"
            >
              <span v-if="previewLabel" class="text-nowrap">{{ previewLabel }}</span>
              <button
                type="button" data-cy="remove" class="ml-2 text-red-500 hover:text-red-700"
                @click="removeAttachment"
              >
                Remove
              </button>
            </label>
          </slot>
        </template>

        <template v-else>
          <label :for="id">
            <slot v-bind="{ attachment, removeAttachment, selectAttachment }">
              <div class="relative cursor-pointer px-3 h-8.5 bg-white flex items-center justify-center rounded border border-gray-light text-xs gap-x-2 text-gray-normal">
                <Icon v-if="icon" :name="icon" size="20px" />
                <span v-if="title">{{ title }}</span>
              </div>
            </slot>
          </label>
          <input :id="id" type="file" data-cy="select" class="hidden" :accept="accept.join(',')" @change="selectAttachment">
        </template>
      </HoverCardTrigger>
      <HoverCardContent v-if="attachment?.preview && !hidePreview" side="top" class="w-fit !z-99">
        <BaseFileInputPreview v-bind="attachment" />
        <HoverCardArrow class="fill-primary" :width="14" />
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
