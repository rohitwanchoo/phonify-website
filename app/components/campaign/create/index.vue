<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'

import { Button } from '~/components/ui/button'

const props = defineProps<Props>()

const emits = defineEmits([
  'completed',
  'resetData',
])

const { formState, enableEditSection } = useCreateCampaign()
const { isRegistered } = useSIPml5()

interface Props {
  dataLoading: boolean
  isPreview: boolean
}

const route = useRoute()
const id = route.query.id
const callSchedule = ref({})

const isEdit = computed(() => !!id)

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Name is required').max(50),
  country_code: z.number().min(1, 'Country code is required'),
  description: z.string().min(1, 'Descriptions is required').max(255),
  caller_id: z.string().min(1, 'Caller ID is required'),
  custom_caller_id: z.string().max(50).optional().superRefine((val, ctx) => {
    if (formState.value.caller_id === '1' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom Caller Is is required when Caller Is is Custom',
      })
    }
  }),
  dial_mode: z.string().min(1, 'Dialing mode is required'),
  group_id: z.number().optional().superRefine((val, ctx) => {
    // group_id is required when dial_mode is NOT 'outbound_ai'
    if (formState.value.dial_mode !== 'outbound_ai' && (!val || val < 1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Caller group is required',
      })
    }
  }),
  time_based_calling: z.boolean().optional(),
  // call_time: z.object({ id: z.number().optional(), title: z.string().optional() }).optional().superRefine((val, ctx) => {
  //   if (values.time_based_calling && !val) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Call time is required',
  //     })
  //   }
  // }),
  call_schedule_id: z.number().optional().superRefine((val, ctx) => {
    if (formState.value.time_based_calling && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Call schedule is required',
      })
    }
  }),
  email: z.number().min(0, 'Email is required'),
  sms: z.boolean(),
  send_report: z.boolean(),
  call_transfer: z.boolean(),
  disposition_id: z.array(z.number()).min(1, 'Disposition is required'),
  hopper_mode: z.number().min(0, 'Hopper Mode is required'),
  voip_configuration_id: z.number().min(1, 'Outbound Line is required'),

  // if dial_mode is predictive_dial
  call_ratio: z.string().optional().superRefine((val, ctx) => {
    if (formState.value.dial_mode !== 'super_power_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        // message: 'Call ratio is required when dialing mode is predictive dial',
        message: formState.value.dial_mode === 'predictive_dial' ? 'Call ratio is required when dialing mode is predictive dial' : 'Simultaneous Calls is required when dialing mode is outbound AI',
      })
    }
  }),
  duration: z.string().optional().superRefine((val, ctx) => {
    if (formState.value.dial_mode !== 'super_power_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        // message: 'Duration is required when dialing mode is predictive dial',
        message: formState.value.dial_mode === 'predictive_dial' ? 'Duration is required when dialing mode is predictive dial' : 'Time interval is required when dialing mode is outbound AI',
      })
    }
  }),
  automated_duration: z.boolean().optional(),
  no_agent_available_action: z.number().optional().superRefine((val, ctx) => {
    if (formState.value.dial_mode === 'predictive_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No agent available action is required when dialing mode is predictive dial',
      })
    }
  }),
  amd: z.boolean().optional(),
  amd_drop_action: z.number().optional().superRefine((val, ctx) => {
    if (formState.value.amd && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'AMD drop action is required when AMD is ON',
      })
    }
  }),
  voicedrop_option_user_id: z.number().optional().superRefine((val, ctx) => {
    // if amd_drop_action is 2 and amd is true then voicedrop_option_user_id is required
    if ((formState.value.amd_drop_action === 2 || formState.value.amd_drop_action === 3) && !val && formState.value.amd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: formState.value.amd_drop_action === 2 ? 'Audio message AMD is required when AMD drop action is Audio Message' : 'Voice template AMD is required when AMD drop action is Voice template',
      })
    }
  }),

  // if no_agent_available_action is 2 and amd is true then no_agent_dropdown_action  is required
  no_agent_dropdown_action: z.number().optional().superRefine((val, ctx) => {
    if ((formState.value.no_agent_available_action === 2 || formState.value.no_agent_available_action === 3) && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: formState.value.no_agent_available_action === 2 ? 'Voice drop option is required when no agent available action is Voice drop option' : 'Inbound IVR is required when no agent available action is Inbound IVR',
      })
    }
  }),

  // if dial_mode is outbound_ai
  redirect_to: z.number().optional().superRefine((val, ctx) => {
    if (formState.value.dial_mode === 'outbound_ai' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Redirect to is required',
      })
    }
  }),

  redirect_to_dropdown: z.number().optional().superRefine((val, ctx) => {
    if ((formState.value.redirect_to === 1 || formState.value.redirect_to === 2 || formState.value.redirect_to === 3 || formState.value.redirect_to === 4 || formState.value.redirect_to === 5) && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required',
        // message: values.redirect_to === 1 ? 'Audio message is required' : values.redirect_to === 2 ? 'Voice template is required' : 'Extension is required',
      })
    }
  }),

  // outbound_ai_dropdown_voice_message: z.number().optional().superRefine((val, ctx) => {
  //   if (values.redirect_to === 2 && !val) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Voice template is required',
  //     })
  //   }
  // }),

  // outbound_ai_dropdown_extension: z.number().optional().superRefine((val, ctx) => {
  //   if (values.redirect_to === 3 && !val) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Extension is required',
  //     })
  //   }
  // }),

  // outbound_ai_dropdown_ring_group: z.number().optional().superRefine((val, ctx) => {
  //   if (values.redirect_to === 4 && !val) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Ring group is required',
  //     })
  //   }
  // }),

  // outbound_ai_dropdown_ivr: z.number().optional().superRefine((val, ctx) => {
  //   if (values.redirect_to === 5 && !val) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'IVR is required',
  //     })
  //   }
  // }),

}))

