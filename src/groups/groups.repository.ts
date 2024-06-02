import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
