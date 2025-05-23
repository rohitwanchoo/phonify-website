<script setup lang="ts">
// Props for the stepper component
const props = defineProps({
  stepper: Object,
})

// Function to check if all previous steps are valid
function allStepsBeforeAreValid(index: number): boolean {
  return !Array.from({ length: index })
    .fill(null)
    .some((_, i) => !props.stepper?.at(i)?.isValid())
}
</script>

<template>
  <div class="block md:grid grid-cols-8 w-full overflow-hidden bg-transparent mt-6">
    <div class="col-span-16 md:col-span-2 bg-primary rounded-lg md:rounded-xl md:rounded-r-none pl-7 py-7 pr-2 ">
      <div
        v-for="(step, key, index) in stepper?.steps.value" :key="key"

        :class="allStepsBeforeAreValid(index) && !stepper?.isBefore(key) ? 'cursor-pointer' : 'cursor-not-allowed'"
        @click="allStepsBeforeAreValid(key) && !stepper?.isBefore(key) ? props?.stepper?.goTo(key) : ''"
      >
        <div class="md:flex gap-x-3 items-start py-3 transition-all w-full text-white text-opacity-50" :class="!props?.stepper?.isCurrent(key) && stepper?.isBefore(key) ? 'hidden md:flex' : 'flex'">
          <div class="w-fit min-w-[30px] flex justify-center mt-0.5">
            <Icon v-if="stepper?.steps.value[key].isValid()" name="ri:checkbox-circle-fill" size="23" class="text-green-600" />
            <span
              v-else
              class="rounded-full !w-[25px] flex items-center justify-center h-[25px] text-[12px] border-[1.5px] border-dotted"
              :class="props?.stepper?.isCurrent(key) ? 'bg-[#16A34A4D] border-[#16A34A]' : ''"
            >
              {{ index + 1 }}
            </span>
          </div>

          <div>
            <h3
              class="text-start font-medium text-[16px] w-full"
              :class="allStepsBeforeAreValid(key) || props?.stepper?.isCurrent(key) ? 'text-white' : ''"
            >
              {{ step.title }}
            </h3>
            <p class="text-start text-gray-300 text-[12px] font-normal mt-1">
              {{ step.description }}
            </p>
          </div>
        </div>
        <icon v-if="index !== Object.keys(stepper?.steps.value).length - 1" name="lucide:chevrons-down" :class="stepper?.steps.value[key].isValid() ? 'text-white' : 'text-[#FFFFFF80]'" class="ml-1 !hidden md:!block " size="20" />
      </div>
    </div>

    <div
      class="col-span-6 grow rounded-r-lg  focus:shadow-[0_0_0_2px] focus:shadow-black mt-5 md:mt-0 bg-[#FAFAFA] overflow-y-auto border"
    >
      <!-- <div class="col-span-6 !rounded-lg bg-red-600"> -->
      <slot />
    </div>
  </div>
</template>
