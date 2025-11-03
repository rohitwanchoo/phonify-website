/**
 * Types for the Audio Player module
 */

export type AudioVariant = 'default' | 'compact'

export interface AudioPlayerProps {
  src: string
  id?: string
  variant?: AudioVariant
  downloadable?: boolean
  autoPlay?: boolean
  class?: string
}

export interface AudioPlayerEmits {
  'update:playing': [value: boolean]
  'play': []
  'pause': []
  'ended': []
  'error': [error: Error | string]
}