import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'

export async function teachersRoutes(app: FastifyInstance) {
  app.get('/teachers', async () => {
    const teachers = await prisma.teacher.findMany()
    return teachers
  })

  app.get('/teachers/:id', async (req, reply) => {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      })
      const { id } = paramsSchema.parse(req.params)

      const teacher = await prisma.teacher.findUniqueOrThrow({
        where: { id },
      })

      return teacher
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          reply.status(404).send()
        }
      }
    }
  })

  app.post('/teachers', async (req, res) => {
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

    return res.status(201).send(teacher)
  })
}
