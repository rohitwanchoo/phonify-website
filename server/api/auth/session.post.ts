export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Set the user session with the provided data
  await setUserSession(event, body)

  return { success: true }
})
