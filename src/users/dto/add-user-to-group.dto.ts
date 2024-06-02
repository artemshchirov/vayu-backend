import { IsInt, Min } from 'class-validator';

export class UserIdParam {
  @IsInt({ message: 'User ID must be an integer.' })
  @Min(1, { message: 'User ID must be a positive integer.' })
  userId: number;
}

export class GroupIdParam {
  @IsInt({ message: 'Group ID must be an integer.' })
  @Min(1, { message: 'Group ID must be a positive integer.' })
  groupId: number;
}
