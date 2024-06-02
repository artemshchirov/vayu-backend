import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusName } from '@prisma/client';

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alice' })
  name: string;

  @ApiProperty({ example: 'alice@example.com' })
  email: string;

  @ApiProperty({ example: StatusName.ACTIVE, enum: StatusName })
  statusId: number;

  @ApiPropertyOptional({ example: 1, nullable: true })
  groupId?: number | null;

  @ApiProperty({ example: '2022-10-21T14:48:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2022-10-21T14:48:00.000Z' })
  updatedAt: Date;
}
