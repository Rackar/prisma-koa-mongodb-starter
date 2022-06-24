import { PrismaClient } from '@prisma/client'
import createServer from '../configs/application'
import routes from './router'

const prisma = new PrismaClient()

async function main() {
  // Connect the client
  await prisma.$connect()
  // ... you will write your Prisma Client queries here
  // await prisma.user.create({
  //   data: {
  //     name: 'Rich',
  //     email: 'hello@prisma.com',
  //     posts: {
  //       create: {
  //         title: 'My first post',
  //         body: 'Lots of really interesting stuff',
  //         slug: 'my-first-post',
  //       },
  //     },
  //   },
  // })
  const app =await createServer()
  app.use(routes.routes());

  // const allUsers = await prisma.user.findMany({
  //   include: {
  //     posts: true,
  //   },
  // })
  // console.dir(allUsers, { depth: null })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })