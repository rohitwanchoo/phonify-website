export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path')
  const method = event.method
  const query = getQuery(event)

  const headers = getHeaders(event)
  delete headers.host
  delete headers.origin
  delete headers.referer
  // These request headers must be recalculated by the outbound client
  delete headers['content-length']
  delete headers['content-encoding']

  const contentType = headers['content-type'] || ''
  let body: any

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    // Handle body according to content-type
    if (contentType.includes('multipart/form-data')) {
      // Forward raw buffer for file uploads; keep boundary from original content-type
      body = await readRawBody(event)
    }
    else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Reconstruct URL-encoded string from parsed body
      const parsed = await readBody(event)
      const params = new URLSearchParams(parsed as Record<string, string>)
      body = params.toString()
      headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    else if (contentType.includes('application/json')) {
      // Ensure JSON string payload
      const parsed = await readBody(event)
      body = JSON.stringify(parsed)
      headers['content-type'] = 'application/json'
    }
    else {
      // Unknown/other content-type: try raw pass-through
      body = await readRawBody(event)
    }
  }

  const targetUrl = `${config.apiBaseUrl}/${path || ''}`

  try {
    const response = await $fetch.raw(targetUrl, {
      method,
      headers: headers as HeadersInit,
      // Body already prepared according to content-type
      body,
      query,
    })

    if (response.headers) {
      for (const [key, value] of Object.entries(response.headers)) {
        if (key.toLowerCase() !== 'content-encoding') {
          setHeader(event, key, value as string)
        }
      }
    }

    // Allow CORS
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response._data
  }
  catch (error: any) {
    console.error('Proxy error:', error)

    if (error.response) {
      setResponseStatus(event, error.response.status)
      return error.response._data || { message: 'API Error' }
    }
    else {
      setResponseStatus(event, 500)
      return { message: 'Internal Server Error' }
    }
  }
})
