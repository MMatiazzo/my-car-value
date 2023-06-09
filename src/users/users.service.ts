import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return await this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    return await this.repo.findOneBy({ id });
  }

  async find(email: string) {
    return await this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotAcceptableException(`User with id ${id} not found`);
    }

    Object.assign(user, attrs);

    return await this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotAcceptableException(`User with id ${id} not found`);
    }

    return await this.repo.remove(user);
  }
}
