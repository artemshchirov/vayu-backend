import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status, StatusName } from '@prisma/client';
import { Type } from 'class-transformer';
import { StatusEntity } from '../../statuses/entities/status.entity';
import { IsEmail } from 'class-validator';

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alice' })
  name: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: StatusName.ACTIVE, enum: StatusName })
  statusId: number;

  @ApiProperty({ example: StatusName.ACTIVE, enum: StatusName })
  @Type(() => StatusEntity)
  status: Status;

  @ApiPropertyOptional({ example: 1, nullable: true })
  groupId?: number | null;

  @ApiProperty({ example: '2022-10-21T14:48:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2022-10-21T14:48:00.000Z' })
  updatedAt: Date;
}
