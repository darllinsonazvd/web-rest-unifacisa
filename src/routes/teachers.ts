import { FastifyInstance } from 'fastify'
import { ZodError, z } from 'zod'
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
        instruct: z.string({
          required_error: 'instruct is required',
          invalid_type_error: 'instruct must be a string',
        }),
      })
      const { name, email, instruct } = bodySchema.parse(req.body)

      const teacher = await prisma.teacher.create({
        data: {
          name,
          email,
          instruct,
        },
      })

      res.status(201).send(teacher)
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).send(JSON.parse(err.message))
      }
    }
  })

  app.put('/teachers/:id', async (req, reply) => {
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
        instruct: z.string({
          required_error: 'instruct is required',
          invalid_type_error: 'instruct must be a string',
        }),
      })
      const { name, email, instruct } = bodySchema.parse(req.body)

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
      } else if (err instanceof ZodError) {
        reply.status(400).send(JSON.parse(err.message))
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
