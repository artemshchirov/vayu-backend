import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsRepository } from './groups.repository';
import { GroupEntity } from './entities/group.entity';
import { Group } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    return this.groupsRepository.createGroup(createGroupDto);
  }

  async isGroupEmpty(groupId: Group['id']): Promise<boolean> {
    const userCount = await this.groupsRepository.countGroupUsers(groupId);
    return userCount === 0;
  }

  async updateGroupStatus(
    groupId: Group['id'],
    status: Group['status'],
  ): Promise<void> {
    await this.groupsRepository.updateGroupStatus(groupId, status);
  }

  async findAll() {
    const groups = await this.groupsRepository.findAll();
    return groups.map((group) => new GroupEntity(group));
  }
}
