<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '~/components/ui/button'

const props = defineProps<Props>()
const emits = defineEmits(['refreshLeadData'])

// Use dialer composable (keeping for future use)
const { openDialer: _openDialer, closeDialer: _closeDialer } = useDialer()
const { user } = useAuth()
const { callStatus } = useSIPml5()

const route = useRoute()

const openDisposition = ref(false)
const dispositions = ref([])
const showHangupConfirm = ref(false)

// Comment field state with auto-save
const comment = ref('')
const commentSaving = ref(false)
const commentSaved = ref(false)
const commentDebounceTimer = ref<NodeJS.Timeout | null>(null)

// Call timer state
const callStartTime = ref<Date | null>(null)
const callDuration = ref('00:00')
const callTimerInterval = ref<NodeJS.Timeout | null>(null)

interface Props {
  leadData: {
    number: string
    lead_id: number
    list_id: number
    data: Record<string, {
      label: string
      value: string
      is_dialing: number
      is_visible: number
      is_editable: number
      alternate_phone: string | null
    }>
    last_disposition?: string
    is_recording?: boolean
  }
  leadDataStatus: string
}

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  // Ctrl+H for hangup
  if (e.ctrlKey && e.key === 'h' && props.leadData?.lead_id && !hangupLoading.value) {
    e.preventDefault()
    showHangupConfirm.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (callTimerInterval.value) {
    clearInterval(callTimerInterval.value)
  }
  if (commentDebounceTimer.value) {
    clearTimeout(commentDebounceTimer.value)
  }
})

// Watch call status for timer
watch(callStatus, (newStatus, oldStatus) => {
  if (newStatus === 'active' && oldStatus !== 'active') {
    // Call started - start timer
    callStartTime.value = new Date()
    callTimerInterval.value = setInterval(() => {
      if (callStartTime.value) {
        const elapsed = Math.floor((Date.now() - callStartTime.value.getTime()) / 1000)
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0')
        const secs = (elapsed % 60).toString().padStart(2, '0')
        callDuration.value = `${mins}:${secs}`
      }
    }, 1000)
  }
  else if (newStatus !== 'active' && oldStatus === 'active') {
    // Call ended - stop timer
    if (callTimerInterval.value) {
      clearInterval(callTimerInterval.value)
      callTimerInterval.value = null
    }
  }
}, { immediate: true })

// Auto-save comment with debounce
watch(comment, (newComment) => {
  if (commentDebounceTimer.value) {
    clearTimeout(commentDebounceTimer.value)
  }

  if (newComment && props.leadData?.lead_id) {
    commentSaved.value = false
    commentDebounceTimer.value = setTimeout(() => {
      saveComment()
    }, 2000) // Auto-save after 2 seconds of inactivity
  }
})

async function saveComment() {
  if (!comment.value || !props.leadData?.lead_id) {
    return
  }

  commentSaving.value = true
  try {
    await useApi().post('/save-lead-comment', {
      lead_id: props.leadData.lead_id,
      comment: comment.value,
    })
    commentSaved.value = true
  }
  catch (error) {
    // Silently fail for auto-save, user can manually retry
    console.error('Failed to save comment:', error)
  }
  finally {
    commentSaving.value = false
  }
}

const hangupLoading = ref(false)

function confirmHangup() {
  showHangupConfirm.value = true
}

async function handleHangup() {
  showHangupConfirm.value = false
  hangupLoading.value = true
  try {
    const hangupResponse = await useApi().post('hang-up', {
      id: user.value?.id,
    })
    showToast({
      message: hangupResponse?.data?.message || 'Call ended successfully',
      type: 'success',
    })
    const disposition = await useApi().post('disposition_by_campaignId', {
      campaign_id: route.query.campaign_id,
    })
    dispositions.value = disposition?.data || []
    openDisposition.value = true
  }
  catch (error: any) {
    const errorMessage = error?.response?.data?.message
      || error?.message
      || 'Failed to end call. Please try again.'
    showToast({
      message: errorMessage,
      type: 'error',
    })
  }
  finally {
    hangupLoading.value = false
  }
}

// Handle disposition dialog close
function handleDispositionClose() {
  openDisposition.value = false
}

// Handle redial functionality
function handleRedial() {
  openDisposition.value = false
}

function onSaveDisposition() {
  openDisposition.value = false
  emits('refreshLeadData')
}
</script>

