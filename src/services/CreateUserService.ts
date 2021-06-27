import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { CustomError } from "../class/CustomError";
import { hash } from "bcryptjs";

interface IUserRequest {
    name: string;
    email: string;
    admin?: boolean;
    password: string;
}

class CreateUserService {
    async execute({ name, email, admin = false, password }: IUserRequest) {
        const UsersRepository = getCustomRepository(UsersRepositories);

        if (!email) {
            throw new CustomError(400, "Email incorrect");
        }

        const userAlreadyExists = await UsersRepository.findOne({
            email
        });

        if (userAlreadyExists) {
            throw new CustomError(400, "User already exists");
        }

        const passwordHash = await hash(password, 8);

        const user = UsersRepository.create({
            name,
            email,
            admin,
            password: passwordHash
        });

        await UsersRepository.save(user);

        return user;
    }
}

export { CreateUserService }