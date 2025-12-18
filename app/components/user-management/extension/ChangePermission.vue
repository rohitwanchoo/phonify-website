<script setup lang="ts">
import type { Extension } from '~/types/extension'
import { toTypedSchema } from '@vee-validate/zod'

import { useForm } from 'vee-validate'

import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps<{
  selectedExtension?: Extension
}>()
defineEmits(['save'])

const formSchema = toTypedSchema(z.object({
  role: z.number().min(1, 'Role is required'),
}))

const { data: rolesList, status: rolesListStatus, refresh: rolesListListRefresh } = await useLazyAsyncData('get-assignable-roles', () =>
  useApi().post(`/user/assignable-roles`, {
    userId: props.selectedExtension?.id,
  }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    role: 0,
  },
})

const open = defineModel<boolean>()
const submitLoading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  submitLoading.value = true
  useApi().post(`/user/${props.selectedExtension?.id}/permission`, values).then(() => {
    showToast({
      type: 'success',
      message: 'Permission updated successfully',
    })
    open.value = false
  }).catch((err) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  }).finally(() => {
    submitLoading.value = false
  })
})

const loading = computed(() => {
  return rolesListStatus.value === 'pending'
})

watch(open, async (newValue) => {
  if (newValue) {
    await rolesListListRefresh()
    if (rolesList.value?.length) {
      const defaultValue = rolesList.value.find((role: { assigned: boolean }) => role.assigned)?.roleId
      if (defaultValue)
        setFieldValue('role', defaultValue)
    }
  }
})
</script>

<template>
  <form as="" keep-values>
    <Dialog v-model:open="open">
      <DialogContent class="sm:max-w-[425px] [&>button]:hidden ">
        <DialogHeader class="mb-4">
          <DialogTitle class="text-[16px] font-normal flex justify-between items-center border-b pb-[17.5px]">
            Change Permission
            <DialogClose>
              <Icon name="material-symbols:close" size="20" />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <form id="dialogForm">
          <FormField v-slot="{ componentField }" name="role">
            <FormItem>
              <FormLabel class="font-normal">
                Select New Role
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <Skeleton v-if="loading" class="h-11 w-full" />
                  <SelectTrigger v-else class="w-full !h-11">
                    <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="(item) in rolesList" :key="item.roleId" :value="item.roleId">
                        {{ item.roleName }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter class="mt-4">
          <DialogClose class="w-[49%]">
            <Button type="button" variant="outline" class="w-full h-11">
              <Icon name="material-symbols:close" />
              Close
            </Button>
          </DialogClose>

          <Button :disabled="loading || submitLoading" class="w-[49%] h-11" type="submit" form="dialogForm" @click="onSubmit">
            <Icon :name="submitLoading ? 'eos-icons:loading' : 'material-symbols:save'" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </form>
</template>
