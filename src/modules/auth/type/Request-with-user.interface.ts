import { UserEntity } from "src/modules/user/user.entity";
import { Request } from "@nestjs/common";
export interface RequestWithUser extends Request {
    user: UserEntity

}