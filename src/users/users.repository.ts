import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: userData,
      // NOTE: Uncomment for including the status relation and not just the statusId in the response
      // include: {
      //   status: true,
      // },
    });
  }

  async findMany({
    skip,
    take,
    where,
  }: {
    skip: number;
    take: number;
    where: Prisma.UserWhereInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      where,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        status: true,
      },
    });
  }
}
