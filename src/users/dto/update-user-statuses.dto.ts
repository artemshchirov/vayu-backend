import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UpdateUserStatusDto {
  @ApiProperty({
    description: 'ID of the user',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID of the new status',
    example: 2,
  })
  @IsInt()
  statusId: number;
}

export class UpdateUsersStatusesDto {
  @ApiProperty({
    description: 'Array of updates',
    example: [
      { userId: 1, statusId: 3 },
      { userId: 2, statusId: 2 },
      { userId: 3, statusId: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserStatusDto)
  updates: UpdateUserStatusDto[];
}
