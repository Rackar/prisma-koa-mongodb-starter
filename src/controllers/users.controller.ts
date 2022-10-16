import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  QueryParam,
  Put,
  Param,
  UseBefore,
  Ctx,
  Authorized,
  NotFoundError,
  UnauthorizedError
} from 'routing-controllers'
import { UsersService } from '../services'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'
import { createToken, verifyToken } from "../utils/auth"
import { Context } from 'koa'
import bcrypt from 'bcrypt'
import config from "../utils/secret";
import { throws } from 'assert'

@JsonController()
@Service()
export class UsersController {
  constructor(private usersService: UsersService) { }
  // router.post('/signup', async (ctx) => {
  //   const { name, username, posts } = ctx.request.body

  //   const postData = posts
  //     ? posts.map((post: Prisma.PostCreateInput) => {
  //       return { title: post.title, content: post.content || undefined }
  //     })
  //     : []
  //   const newUser = await prisma.user.create({
  //     data: {
  //       name,
  //       username,
  //       posts: {
  //         create: postData,
  //       },
  //     },
  //   })

  //   ctx.status = 201 // Created
  //   ctx.body = newUser
  // })

  @Post('/signup')
  async signup(
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('password', { required: true }) password: string,
  ) {
    let encryptedPassword = await bcrypt.hash(password, 10)
    // 验证密码并查询用户信息
    const user = await prisma.user.create({
      data: {
        username,
        password: encryptedPassword,
      },
    })
    // if (!user)
    //   throw new NotFoundError(`User was not found.`); // message is optional

    let token = createToken({ id: user.id, username: user.username, role: user.role })

    return { token }
  }

  @Post('/login')
  async login(
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('password', { required: true }) password: string,
    @Ctx() ctx: Context
  ) {
    // let encryptedPassword = await bcrypt.hash(password, config.bcryptSalt)
    // 验证密码并查询用户信息
    const user = await prisma.user.findFirstOrThrow({ where: { username } })
    const matched = await bcrypt.compare(password, user.password)
    if (!matched) {
      throw new UnauthorizedError(`登陆失败`); // 参数选填
    }

    // if (!user)

    //   throw new NotFoundError(`User was not found.`); // message is optional

    let token = createToken({ id: user.id, username: user.username, role: user.role })

    return { token }
  }

  // @Authorized()
  @Get('/users')
  async query(@QueryParam('username') username: string,) {
    let data = await prisma.user.findMany({
      where: {
        username: username || undefined,
      },
      select: {
        username: true, name: true, tel: true, role: true, orgId: true, id: true
      }
    })

    return { data }
  }

  @Post('/users')
  async create(
    @BodyParam('username') username: string,
    @BodyParam('name') name: string,
    @BodyParam('tel') tel: string,
    @BodyParam('role') role: string,
    @BodyParam('level') level: number,
    @BodyParam('password') password: string,
    @BodyParam('orgId') orgId: string,
  ) {
    if (!name) {
      throw new BadRequestError('username is required')
    }
    return await prisma.user.create({
      data: { username, name, tel, role, password, orgId }
    })
  }

  @Put('/users')
  async put(
    @BodyParam('id') id: string,
    @BodyParam('orgId') orgId: string,
  ) {
    // if (!orgId) {
    //   throw new BadRequestError('username is required')
    // }
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        orgId: orgId || undefined,
      },
    })
  }
  @Get("/users/:id/upload")
  async queryUploads(@Param("id") id: string) {
    let files = await prisma.user.findUnique({
      where: {
        id: id
      }
    }).files({})

    return { data: files }
  }
}
