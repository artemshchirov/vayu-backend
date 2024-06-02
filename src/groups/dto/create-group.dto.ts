import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GroupStatus } from '@prisma/client';

export class CreateGroupDto {
  @ApiProperty({ example: 'Developers', description: 'The name of the group' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: GroupStatus.EMPTY,
    enum: GroupStatus,
    description: 'Initial status of the group',
  })
  @IsEnum(GroupStatus)
  status: GroupStatus;
}
