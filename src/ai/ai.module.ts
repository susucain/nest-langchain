import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { UserService } from './user.service';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { ToolModule } from '../tool/tool.module';

@Module({
  controllers: [AiController],
  imports: [ToolModule],
  providers: [
    AiService,
    // 注意区分，这个是本地模拟用户数据的 UserService，不是 users 模块的 UsersService
    UserService,
    {
      provide: 'QUERY_USER_TOOL',
      useFactory: (userService: UserService) => {
        const queryUserArgsSchema = z.object({
          userId: z.string().describe('用户 ID，例如: 001, 002, 003'),
        });

        return tool(
          async ({ userId }: { userId: string }) => {
            const user = userService.findOne(userId);

            if (!user) {
              const availableIds = userService
                .findAll()
                .map((u) => u.id)
                .join(', ');

              return `用户 ID ${userId} 不存在。可用的 ID: ${availableIds}`;
            }

            return `用户信息：\n- ID: ${user.id}\n- 姓名（name）: ${user.name}\n- 邮箱（email）: ${user.email}\n- 角色（role）: ${user.role}`;
          },
          {
            name: 'query_user',
            description:
              '查询数据库中的用户信息。输入用户 ID，返回该用户的详细信息（姓名、邮箱、角色）。',
            schema: queryUserArgsSchema,
          },
        );
      },
      inject: [UserService],
    },
  ],
})
export class AiModule {}
