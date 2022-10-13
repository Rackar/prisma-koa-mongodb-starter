import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  QueryParam,
  Body,
} from 'routing-controllers'
// import { UsersService } from '../services'
import prisma from '../helpers/client'
import { Service } from 'typedi'
import * as utils from '../../configs/utils'

@JsonController()
@Service()
export class DocsController {
  constructor() { }

  @Get('/docs')
  async query(
    @QueryParam('id') id: string,
    @QueryParam('name') name: string,
    @QueryParam('description') description: string,
    @QueryParam('url') url: string,
    @QueryParam('authorId') authorId: string,
    @QueryParam('orgId') orgId: string) {
    let params = utils.removeParamsObjectNullValue({ id, name, description, url, authorId, orgId })
    let data = await prisma.theDocument.findMany({ where: params })
    return { data }
  }

  @Post('/docs')
  async create(
    @BodyParam('name') name: string,
    @BodyParam('description') description: string,
    @BodyParam('url') url: string,
    @BodyParam('authorId') authorId: string,
    @BodyParam('orgId') orgId: string,
  ) {
    if (!name) {
      throw new BadRequestError('name is required')
    }
    return await prisma.theDocument.create({
      data:{  name, description, url, authorId, orgId } ,
    })
  }
}
