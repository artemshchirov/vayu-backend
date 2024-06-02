import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { User } from '@prisma/client';
import { infinityPagination } from '../utils/infinity-pagination';
import { QueryUserDto } from './dto/query-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUsersStatusesDto } from './dto/update-user-statuses.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllWithPagination(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<UserEntity>> {
    console.log('query', query);

    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const filterOptions = {
      name: query.name,
      email: query.email,
    };

    return infinityPagination(
      await this.usersService.findManyWithPagination({
        filterOptions,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Post('update-statuses')
  @HttpCode(HttpStatus.OK)
  async updateStatuses(
    @Body() updateUsersStatusesDto: UpdateUsersStatusesDto,
  ): Promise<void> {
    await this.usersService.updateStatuses(updateUsersStatusesDto);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
