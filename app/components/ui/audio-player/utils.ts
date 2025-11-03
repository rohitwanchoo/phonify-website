export function formatTime(time: number): string {
  if (!Number.isFinite(time) || time <= 0)
    return '0:00'
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)
  return `${min}:${sec < 10 ? `0${sec}` : sec}`
}

export function createInstanceId(prefix = 'audio-player'): string {
  const rand = Math.random().toString(36).slice(2, 8)
  const time = Date.now().toString(36)
  return `${prefix}-${time}-${rand}`
}

export async function triggerDownload(url: string, fileName = 'audio.mp3') {
  const response = await fetch(url, { mode: 'cors' })
  if (!response.ok)
    throw new Error(`Download failed: ${response.status} ${response.statusText}`)
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  finally {
    URL.revokeObjectURL(objectUrl)
  }
}