const { handleSubmit, values, setFieldValue, resetForm, setFieldError, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    country_code: 0,
    description: '',
    caller_id: '',
    dial_mode: '',
    group_id: 0,
    voip_configuration_id: 0,
    disposition_id: [],
    call_schedule_id: 0,
    // call_time: {},
    time_based_calling: false,
    // inbound_ivr_no_agent_available_action: 0,
    no_agent_dropdown_action: 0,
    no_agent_available_action: 0,
    sms: false,
    send_report: false,
    call_transfer: false,
  },
})

const hasErrors = computed(() => Object.keys(errors.value).length > 0)
const errorCount = computed(() => Object.keys(errors.value).length)

function scrollToFirstError() {
  nextTick(() => {
    const errorElement = document.querySelector('.text-red-600, [class*="border-red"]')
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  const payload = {
    campaign_id: id,
    ...values,
    amd: formState.value?.amd ? '1' : ' 0',
    sms: formState.value?.sms ? 1 : 0,
    send_report: formState.value?.send_report ? 1 : 0,
    call_transfer: formState.value?.call_transfer ? '1' : '0',
    automated_duration: formState.value?.automated_duration ? '1' : '0',
    time_based_calling: formState.value?.time_based_calling ? 1 : 0,
    status: formState.value.status,
    call_time_start: undefined as string | undefined,
    call_time_end: undefined as string | undefined,
  }
  if (!formState.value.time_based_calling) {
    payload.call_time_start = '00:00'
    payload.call_time_end = '23:59'
  }
  // console.log(payload)
  // delete payload.call_time

  // remove undefined keys from payload
  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined),
  )
  let Api = '/add-campaign'
  if (isEdit.value) {
    Api = '/edit-campaign'
  }

  useApi().post(Api, cleanedPayload).then(async (response: any) => {
    showToast({
      message: response?.message,
    })
    if (isEdit.value) {
      enableEditSection.value = ''
      emits('completed')
      return
    }

    await navigateTo({ query: { id: response.data.id } })
    emits('completed')
  }).catch((err: any) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  }).finally(() => {
    loading.value = false
  })
}, (errors) => {
  // Handle validation errors
  const errorCount = Object.keys(errors).length
  showToast({
    type: 'error',
    message: `Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before continuing`,
  })
  scrollToFirstError()
})

