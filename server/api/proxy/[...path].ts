export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path')
  const method = event.method
  const query = getQuery(event)

  const headers = getHeaders(event)
  delete headers.host
  delete headers.origin
  delete headers.referer

  const contentType = headers['content-type'] || ''
  let body

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    // Handle FormData and JSON differently
    if (contentType.includes('multipart/form-data')) {
      // Raw buffer for file uploads
      body = await readRawBody(event)
    }
    else {
      body = await readBody(event)
    }
  }

  const targetUrl = `${config.apiBaseUrl}/${path || ''}`

  try {
    const response = await $fetch.raw(targetUrl, {
      method,
      headers: headers as HeadersInit,
      // Don’t JSON.stringify if it’s form data
      body: contentType.includes('multipart/form-data')
        ? body
        : body
          ? JSON.stringify(body)
          : undefined,
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
