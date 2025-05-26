export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  // If user is already logged in, redirect to dashboard
  if (loggedIn.value) {
    return navigateTo('/app/dashboard')
  }
})
