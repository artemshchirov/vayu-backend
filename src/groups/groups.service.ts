import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsRepository } from './groups.repository';
import { GroupEntity } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    return this.groupsRepository.createGroup(createGroupDto);
  }

  async isGroupEmpty(groupId: number): Promise<boolean> {
    const userCount = await this.groupsRepository.countGroupUsers(groupId);
    return userCount === 0;
  }

  async updateGroupStatus(
    groupId: number,
    status: 'EMPTY' | 'NOT_EMPTY',
  ): Promise<void> {
    await this.groupsRepository.updateGroupStatus(groupId, status);
  }

  async findAll() {
    const groups = await this.groupsRepository.findAll();
    return groups.map((group) => new GroupEntity(group));
  }
}
