import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import { CustomError } from "../class/CustomError";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {
    async execute({ email, password }: IAuthenticateRequest) {
        const usersRepository = getCustomRepository(UsersRepositories);

        // Verifica se o email existe
        const user = await usersRepository.findOne({
            email
        });

        if (!user) {
            throw new CustomError(401, "Email/Password incorrect!");
        }

        // Verifica se a senha informada está correta
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new CustomError(401, "Email/Password incorrect!");
        }

        // Gerar token
        const token = sign(
            {
                email
            },
            "",
            {
                subject: user.id,
                expiresIn: "1d"
            }
        );

        return token;
    }
}

export { AuthenticateUserService };
