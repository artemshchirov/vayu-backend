import { Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        name: createGroupDto.name,
        status: createGroupDto.status,
      },
    });
  }

  async updateGroupStatus(
    groupId: number,
    status: 'EMPTY' | 'NOT_EMPTY',
  ): Promise<void> {
    await this.prisma.group.update({
      where: { id: groupId },
      data: { status: status },
    });
  }

  async countGroupUsers(groupId: number): Promise<number> {
    const result = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: {
        _count: {
          select: { users: true },
        },
      },
    });
    return result?._count.users || 0;
  }

  async findAll(): Promise<Group[]> {
    return await this.prisma.group.findMany({
      include: {
        users: true,
      },
    });
  }
}
