import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'

@Entity('users')

export class UserEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email: string;

    @Column()
    name:string;

    @Column()
    password: string

    @Column({nullable:true})
    refresh_token?: string

    @CreateDateColumn()
    created_at : Date;

    @CreateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    async hassPassword (){
        if(this.password ){
            
            this.password = await bcrypt.hash(this.password,10)
        }
        
    }





}