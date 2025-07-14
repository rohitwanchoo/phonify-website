import type { ApiError, LoginRequest, LoginResponse } from '../../auth'

export function useApi() {
  const config = useRuntimeConfig()
  const { session } = useUserSession()

  // Base API client with authentication
  const apiClient = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/json',
    },
    onRequest({ options }) {
      // Add auth token to requests if available
      if (session.value?.token) {
        // Create headers object if it doesn't exist
        options.headers = options.headers || new Headers()
        // Set authorization header
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${session.value.token}`)
        }
        else {
          (options.headers as any).Authorization = `Bearer ${session.value.token}`
        }
      }
    },
    onResponseError({ response }) {
      // Handle common API errors
      if (response.status === 401) {
        // Token expired or invalid, clear session
        const { clear } = useUserSession()
        clear()
        throw createError({
          statusCode: 401,
          statusMessage: 'Authentication required',
        })
      }

      // Handle other errors
      const error = response._data as ApiError
      throw createError({
        statusCode: response.status,
        statusMessage: error.message || 'API Error',
        data: error,
      })
    },
  })

  // Authentication methods
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient('/authentication', {
      method: 'POST',
      body: credentials,
    }) as any

    // Handle the API response structure where data is nested
    if (response.success && response.data) {
      return {
        token: response.data.token,
        user: {
          id: response.data.id,
          email: response.data.email,
          name: `${response.data.first_name} ${response.data.last_name}`.trim(),
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          mobile: response.data.mobile,
          companyName: response.data.companyName,
          extension: response.data.extension,
          alt_extension: response.data.alt_extension,
          app_extension: response.data.app_extension,
        },
        expires_at: response.data.expires_at,
        server: response.data.server,
        domain: response.data.domain,
        did: response.data.did,
      }
    }

    // If response doesn't match expected structure, throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid API response format',
    })
  }

  // Generic API methods
  const get = async <T = any>(url: string, options?: any): Promise<T> => {
    return await apiClient(url, { method: 'GET', ...options })
  }

  const post = async <T = any>(url: string, body?: any, options?: any): Promise<T> => {
    return await apiClient(url, { method: 'POST', body, ...options })
  }

  const put = async <T = any>(url: string, body?: any, options?: any): Promise<T> => {
    return await apiClient(url, { method: 'PUT', body, ...options })
  }

  const del = async <T = any>(url: string, options?: any): Promise<T> => {
    return await apiClient(url, { method: 'DELETE', ...options })
  }

  const patch = async <T = any>(url: string, body?: any, options?: any): Promise<T> => {
    return await apiClient(url, { method: 'PATCH', body, ...options })
  }

  return {
    // Auth methods
    login,

    // Generic methods
    get,
    post,
    put,
    delete: del,
    patch,

    // Direct access to the client for custom requests
    client: apiClient,
  }
}
