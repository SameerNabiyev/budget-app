import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.repository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = this.repository.create({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });
    await this.repository.save(user);
    const { password, ...result } = user;
    const access_token = this.jwtService.sign({
      id: result.id,
      email: result.email,
    });
    return {
      ...result,
      access_token,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.repository.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
