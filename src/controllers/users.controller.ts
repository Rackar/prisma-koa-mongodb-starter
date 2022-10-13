import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  QueryParam,
  Put,
} from 'routing-controllers'
import { UsersService } from '../services'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'

@JsonController()
@Service()
export class UsersController {
  constructor(private usersService: UsersService) { }

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
    @BodyParam('role') role: number,
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
}
