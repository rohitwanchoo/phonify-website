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
