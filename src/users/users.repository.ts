import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
}
