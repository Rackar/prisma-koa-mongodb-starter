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
import { Prisma, Role } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'
import { createToken, verifyToken } from "../utils/auth"
import { Context } from 'koa'
import bcrypt from 'bcrypt'

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
    @BodyParam('nickname', { required: true }) nickname: string,
    @BodyParam('password', { required: true }) password: string,
  ) {
    let encryptedPassword = await bcrypt.hash(password, 10)
    // 验证密码并查询用户信息
    const user = await prisma.user.create({
      data: {
        username, nickname,
        password: encryptedPassword,
      },
    })
    let token = createToken({ id: user.id, username, nickname, role: user.role })

    return { data: { token } }
  }

  @Post('/login')
  async login(
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('password', { required: true }) password: string,
  ) {
    // let encryptedPassword = await bcrypt.hash(password, config.bcryptSalt)
    // 验证密码并查询用户信息
    const user = await prisma.user.findFirstOrThrow({ where: { username } })
    const matched = await bcrypt.compare(password, user.password)
    if (!matched) {
      throw new UnauthorizedError(`登陆失败`); // 参数选填
    }
    let token = createToken({ id: user.id, username, nickname: user.nickname, role: user.role })

    return { data: { token } }
  }

  @Authorized()
  @Get('/users')
  async query(
    @QueryParam('username') username?: string,
    @QueryParam('skip') skip?: number,
    @QueryParam('take') take?: number,
  ) {
    const where = {
      username: username || undefined,
    }
    const [list, total] = await prisma.$transaction([
      prisma.user.findMany({
        where, skip, take, select: {
          nickname: true, username: true, name: true, tel: true, role: true, orgId: true, id: true
        }
      }),
      prisma.user.count({ where })
    ])


    return { data: { list, total } }
  }

  @Authorized()
  @Post('/users')
  async create(
    @BodyParam('username') username: string,
    @BodyParam('nickname') nickname: string,
    @BodyParam('name') name: string,
    @BodyParam('tel') tel: string,
    @BodyParam('role') role: Role,
    @BodyParam('level') level: number,
    @BodyParam('password') password: string,
    @BodyParam('orgId') orgId: string,
  ) {
    if (!name) {
      throw new BadRequestError('username is required')
    }
    return await prisma.user.create({
      data: { username, nickname, name, tel, role, password, orgId, level }
    })
  }


  @Authorized()
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

  @Authorized()
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
