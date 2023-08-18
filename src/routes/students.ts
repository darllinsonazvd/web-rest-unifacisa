import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'

export async function studentsRoutes(app: FastifyInstance) {
  app.get('/students', async () => {
    const students = await prisma.student.findMany()
    return students
  })

  app.get('/students/:id', async (req, reply) => {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      })
      const { id } = paramsSchema.parse(req.params)

      const student = await prisma.student.findUniqueOrThrow({
        where: { id },
      })

      return student
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          reply.status(404).send()
        }
      }
    }
  })

  app.post('/students', async (req, res) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      teacherId: z.string(),
    })
    const { name, email, teacherId } = bodySchema.parse(req.body)

    const student = await prisma.student.create({
      data: {
        name,
        email,
        teacherId,
      },
    })

    return res.status(201).send(student)
  })
}
