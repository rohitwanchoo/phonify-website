import type { Invitation } from 'sip.js'
import { Inviter, SessionState, URI, UserAgent } from 'sip.js'

// Global SIP state using useState
const isRegistered = useState('sip.isRegistered', () => false)
const isCallActive = useState('sip.isCallActive', () => false)
const callStatus = useState<'idle' | 'connecting' | 'active' | 'incoming' | 'ringing'>('sip.callStatus', () => 'idle')

// SIP variables (global)
let ua: any
let registerer: any
let activeSession: any
let isInitialized = false

// Setup media for the session (global function)
function setupMedia(session: any) {
  try {
    console.error('Setting up media for session...')
    const handler = session.sessionDescriptionHandler

    if (!handler) {
      console.error('No session description handler found')
      return
    }

    // Add ICE connection state monitoring
    handler.peerConnection.oniceconnectionstatechange = () => {
      console.error('ICE connection state:', handler.peerConnection.iceConnectionState)
    }

    handler.peerConnection.onicegatheringstatechange = () => {
      console.error('ICE gathering state:', handler.peerConnection.iceGatheringState)
    }

    handler.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        console.error('ICE candidate:', event.candidate.candidate)
      }
      else {
        console.error('ICE gathering completed')
      }
    }

    handler.peerConnection.ontrack = (event: RTCTrackEvent) => {
      console.error('Received remote track, setting up audio...')

      // Try to find existing audio element or create a new one
      let remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement

      if (!remoteAudio) {
        console.error('Remote audio element not found, creating new one...')
        remoteAudio = document.createElement('audio')
        remoteAudio.id = 'remoteAudio'
        remoteAudio.autoplay = true
        remoteAudio.controls = false
        remoteAudio.style.display = 'none' // Hidden audio element
        document.body.appendChild(remoteAudio)
        console.error('Created new remote audio element')
      }

      if (event.streams[0]) {
        remoteAudio.srcObject = event.streams[0]
        console.error('Remote audio stream connected successfully')

        // Ensure audio plays
        remoteAudio.play().catch((error) => {
          console.error('Error playing remote audio:', error)
        })
      }
      else {
        console.error('No remote stream available')
      }
    }

    console.error('Media setup completed')
  }
  catch (error) {
    console.error('Error setting up media:', error)
  }
}

export function useSIP() {
  const { user } = useAuth()
  const config = useRuntimeConfig()
  const { $createSIPUA } = useNuxtApp()

  // Initialize SIP User Agent (only once)
  const initializeSIP = () => {
    if (isInitialized) {
      console.error('SIP already initialized')
      return
    }
    // const { userAgent, registerer: reg } = $createSIPUA({
    //   uri: user.value?.id === 918
    //     ? `sip:33976@${config.public.asteriskDomain}`
    //     : `sip:36271@${config.public.asteriskDomain}`,
    //   username: user.value?.id === 918 ? '33976' : '36271',
    //   password: user.value?.id === 918 ? 'test123' : 'hello_test',
    //   wsServer: `wss://${config.public.asteriskDomain}:${config.public.asteriskWsPort}/ws`,
    // })

    const agentData = {
      uri: `sip:${user.value?.alt_extension}@${config.public.asteriskDomain}`,
      username: user.value?.alt_extension || '',
      password: passwordDecrypt(user.value?.secret || '') || '',
      wsServer: `wss://${config.public.asteriskDomain}:${config.public.asteriskWsPort}/ws`,
    }
    console.log(agentData)

    const { userAgent, registerer: reg } = $createSIPUA(agentData)

    ua = userAgent
    registerer = reg

    // Handle incoming calls
    ua.delegate = {
      onInvite: async (invitation: Invitation) => {
        try {
          console.error('Incoming call from:', invitation.remoteIdentity?.uri?.user || 'unknown')
          console.error('Call invitation received, setting up call...')

          activeSession = invitation
          callStatus.value = 'incoming'

          // Add state change listener for better debugging
          invitation.stateChange.addListener((state) => {
            console.error('Invitation state changed to:', state)
          })

          console.error('Accepting invitation...')
          // await invitation.accept({
          //   sessionDescriptionHandlerOptions: {
          //     constraints: { audio: true, video: false },
          //   },
          // })

          // console.error('Invitation accepted, setting up media...')
          // setupMedia(invitation)

          // isCallActive.value = true
          // callStatus.value = 'active'
          // console.error('Incoming call setup completed successfully')
        }
        catch (error) {
          console.error('Error handling incoming call:', error)
          callStatus.value = 'idle'
          isCallActive.value = false
          if (activeSession) {
            try {
              activeSession.reject()
            }
            catch (rejectError) {
              console.error('Error rejecting invitation:', rejectError)
            }
            activeSession = null
          }
        }
      },
    }

    // UA state changes (helpful)
    ua.stateChange.addListener((newState: any) => {
      console.error('UA state changed:', newState)
    })

    ua.start().then(() => {
      registerer.register().then(() => {
        isRegistered.value = true
        isInitialized = true
        console.error('SIP registration successful')
      }).catch((error: any) => {
        console.error('SIP registration failed:', error)
        isRegistered.value = false
        isInitialized = false
      })
    }).catch((error: any) => {
      console.error('SIP UA start failed:', error)
    })
  }

  // Start an outbound call (local function)
  const startLocalCall = async (target: string) => {
    return await startCall(target)
  }

  // End the current call (local function)
  const endLocalCall = () => {
    return endCall()
  }

  // Cleanup SIP resources
  const cleanup = () => {
    if (activeSession) {
      activeSession.bye()
    }
    if (ua) {
      ua.stop()
    }
    isRegistered.value = false
    isCallActive.value = false
    callStatus.value = 'idle'
    isInitialized = false
  }

  // Get current SIP status
  const getSIPStatus = () => ({
    isRegistered: isRegistered.value,
    isCallActive: isCallActive.value,
    callStatus: callStatus.value,
    isInitialized,
  })

  return {
    // State
    isRegistered: readonly(isRegistered),
    isCallActive: readonly(isCallActive),
    callStatus: readonly(callStatus),

    // Methods
    initializeSIP,
    startCall: startLocalCall,
    endCall: endLocalCall,
    cleanup,
    getSIPStatus,
  }
}

