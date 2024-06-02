import { ApiProperty } from '@nestjs/swagger';
import { GroupStatus } from '@prisma/client';

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

  @ApiProperty({ example: '2022-10-21T14:48:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2022-10-21T14:48:00.000Z' })
  updatedAt: Date;
}
