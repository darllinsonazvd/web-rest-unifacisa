import { FastifyInstance } from 'fastify'
import { ZodError, z } from 'zod'
import { Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'

export async function studentsRoutes(app: FastifyInstance) {
  app.get('/students', async () => {
    const students = await prisma.student.findMany()
    return students
  })

  app.get('/students/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    try {
      const student = await prisma.student.findUniqueOrThrow({
        where: { id },
      })

      return student
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          reply.status(404).send({
            message: `Student not found for id ${id}`,
          })
        }
      }
    }
  })

  app.post('/students', async (req, res) => {
    try {
      const bodySchema = z.object({
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
      const { name, email, teacherId } = bodySchema.parse(req.body)

      const student = await prisma.student.create({
        data: {
          name,
          email,
          teacherId,
        },
      })

      res.status(201).send(student)
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).send(JSON.parse(err.message))
      }
    }
  })

  app.put('/students/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    try {
      const bodySchema = z.object({
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
      const { name, email, teacherId } = bodySchema.parse(req.body)
      let student = await prisma.student.findUniqueOrThrow({
        where: { id },
      })

      student = await prisma.student.update({
        where: { id },
        data: {
          name,
          email,
          teacherId,
        },
      })

      return student
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          reply.status(404).send({
            message: `Student not found for id ${id}`,
          })
        }
      } else if (err instanceof ZodError) {
        reply.status(400).send(JSON.parse(err.message))
      }
    }
  })

  app.delete('/students/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    try {
      const student = await prisma.student.findUniqueOrThrow({
        where: { id },
      })
      await prisma.student.delete({
        where: {
          id: student.id,
        },
      })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          reply.status(404).send({
            message: `Student not found for id ${id}`,
          })
        }
      }
    }
  })
}
