import type { LoginRequest } from '../../auth'

export function useAuth() {
  const { loggedIn, user, session, fetch: refreshSession, clear } = useUserSession()
  const api = useApi()

  // Login function
  const login = async (credentials: Omit<LoginRequest, 'device'>) => {
    // Add device info to credentials
    const loginData: LoginRequest = {
      ...credentials,
      device: 'desktop_app', // You can make this dynamic based on user agent
    }

    // Call the external API
    const response = await api.login(loginData)

    // Set the user session with the response data
    await $fetch('/api/auth/session', {
      method: 'POST',
      body: {
        user: response.user,
        token: response.token,
        loggedInAt: new Date().toISOString(),
        expires_at: response.expires_at,
        server: response.server,
        domain: response.domain,
        did: response.did,
      },
    })

    // Refresh the session to update reactive state
    await refreshSession()

    return response
  }

  // Logout function
  const logout = async () => {
    try {
      // You can call a logout endpoint on your API here if needed
      // await api.post('/logout')

      // Clear the local session
      await clear()
    }
    catch (error) {
      // Even if API logout fails, clear local session
      await clear()
      throw error
    }
  }

  // Check if user has specific permissions/roles
  const hasRole = (role: string): boolean => {
    // Implement based on your user structure
    return (user.value as any)?.role === role || false
  }

  const hasPermission = (permission: string): boolean => {
    // Implement based on your user structure
    return (user.value as any)?.permissions?.includes(permission) || false
  }

  // Get auth token for manual API calls
  const getToken = (): string | null => {
    return session.value?.token || null
  }

  // Check if token is expired (if you have expiration logic)
  const isTokenExpired = (): boolean => {
    if (!session.value?.expiresAt)
      return false
    return new Date() > new Date(session.value.expiresAt)
  }

  // Refresh token if needed (implement based on your API)
  const refreshToken = async () => {
    try {
      // Implement token refresh logic if your API supports it
      // const response = await api.post('/refresh-token')
      // await setUserSession({ ...session.value, token: response.token })
      // await refreshSession()
    }
    catch (error) {
      // If refresh fails, logout user
      await logout()
      throw error
    }
  }

  return {
    // State
    loggedIn: readonly(loggedIn),
    user: readonly(user),
    session: readonly(session),

    // Actions
    login,
    logout,
    refreshSession,

    // Utilities
    hasRole,
    hasPermission,
    getToken,
    isTokenExpired,
    refreshToken,
  }
}
