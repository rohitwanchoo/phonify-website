export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path')
  const method = getMethod(event)
  const query = getQuery(event)

  // Get the request body for POST/PUT/PATCH requests
  let body
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await readBody(event)
  }

  // Get headers from the original request
  const headers = getHeaders(event)

  // Remove host header to avoid conflicts
  delete headers.host
  delete headers.origin
  delete headers.referer

  // Construct the target URL
  const targetUrl = `https://api.phonify.com/${path || ''}`

  try {
    // Make the request to the external API
    const response = await $fetch.raw(targetUrl, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      query,
    })

    // Set response headers
    if (response.headers) {
      for (const [key, value] of Object.entries(response.headers)) {
        if (key.toLowerCase() !== 'content-encoding') {
          setHeader(event, key, value as string)
        }
      }
    }

    // Set CORS headers for browser requests
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response._data
  }
  catch (error: any) {
    console.error('Proxy error:', error)

    // Handle different types of errors
    if (error.response) {
      // API returned an error response
      setResponseStatus(event, error.response.status)
      return error.response._data || { message: 'API Error' }
    }
    else {
      // Network or other error
      setResponseStatus(event, 500)
      return { message: 'Internal Server Error' }
    }
  }
})
