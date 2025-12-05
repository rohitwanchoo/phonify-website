<script setup lang="ts">
const props = defineProps({
  text: { type: String, required: true },
  voice: { type: String, required: true },
})

// Create speech instance
const synth = window.speechSynthesis

// Play function exposed to parent
function play() {
  if (!props.text?.trim())
    return

  const utter = new SpeechSynthesisUtterance(props.text)

  // Find matching browser voice
  const selected = synth.getVoices().find(v => v.name === props.voice)
  if (selected)
    utter.voice = selected

  synth.cancel()
  synth.speak(utter)
}

defineExpose({ play })
</script>

<template>
  <!-- This slot will contain your Listen button -->
  <slot />
</template>
