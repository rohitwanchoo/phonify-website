<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const dialogOpen = ref(false)
const loading = ref(false)

function onDialogOpen(val: boolean) {
  if (val)
    resetForm()
}

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'Name is required').max(100),
  url: z.string().min(1, 'URL is required').max(200),
  host: z.string().min(1, 'Host is required').max(100),
  username: z.string().min(1, 'Username is required').max(100),
  secret: z.string().min(1, 'Password is required').max(100),
  prefix: z.string().optional(),
}))

const { handleSubmit, resetForm, setFieldError } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    url: '',
    host: '',
    username: '',
    secret: '',
    prefix: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    const response = await useApi().put('/voip-configuration', values)
    showToast({
      message: response.message || 'Saved successfully',
      type: 'success',
    })
    refreshNuxtData('voip-configurations')
    dialogOpen.value = false
    resetForm()
  }
  catch (error: any) {
    handleFieldErrors(error?.data, setFieldError)
    showToast({
      message: error?._data?.message || 'Failed to save configuration',
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog v-model:open="dialogOpen" @update:open="onDialogOpen">
    <DialogTrigger as-child>
      <Button class="h-11">
        <Icon class="!text-white" name="lucide:plus" size="20px" />
        Add VoIP Configuration
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add VoIP Configuration</DialogTitle>
      </DialogHeader>
      <form class="space-y-4 py-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <p class="text-primary">
              Name
            </p>
            <FormControl><Input placeholder="Enter name" class="h-11" v-bind="componentField" /></FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="url">
          <FormItem>
            <p class="text-primary">
              URL
            </p>
            <FormControl><Input placeholder="Enter URL" class="h-11" v-bind="componentField" /></FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="host">
          <FormItem>
            <p class="text-primary">
              Host
            </p>
            <FormControl><Input placeholder="Enter host" class="h-11" v-bind="componentField" /></FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <p class="text-primary">
              Username
            </p>
            <FormControl><Input placeholder="Enter username" class="h-11" v-bind="componentField" /></FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="secret">
          <FormItem>
            <p class="text-primary">
              Password
            </p>
            <FormControl><Input type="text" placeholder="Enter password" class="h-11" v-bind="componentField" /></FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="prefix">
          <FormItem>
            <p class="text-primary">
              Dial Prefix (if any)
            </p>
            <FormControl><Input placeholder="Enter dial prefix" class="h-11" v-bind="componentField" /></FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <DialogFooter class="pt-4">
          <Button type="button" class="w-full md:w-[50%]" variant="outline" @click="resetForm">
            <Icon name="material-symbols:autorenew" />
            Reset
          </Button>
          <Button type="submit" class="w-full md:w-[50%]" :disabled="loading" :loading="loading">
            <Icon name="material-symbols:save" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
