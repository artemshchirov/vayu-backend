import { Status as PrismaStatus, StatusName } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class StatusEntity implements PrismaStatus {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: StatusName.ACTIVE })
  name: StatusName;
}
