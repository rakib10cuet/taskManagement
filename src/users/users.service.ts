import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export type User = any;
@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'Rezwoan',
      password: '12345',
    },
    {
      userId: 2,
      username: 'Raihan',
      password: '12345',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
  async findOneById(id: number) {
    const usersData = [
      {
        id: 1,
        username: 'Rezwoan',
        password: '12345',
      },
      {
        id: 2,
        username: 'Raihan',
        password: '12345',
      },
    ];
    const userDetails = await usersData.find((user) => user.id == id);
    console.log(userDetails);
    if (userDetails === undefined) {
      throw new HttpException(`ssss`, HttpStatus.NOT_FOUND);
    }
    return userDetails;
  }
}
