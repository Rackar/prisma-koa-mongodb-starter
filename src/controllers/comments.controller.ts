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
  Delete,
  QueryParams,
} from 'routing-controllers'
import { Post as IPost, Prisma } from '@prisma/client'
import { Service } from 'typedi'
import prisma from '../helpers/client'

@JsonController()
@Service()
export class CommentController {

  @Post('/comment/post')
  async query(
    @BodyParam('id') id: string,
    @BodyParam('all') all?: boolean,
  ) {
    let data = await prisma.post.findUnique({
      where: { id }
    }).comments({
      where: { active: all ? undefined : true },
      include: {
        author: {
          select: {
            nickname: true,
            username: true,
            id: true
          }
        }
      },
    })
    return { data }
  }

  @Post('/comment')
  async create(
    @BodyParam('postId') postId: string,
    @BodyParam('username') username: string,
    @BodyParam('comment') comment: string,
  ) {

    const post = await prisma.post.findFirstOrThrow({ where: { id: postId, active: true } })

    return {
      data: await prisma.comment.create({
        data: {
          comment,
          post: {
            connect: {
              id: postId
            }
          },
          author: { connect: { username } }
        }
      })
    }


  }


  @Put('/comment')
  async put(
    @BodyParam('id') id: string,
    @BodyParam('comment') comment: string,
    @BodyParam('publish') publish?: boolean,
    @BodyParam('active') active?: boolean,
  ) {

    return await prisma.comment.update({
      where: {
        id
      },
      data: {
        comment, publish, active
      }
    })
  }

  @Delete('/comment')
  async deleteComment(
    @QueryParams() id: string,
  ) {
    return await prisma.comment.update({
      where: {
        id
      },
      data: {
        active: false
      }
    })
  }
}