function checkTimeRange() {
  // If time based calling is disabled, we don't enforce schedule
  if (!formState.value.time_based_calling)
    return { valid: true }

  const schedule = callSchedule.value as any
  if (!schedule || !schedule.week_plan)
    return { valid: false, message: 'No call schedule found' }

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const now = new Date()
  const currentDay = days[now.getDay()]

  if (!currentDay)
    return { valid: false, message: 'Invalid day' }

  const dayPlan = schedule.week_plan[currentDay] || schedule.week_plan.default

  if (!dayPlan || !dayPlan.start || !dayPlan.end)
    return { valid: false, message: `No schedule configured for ${currentDay}` }

  const [startH, startM] = dayPlan.start.split(':').map(Number)
  const [endH, endM] = dayPlan.end.split(':').map(Number)

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  let isValid = false
  if (startMinutes <= endMinutes) {
    isValid = currentMinutes >= startMinutes && currentMinutes <= endMinutes
  }
  else {
    // Overnight schedule
    isValid = currentMinutes >= startMinutes || currentMinutes <= endMinutes
  }

  if (!isValid) {
    return {
      valid: false,
      message: `Current time (${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}) is outside the allowed schedule (${dayPlan.start} - ${dayPlan.end})`,
    }
  }

  return { valid: true }
}

function startDialing() {
  if (!formState.value.status) {
    showToast({
      message: 'Campaign is not active. Please activate.',
      type: 'error',
    })
    return
  }
  if (!isRegistered.value) {
    showToast({
      message: 'Webphone is not registered. Please register it first.',
      type: 'warning',
    })
    return
  }

  const timeCheck = checkTimeRange()
  if (!timeCheck.valid) {
    showToast({
      message: timeCheck.message || 'Current time is outside the allowed schedule.',
      type: 'error',
    })
    return
  }

  navigateTo({ path: '/app/start-dialing', query: { tab: 'lead-details', campaign_id: id } })
}

onMounted(() => {
  if (!isEdit.value) {
    resetForm()
  }
})

// Watch formState.title - when it has a value in edit mode, sync with vee-validate
watch(() => formState.value?.title, (newTitle) => {
  if (isEdit.value && newTitle && newTitle !== values.title) {
    const state = formState.value
    resetForm({
      values: {
        title: state.title || '',
        country_code: state.country_code || 0,
        description: state.description || '',
        caller_id: state.caller_id || '',
        custom_caller_id: state.custom_caller_id || '',
        dial_mode: state.dial_mode || '',
        group_id: state.group_id || 0,
        voip_configuration_id: state.voip_configuration_id || 0,
        disposition_id: state.disposition_id || [],
        call_schedule_id: state.call_schedule_id || 0,
        time_based_calling: state.time_based_calling || false,
        no_agent_dropdown_action: state.no_agent_dropdown_action || 0,
        no_agent_available_action: state.no_agent_available_action || 0,
        sms: state.sms || false,
        send_report: state.send_report || false,
        call_transfer: state.call_transfer || false,
        email: state.email || 0,
        hopper_mode: state.hopper_mode || 0,
        call_ratio: String(state.call_ratio || ''),
        duration: state.duration ? String(state.duration) : '',
        automated_duration: state.automated_duration || false,
        amd: state.amd || false,
        amd_drop_action: state.amd_drop_action || 0,
        voicedrop_option_user_id: state.voicedrop_option_user_id || 0,
        redirect_to: state.redirect_to || 0,
        redirect_to_dropdown: state.redirect_to_dropdown || 0,
      },
    })
  }
}, { immediate: true })

function saveCampaign() {
  showToast({
    message: 'Campaign saved successfully',
  })
  navigateTo({ path: '/app/campaign' })
}
</script>

