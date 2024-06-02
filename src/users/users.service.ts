import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser({
      name: createUserDto.name,
      email: createUserDto.email,
      status: {
        connect: { id: createUserDto.statusId || 1 },
      },
    });
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: {
      name: QueryUserDto['name'];
      email: QueryUserDto['email'];
    } | null;
    paginationOptions: { page: number; limit: number };
  }): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};

    if (filterOptions?.name) {
      where.name = { equals: filterOptions.name };
    }

    if (filterOptions?.email) {
      where.email = { equals: filterOptions.email };
    }

    const page = Number(paginationOptions.page);
    const limit = Number(paginationOptions.limit);

    console.log('filterOptions', filterOptions);
    console.log('where', where);

    return this.usersRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => new UserEntity(user));
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
