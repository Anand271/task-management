/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authSerivce: AuthService){}
    
    @Post('/singup')
    async singUp(@Body() authCredentialsDto : AuthCredentialsDto): Promise<void>{
        return await this.authSerivce.singUp(authCredentialsDto);
    }

    @Post('/singin')
    async singIn(@Body() authCredentialsDto : AuthCredentialsDto): Promise<{accessToken: string}>{
        return await this.authSerivce.singIn(authCredentialsDto);
    }
}
