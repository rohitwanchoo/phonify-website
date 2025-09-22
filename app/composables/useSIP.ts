import type { Invitation } from 'sip.js'
import { consola } from 'consola'
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
    consola.info('Setting up media for session...')
    const handler = session.sessionDescriptionHandler

    if (!handler) {
      consola.error('No session description handler found')
      return
    }

    // Add ICE connection state monitoring
    handler.peerConnection.oniceconnectionstatechange = () => {
      consola.info('ICE connection state:', handler.peerConnection.iceConnectionState)
    }

    handler.peerConnection.onicegatheringstatechange = () => {
      consola.info('ICE gathering state:', handler.peerConnection.iceGatheringState)
    }

    handler.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        consola.info('ICE candidate:', event.candidate.candidate)
      }
      else {
        consola.success('ICE gathering completed')
      }
    }

    handler.peerConnection.ontrack = (event: RTCTrackEvent) => {
      consola.info('Received remote track, setting up audio...')

      // Try to find existing audio element or create a new one
      let remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement

      if (!remoteAudio) {
        consola.error('Remote audio element not found, creating new one...')
        remoteAudio = document.createElement('audio')
        remoteAudio.id = 'remoteAudio'
        remoteAudio.autoplay = true
        remoteAudio.controls = false
        remoteAudio.style.display = 'none' // Hidden audio element
        document.body.appendChild(remoteAudio)
        consola.info('Created new remote audio element')
      }

      if (event.streams[0]) {
        remoteAudio.srcObject = event.streams[0]
        consola.success('Remote audio stream connected successfully')

        // Ensure audio plays
        remoteAudio.play().catch((error) => {
          consola.error('Error playing remote audio:', error)
        })
      }
      else {
        consola.error('No remote stream available')
      }
    }

    consola.success('Media setup completed')
  }
  catch (error) {
    consola.error('Error setting up media:', error)
  }
}

