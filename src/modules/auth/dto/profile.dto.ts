import { Expose } from "class-transformer";

export class ProfileDto {
    @Expose()
    email: string

    @Expose()
    name: string

    @Expose()
    password: string
}