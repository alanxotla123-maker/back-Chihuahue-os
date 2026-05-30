import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { email } = createAuthDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    const user = this.userRepository.create(createAuthDto);
    return this.userRepository.save(user);
  }

  async login(loginDto: import('./dto/login.dto').LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) throw new NotFoundException(`Credenciales inválidas`);
    if (user.password !== loginDto.password) throw new NotFoundException(`Credenciales inválidas`);
    
    return {
      message: 'Inicio de sesión exitoso',
      user: {
        userId: user.userId,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const user = await this.userRepository.preload({
      userId: id,
      ...updateAuthDto,
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
