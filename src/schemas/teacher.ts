import { z } from 'zod'

export const teacherSchema = z.object({
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name must be a string',
  }),
  email: z.string({
    required_error: 'email is required',
    invalid_type_error: 'email must be a string',
  }),
  instruct: z.string({
    required_error: 'instruct is required',
    invalid_type_error: 'instruct must be a string',
  }),
})
