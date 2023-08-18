import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function teachersRoutes(app: FastifyInstance) {
  app.post('/teachers', async (req) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      instruct: z.string(),
    })
    const { name, email, instruct } = bodySchema.parse(req.body)

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        instruct,
      },
    })

    return teacher
  })
}
