# Authentication System Setup

This document explains the comprehensive authentication system implemented for the Phonify project using Nuxt 4 and nuxt-auth-utils with external API integration.

## Overview

The authentication system provides:
- Secure session management with encrypted cookies
- Integration with external Phonify API
- Route protection middleware
- Type-safe API calls
- Automatic token handling
- Session hooks for extensibility

## Architecture

### Components

1. **nuxt-auth-utils**: Core authentication module
2. **External API**: Phonify API at `https://api.phonify.com`
3. **Session Management**: Encrypted cookie-based sessions
4. **Middleware**: Route protection and guest-only routes
5. **Composables**: Reusable authentication logic
6. **Type Safety**: Full TypeScript support

### File Structure

```
├── auth.d.ts                     # Type definitions
├── nuxt.config.ts               # Module configuration
├── server/
│   └── plugins/
│       └── auth.ts              # Session hooks
├── app/
│   ├── composables/
│   │   ├── useAuth.ts           # Authentication composable
│   │   └── useApi.ts            # API client composable
│   ├── middleware/
│   │   ├── auth.ts              # Protected route middleware
│   │   └── guest.ts             # Guest-only middleware
│   └── pages/
│       ├── index.vue            # Landing page
│       ├── login.vue            # Login page
│       └── dashboard.vue        # Protected dashboard
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Required: Session encryption password (minimum 32 characters)
NUXT_SESSION_PASSWORD=your-super-secret-session-password-with-at-least-32-characters-for-security
```

### Nuxt Configuration

The system is configured in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    'nuxt-auth-utils',
    // ... other modules
  ],
  runtimeConfig: {
    sessionPassword: process.env.NUXT_SESSION_PASSWORD || '',
    public: {
      apiBaseUrl: 'https://api.phonify.com',
    }
  }
})
```

## Usage

### Authentication Composable

The `useAuth()` composable provides all authentication functionality:

```vue
<script setup>
const { loggedIn, user, login, logout } = useAuth()

// Login
async function handleLogin() {
  try {
    await login({
      email: 'user@example.com',
      password: 'password123'
    })
    // User is now logged in
  }
  catch (error) {
    // Handle login error
  }
}

// Logout
async function handleLogout() {
  await logout()
  // User is now logged out
}
</script>
```

### API Calls

The `useApi()` composable handles authenticated API requests:

```vue
<script setup>
const api = useApi()

// Authenticated API calls
async function fetchUserData() {
  try {
    const userData = await api.get('/user/profile')
    return userData
  }
  catch (error) {
    // Handle API error
  }
}

// Other HTTP methods
await api.post('/endpoint', { data: 'value' })
await api.put('/endpoint', { data: 'value' })
await api.delete('/endpoint')
</script>
```

### Route Protection

#### Protected Routes

Use the `auth` middleware to protect routes:

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

#### Guest-Only Routes

Use the `guest` middleware for login/register pages:

```vue
<script setup>
definePageMeta({
  middleware: 'guest'
})
</script>
```

### Safe Authentication State

Use the `<AuthState>` component for safe rendering:

```vue
<template>
  <AuthState>
    <template #default="{ loggedIn, user, clear }">
      <div v-if="loggedIn">
        Welcome, {{ user.email }}!
        <button @click="clear">
          Logout
        </button>
      </div>
      <div v-else>
        <NuxtLink to="/auth/login">
          Login
        </NuxtLink>
      </div>
    </template>
    <template #placeholder>
      <div>Loading...</div>
    </template>
  </AuthState>
</template>
```

## API Integration

### Login Endpoint

The system calls `POST /authentication` with:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "device": "desktop_app"
}
```

Expected response:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Authenticated Requests

All subsequent API calls include the Bearer token:

```
Authorization: Bearer jwt_token_here
```

## Type Definitions

The system includes comprehensive TypeScript types in `auth.d.ts`:

```typescript
declare module '#auth-utils' {
  interface User {
    id: string | number
    email: string
    name?: string
  }

  interface UserSession {
    user: User
    token: string
    loggedInAt: string
    expiresAt?: string
  }
}
```

## Session Management

### Session Hooks

Server-side hooks in `server/plugins/auth.ts` allow extending session functionality:

```typescript
sessionHooks.hook('fetch', async (session, event) => {
  // Extend session data
  // Validate token expiration
  // Fetch additional user data
})

sessionHooks.hook('clear', async (session, event) => {
  // Cleanup on logout
  // Call API logout endpoint
  // Log user activity
})
```

### Session Storage

- Sessions are stored in encrypted HTTP-only cookies
- Automatic session refresh on page load
- Secure transmission (HTTPS in production)
- 4KB cookie size limit (store only essential data)

## Security Features

1. **Encrypted Sessions**: All session data is encrypted using the session password
2. **HTTP-Only Cookies**: Prevents XSS attacks
3. **CSRF Protection**: Built-in CSRF protection
4. **Token Validation**: Automatic token expiration handling
5. **Secure Headers**: Proper security headers for authentication

## Error Handling

The system handles various error scenarios:

- **401 Unauthorized**: Automatic session clearing and redirect to login
- **Network Errors**: Graceful error handling with user feedback
- **Token Expiration**: Automatic logout and session cleanup
- **API Errors**: Structured error responses with proper status codes

## Development

### Testing Authentication

1. Start the development server: `pnpm dev`
2. Navigate to `/auth/login` to test login functionality
3. Use the dashboard at `/app/dashboard` to test protected routes
4. Test API calls using the "Test API Call" button

### Extending the System

1. **Add new API endpoints**: Extend the `useApi()` composable
2. **Add user roles**: Extend the User interface and add role checking
3. **Add permissions**: Implement permission-based access control
4. **Add OAuth providers**: Use nuxt-auth-utils OAuth handlers

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check `NUXT_SESSION_PASSWORD` environment variable
2. **API calls failing**: Verify API base URL and token format
3. **Middleware not working**: Ensure middleware is properly applied to routes
4. **Type errors**: Check type definitions in `auth.d.ts`

### Debug Mode

Enable debug logging by setting:

```env
NUXT_DEBUG=true
```

## Production Deployment

1. Set secure `NUXT_SESSION_PASSWORD` (32+ characters)
2. Use HTTPS for secure cookie transmission
3. Configure proper CORS settings on your API
4. Set up proper error monitoring
5. Configure session timeout based on security requirements

## API Endpoints Reference

Based on your external API, you'll have access to:

- `POST /authentication` - Login endpoint
- All other endpoints require the Bearer token
- Replace `/user/profile` in examples with your actual endpoints

This authentication system provides a solid foundation for secure user authentication in your Nuxt 4 application with external API integration.
