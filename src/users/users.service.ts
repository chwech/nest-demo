import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EncrytHelper } from 'src/utils/helper';
import { PageParams } from 'src/article/article.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private encryHelper: EncrytHelper,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }

  async create(createUserDto: CreateUserDto) {
    const { iv, encrytText: password } = await this.encryHelper.encryt(
      createUserDto.password,
    );
    const newUser = {
      ...createUserDto,
      password,
      iv,
    };
    const user = new User(newUser);
    return this.userRepository.save(user);
  }

  async findAll(options: PageParams) {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (options.page - 1) * options.per_page,
      take: options.per_page
    });

    return {
      data,
      total,
      current_page: options.page,
    };
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async update(id:number, user) {
    const _user = await this.userRepository.findOne(id);
    const { iv, encrytText: password } = await this.encryHelper.encryt(
      user.password,
    );
    _user.password = password
    _user.iv = iv
    return this.userRepository.save(_user)
  }
}
