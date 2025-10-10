import consola from 'consola'
import { Inviter, Registerer, UserAgent } from 'sip.js'

export default defineNuxtPlugin(() => {
  const createSIPUA = (config: {
    uri: string
    username: string
    password: string
    wsServer: string
  }) => {
    consola.info('🔧 Creating SIP UserAgent with config:', {
      uri: config.uri,
      username: config.username,
      wsServer: config.wsServer,
    })

    const userAgent = new UserAgent({
      uri: UserAgent.makeURI(config.uri)!,
      transportOptions: {
        server: config.wsServer,
        // Add connection options for better reliability
        connectionTimeout: 30,
        maxReconnectionAttempts: 10,
        reconnectionTimeout: 4,
        traceSip: true,
      },
      authorizationUsername: config.username,
      authorizationPassword: config.password,
      // Add display name for better call identification
      displayName: config.username,
      // Enable logging for debugging
      logBuiltinEnabled: true,
      logLevel: 'debug',
      sessionDescriptionHandlerFactoryOptions: {
        constraints: { audio: true, video: false },
        // Always acquire media first to ensure proper call handling
        alwaysAcquireMediaFirst: true,
        peerConnectionOptions: {
          iceServers: [
            // { urls: 'stun:stun.l.google.com:19302' },
            // Add STUN servers for better connectivity
            // { urls: 'stun:stun.l.google.com:19302' },
            // { urls: 'stun:stun1.l.google.com:19302' },
            {
              urls: ['turn:sip2.voiptella.com:3478'],
              username: '89789798',
              credential: 'dwuedjniu',
            },

          ],
          iceCandidatePoolSize: 10,
          iceTransportPolicy: 'all',
          bundlePolicy: 'balanced',
          rtcpMuxPolicy: 'require',
          // Add additional options for better call quality
          iceGatheringTimeout: 5000,
        },
      },
      // Add user agent string for server identification
      userAgentString: 'Phonify SIP Client 1.0',
      // Add delegate placeholder (will be set in useSIP)
      delegate: {},
    })

    // Add transport event listeners for debugging
    userAgent.transport.stateChange.addListener((state) => {
      consola.info('🚀 Transport state in plugin:', state)
    })

    const registerer = new Registerer(userAgent, {
      // Add registration options
      expires: 300, // 5 minutes
    })

    consola.success('✅ SIP UserAgent and Registerer created successfully')
    return { userAgent, registerer }
  }

  return {
    provide: {
      createSIPUA,
    },
  }
})
