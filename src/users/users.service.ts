import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Group, GroupStatus, Prisma, User } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUsersStatusesDto } from './dto/update-user-statuses.dto';
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly groupsService: GroupsService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser({
      name: createUserDto.name,
      email: createUserDto.email,
      status: {
        connect: { id: createUserDto.statusId || 1 },
      },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => new UserEntity(user));
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
  }): Promise<UserEntity[]> {
    const where: Prisma.UserWhereInput = {};

    if (filterOptions?.name) {
      where.name = { equals: filterOptions.name };
    }

    if (filterOptions?.email) {
      where.email = { equals: filterOptions.email };
    }

    const page = Number(paginationOptions.page);
    const limit = Number(paginationOptions.limit);

    const users = await this.usersRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
    });
    return users.map((user) => new UserEntity(user));
  }

  async updateStatuses(
    updateUsersStatusesDto: UpdateUsersStatusesDto,
  ): Promise<void> {
    const { updates } = updateUsersStatusesDto;
    await this.usersRepository.updateStatuses(updates);
  }

  async addUserToGroup(
    userId: User['id'],
    groupId: Group['id'],
  ): Promise<void> {
    const oldGroupId = await this.usersRepository.getUserGroupId(userId);
    const groupWasEmpty = await this.groupsService.isGroupEmpty(groupId);
    await this.usersRepository.addUserToGroup(userId, groupId);
    if (groupWasEmpty) {
      await this.groupsService.updateGroupStatus(
        groupId,
        GroupStatus.NOT_EMPTY,
      );
    }

    if (oldGroupId) {
      await this.updateOldGroupStatus(oldGroupId);
    }
  }

  private async updateOldGroupStatus(groupId: Group['id']): Promise<void> {
    const oldGroupIsEmpty = await this.groupsService.isGroupEmpty(groupId);

    if (oldGroupIsEmpty) {
      await this.groupsService.updateGroupStatus(groupId, GroupStatus.EMPTY);
    }
  }

  async removeUserFromGroup(userId: User['id']): Promise<void> {
    const groupId = await this.usersRepository.getUserGroupId(userId);
    if (!groupId) {
      throw new BadRequestException('Group ID must not be null or undefined');
    }

    await this.usersRepository.removeUserFromGroup(userId);

    const groupIsEmpty = await this.groupsService.isGroupEmpty(groupId);
    if (groupIsEmpty) {
      await this.groupsService.updateGroupStatus(groupId, GroupStatus.EMPTY);
    }
  }
}
