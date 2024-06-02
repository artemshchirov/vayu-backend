import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
  @ApiPropertyOptional({
    description: 'Page number of the pagination',
    example: 1,
    default: 1,
  })
  @Transform(({ value }) => parseInt(value) || 1)
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @Transform(({ value }) => parseInt(value) || 10)
  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({ description: 'Filter by name', example: 'Dor' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by email',
    example: 'dor@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
