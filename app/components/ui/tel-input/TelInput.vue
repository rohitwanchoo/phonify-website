<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
// @ts-expect-error vue-tel-input does not have TypeScript declarations
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

// Type for country change event
interface CountryData {
  name: string
  iso2: string
  dialCode: string
  priority: number
  areaCodes: string[] | null
}

interface PhoneObject {
  valid: boolean
  country: CountryData
  countryCode: string
  nationalNumber: string
  formatInternational: string
  formatNational: string
  uri: string
  e164: string
}

interface Props {
  placeholder?: string
  disabled?: boolean
  defaultCountry?: string
  onlyCountries?: string[]
  readonly?: boolean
  mode?: 'international' | 'national'
  form?: any // Form instance from vee-validate
  fieldName?: string // Field name for validation
  dropdownOffset?: number // Offset for dropdown position in pixels
}

interface Emits {
  validate: [value: boolean]
}

const _props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter phone number',
  disabled: false,
  defaultCountry: 'US',
  mode: 'international',
  onlyCountries: () => [],
  readonly: false,
  fieldName: 'phone',
  dropdownOffset: 0,
})

const emits = defineEmits<Emits>()

// Track if search input is focused
const isSearchInputFocused = ref(false)

// Use defineModel with computed getter/setter to filter alphabetic characters
const modelValue = defineModel<string>({
  default: '',
  get(value: string) {
    // Return the value as-is for display
    return value || ''
  },
  set(value: string) {
    // Don't update model value if search input is focused
    if (isSearchInputFocused.value) {
      return value
    }
    // Filter out alphabetic characters, keep only numbers, spaces, +, -, (, ), and other symbols
    const filteredValue = value.replace(/[a-z]/gi, '')
    return filteredValue
  },
})

// Handle phone validation
function handlePhoneValidation(phoneObj: PhoneObject) {
  emits('validate', phoneObj.valid)
  // If form prop is provided, use setErrors for validation
  if (_props.form && _props.fieldName) {
    if (!phoneObj.valid) {
      _props.form.setErrors({
        last_name: 'Invalid phone number',
        [_props.fieldName]: 'Invalid phone number',
      })
    }
    else if (phoneObj.valid) {
      // Clear the error if phone is valid
      _props.form.setErrors({
        [_props.fieldName]: undefined,
      })
    }
  }

  return phoneObj.valid
}

// Function to handle focus events on search input
function handleSearchInputFocus() {
  isSearchInputFocused.value = true
}

function handleSearchInputBlur() {
  isSearchInputFocused.value = false
}

// Set up event listeners for search input focus/blur
onMounted(() => {
  // Use a slight delay to ensure the DOM is fully rendered
  setTimeout(() => {
    const searchInput = document.querySelector('.vti__search_box')
    if (searchInput) {
      searchInput.addEventListener('focus', handleSearchInputFocus)
      searchInput.addEventListener('blur', handleSearchInputBlur)
    }
  }, 100)
})

onUnmounted(() => {
  const searchInput = document.querySelector('.vti__search_box')
  if (searchInput) {
    searchInput.removeEventListener('focus', handleSearchInputFocus)
    searchInput.removeEventListener('blur', handleSearchInputBlur)
  }
})
</script>

<template>
  <VueTelInput
    v-model="modelValue"
    :mode="mode"
    auto-default-country
    :only-countries="onlyCountries"
    :input-options="{
      id: 'phone-input',
      name: 'phone',
      readonly,
      placeholder,
    }"
    :default-country="defaultCountry"
    :enabled-country-code="true"
    :valid-characters-only="true"
    :dropdown-options="{
      searchPlaceholder: 'Search countries',
      name: 'country',
      showDialCodeInList: true,
      showFlags: true,
      showSearchBox: true,
      readonly,
      disabled: readonly,
    }"
    :readonly="readonly"
    :disabled="disabled"
    :placeholder="placeholder"
    class="tel-input"
    @validate="handlePhoneValidation"
  />
</template>

<style>
  @reference "~/assets/css/tailwind.css";

.vti__search_box {
  border: 0;
  padding-left: 2rem;
  font-size: 16px;
}
.vti__search_box_container {
  position: relative;
}

.vti__search_box_container::before {
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' /%3e%3c/svg%3e");
  position: absolute;
  left: 0.75rem;
  top: 49%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  pointer-events: none;
}
.vue-tel-input .vti__dropdown-item {
  font-size: .875rem;
  font-weight: 300;
}

.vti__dropdown-list{
  border-radius: 8px;
}
.vue-tel-input {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 2.75rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--input);
  border-color: var(--input);
  &:focus-within {
    border-color: var(--ring);
  }
  background-color: var(--background);
  color: var(--foreground);
  transition-property: border-color, box-shadow, background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 100ms;
  --ring-offset-color: var(--background);
}

.vue-tel-input:focus-within {
  --ring-width: 2px;
  --ring-color: color-mix(in srgb, var(--ring) 50%, transparent);
  outline: none;
  box-shadow: 0 0 0 var(--ring-width) var(--ring-color);
}
</style>