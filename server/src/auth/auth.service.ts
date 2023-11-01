import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) return null;
    const passwordIsMatch = await argon2.verify(user.password, password);
    if (passwordIsMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: IUser) {
    const { id, email } = user;

    return {
      id,
      email,
      access_token: this.jwtService.sign({ id, email }),
    };
  }
}
