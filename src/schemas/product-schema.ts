import { z } from 'zod'

export const productSchema = z.object({
  name: z.string({
    required_error: 'name field is required',
    invalid_type_error: 'name field must be a string',
  }),
  price: z.number({
    required_error: 'price field is required',
    invalid_type_error: 'price field must be a number',
  }),
  description: z
    .string({
      invalid_type_error: 'description field must be a string',
    })
    .optional(),
  imgUrl: z
    .string({
      invalid_type_error: 'imgUrl field must be a string',
    })
    .optional(),
})
