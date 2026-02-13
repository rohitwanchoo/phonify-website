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

// Get step status for styling
function getStepStatus(key: string, index: number): 'completed' | 'current' | 'upcoming' {
  if (props.stepper?.steps.value[key].isValid()) return 'completed'
  if (props.stepper?.isCurrent(key)) return 'current'
  return 'upcoming'
}
</script>

<template>
  <div class="block md:grid grid-cols-8 w-full overflow-hidden bg-transparent gap-0">
    <!-- Stepper Sidebar -->
    <div class="col-span-16 md:col-span-2 bg-gradient-to-b from-[#162D3A] to-[#1a3544] rounded-lg md:rounded-xl md:rounded-r-none px-6 py-8">
      <!-- Progress indicator -->
      <div class="hidden md:flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
        <div class="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 rounded-full transition-all duration-500"
            :style="{
              width: `${((Object.keys(stepper?.steps.value || {}).filter((key) => stepper?.steps.value[key].isValid()).length) / Object.keys(stepper?.steps.value || {}).length) * 100}%`,
            }"
          />
        </div>
        <span class="text-xs text-white/60">
          {{ Object.keys(stepper?.steps.value || {}).filter((key) => stepper?.steps.value[key].isValid()).length }}/{{ Object.keys(stepper?.steps.value || {}).length }}
        </span>
      </div>

      <!-- Steps -->
      <div class="relative">
        <!-- Vertical line connector (hidden on mobile) -->
        <div class="absolute left-[15px] top-8 bottom-8 w-0.5 bg-white/10 hidden md:block" />

        <div
          v-for="(step, key, index) in stepper?.steps.value" :key="key"
          class="relative"
          :class="allStepsBeforeAreValid(index) && !stepper?.isBefore(key) ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'"
          @click="allStepsBeforeAreValid(key) && !stepper?.isBefore(key) ? props?.stepper?.goTo(key) : ''"
        >
          <div
            class="md:flex gap-x-4 items-start py-4 transition-all w-full group"
            :class="[
              !props?.stepper?.isCurrent(key) && stepper?.isBefore(key) ? 'hidden md:flex' : 'flex',
              props?.stepper?.isCurrent(key) ? 'md:bg-white/5 md:-mx-3 md:px-3 md:rounded-lg' : '',
            ]"
          >
            <!-- Step indicator -->
            <div class="relative z-10 w-fit min-w-[32px] flex justify-center">
              <!-- Completed -->
              <div
                v-if="getStepStatus(key, index) === 'completed'"
                class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
              >
                <Icon name="lucide:check" class="h-4 w-4 text-white" />
              </div>
              <!-- Current -->
              <div
                v-else-if="getStepStatus(key, index) === 'current'"
                class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
              >
                <span class="text-sm font-semibold text-primary">{{ index + 1 }}</span>
              </div>
              <!-- Upcoming -->
              <div
                v-else
                class="w-8 h-8 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-white/50">{{ index + 1 }}</span>
              </div>
            </div>

            <!-- Step content -->
            <div class="flex-1 min-w-0">
              <h3
                class="text-start font-semibold text-[15px] leading-tight transition-colors"
                :class="[
                  getStepStatus(key, index) === 'completed' ? 'text-green-400' : '',
                  getStepStatus(key, index) === 'current' ? 'text-white' : '',
                  getStepStatus(key, index) === 'upcoming' ? 'text-white/50' : '',
                ]"
              >
                {{ typeof step.title === 'object' && step.title?.value ? step.title.value : step.title }}
              </h3>
              <p
                class="text-start text-[12px] font-normal mt-1 line-clamp-2"
                :class="getStepStatus(key, index) === 'current' ? 'text-white/70' : 'text-white/40'"
              >
                {{ step.description }}
              </p>

              <!-- Status badge -->
              <div v-if="getStepStatus(key, index) === 'completed'" class="mt-2 hidden md:block">
                <span class="inline-flex items-center gap-1 text-[10px] font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                  <Icon name="lucide:check-circle" class="h-3 w-3" />
                  Completed
                </span>
              </div>
              <div v-else-if="getStepStatus(key, index) === 'current'" class="mt-2 hidden md:block">
                <span class="inline-flex items-center gap-1 text-[10px] font-medium text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full">
                  <Icon name="lucide:pencil" class="h-3 w-3" />
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div
      class="col-span-6 grow rounded-r-lg focus:shadow-[0_0_0_2px] focus:shadow-black mt-5 md:mt-0 bg-[#FAFAFA] overflow-y-auto border border-l-0"
    >
      <slot />
    </div>
  </div>
</template>
