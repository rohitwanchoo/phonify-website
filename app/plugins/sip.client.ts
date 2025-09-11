import { Inviter, Registerer, UserAgent } from 'sip.js'

export default defineNuxtPlugin(() => {
  const createSIPUA = (config: {
    uri: string
    username: string
    password: string
    wsServer: string
  }) => {
    const userAgent = new UserAgent({
      uri: UserAgent.makeURI(config.uri)!,
      transportOptions: {
        server: config.wsServer, // WSS from Asterisk
      },
      // authorizationUsername: config.uri?.split(':')[1]?.split('@')[0],
      authorizationUsername: config.username,
      authorizationPassword: config.password,
      sessionDescriptionHandlerFactoryOptions: {
        constraints: { audio: true, video: false },
        // peerConnectionOptions: {
        //   iceServers: [
        //     { urls: 'stun:stun.l.google.com:19302' },
        //     { urls: 'stun:stun1.l.google.com:19302' },
        //     { urls: 'stun:stun2.l.google.com:19302' },
        //     { urls: 'stun:stun3.l.google.com:19302' },
        //     { urls: 'stun:stun4.l.google.com:19302' },
        //     {
        //       urls: 'turn:sip2.voiptella.com:3478',
        //       username: '89789798',
        //       credential: 'dwuedjniu',
        //     },
        //   ],
        //   // iceCandidatePoolSize: 10,
        //   // iceTransportPolicy: 'all',
        //   bundlePolicy: 'balanced',
        //   rtcpMuxPolicy: 'require',

        // },
        // alwaysAcquireMediaFirst: true,

        // iceRestart: true,
      },
    })

    const registerer = new Registerer(userAgent)

    return { userAgent, registerer }
  }

  return {
    provide: {
      createSIPUA,
    },
  }
})
