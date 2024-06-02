import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusEnum } from '../../statuses/statuses.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Dor Zammir' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'dor@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: StatusEnum.ACTIVE,
    description: 'Status ID',
    required: false,
  })
  @IsInt()
  @IsOptional()
  statusId?: number;
}
