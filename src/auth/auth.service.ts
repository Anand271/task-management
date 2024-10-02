/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
        constructor(
            @InjectRepository(User)
            //private userRepositoty: UserRepository,
            private readonly userRepositoty: Repository<User>,
            private jwtService: JwtService,

        ){}

    async singUp(authCredentialsDto : AuthCredentialsDto): Promise<void>{

        const {username, password} = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(salt)
        console.log(hashedPassword);

        const user = this.userRepositoty.create({ username, password: hashedPassword });

        try {
            await this.userRepositoty.save(user);
        } catch (error) {
            //
            if(error.code === '23505'){//23505 = duplicate error code
                throw new ConflictException('Username already exists');
            }else{
                throw new InternalServerErrorException();
            }
        }
    }

    async singIn(authCredentialsDto : AuthCredentialsDto): Promise<{accessToken: string}>{
        const {username, password} = authCredentialsDto;

        const user = await this.userRepositoty.findOneBy({ username: username })

        if(user && (await bcrypt.compare(password, user.password))){

            const payload : JwtPayload = {username};
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken }
        }else{
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}
