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
  Param,
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
      include: {
        comments: true,
        author: {
          select: {
            name: true,
            id: true,
            role: true,
            level: true
          }
        }
      },
      // 返回关联查询的部分字段。下面那种不返回本表数据，需要手动填入select
      // select: {
      //   author: {
      //     select: {
      //       name: true,
      //       id: true,
      //       role: true,
      //       level: true
      //     }
      //   },
      //   comments: true
      // }
    })
    return { data }
  }

  @Get('/post/:id')
  async queryByid(
    @Param('id') id: string
  ) {
    let data = await prisma.post.findFirstOrThrow({
      where: {
        id
      },
      orderBy: {
        sortIndex: 'desc',
      },
      include: {
        comments: true,
        author: {
          select: {
            name: true,
            id: true,
            role: true,
            level: true
          }
        }
      },
    })
    return { data }
  }

  @Post('/post')
  async create(
    @BodyParam('title') title: string,
    @BodyParam('body') body: string,
    @BodyParam('abstract') abstract: string,
    @BodyParam('username') username: string,
    // @CurrentUser() user?: User,
  ) {
    if (!title) {
      throw new BadRequestError('title is required')
    }
    const count = await prisma.post.count()
    return {
      data: await prisma.post.create({
        data: { title, body, abstract, sortIndex: count * 10, author: { connect: { username } } }
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
      include: {
        comments: true
      }
    })
    return { data }
  }
}