<template>
  <div class="relative h-full">
    <!-- Empty State when no lead is loaded -->
    <div v-if="!leadData?.lead_id && leadDataStatus !== 'pending'" class="p-5 bg-gray-50 rounded-tr-lg h-full flex items-center justify-center">
      <div class="text-center max-w-md">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="material-symbols:person-search" size="32" class="text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Lead Selected</h3>
        <p class="text-sm text-gray-500 mb-4">
          Select a campaign from the dropdown above and click "Start Dialing" to begin calling leads.
        </p>
        <div class="text-xs text-gray-400">
          <p>Tip: Use <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Ctrl+H</kbd> to quickly hang up during a call</p>
        </div>
      </div>
    </div>

    <div v-if="leadData?.lead_id" class="p-5 bg-gray-50 rounded-tr-lg">
      <!-- Show loading skeleton while data is being fetched -->
      <div v-if="leadDataStatus === 'pending'" class="bg-gray-50 rounded-lg">
        <div class="border border-gray-100 rounded-lg">
          <div class="bg-white p-5">
            <div class="animate-pulse grid grid-cols-3 gap-x-4 gap-y-4">
              <div v-for="n in 9" :key="n" class="space-y-2">
                <div class="h-3 bg-gray-200 rounded w-16" />
                <div class="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 border border-gray-100 rounded-lg bg-white p-5">
          <div class="animate-pulse space-y-3">
            <div class="h-4 bg-gray-200 rounded w-20" />
            <div class="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <!-- Show actual data when loaded -->
      <div v-else>
        <!-- Call Status Bar -->
        <div v-if="callStatus === 'active'" class="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span class="text-sm font-medium text-green-700">Call Active</span>
            </div>
            <span class="text-sm font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">{{ callDuration }}</span>
          </div>
          <div v-if="leadData?.is_recording" class="flex items-center gap-1 text-red-600">
            <Icon name="material-symbols:fiber-manual-record" size="16" class="animate-pulse" />
            <span class="text-xs font-medium">Recording</span>
          </div>
        </div>

        <!-- Last Disposition Badge -->
        <div v-if="leadData?.last_disposition" class="mb-3">
          <span class="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            <Icon name="material-symbols:history" size="14" />
            Last outcome: {{ leadData.last_disposition }}
          </span>
        </div>

        <div class="border border-gray-100 rounded-lg">
          <div class="bg-white p-5 grid grid-cols-3 gap-x-4 gap-y-3 rounded-lg">
            <div v-for="(item, index) in leadData?.data" :key="index" class="flex flex-col gap-2">
              <span class="text-gray-500 text-xs">{{ item.label }}</span>
              <div class="flex items-center gap-2">
                <span class="text-sm text-primary">
                  {{ item.is_dialing === 1 ? formatNumber(item.value) : item.value }}
                </span>
                <button
                  v-if="item.is_dialing === 1"
                  type="button"
                  aria-label="Copy phone number to clipboard"
                  class="p-0.5 rounded hover:bg-gray-100 transition-colors"
                  @click="copyToClipboard(item.value, item.label)"
                >
                  <Icon
                    name="material-symbols:content-copy-outline"
                    size="16"
                    class="cursor-pointer text-gray-500 hover:text-green-800"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Comment Section with Auto-save -->
        <div class="mt-3 bg-white p-5 border border-gray-100 rounded-lg">
          <div class="flex items-center justify-between mb-3">
            <p class="text-base text-primary font-medium">Comment</p>
            <div class="flex items-center gap-2 text-xs">
              <span v-if="commentSaving" class="text-gray-400 flex items-center gap-1">
                <Icon name="eos-icons:loading" size="14" class="animate-spin" />
                Saving...
              </span>
              <span v-else-if="commentSaved" class="text-green-600 flex items-center gap-1">
                <Icon name="material-symbols:check-circle" size="14" />
                Saved
              </span>
            </div>
          </div>
          <textarea
            v-model="comment"
            class="w-full min-h-[178px] text-primary text-sm leading-[150%] p-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="Enter your comment here... (auto-saves after 2 seconds)"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="leadData?.lead_id" class="sticky bottom-0 p-5 flex gap-4 justify-between bg-white shadow-md overflow-x-auto">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <span class="flex-1">
              <Button disabled variant="outline" name="voice-drop" class="w-full cursor-not-allowed" aria-label="Voice Drop - Coming Soon">
                <Icon name="material-symbols:mic" size="20" />
                Voice Drop
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice Drop feature coming soon</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <span class="flex-1">
              <Button disabled variant="outline" name="dial-pad" class="w-full cursor-not-allowed" aria-label="Dial Pad - Coming Soon">
                <Icon name="material-symbols:dialpad" size="20" />
                Dial-pad
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dial-pad feature coming soon</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- Hangup Button with Confirmation -->
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              :loading="hangupLoading"
              variant="destructive"
              name="hangup"
              class="flex-1"
              :disabled="!leadData?.lead_id"
              aria-label="End call (Ctrl+H)"
              @click="confirmHangup"
            >
              <Icon name="material-symbols:call-end" size="20" />
              Hangup
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>End current call (Ctrl+H)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- Hangup Confirmation Dialog -->
    <AlertDialog v-model:open="showHangupConfirm">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Call?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to end the current call? You will be prompted to select a disposition.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction class="bg-red-600 hover:bg-red-700" @click="handleHangup">
            End Call
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Disposition Dialog - Always present, controlled by openDisposition -->
    <StartDialingLeadDetailsSelectDisposition
      :is-open="openDisposition"
      :dispositions="dispositions"
      :lead-id="Number(leadData?.lead_id)"
      :list-id="Number(leadData?.list_id)"
      @save="onSaveDisposition"
      @close="handleDispositionClose"
      @redial="handleRedial"
    />
  </div>
</template>
