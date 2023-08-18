import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'

import { teachersRoutes } from './routes/teachers'
import { studentsRoutes } from './routes/students'

const app = fastify()
const PORT: number = Number(process.env.PORT) || 3333

app.register(cors, {
  origin: true /** Todas as aplicações frontend terão acesso a este backend */,
})

app.register(teachersRoutes)
app.register(studentsRoutes)

app
  .listen({
    port: PORT,
  })
  .then(() => console.log(`🚀 Http server running on port ${PORT}`))
