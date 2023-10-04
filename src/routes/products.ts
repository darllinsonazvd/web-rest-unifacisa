import { FastifyInstance } from 'fastify'
import { ZodError, z } from 'zod'
import { Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'
import { productSchema } from '../schemas/product-schema'

export async function productRoutes(app: FastifyInstance) {
  app.get('/products', async () => {
    const products = await prisma.product.findMany()
    return products
  })

  app.get('/products/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    try {
      const product = await prisma.product.findUniqueOrThrow({
        where: { id },
      })
      return product
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023' || err.code === 'P2025') {
          reply.status(404).send({
            message: `Product not found for id ${id}`,
          })
        }
      }
    }
  })

  app.post('/products', async (req, res) => {
    try {
      const { name, price, advertiserPhoneNumber, description, imgUrl } =
        productSchema.parse(req.body)

      const product = await prisma.product.create({
        data: {
          name,
          price,
          advertiserPhoneNumber,
          description,
          imgUrl,
        },
      })

      res.status(201).send(product)
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).send(JSON.parse(err.message))
      }
    }
  })

  app.put('/products/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    try {
      const { name, price, advertiserPhoneNumber, description, imgUrl } =
        productSchema.parse(req.body)

      let product = await prisma.product.findUniqueOrThrow({
        where: { id },
      })

      product = await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          advertiserPhoneNumber,
          description,
          imgUrl,
        },
      })

      return product
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023') {
          return reply.status(400).send({
            message: `Product not found for id ${id}`,
          })
        }
      } else if (err instanceof ZodError) {
        return reply.status(400).send(JSON.parse(err.message))
      }
    }
  })

  app.delete('/products/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(req.params)

    try {
      const product = await prisma.product.findUniqueOrThrow({
        where: { id },
      })
      await prisma.product.delete({
        where: {
          id: product.id,
        },
      })

      return reply.status(204).send()
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2023' || err.code === 'P2025') {
          return reply.status(400).send({
            message: `Product not found for id ${id}`,
          })
        }
      }
    }
  })
}
