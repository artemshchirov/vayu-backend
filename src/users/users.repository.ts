import { Injectable } from '@nestjs/common';
import { Group, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UpdateUsersStatusesDto } from './dto/update-user-statuses.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        status: true,
        group: true,
      },
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

  async getUserGroupId(userId: User['id']): Promise<Group['id'] | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { groupId: true },
    });
    return user?.groupId;
  }

  async addUserToGroup(
    userId: User['id'],
    groupId: Group['id'],
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { groupId: groupId },
    });
  }

  async removeUserFromGroup(userId: User['id']): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { groupId: null },
    });
  }

  async countUsersInGroup(groupId: Group['id']): Promise<number> {
    return this.prisma.user.count({
      where: { groupId: groupId },
    });
  }

  async updateStatuses(
    updates: UpdateUsersStatusesDto['updates'],
  ): Promise<void> {
    const batchSize = 100;
    const retryLimit = 3;

    const processBatch = async (batch: typeof updates, batchIndex: number) => {
      try {
        await this.prisma.$transaction(async (prisma) => {
          const updatePromises = batch.map((update) =>
            prisma.user.update({
              where: { id: update.userId },
              data: { statusId: update.statusId },
            }),
          );
          await Promise.all(updatePromises);
        });
        return { index: batchIndex, success: true };
      } catch (error) {
        console.error(`Failed to update batch ${batchIndex}:`, error);
        return { index: batchIndex, success: false, error };
      }
    };

    const handleBatches = async (batchIndexes: number[]) => {
      const results = [];
      let retryCount = 0;

      while (batchIndexes.length > 0 && retryCount < retryLimit) {
        const currentIndexes = [...batchIndexes];
        batchIndexes.length = 0;

        for (const index of currentIndexes) {
          const start = index * batchSize;
          const batch = updates.slice(start, start + batchSize);
          const result = await processBatch(batch, index);
          results.push(result);

          if (!result.success) {
            batchIndexes.push(index);
          }
        }

        retryCount++;
      }

      return results.filter((r) => !r.success);
    };

    const totalBatches = Math.ceil(updates.length / batchSize);
    const batchIndexes = [...Array(totalBatches).keys()];
    const failedBatches = await handleBatches(batchIndexes);

    if (failedBatches.length > 0) {
      console.error(
        `Some batches still failed after ${retryLimit} retries:`,
        failedBatches,
      );
      throw new Error('Failed to update some user statuses after retries');
    }
  }
}
