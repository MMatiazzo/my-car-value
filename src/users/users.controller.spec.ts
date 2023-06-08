import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {

  let controller: Partial<UsersController>;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {

    // const users: User[] = [];

    fakeUsersService = {
      findOne: (id: number) => Promise.resolve({ id, email: 'email@email.com', password: 'password' } as User),
      find: (email: string) =>  Promise.resolve([{ id: 1, email, password: 'password' }] as User[]),
      remove: (id: number) => Promise.resolve({} as User),
      update: (id: number, { password }) => Promise.resolve({} as User)
    }

    fakeAuthService = {
     signin: (email: string, password: string) => Promise.resolve({ id: 1 , email, password } as User),
     signup: (email: string, password: string) => Promise.resolve({} as User)
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all user returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('singin updates session object and returns user', async () => {
    const session = { userId: 0 };
    const user = await controller.signin({ email: 'test@email.com', password: 'password' }, session);
    
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
