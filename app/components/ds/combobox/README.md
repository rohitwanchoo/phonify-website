### SelectMenu

Lightweight, accessible select/combobox built on the app's Combobox primitives. Supports single/multiple select, search, select-all, custom rendering, disabled items, and flexible return types (id, full object, or partial object). Includes optional server-side search, prefetching, sticky header, and list-only scrolling

#### Basic usage (single, return id)

```vue
<SelectMenu
  v-model="selectedId"
  :options="items"
  value-key="id"
  label-key="name"
  placeholder="Select item"
/>
```

#### Multiple select with disabled items and Select All

```vue
<SelectMenu
  v-model="selectedIds"
  :options="items"
  value-key="id"
  label-key="name"
  :multiple="true"
  :disable-function="(item) => item.disabled === true"
  placeholder="Select items"
>
  <template #item="{ name }">{{ name }}</template>
</SelectMenu>
```

#### Return full object (use by when returning objects)

```vue
<SelectMenu
  v-model="selectedObjects"
  :options="items"
  value-key="id"
  label-key="name"
  return-type="full"
  by="id"
  placeholder="Pick one"
>
  <template #selected="{ selectedItems }">
    <span v-if="selectedItems.length">{{ selectedItems[0].name }}</span>
    <span v-else class="opacity-60">Pick one</span>
  </template>
</SelectMenu>
```

#### Return partial object (subset of keys)

```vue
<SelectMenu
  v-model="selectedPartials"
  :options="items"
  value-key="id"
  label-key="name"
  :return-type="['id','name']"
  by="id"
  :multiple="true"
/>
```

#### Custom selected display and empty state

```vue
<SelectMenu v-model="selectedId" :options="items" value-key="id" label-key="name">
  <template #selected="{ selectedItems, placeholder }">
    <span v-if="selectedItems.length">{{ lookupName(selectedItems[0]) }}</span>
    <span v-else class="opacity-60">{{ placeholder }}</span>
  </template>

  <template #empty="{ search }">
    <div v-if="!search">No data yet</div>
    <div v-else>No matches for "{{ search }}"</div>
  </template>
</SelectMenu>
```

#### Search formatting (e.g., normalize case/strip non-digits)

```vue
<SelectMenu
  v-model="selectedIds"
  :options="items"
  value-key="id"
  label-key="name"
  :format-search="(s) => s.toLowerCase().trim()"
/>
```

#### Exposed methods (via ref)

```vue
<script setup lang="ts">
const selectRef = ref<InstanceType<typeof SelectMenu> | null>(null)
function clearAll() { selectRef.value?.resetSelections?.() }
</script>

<template>
  <SelectMenu ref="selectRef" v-model="selectedIds" :options="items" value-key="id" label-key="name" />
  <UButton @click="clearAll">
    Reset
  </UButton>
</template>
```

---

### Props

- "modelValue" (any[], required via v-model): Selected values; array for both single and multiple modes
- "options" (any[], required): Source items
- "valueKey" (string, default: "id"): Key on option used as primitive value when returning ids
- "labelKey" (string, default: "name"): Key used for display and search
- "disableFunction" ((item) => boolean, default: () => false): Disable logic per item
- "formatSearch" ((search: string) => string, default: identity): Format/normalize the search term
- "placeholder" (string, default: "Select items...")
- "searchPlaceholder" (string, default: "Search items...")
- "returnType" ("valueKey" | "full" | string[], default: "valueKey"):
  - valueKey → returns primitive (e.g., id)
  - full → returns the full object
  - string[] → returns an object with only the listed keys
- "multiple" (boolean, default: false)
- "by" (string, default: ""):
  - Only relevant when returnType returns objects (full or partial)
  - Used as the identity key to compare objects across fetches (e.g., "id")
  - Do not set when returning primitives
- "name" (string, default: "default-select"): Applied to trigger for testing hooks (data-cy)
- "disabled" (boolean, default: false)
- "triggerStyle" (string, optional): Additional classes for the trigger button
- "icon" (string, optional): Nuxt Icon name to render in the trigger
- "asyncSearch" ((query: string) => Promise<any[]> | Promise<{ data: any[] }>, optional): Enable server-side search. When provided, the component uses remote results instead of local filtering
- "searchDebounceMs" (number, default: 300): Debounce window for asyncSearch
- "minSearchChars" (number, default: 0): Minimum characters before firing asyncSearch
- "fetchOnOpen" (boolean, default: true): Fetch once when the menu opens (with current search term)
- "prefetchOnMount" (boolean, default: false): Prefetch once on mount (ignores minSearchChars)
- "prefetchQuery" (string, default: ""): Query string used for prefetch
- "loadingText" (string, default: "Loading...")

### Events

- "update:modelValue" (any[]): Emits the new selection array whenever selection changes

### Slots

- "button" (scoped): Customize the trigger button
  - Props: { selected-items, placeholder }
- "selected" (scoped): Custom render for the selected value(s) inside the default trigger
  - Props: { selectedItems, multiple, labelKey, placeholder }
- "item" (scoped): Custom render for each option in the list
  - Props: Spread of the option object (e.g., { id, name, ... })
- "empty" (scoped): Custom render when no items match the search
  - Props: { search }
- "header-extra" (scoped): Additional header content area (below search and Select All)
  - Props: { search }

### Behavior notes

- Select All appears automatically when multiple=true and there are enabled options
- Search matches on labelKey using the formatted search term (formatSearch)
- Disabled items render with reduced opacity and cannot be selected
- The component reorders options so selected items appear at the top
- When asyncSearch is provided, local filtering is disabled and results are taken from the remote source. The selected values are still matched against the current list via `by` (for objects) or primitive comparison with string coercion (to avoid number/string id mismatches)
- The dropdown header (search + Select All + header-extra) is sticky; only the items scroll
- Inside modals/drawers, the dropdown renders inline (non-portal) so the overlay doesn’t trap focus. In other contexts you can render via portal using the ComboboxList’s `usePortal` prop if needed

### Choosing return types and by

- Returning primitives (ids): use default returnType ("valueKey"); do not set by
- Returning objects (full/partial): set by to a stable key (e.g., "id") for reliable matching

### Common pitfalls

- Do not pass "by" when returning primitives. This can cause incorrect matching/indicators
- There is no "disable-key" prop; use "disableFunction" to disable items
- If your backend returns `{ status, data: [...] }`, you can return either the raw array or the whole object from `asyncSearch`; the component will normalize `(Array.isArray(result) ? result : result.data)`

---

### Server-side search examples

Basic:

```vue
<SelectMenu
  v-model="selectedIds"
  :options="[]"
  value-key="id"
  label-key="name"
  :async-search="searchItems"
  :min-search-chars="1"
  :search-debounce-ms="300"
  fetch-on-open
  placeholder="Search items"
/>
```

With prefetch and custom header action:

```vue
<SelectMenu
  v-model="selectedId"
  :options="[]"
  value-key="id"
  label-key="name"
  :async-search="searchItems"
  prefetch-on-mount
  prefetch-query=""
  fetch-on-open
>
  <template #header-extra="{ search }">
    <Button size="sm" variant="ghost" class="w-full justify-center">
      Create New “{{ search || 'Item' }}”
    </Button>
  </template>
</SelectMenu>
```
