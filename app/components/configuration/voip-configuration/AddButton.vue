<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const dialogOpen = ref(false)

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  url: z.string().min(1, 'URL is required').max(200, 'URL too long'),
  host: z.string().min(1, 'Host is required').max(100, 'Host too long'),
  username: z.string().min(1, 'Username is required').max(100, 'Username too long'),
  password: z.string().min(1, 'Password is required').max(100, 'Password too long'),
  dialPrefix: z.string().optional(),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    url: '',
    host: '',
    username: '',
    password: '',
    dialPrefix: '',
  },
})

const onSubmit = handleSubmit((values) => {
  // Save logic here
  dialogOpen.value = false
})

function handleReset() {
  resetForm()
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <Button @click="dialogOpen = true">
      <Icon class="!text-white" name="lucide:plus" />
      Add VoIP Configuration
    </Button>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add VoIP Configuration</DialogTitle>
      </DialogHeader>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div class="py-4 space-y-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <p class="text-primary">
                Name
              </p>
              <FormControl>
                <Input placeholder="Enter name" v-bind="componentField" />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="url">
            <FormItem>
              <p class="text-primary">
                URL
              </p>
              <FormControl>
                <Input placeholder="Enter URL" v-bind="componentField" />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="host">
            <FormItem>
              <p class="text-primary">
                Host
              </p>
              <FormControl>
                <Input placeholder="Enter host" v-bind="componentField" />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <p class="text-primary">
                Username
              </p>
              <FormControl>
                <Input placeholder="Enter username" v-bind="componentField" />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <p class="text-primary">
                Password
              </p>
              <FormControl>
                <Input type="password" placeholder="Enter password" v-bind="componentField" />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="dialPrefix">
            <FormItem>
              <p class="text-primary">
                Dial Prefix (if any)
              </p>
              <FormControl>
                <Input placeholder="Enter dial prefix" v-bind="componentField" />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <Button
            class="w-[50%]  hover:bg-red-50 h-10"
            variant="outline"
            type="button"
            @click="handleReset"
          >
            <Icon name="material-symbols:autorenew" />
            Reset
          </Button>
          <Button class="w-[50%] h-10" type="submit">
            <Icon name="material-symbols:save" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
