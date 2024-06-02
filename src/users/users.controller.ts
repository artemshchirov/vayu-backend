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
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { infinityPagination } from '../utils/infinity-pagination';
import { QueryUserDto } from './dto/query-user.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateUsersStatusesDto } from './dto/update-user-statuses.dto';
import { UserEntity } from './entities/user.entity';
import { Group, User } from '@prisma/client';

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

  @Patch(':userId/add-to-group/:groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'userId', type: 'number', description: 'ID of the user' })
  @ApiParam({ name: 'groupId', type: 'number', description: 'ID of the group' })
  addUserToGroup(
    @Param('userId') userId: User['id'],
    @Param('groupId') groupId: Group['id'],
  ): Promise<void> {
    return this.usersService.addUserToGroup(+userId, +groupId);
  }

  @Delete('remove-from-group/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the user' })
  async removeUserFromGroup(@Param('id') id: User['id']): Promise<void> {
    return this.usersService.removeUserFromGroup(+id);
  }
}
