import { ApiProperty } from '@nestjs/swagger';
import { GroupStatus, User } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';
import { Type } from 'class-transformer';

export class GroupEntity {
  constructor(partial: Partial<GroupEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Developers' })
  name: string;

  @ApiProperty({ example: GroupStatus.NOT_EMPTY, enum: GroupStatus })
  status: GroupStatus;

  @ApiProperty({
    type: () => [UserEntity],
    description: 'List of users in the group',
  })
  @Type(() => UserEntity)
  users: User[];

  @ApiProperty({ example: '2022-10-21T14:48:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2022-10-21T14:48:00.000Z' })
  updatedAt: Date;
}