export function useSIP() {
  const { user } = useAuth()
  const config = useRuntimeConfig()
  const { $createSIPUA } = useNuxtApp()

  const initializeSIP = async () => {
    if (isInitialized) {
      consola.info('SIP already initialized')
      return
    }

    // const agentData = {
    //   uri: `sip:${user.value?.alt_extension}@${config.public.asteriskDomain}`,
    //   username: user.value?.alt_extension || '',
    //   // password: passwordDecrypt(user.value?.secret || '') || '',
    //   password: user.value?.id === 918 ? 'demo@1990' : passwordDecrypt(user.value?.secret || '') || '',
    //   wsServer: `wss://${user.value?.domain}:${config.public.asteriskWsPort}/ws`,
    // }

    const agentData1 = {
      uri: 'sip:1001@192.168.64.2',
      username: '1001',
      password: 'secret1001', // from your pjsip.conf
      wsServer: 'wss://192.168.64.2:8088/ws',
    }

    const agentData2 = {
      uri: 'sip:1002@192.168.64.2',
      username: '1002',
      password: 'secret1002',
      wsServer: 'wss://192.168.64.2:8088/ws',
    }

    // consola.info('🔧 Initializing SIP with config:', {
    //   uri: agentData.uri,
    //   alt_extension: agentData.username,
    //   wsServer: agentData.wsServer,
    //   domain: config.public.asteriskDomain,
    //   password: agentData.password,
    //   email: user.value?.email || '',
    // })

    const { userAgent, registerer: reg } = $createSIPUA(user?.value?.id === 918 ? agentData1 : agentData2)
    ua = userAgent
    registerer = reg

    // Set up delegate BEFORE starting UA
    ua.delegate = {
      onInvite: async (invitation: Invitation) => {
        consola.success('🔔 INCOMING CALL DETECTED!')
        consola.info('📞 Incoming call from:', invitation.remoteIdentity?.uri?.user || 'unknown')
        consola.info('📞 Full remote identity:', invitation.remoteIdentity)

        try {
          activeSession = invitation
          callStatus.value = 'incoming'

          // Add comprehensive state tracking
          invitation.stateChange.addListener((state) => {
            consola.info('📞 Invitation state changed to:', state)
          })

          // Request microphone permission before accepting
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            consola.info('🎤 Microphone permission granted')
          }
          catch (mediaError) {
            consola.error('❌ Microphone permission denied:', mediaError)
            throw new Error('Microphone access required for calls')
          }

          consola.info('✅ Accepting incoming call...')
          await invitation.accept({
            sessionDescriptionHandlerOptions: {
              constraints: { audio: true, video: false },
            },
          })

          consola.info('🔊 Setting up media for incoming call...')
          setupMedia(invitation)

          isCallActive.value = true
          callStatus.value = 'active'
          consola.success('✅ Incoming call accepted and active')
        }
        catch (error) {
          consola.error('❌ Error handling incoming call:', error)
          callStatus.value = 'idle'
          isCallActive.value = false

          if (activeSession) {
            try {
              consola.info('🚫 Rejecting call due to error')
              activeSession.reject()
            }
            catch (rejectError) {
              consola.error('❌ Error rejecting invitation:', rejectError)
            }
            activeSession = null
          }
        }
      },
      onConnect: () => {
        consola.success('🔗 UA Connected to server')
      },
      onDisconnect: (error?: Error) => {
        consola.info('🔌 UA Disconnected from server:', error?.message || 'No error')
      },
    }

    // UA lifecycle monitoring
    ua.stateChange.addListener((newState: any) => {
      consola.info('🔄 UA state changed to:', newState)
    })

    // Transport state monitoring
    ua.transport.stateChange.addListener((newState: any) => {
      consola.info('🚀 Transport state changed to:', newState)
    })

    // Registration lifecycle
    registerer.stateChange.addListener((newState: any) => {
      consola.info('📋 Registerer state changed to:', newState)
      if (newState === 'Registered') {
        isRegistered.value = true
        isInitialized = true
        consola.success('✅ SIP registration successful - ready to receive calls!')
      }
      else if (newState === 'Unregistered') {
        isRegistered.value = false
        consola.error('⚠️ SIP unregistered - cannot receive calls')
      }
    })

    registerer.delegate = {
      onReject: (response: any) => {
        consola.error('❌ Registration rejected:', response.message?.statusCode, response.message?.reasonPhrase)
        showToast({
          type: 'error',
          message: `SIP Registration failed: ${response.message?.statusCode} ${response.message?.reasonPhrase}`,
        })
      },
      onAccept: (response: any) => {
        consola.success('✅ Registration accepted:', response.message?.statusCode)
      },
    }

    // Start UA and register
    try {
      consola.info('🚀 Starting SIP UserAgent...')
      await ua.start()
      consola.success('✅ SIP UserAgent started successfully')

      consola.info('📋 Sending registration...')
      await registerer.register()
      consola.success('✅ Registration request sent')
    }
    catch (error) {
      consola.error('❌ Failed to start SIP UA or register:', error)
      isRegistered.value = false
      isInitialized = false

      showToast({
        type: 'error',
        message: `SIP initialization failed: ${error}`,
      })
    }
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
          consola.error('Error stopping ringback:', e)
        }
      },
    }
  }
  catch (error) {
    consola.error('Error creating ringback tone:', error)
  }
}

function stopRingbackTone() {
  if (ringbackTone) {
    try {
      ringbackTone.stop()
      ringbackTone = null
    }
    catch (error) {
      consola.error('Error stopping ringback tone:', error)
    }
  }
}

export async function startCall(target: string) {
  if (!ua) {
    showToast({
      type: 'error',
      message: 'SIP UA not initialized. Call initializeSIP() first.',
    })
    consola.error('SIP UA not initialized. Call initializeSIP() first.')
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
    consola.error('Microphone permission denied:', error)
    return
  }

  // ✅ Correct way to build SIP target
  const targetURI = new URI(
    'sip',
    target,
    useRuntimeConfig().public.asteriskDomain,
  )

  if (!targetURI) {
    consola.error('Invalid target URI')
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
    consola.error('Call failed:', error)
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
    consola.info('Call state:', state)
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
        consola.info('Ending call, session state:', activeSession.state)
        activeSession.bye()
      }
      else {
        consola.info('Session already terminated, state:', activeSession.state)
      }
    }
    catch (error) {
      consola.error('Error ending call:', error)
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
