import { z } from 'zod'

export const studentSchema = z.object({
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name must be a string',
  }),
  email: z.string({
    required_error: 'email is required',
    invalid_type_error: 'email must be a string',
  }),
  teacherId: z.string({
    required_error: 'teacherId is required',
    invalid_type_error: 'teacherId must be a string',
  }),
})
