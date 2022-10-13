import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  QueryParam,
  Put,
} from 'routing-controllers'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'

@JsonController()
@Service()
export class PostController {

  @Get('/post')
  async query() {
    let data = await prisma.post.findMany({
    })
    return { data }
  }

  @Post('/post')
  async create(
    @BodyParam('title') title: string,
    @BodyParam('content') body: string,
    @BodyParam('authorEmail') email: string,

  ) {
    if (!title) {
      throw new BadRequestError('title is required')
    }
    return await prisma.post.create({
      data: { title, body, author: { connect: { email } } }
    })
  }

  @Put('/post')
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
