import { consola } from 'consola'

const { isDialerOpen: _isDialerOpen, closeDialer: _closeDialer, openDialer: _openDialer } = useDialer()

// Global SIPml5 state using useState
const isRegistered = useState('sipml5.isRegistered', () => false)
const isCallActive = useState('sipml5.isCallActive', () => false)
const callStatus = useState<'idle' | 'connecting' | 'active' | 'incoming' | 'ringing'>('sipml5.callStatus', () => 'idle')
const callDuration = useState('sipml5.callDuration', () => 0)
const isRinging = useState('sipml5.isRinging', () => false)
const isMuted = useState('sipml5.isMuted', () => false)
const callerDetails = useState('sipml5.callerDetails', () => ({
  name: '',
  number: '',
  uri: '',
  displayName: '',
}))

// SIPml5 variables (global)
let sipStack: any = null
let registerSession: any = null
let callSession: any = null
let isInitialized = false
let callStartTime: number | null = null
let durationInterval: NodeJS.Timeout | null = null

// Declare SIPml global type
declare global {
  interface Window {
    SIPml: any
  }
}

export function useSIPml5() {
  const { user } = useAuth()
  const config = useRuntimeConfig()

  // Ensure remote audio element exists
  const ensureAudioElement = () => {
    let remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement

    if (!remoteAudio) {
      consola.info('🔊 Creating remote audio element...')
      remoteAudio = document.createElement('audio')
      remoteAudio.id = 'remoteAudio'
      remoteAudio.autoplay = true
      remoteAudio.controls = false
      remoteAudio.style.display = 'none' // Hidden audio element
      document.body.appendChild(remoteAudio)
      consola.success('✅ Remote audio element created')
    }
    else {
      consola.info('🔊 Remote audio element already exists')
    }

    // Additional debugging for audio element state
    consola.info('🔊 Audio element state:', {
      id: remoteAudio.id,
      autoplay: remoteAudio.autoplay,
      muted: remoteAudio.muted,
      volume: remoteAudio.volume,
      readyState: remoteAudio.readyState,
      paused: remoteAudio.paused,
    })

    return remoteAudio
  }

  // Ensure ringing audio element exists
  const ensureRingingAudioElement = () => {
    let ringingAudio = document.getElementById('ringingAudio') as HTMLAudioElement

    if (!ringingAudio) {
      consola.info('🔔 Creating ringing audio element...')
      ringingAudio = document.createElement('audio')
      ringingAudio.id = 'ringingAudio'
      ringingAudio.loop = true
      ringingAudio.controls = false
      ringingAudio.style.display = 'none'
      ringingAudio.preload = 'auto'

      // Use a simple ringtone MP3 file
      ringingAudio.src = '/audio/ringtone.mp3'

      document.body.appendChild(ringingAudio)
      consola.success('✅ Ringing audio element created')
    }

    return ringingAudio
  }

  // Initialize audio context on user interaction
  const initializeAudioOnUserInteraction = () => {
    const ringingAudio = ensureRingingAudioElement()

    // Try to load and prepare the audio
    ringingAudio.load()

    // Create a silent play to unlock audio context
    const unlockAudio = async () => {
      try {
        ringingAudio.muted = true
        await ringingAudio.play()
        ringingAudio.pause()
        ringingAudio.currentTime = 0
        ringingAudio.muted = false
        consola.success('🔓 Audio context unlocked for ringing')

        // Remove the event listeners after successful unlock
        document.removeEventListener('click', unlockAudio)
        document.removeEventListener('touchstart', unlockAudio)
        document.removeEventListener('keydown', unlockAudio)
      }
      catch (error) {
        consola.warn('⚠️ Could not unlock audio context:', error)
      }
    }

    // Add event listeners for user interaction
    document.addEventListener('click', unlockAudio, { once: true })
    document.addEventListener('touchstart', unlockAudio, { once: true })
    document.addEventListener('keydown', unlockAudio, { once: true })
  }

  // Start ringing audio
  const startRinging = () => {
    if (isRinging.value)
      return // Already ringing

    const ringingAudio = ensureRingingAudioElement()
    isRinging.value = true

    ringingAudio.currentTime = 0

    // Try to play with better error handling for autoplay policy
    const playPromise = ringingAudio.play()

    if (playPromise !== undefined) {
      playPromise.then(() => {
        consola.info('🔔 Ringing audio started')
      }).catch((error) => {
        consola.warn('⚠️ Ringing audio blocked by browser autoplay policy:', error.message)
        consola.info('💡 Ringing will work after user interacts with the page')

        // Try to play again on next user interaction
        const playOnInteraction = async () => {
          try {
            await ringingAudio.play()
            consola.info('🔔 Ringing audio started after user interaction')
            document.removeEventListener('click', playOnInteraction)
            document.removeEventListener('touchstart', playOnInteraction)
            document.removeEventListener('keydown', playOnInteraction)
          }
          catch (retryError) {
            consola.error('❌ Still failed to play ringing audio:', retryError)
          }
        }

        document.addEventListener('click', playOnInteraction, { once: true })
        document.addEventListener('touchstart', playOnInteraction, { once: true })
        document.addEventListener('keydown', playOnInteraction, { once: true })
      })
    }
  }

  // Stop ringing audio
  const stopRinging = () => {
    if (!isRinging.value)
      return // Not ringing

    const ringingAudio = document.getElementById('ringingAudio') as HTMLAudioElement
    if (ringingAudio) {
      ringingAudio.pause()
      ringingAudio.currentTime = 0
      consola.info('🔕 Ringing audio stopped')
    }

    isRinging.value = false
  }

  // Handle call session events
  const onSipEventSession = (e: any) => {
    consola.info('==Session event:', e.type)

    switch (e.type) {
      case 'connecting':
        callStatus.value = 'connecting'
        break
      case 'connected': {
        isCallActive.value = true
        callStatus.value = 'active'

        // Stop ringing audio when call is connected
        stopRinging()

        // Ensure audio element exists and is properly configured
        ensureAudioElement()
        consola.info('🔊 Audio element ready for media stream')

        // Start call duration tracking
        callStartTime = Date.now()
        callDuration.value = 0

        // Update duration every second
        durationInterval = setInterval(() => {
          if (callStartTime) {
            callDuration.value = Math.floor((Date.now() - callStartTime) / 1000)
          }
        }, 1000)

        consola.success('✅ Call connected successfully')
        break
      }
      case 'terminating':
      case 'terminated': {
        isCallActive.value = false
        callStatus.value = 'idle'
        callSession = null

        // Stop ringing audio when call is terminated
        stopRinging()

        // Stop duration tracking
        if (durationInterval) {
          clearInterval(durationInterval)
          durationInterval = null
        }
        callStartTime = null
        callDuration.value = 0

        // Reset mute state when call ends
        isMuted.value = false

        consola.info('📞 Call ended')

        // Clean up the audio element if it exists
        const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement
        if (remoteAudio) {
          remoteAudio.srcObject = null
        }

        // Clear caller details when call ends
        callerDetails.value = {
          name: '',
          number: '',
          uri: '',
          displayName: '',
        }
        break
      }
      case 'i_ao_request':
        if (e.getSipResponseCode() === 180 || e.getSipResponseCode() === 183) {
          callStatus.value = 'ringing'
          consola.info('📞 Remote party is ringing...')
        }
        break
    }
  }

  // Handle SIP stack events
  const onSipEventStack = (e: any) => {
    consola.info('==Stack event:', e.type)

    switch (e.type) {
      case 'started':
        consola.success('✅ SIP Stack started successfully')
        // Create registration session
        registerSession = sipStack.newSession('register', {
          events_listener: {
            events: '*',
            listener: (evt: any) => {
              consola.info('Register event:', evt.type)
              if (evt.type === 'connected') {
                isRegistered.value = true
                isInitialized = true
                consola.success('✅ SIP registration successful - ready to receive calls!')
              }
              else if (evt.type === 'terminated') {
                isRegistered.value = false
                consola.error('⚠️ SIP registration terminated')
              }
            },
          },
        })
        registerSession.register()
        break

      case 'i_new_call': {
        consola.success('🔔 INCOMING CALL DETECTED!')
        callSession = e.newSession

        // Ensure audio element exists before configuring the session
        const remoteAudio = ensureAudioElement()

        callSession.setConfiguration({
          audio_remote: remoteAudio,
          events_listener: { events: '*', listener: onSipEventSession },
        })

        // Extract caller details
        const remoteUri = callSession.getRemoteUri()
        const remoteFriendlyName = callSession.getRemoteFriendlyName()

        // Parse the SIP URI to extract number
        const sipUriMatch = remoteUri?.match(/sip:([^@]+)@/)
        const callerNumber = sipUriMatch ? sipUriMatch[1] : ''

        // Update caller details state
        callerDetails.value = {
          name: remoteFriendlyName || 'Unknown Caller',
          number: callerNumber,
          uri: remoteUri || '',
          displayName: remoteFriendlyName || 'Unknown',
        }

        callStatus.value = 'incoming'

        // Start ringing audio for incoming call
        startRinging()

        consola.info('📞 Incoming call from:', {
          name: callerDetails.value.name,
          number: callerDetails.value.number,
          uri: callerDetails.value.uri,
        })

        // You can add UI notification here
        showToast({
          type: 'info',
          message: `Incoming call from ${callerDetails.value.name || callerDetails.value.number}`,
        })
        // Open dialer when incoming call is detected
        // openDialer()
        break
      }

      case 'failed_to_start':
      case 'failed_to_stop':
        consola.error('❌ SIP Stack failed:', e.type)
        isRegistered.value = false
        isInitialized = false
        showToast({
          type: 'error',
          message: 'SIP initialization failed',
        })
        break
    }
  }

  // Helper: create and start a SIPml5 stack
  const createAndStartStack = (SIPml: any) => {
    consola.info('🔧 Initializing SIPml5 stack...')
    const stackConfig = {
      realm: user.value?.domain,
      impi: user.value?.alt_extension || '',
      impu: `sip:${user.value?.alt_extension}@${user.value?.domain}`,
      password: passwordDecrypt(user.value?.secret || '') || '',
      display_name: user.value?.name || 'Web Client',
      websocket_proxy_url: `wss://${user.value?.domain}:${config.public.asteriskWsPort}/ws`,
      ice_servers: [{ urls: 'stun:stun.l.google.com:19302' }],
      events_listener: { events: '*', listener: onSipEventStack },
    }

    consola.info('🔧 SIPml5 config:', {
      realm: stackConfig.realm,
      impi: stackConfig.impi,
      impu: stackConfig.impu,
      websocket_proxy_url: stackConfig.websocket_proxy_url,
      password: stackConfig.password,
    })

    try {
      sipStack = new SIPml.Stack(stackConfig)
      sipStack.start()
    }
    catch (error) {
      consola.error('❌ Failed to create SIP stack:', error)
      showToast({
        type: 'error',
        message: `SIP initialization failed: ${error}`,
      })
    }
  }

  async function initializeSIP() {
    if (isInitialized) {
      consola.info('SIPml5 already initialized')
      return
    }

    // Initialize audio context for ringing on user interaction
    initializeAudioOnUserInteraction()

    // Wait for SIPml to be available
    if (typeof window === 'undefined' || !window.SIPml) {
      consola.error('SIPml5 library not loaded')
      showToast({
        type: 'error',
        message: 'SIPml5 library not available. Please refresh the page.',
      })
      return
    }

    const SIPml = window.SIPml
    consola.info(SIPml)

    // If SIPml global is already initialized, just create/start a new stack
    const alreadyInit = typeof SIPml.isInitialized === 'function' ? SIPml.isInitialized() : !!SIPml.b_initialized
    if (alreadyInit) {
      consola.info('SIPml5 already initialized globally; creating new SIP stack...')
      createAndStartStack(SIPml)
      return
    }

    // Otherwise, initialize the SIPml library first
    SIPml.init(() => {
      consola.info('🔧 SIPml5 library init callback')
      createAndStartStack(SIPml)
    }, (error: any) => {
      consola.error('❌ SIPml5 initialization failed:', error)
      showToast({
        type: 'error',
        message: 'Failed to initialize SIPml5 library',
      })
    })
  }

  // Start an outbound call
  const startCall = async (target: string) => {
    if (!sipStack) {
      showToast({
        type: 'error',
        message: 'SIP Stack not initialized. Call initializeSIP() first.',
      })
      consola.error('SIP Stack not initialized')
      return
    }

    if (!isRegistered.value) {
      showToast({
        type: 'error',
        message: 'Not registered to SIP server. Please wait for registration.',
      })
      consola.error('Not registered to SIP server')
      return
    }

    try {
      consola.info('📞 Starting outbound call to:', target)

      // Ensure audio element exists before creating the call session
      const remoteAudio = ensureAudioElement()

      callSession = sipStack.newSession('call-audio', {
        audio_remote: remoteAudio,
        events_listener: { events: '*', listener: onSipEventSession },
      })

      const targetUri = `sip:${target}@${user.value?.domain || config.public.asteriskDomain}`

      // Set caller details for outbound call
      callerDetails.value = {
        name: target, // Use target number as name for outbound calls
        number: target,
        uri: targetUri,
        displayName: target,
      }

      callSession.call(targetUri)

      callStatus.value = 'connecting'
      consola.info('📞 Call initiated to:', targetUri, {
        callerDetails: callerDetails.value,
      })
    }
    catch (error) {
      consola.error('❌ Failed to start call:', error)
      callStatus.value = 'idle'
      showToast({
        type: 'error',
        message: 'Failed to start call. Please try again.',
      })
    }
  }

  // End the current call
  const endCall = () => {
    if (callSession) {
      try {
        consola.info('📞 Ending call...')
        callSession.hangup()
      }
      catch (error) {
        consola.error('❌ Error ending call:', error)
      }
      finally {
        callSession = null
        isCallActive.value = false
        callStatus.value = 'idle'

        // Stop duration tracking
        if (durationInterval) {
          clearInterval(durationInterval)
          durationInterval = null
        }
        callStartTime = null
        callDuration.value = 0

        // Reset mute state when call is ended
        isMuted.value = false

        // Clean up the audio element
        const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement
        if (remoteAudio) {
          remoteAudio.srcObject = null
        }
      }
    }
  }

  // Answer incoming call
  const answerCall = () => {
    if (callSession) {
      try {
        consola.info('📞 Answering incoming call...')

        // Stop ringing audio when call is answered
        stopRinging()

        setTimeout(() => {
          callSession.accept()
        }, 500)
      }
      catch (error) {
        consola.error('❌ Error answering call:', error)
        showToast({
          type: 'error',
          message: 'Failed to answer call',
        })
      }
    }
  }

  // Reject incoming call
  const rejectCall = () => {
    if (callSession) {
      try {
        consola.info('📞 Rejecting incoming call...')

        // Stop ringing audio when call is rejected
        stopRinging()

        callSession.reject()
      }
      catch (error) {
        consola.error('❌ Error rejecting call:', error)
      }
      finally {
        callSession = null
        callStatus.value = 'idle'

        // Stop duration tracking if it was started
        if (durationInterval) {
          clearInterval(durationInterval)
          durationInterval = null
        }
        callStartTime = null
        callDuration.value = 0

        // Reset mute state when call is rejected
        isMuted.value = false
      }
    }
  }

  // Cleanup SIP resources
  const cleanup = () => {
    // Stop ringing audio during cleanup
    stopRinging()

    // Stop duration tracking
    if (durationInterval) {
      clearInterval(durationInterval)
      durationInterval = null
    }
    callStartTime = null
    callDuration.value = 0

    // Reset mute state during cleanup
    isMuted.value = false

    if (callSession) {
      try {
        callSession.hangup()
      }
      catch (error) {
        consola.error('Error hanging up during cleanup:', error)
      }
    }

    if (registerSession) {
      try {
        registerSession.unregister()
      }
      catch (error) {
        consola.error('Error unregistering during cleanup:', error)
      }
    }

    if (sipStack) {
      try {
        sipStack.stop()
      }
      catch (error) {
        consola.error('Error stopping stack during cleanup:', error)
      }
    }

    isRegistered.value = false
    isCallActive.value = false
    callStatus.value = 'idle'
    isInitialized = false
    sipStack = null
    registerSession = null
    callSession = null
  }

  // Explicit disconnect function for the webphone
  const disconnectWebphone = () => {
    consola.info('🔌 Disconnecting webphone...')
    try {
      // Perform core cleanup
      cleanup()

      // Clear audio elements
      const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement | null
      if (remoteAudio) {
        try {
          remoteAudio.srcObject = null
        }
        catch {}
      }
      const ringingAudio = document.getElementById('ringingAudio') as HTMLAudioElement | null
      if (ringingAudio) {
        try {
          ringingAudio.pause()
          ringingAudio.currentTime = 0
        }
        catch {}
      }

      showToast({ type: 'success', message: 'Webphone disconnected' })
    }
    catch (error) {
      consola.error('❌ Error disconnecting webphone:', error)
      showToast({ type: 'error', message: 'Failed to disconnect webphone' })
    }
  }

  // Get current SIP status
  const getSIPStatus = () => ({
    isRegistered: isRegistered.value,
    isCallActive: isCallActive.value,
    callStatus: callStatus.value,
    isInitialized,
  })

  // Mute/unmute microphone
  const mute = () => {
    if (callSession) {
      try {
        callSession.mute('audio', true)
        isMuted.value = true
        consola.info('🔇 Microphone muted')
      }
      catch (error) {
        consola.error('❌ Error muting microphone:', error)
      }
    }
  }

  const unmute = () => {
    if (callSession) {
      try {
        callSession.mute('audio', false)
        isMuted.value = false
        consola.info('🔊 Microphone unmuted')
      }
      catch (error) {
        consola.error('❌ Error unmuting microphone:', error)
      }
    }
  }

  const toggleMute = () => {
    if (isMuted.value) {
      unmute()
    }
    else {
      mute()
    }
  }

  // Send DTMF digit during an active call
  const sendDTMF = (digit: string | number) => {
    const d = String(digit)
    if (!/^[0-9*#]$/.test(d)) {
      consola.warn('Invalid DTMF digit:', d)
      showToast({ type: 'warning', message: `Invalid DTMF digit: ${d}` })
      return
    }
    if (!callSession || !isCallActive.value) {
      consola.warn('No active call to send DTMF')
      showToast({ type: 'warning', message: 'No active call to send DTMF' })
      return
    }
    try {
      // SIPml5 API: callSession.dtmf(digit)
      const ret = (callSession as any).dtmf(d)
      consola.info('📟 Sent DTMF:', d, 'ret=', ret)
    }
    catch (error) {
      consola.error('❌ Error sending DTMF:', error)
      showToast({ type: 'error', message: 'Failed to send DTMF' })
    }
  }

  return {
    // State
    isRegistered: readonly(isRegistered),
    isCallActive: readonly(isCallActive),
    callStatus: readonly(callStatus),
    callDuration: readonly(callDuration),
    isRinging: readonly(isRinging),
    isMuted: readonly(isMuted),
    callerDetails: readonly(callerDetails),

    // Methods
    initializeSIP,
    startCall,
    endCall,
    answerCall,
    rejectCall,
    cleanup,
    disconnectWebphone,
    getSIPStatus,
    mute,
    unmute,
    toggleMute,
    sendDTMF,
  }
}