<template>
  <div class="relative h-[calc(100vh-190px)]">
    <!-- Loading State for Edit Mode -->
    <div v-if="dataLoading && isEdit" class="m-5 space-y-4">
      <div class="border rounded-lg bg-white p-6">
        <div class="flex items-center gap-3 mb-4">
          <BaseSkelton class="h-6 w-6 rounded" />
          <BaseSkelton class="h-6 w-40" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <BaseSkelton class="h-11 w-full" />
          <BaseSkelton class="h-11 w-full" />
        </div>
        <BaseSkelton class="h-20 w-full mt-4" />
      </div>
      <div class="border rounded-lg bg-white p-6">
        <div class="flex items-center gap-3 mb-4">
          <BaseSkelton class="h-6 w-6 rounded" />
          <BaseSkelton class="h-6 w-32" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <BaseSkelton class="h-11 w-full" />
          <BaseSkelton class="h-11 w-full" />
          <BaseSkelton class="h-11 w-full" />
          <BaseSkelton class="h-11 w-full" />
        </div>
      </div>
      <div class="border rounded-lg bg-white p-6">
        <div class="flex items-center gap-3 mb-4">
          <BaseSkelton class="h-6 w-6 rounded" />
          <BaseSkelton class="h-6 w-36" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <BaseSkelton class="h-11 w-full" />
          <BaseSkelton class="h-11 w-full" />
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div v-else class="m-5">
      <!-- Validation Error Banner -->
      <div v-if="hasErrors" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start gap-3">
          <div class="p-1.5 bg-red-100 rounded-full mt-0.5">
            <Icon name="lucide:alert-circle" class="h-4 w-4 text-red-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800">
              {{ errorCount }} field{{ errorCount > 1 ? 's' : '' }} require{{ errorCount === 1 ? 's' : '' }} attention
            </p>
            <p class="text-xs text-red-600 mt-0.5">
              Please review and correct the highlighted fields below
            </p>
          </div>
          <button type="button" class="text-red-500 hover:text-red-700" @click="scrollToFirstError">
            <Icon name="lucide:arrow-down" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <form class="space-y-4" @submit="onSubmit">
        <!-- CAMPAIGN DETAILS -->
        <CampaignDetails :is-preview="isPreview" :values :loading @reset-fields="emits('resetData')" />

        <!-- Caller Details -->
        <CampaignCallerDetails :is-preview="isPreview" :values :loading @set-field-value="setFieldValue" @set-field-error="setFieldError" @cancel-edit="emits('resetData')" />

        <!-- Time Based Calling -->
        <CampaignTimeBaseCalling :is-preview="isPreview" :values :loading @cancel-edit="emits('resetData')" @get-call-schedule="(val: any) => callSchedule = val" />

        <!-- Send Details -->
        <CampaignSendDetails :is-preview="isPreview" :values :loading @cancel-edit="emits('resetData')" />

        <!-- Other Details -->
        <CampaignOtherDetails :is-preview="isPreview" :values :loading @set-field-value="setFieldValue" @cancel-edit="emits('resetData')" />

        <!-- Associate List -->
        <CampaignAssociatedList
          v-if="isPreview"
          :values="values"
          :loading="loading"
          @set-field-value="setFieldValue"
          @cancel-edit="emits('resetData')"
        />
      </form>
    </div>

    <!-- Footer Actions -->
    <div v-if="isPreview && !dataLoading" class="sticky bottom-0 right-0 w-full flex gap-x-3 bg-white shadow-2xl p-4 border-t">
      <Button :disabled="dataLoading || enableEditSection.length > 0" class="w-1/2 h-[52px]" variant="outline" @click="saveCampaign">
        <Icon name="lucide:save" class="mr-2 h-4 w-4" />
        Save Campaign
      </Button>
      <Button class="w-1/2 h-[52px]" :disabled="dataLoading || enableEditSection.length > 0 || !formState.status" :loading="loading" @click="startDialing">
        <Icon name="material-symbols:call" class="mr-2 h-4 w-4" />
        Start Dialing
      </Button>
    </div>
    <div v-else-if="!dataLoading" class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4 border-t">
      <Button class="w-full h-[52px]" type="submit" :disabled="dataLoading || enableEditSection.length > 0" :loading="loading" @click="onSubmit">
        <Icon name="lucide:arrow-right" class="mr-2 h-4 w-4" />
        {{ isEdit ? 'Save & Continue' : 'Continue' }}
      </Button>
    </div>
  </div>
</template>
