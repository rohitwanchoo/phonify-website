export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required session fields
  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  // Validate required user data
  if (!body.user || !body.token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required session data: user and token are required',
    })
  }

  // Validate user object has required fields
  const { user, token } = body
  if (!user.id || !user.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user data: id and email are required',
    })
  }

  // Validate token is a non-empty string
  if (typeof token !== 'string' || token.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid token: must be a non-empty string',
    })
  }

  // Sanitize and set the user session with validated data
  const sessionData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      mobile: user.mobile || '',
      companyName: user.companyName || '',
      extension: user.extension || '',
      alt_extension: user.alt_extension || '',
      app_extension: user.app_extension || '',
      secret: user.secret || '',
      domain: user.domain || '',
      parent_id: user.parent_id || null,
    },
    token,
    loggedInAt: body.loggedInAt || new Date().toISOString(),
    expires_at: body.expires_at || null,
    server: body.server || '',
    domain: body.domain || '',
    did: body.did || '',
  }

  await setUserSession(event, sessionData)

  return { success: true }
})
