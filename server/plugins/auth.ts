export default defineNitroPlugin(() => {
  // Hook into session fetch to extend or validate session data
  sessionHooks.hook('fetch', async (session, event) => {
    // You can extend the session here with additional data
    // For example, fetch user permissions, roles, etc.
    
    if (session.user) {
      // Example: Add last activity timestamp
      session.lastActivity = new Date().toISOString()
      
      // Example: Validate token expiration
      if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
        // Token expired, clear session
        throw createError({
          statusCode: 401,
          statusMessage: 'Session expired'
        })
      }
      
      // You could also fetch additional user data from your API here
      // const userDetails = await $fetch(`${process.env.API_BASE_URL}/user/${session.user.id}`, {
      //   headers: { Authorization: `Bearer ${session.token}` }
      // })
      // session.user = { ...session.user, ...userDetails }
    }
  })

  // Hook into session clear to perform cleanup
  sessionHooks.hook('clear', async (session, event) => {
    // Log user logout
    console.log(`User ${session.user?.email} logged out at ${new Date().toISOString()}`)
    
    // You could also call your API's logout endpoint here
    // if (session.token) {
    //   try {
    //     await $fetch(`${process.env.API_BASE_URL}/logout`, {
    //       method: 'POST',
    //       headers: { Authorization: `Bearer ${session.token}` }
    //     })
    //   } catch (error) {
    //     console.error('API logout error:', error)
    //   }
    // }
  })
}) 
