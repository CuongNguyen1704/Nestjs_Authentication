import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


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

    @CreateDateColumn()
    created_at : Date;

    @CreateDateColumn()
    updated_at: Date;





}