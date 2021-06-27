import { getCustomRepository } from "typeorm"
import { TagsRepositories } from "../repositories/TagsRepositories";
import { CustomError } from "../class/CustomError";

class CreateTagService {
    async execute(name: string) {
        const tagsRepository = getCustomRepository(TagsRepositories);

        if (!name) {
            throw new CustomError(400, "Incorrect name!");
        }

        const tagAlreadyExists = await tagsRepository.findOne({
            name
        });

        if (tagAlreadyExists) {
            throw new CustomError(400, "Tag already exists!");
        }

        const tag = tagsRepository.create({
            name
        });

        await tagsRepository.save(tag);

        return tag;
    }
}

export { CreateTagService }