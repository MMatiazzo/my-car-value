import { Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Delete,
  Patch,
  Session,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

import { AuthGuard } from '../guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
      return user;
    }

  @Post('/signup')
  async createUser(@Body() {email, password}: CreateUserDto, @Session() session: any) {
    const user =  await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() {email, password}: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if(!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Get('/')
  async findAllUsers(@Query('email') email: string) {
    return await this.usersService.find(email);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto
    ) {
      return await this.usersService.update(parseInt(id), {...body})
  }

}
