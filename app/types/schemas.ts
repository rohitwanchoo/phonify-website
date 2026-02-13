import { z } from 'zod'

// User schema
export const UserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  email: z.string().email(),
  name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  mobile: z.string().optional(),
  companyName: z.string().optional(),
  extension: z.union([z.string(), z.number()]).optional(),
  alt_extension: z.string().optional(),
  app_extension: z.string().optional(),
  secret: z.string().optional(),
  domain: z.string().optional(),
  parent_id: z.number().optional().nullable(),
})

export type User = z.infer<typeof UserSchema>

// Login response schema
export const LoginResponseSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  user: UserSchema,
  expires_at: z.string().optional(),
  server: z.string().optional(),
  domain: z.string().optional(),
  did: z.string().optional(),
})

export type LoginResponseValidated = z.infer<typeof LoginResponseSchema>

// Phonify API response schema
export const PhonifyApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    mobile: z.string(),
    email: z.string().email(),
    companyName: z.string(),
    companyLogo: z.string().optional(),
    profile_pic: z.string().nullable().optional(),
    extension: z.union([z.string(), z.number()]),
    alt_extension: z.string(),
    app_extension: z.string(),
    token: z.string(),
    expires_at: z.string(),
    server: z.string(),
    domain: z.string(),
    did: z.string(),
    secret: z.string().optional(),
  }),
})

export type PhonifyApiResponse = z.infer<typeof PhonifyApiResponseSchema>

// Generic API response schema
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) => z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: dataSchema,
})

// Paginated response schema
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) => z.object({
  success: z.boolean(),
  data: z.array(itemSchema),
  meta: z.object({
    current_page: z.number(),
    last_page: z.number(),
    per_page: z.number(),
    total: z.number(),
  }).optional(),
})

// Error response schema
export const ApiErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.array(z.string())).optional(),
  status: z.number().optional(),
})

export type ApiErrorValidated = z.infer<typeof ApiErrorSchema>

// Helper function to validate API responses
export function validateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    console.error('API response validation failed:', result.error.format())
    throw new Error(`Invalid API response: ${result.error.message}`)
  }
  return result.data
}

// Helper function to safely validate with fallback
export function safeValidateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown, fallback: T): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    console.warn('API response validation failed, using fallback:', result.error.format())
    return fallback
  }
  return result.data
}
