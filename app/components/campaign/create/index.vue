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
  group_id: z.number().min(1, 'Caller group is required').max(50),
  time_based_calling: z.boolean(),
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
        message: formState.value.dial_mode === 'predictive_dial' ? 'Call ratio is required when dialing mode is predictive dial' : 'Simultaneous Calls is required when dialing mode is super power dial',
      })
    }
  }),
  duration: z.string().optional().superRefine((val, ctx) => {
    if (formState.value.dial_mode !== 'super_power_dial' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        // message: 'Duration is required when dialing mode is predictive dial',
        message: formState.value.dial_mode === 'predictive_dial' ? 'Duration is required when dialing mode is predictive dial' : 'Time interval is required when dialing mode is super power dial',
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
  // voice_message_amd: z.number().optional().superRefine((val, ctx) => {
  //   // if amd_drop_action is 3 and amd is true then voice_message_amd is required
  //   if (formState.value.amd_drop_action === 3 && !val) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Voice template AMD is required when AMD drop action is Voice template',
  //     })
  //   }
  // }),
  // if no_agent_available_action is 2 and amd is true then no_agent_dropdown_action  is required
  no_agent_dropdown_action: z.number().optional().superRefine((val, ctx) => {
    if ((values.no_agent_available_action === 2 || values.no_agent_available_action === 3) && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: values.no_agent_available_action === 2 ? 'Voice drop option is required when no agent available action is Voice drop option' : 'Inbound IVR is required when no agent available action is Inbound IVR',
      })
    }
  }),
  // if no_agent_available_action is 3 and amd is true then inbound_ivr_no_agent_available_action is required
  // inbound_ivr_no_agent_available_action: z.number().optional().superRefine((val, ctx) => {
  //   if (values.no_agent_available_action === 3 && !val) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Inbound IVR is required when no agent available action is Inbound IVR',
  //     })
  //   }
  // }),

  // if dial_mode is outbound_ai
  redirect_to: z.number().optional().superRefine((val, ctx) => {
    if (values.dial_mode === 'outbound_ai' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Redirect to is required',
      })
    }
  }),

  redirect_to_dropdown: z.number().optional().superRefine((val, ctx) => {
    if ((values.redirect_to === 1 || values.redirect_to === 2 || values.redirect_to === 3 || values.redirect_to === 4 || values.redirect_to === 5) && !val) {
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
    outbound_ai_dropdown_ivr: 0,
    sms: false,
    send_report: false,
    call_transfer: false,
  },
})

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
  // emits('completed')
  // console.log('Form submitted!', values)
})

function startDialing() {
  if (!isRegistered.value) {
    showToast({
      message: 'Webphone is not registered. Please register it first.',
      type: 'warning',
    })
    return
  }

  navigateTo({ path: '/app/start-dialing/lead-details', query: { campaign_id: id } })
}

onMounted(() => {
  if (!isEdit.value) {
    resetForm()
  }
})
</script>

<template>
  <div class=" relative h-[calc(100vh-190px)]">
    <div class=" m-5">
      <form class="space-y-4" @submit="onSubmit">
        <!-- CAMPAIGN DETAILS -->
        <CampaignDetails :is-preview="isPreview" :values :loading @reset-fields="emits('resetData')" />

        <!-- Caller Details -->
        <CampaignCallerDetails :is-preview="isPreview" :values :loading @set-field-value="setFieldValue" @set-field-error="setFieldError" @cancel-edit="emits('resetData')" />

        <!-- Time Based Calling -->
        <CampaignTimeBaseCalling :is-preview="isPreview" :values :loading @cancel-edit="emits('resetData')" />

        <!-- Send Details -->
        <CampaignSendDetails :is-preview="isPreview" :values :loading @cancel-edit="emits('resetData')" />

        <!-- Other Details -->
        <CampaignOtherDetails :is-preview="isPreview" :values :loading @set-field-value="setFieldValue" @cancel-edit="emits('resetData')" @submit="onSubmit()" />

        <!-- Associate List -->
        <CampaignAssociatedList
          v-if="isPreview"
          :values="values"
          :loading="loading"
          @set-field-value="setFieldValue"
          @cancel-edit="emits('resetData')"
        />

      <!-- @page-navigation="changePage" @change-limit="changeLimit" -->
      </form>
    </div>
    <div v-if="isPreview" class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4">
      <Button class="w-full h-[52px]" :disabled="dataLoading || enableEditSection.length" :loading="loading" @click="startDialing">
        <Icon name="material-symbols:call" />
        Start Dialing
      </Button>
    </div>
    <div v-else class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4">
      <Button class="w-full h-[52px]" type="submit" :disabled="dataLoading || enableEditSection.length" :loading="loading" @click="onSubmit">
        Continue
      </Button>
    </div>
  </div>
</template>
