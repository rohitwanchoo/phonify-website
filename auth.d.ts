// Type definitions for authentication
declare module '#auth-utils' {
  interface User {
    id: string | number
    email: string
    name?: string
    first_name?: string
    last_name?: string
    mobile?: string
    companyName?: string
    extension?: string | number
    alt_extension?: string
    app_extension?: string
    // Add any other user fields from your API response
  }

  interface UserSession {
    user: User
    token: string
    loggedInAt: string
    expiresAt?: string
    expires_at?: string
    server?: string
    domain?: string
    did?: string
    // Add any other session fields you need
  }

  interface SecureSessionData {
    token: string
    // Add any other secure data you want to store server-side only
  }
}

export { }

// API Response types
export interface LoginRequest {
  email: string
  password: string
  device: string
}

// Phonify API response structure
export interface VoipTellaApiResponse {
  success: boolean
  message: string
  data: {
    id: number
    first_name: string
    last_name: string
    mobile: string
    email: string
    companyName: string
    companyLogo: string
    profile_pic: string | null
    extension: number
    alt_extension: string
    app_extension: string
    token: string
    expires_at: string
    server: string
    domain: string
    did: string
  }
}

export interface LoginResponse {
  token: string
  user: {
    id: string | number
    email: string
    name?: string
    first_name?: string
    last_name?: string
    mobile?: string
    companyName?: string
    extension?: string | number
    alt_extension?: string
    app_extension?: string
    secret?: string
  }
  expires_at?: string
  server?: string
  domain?: string
  did?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}
