import { Service } from 'typedi'
import prisma from '../helpers/client'
import { Prisma } from '@prisma/client'

@Service()
export class UsersService {
  /**
   * Type 'Prisma.SessionCreateInput' is automatically generated.
   * Whenever you modify file 'prisma/schema.prisma' and then run command:
   *   prisma generate
   *   prisma migrate dev
   * The types is automatically updated.
   *
   * About CRUD: https://www.prisma.io/docs/concepts/components/prisma-client/crud
   */
  async create(user: Prisma.UserCreateInput) {
    return prisma.user.create({
      data: user,
    })
  }

  async query(user: Prisma.UserCreateInput) {
    return prisma.user.findMany({where:{
      email: user.email,
    }})
  }
}
