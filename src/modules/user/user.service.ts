import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
        
    ) {}

   async createUser(userData: Partial<UserEntity>): Promise<UserEntity>{

        const user = this.userRepository.create(userData);
        return this.userRepository.save(user)
    }

   async findByEmail (email:string) {
        const user = await this.userRepository.findOneBy({email})
        return user;
    }

  async validateUser (email: string, password:string) {
        const user = await this.findByEmail(email);
        if(!user){
            return null
        }
       const status =  bcrypt.compareSync(password, user.password);
       console.log(status)
        if(status) {
            return user
        }
        return null 
    }
}