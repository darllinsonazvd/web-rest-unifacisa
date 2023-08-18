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
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    try {
      const teacher = await prisma.teacher.findUniqueOrThrow({
        where: { id },
      })
      return teacher
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          reply.status(404).send({
            message: `Teacher not found for id ${id}`,
          })
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

  app.put('/teachers/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      instruct: z.string(),
    })
    const { name, email, instruct } = bodySchema.parse(req.body)

    try {
      let teacher = await prisma.teacher.findUniqueOrThrow({
        where: { id },
      })

      teacher = await prisma.teacher.update({
        where: { id },
        data: {
          name,
          email,
          instruct,
        },
      })

      return teacher
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          reply.status(404).send({
            message: `Teacher not found for id ${id}`,
          })
        }
      }
    }
  })

  app.delete('/teachers/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    try {
      const teacher = await prisma.teacher.findUniqueOrThrow({
        where: { id },
      })
      await prisma.teacher.delete({
        where: {
          id: teacher.id,
        },
      })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          reply.status(404).send({
            message: `Teacher not found for id ${id}`,
          })
        }
      }
    }
  })
}
