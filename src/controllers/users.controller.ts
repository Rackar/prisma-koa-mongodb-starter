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
  NotFoundError
} from 'routing-controllers'
import { UsersService } from '../services'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'
import { createToken, verifyToken } from "../utils/auth"
import { Context } from 'koa'

@JsonController()
@Service()
export class UsersController {
  constructor(private usersService: UsersService) { }
  @Post('/login')
  async login(
    @BodyParam('username', { required: true }) email: string,
    @BodyParam('password', { required: true }) password: string,
    @Ctx() ctx: Context
  ) {
    // 验证密码并查询用户信息
    const user = await prisma.user.findFirstOrThrow({ where: { email, password } })
    // if (!user)
    //   throw new NotFoundError(`User was not found.`); // message is optional

    let token = createToken({ id: user.id, username: user.email, role: user.role })

    return { token }
  }

  // @Authorized()
  @Get('/users')
  async query(@QueryParam('email') email: string,) {
    let data = await prisma.user.findMany({
      where: {
        email: email || undefined,
      },
      select: {
        email: true, name: true, tel: true, role: true, orgId: true, id: true
      }
    })

    return { data }
  }

  @Post('/users')
  async create(
    @BodyParam('email') email: string,
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
      data: { email, name, tel, role, password, orgId }
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