// Start an outbound call
// Ringback tone functionality
interface RingbackTone {
  stop: () => void
}

let ringbackTone: RingbackTone | null = null

function playRingbackTone() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const gainNode = audioContext.createGain()

    gainNode.connect(audioContext.destination)

    const osc1 = audioContext.createOscillator()
    const osc2 = audioContext.createOscillator()
    osc1.frequency.setValueAtTime(440, audioContext.currentTime)
    osc2.frequency.setValueAtTime(480, audioContext.currentTime)

    osc1.connect(gainNode)
    osc2.connect(gainNode)

    osc1.start()
    osc2.start()

    // Cadence: 2s ON, 4s OFF
    const now = audioContext.currentTime
    for (let i = 0; i < 10; i++) {
      const start = now + i * 6
      const end = start + 2
      gainNode.gain.setValueAtTime(0.1, start)
      gainNode.gain.setValueAtTime(0.0, end)
    }

    ringbackTone = {
      stop: () => {
        try {
          osc1.stop()
          osc2.stop()
          audioContext.close()
          ringbackTone = null
        }
        catch (e) {
          console.error('Error stopping ringback:', e)
        }
      },
    }
  }
  catch (error) {
    console.error('Error creating ringback tone:', error)
  }
}

function stopRingbackTone() {
  if (ringbackTone) {
    try {
      ringbackTone.stop()
      ringbackTone = null
    }
    catch (error) {
      console.error('Error stopping ringback tone:', error)
    }
  }
}

export async function startCall(target: string) {
  if (!ua) {
    showToast({
      type: 'error',
      message: 'SIP UA not initialized. Call initializeSIP() first.',
    })
    console.error('SIP UA not initialized. Call initializeSIP() first.')
    return
  }

  // Request microphone permission first
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  }
  catch (error) {
    showToast({
      type: 'error',
      message:
        'Microphone permission denied. Please allow microphone access to make calls.',
    })
    console.error('Microphone permission denied:', error)
    return
  }

  // ✅ Correct way to build SIP target
  const targetURI = new URI(
    'sip',
    target,
    useRuntimeConfig().public.asteriskDomain,
  )

  if (!targetURI) {
    console.error('Invalid target URI')
    return
  }

  const inviter = new Inviter(ua, targetURI, {
    sessionDescriptionHandlerOptions: {
      constraints: { audio: true, video: false },
    },
  })

  activeSession = inviter
  callStatus.value = 'connecting'

  // 🔔 Start ringback tone
  playRingbackTone()

  // Send INVITE
  inviter.invite().catch((error: any) => {
    // Call failed before ringing
    stopRingbackTone()
    console.error('Call failed:', error)
    callStatus.value = 'idle'
    showToast({
      type: 'error',
      message: 'Call failed. Please try again.',
    })
  })

  // Attach media streams
  setupMedia(inviter)

  // 📞 Track call state
  inviter.stateChange.addListener((state) => {
    console.log('Call state:', state)
    switch (state) {
      case SessionState.Establishing:
        isCallActive.value = true
        callStatus.value = 'ringing' // remote is being alerted
        break

      case SessionState.Established:
        stopRingbackTone() // ✅ stop only when answered
        isCallActive.value = true
        callStatus.value = 'active'
        break

      case SessionState.Terminated:
        stopRingbackTone()
        isCallActive.value = false
        callStatus.value = 'idle'
        break
    }
  })
}

export function endCall() {
  if (activeSession) {
    try {
      // Check if the session is in a state that allows bye()
      if (activeSession.state !== 'Terminated' && activeSession.state !== 'Terminating') {
        console.error('Ending call, session state:', activeSession.state)
        activeSession.bye()
      }
      else {
        console.error('Session already terminated, state:', activeSession.state)
      }
    }
    catch (error) {
      console.error('Error ending call:', error)
    }
    finally {
      // Stop ringback tone if still playing
      stopRingbackTone()

      // Always clean up the session and reset state
      activeSession = null
      isCallActive.value = false
      callStatus.value = 'idle'

      // Clean up the audio element if it exists
      const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement
      if (remoteAudio) {
        remoteAudio.srcObject = null
      }
    }
  }
}

export function getSIPStatus() {
  return {
    isRegistered: isRegistered.value,
    isCallActive: isCallActive.value,
    callStatus: callStatus.value,
    isInitialized,
  }
}
