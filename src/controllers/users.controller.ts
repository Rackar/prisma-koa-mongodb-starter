import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  QueryParam,
} from 'routing-controllers'
import { UsersService } from '../services'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'

@JsonController()
@Service()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/users')
  async query( @QueryParam('email') email: string,) {
    return  this.usersService.query({email })
  }

  @Post('/users')
  async create(
    @BodyParam('email') email: string,
    @BodyParam('username') name: string,
  ) {
    if (!name) {
      throw new BadRequestError('username is required')
    }
    return await this.usersService.create({email, name })
  }
}
