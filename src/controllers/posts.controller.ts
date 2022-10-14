import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  QueryParam,
  Put,
  Params,
  Body,
  CurrentUser,
  Delete,
} from 'routing-controllers'
import { Post as IPost, Prisma, User } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'

@JsonController()
@Service()
export class PostController {

  @Get('/post')
  async query() {
    let data = await prisma.post.findMany({
      orderBy: {
        sortIndex: 'desc',
      },
    })
    return { data }
  }

  @Post('/post')
  async create(
    @BodyParam('title') title: string,
    @BodyParam('content') body: string,
    @BodyParam('authorEmail') email: string,
    // @CurrentUser() user?: User,
  ) {
    if (!title) {
      throw new BadRequestError('title is required')
    }
    const count = await prisma.post.count()
    return {
      data: await prisma.post.create({
        data: { title, body, sortIndex: count * 10, author: { connect: { email } } }
      })
    }
  }

  @Put('/post/sortindex')
  async changeSortIndex(
    @BodyParam('id') id: string,
    @BodyParam('sortIndex') sortIndex: number,
  ) {
    if (!id) {
      throw new BadRequestError('id is required')
    } else if (!sortIndex) {
      throw new BadRequestError('sortIndex is required')
    }
    return {
      data: await prisma.post.update({
        where: { id },
        data: { sortIndex }
      })
    }
  }

  @Put('/post')
  async put(
    @Body() data: IPost
  ) {
    let { id, title, body, sortIndex, publish, active, authorId } = data
    return {
      data:
        await prisma.post.update({
          where: {
            id
          },
          data: {
            title, body, sortIndex, publish, active, authorId
          }
        })
    }
  }
  @Put('/post/publish')
  async putPublish(
    @BodyParam('id') id: string,
    @BodyParam('publish') publish: boolean,
  ) {
    return {
      data:
        await prisma.post.update({
          where: {
            id
          },
          data: {
            publish
          }
        })
    }
  }

  @Put('/post/delete')
  async deletePost(
    @BodyParam('id') id: string,
    @BodyParam('active') active: boolean
  ) {
    return {
      data:
        await prisma.post.update({
          where: {
            id
          },
          data: {
            active
          }
        })
    }
  }

  @Put('/post/view')
  async addViewCount(
    @BodyParam('id') id: string,
  ) {
    const data = await prisma.post.update({
      where: {
        id,
      },
      data: {
        viewCount: {
          increment: 1,
        }
      }
    })
    return { data }
  }

  @Get('/feed')
  async queryFeed() {
    let data = await prisma.post.findMany({
      where: {
        active: true,
        publish: true
      },
      orderBy: {
        sortIndex: 'desc',
      },
    })
    return { data }
  }
}
