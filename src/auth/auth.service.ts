import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { EncrytHelper } from 'src/utils/helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly encrytHelper: EncrytHelper,
  ) {}

  login(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const decryptPass = await this.encrytHelper.decrypt(user.password, user.iv);

    if (user && decryptPass === pass) {
      const { iv, password, ...result } = user;
      return result;
    }
    return null;
  }
}
