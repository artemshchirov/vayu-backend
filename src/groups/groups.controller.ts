import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Groups')
@Controller({
  path: 'groups',
  version: '1',
})
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully created.',
  })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.createGroup(createGroupDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({
    status: 200,
    description: 'Get all groups',
  })
  findAll() {
    return this.groupsService.findAll();
  }
}
