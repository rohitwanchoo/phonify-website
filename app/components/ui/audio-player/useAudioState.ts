import { useState } from '#app'

/**
 * Audio state management for coordinating playback between multiple player instances.
 * Tracks the currently playing audio instance and enables automatic pausing when another starts.
 */
export function useAudioState() {
  const currentId = useState<string | null>('audio-player-current-id', () => null)

  function setCurrent(id: string | null) {
    currentId.value = id
  }

  return {
    currentId,
    setCurrent,
  }
}

/**
 * Provides access to the shared audio state manager
 */
export default useAudioState