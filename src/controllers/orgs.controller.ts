import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  QueryParam,
} from 'routing-controllers'
// import { UsersService } from '../services'
import prisma from '../helpers/client'
import { Service } from 'typedi'

@JsonController()
@Service()
export class OrgsController {
  constructor() { }

  @Get('/orgs')
  async query(@QueryParam('id') id: string,
    @QueryParam('name') name: string,
    @QueryParam('description') description: string,
    @QueryParam('parentId') parentId: string,
    @QueryParam('type') type: string,
    @QueryParam('level') level: string,) {
    let params = { id: id || undefined, name: name || undefined, description: description || undefined, parentId: parentId || undefined, type: type || undefined, level: level || undefined }
    let data = await prisma.org.findMany({ where: params })
    return { data }
  }

  @Post('/orgs')
  async create(
    @BodyParam('name') name: string,
    @BodyParam('description') description: string,
    @BodyParam('parentId') parentId: string,
    @BodyParam('type') type: string,
    @BodyParam('level') level: string,
  ) {
    if (!name) {
      throw new BadRequestError('name is required')
    }
    return await prisma.org.create({
      data: { name, description, parentId, type, level },
    })
  }
}
