<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Separator } from '@/components/ui/separator'

const showWhitelistDialog = ref(false)

// Dummy server options
const serverOptions = [
  { label: 'US East Server', value: 'us-east' },
  { label: 'US West Server', value: 'us-west' },
  { label: 'Europe Server', value: 'eu' },
  { label: 'Asia Server', value: 'asia' },
]

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    ipAddress: z.string().min(1, 'IP Address is required').ip({ version: 'v4', message: 'Invalid IPv4 address' }),
    server: z.string().min(1, 'Server is required'),
  })
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  // Handle whitelist IP submission here
  console.log('Whitelisting IP:', values)
  showWhitelistDialog.value = false
})

function onCancel() {
  resetForm()
  showWhitelistDialog.value = false
}
</script>

<template>
  <div>
    <Button @click="showWhitelistDialog = true">
      <Icon class="!text-white" name="material-symbols:language" />
      Whitelist IP
    </Button>

    <Dialog v-model:open="showWhitelistDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Whitelist IP</DialogTitle>
        </DialogHeader>
        <Separator />
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="grid gap-4 py-4">
            <!-- IP Address Field -->
            <FormField v-slot="{ componentField }" name="ipAddress">
              <FormItem>
                <FormLabel>IP Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g. 192.168.1.1"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Server Dropdown -->
            <FormField v-slot="{ componentField }" name="server">
              <FormItem>
                <FormLabel>Server</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Enter URL" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      v-for="server in serverOptions"
                      :key="server.value"
                      :value="server.value"
                    >
                      {{ server.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="flex gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              @click="onCancel"
              class="w-[50%]"
            >
            <Icon class="" name="material-symbols:close" />
              Cancel
            </Button>
            <Button type="submit" class="w-[50%]">
                <Icon class="!text-white" name="material-symbols:language" />
              Whitelist IP
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>