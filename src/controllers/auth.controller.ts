import { Body, Controller, HttpCode, HttpStatus, NotImplementedException, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';

class UserCredentials {
  @IsEmail() readonly email: string;
  @IsNotEmpty() readonly password: string;
}

@Controller()
export class AuthenticationController {
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userCredentials: UserCredentials): Promise<{ token: string }> {
    throw new NotImplementedException();
  }
}
