import prisma from './client'
import { UsersController, PostController, CommentController } from '../controllers/index'

async function dropAndInitDB() {
  await prisma.comment.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.fileBeenUploaded.deleteMany({})
  await prisma.theDocument.deleteMany({})
  await prisma.org.deleteMany({})
  await prisma.user.deleteMany({})

  //创建初始化数据
  let user = new UsersController(null)
  let uIns = await user.signup("admin", "管理员", "123456")

  let post = new PostController()
  let pIns = await post.create('测试1', "初始测试内容1111", "初始测试内容1111", 'admin')

  let comment = new CommentController()
  let cIns = await comment.create(pIns.data.id, 'admin', "评论1")

}

dropAndInitDB()