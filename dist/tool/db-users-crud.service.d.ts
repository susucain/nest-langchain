import { StructuredTool } from '@langchain/core/tools';
import { UsersService } from '../users/users.service';
export declare class DbUsersCrudService {
    readonly tool: StructuredTool;
    constructor(usersService: UsersService);
}
