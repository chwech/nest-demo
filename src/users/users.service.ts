import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EncrytHelper } from 'src/utils/helper';

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
}
