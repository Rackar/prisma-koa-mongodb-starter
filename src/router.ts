const router = require('koa-router')()
import prisma from './helpers/client'
router.prefix('/api/test')
router.get("/", async (ctx) => {
    await list(ctx)
})

async function list(ctx){
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
  ctx.body = {
    message:'ok',
    data:{ allUsers }
  }
}

// router.use(router.routes(), router.allowedMethods()); 

export default router