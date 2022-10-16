import prisma from './client'
import { UsersController } from '../controllers/users.controller'

async function dropAllTable() {
  await prisma.comment.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.fileBeenUploaded.deleteMany({})
  await prisma.theDocument.deleteMany({})
  await prisma.org.deleteMany({})
  await prisma.user.deleteMany({})

  let user = new UsersController(null)
  user.signup("admin", "管理员", "abcdefg")
}

dropAllTable()