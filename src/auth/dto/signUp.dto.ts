import { Optional } from '@nestjs/common';

export class SignUpDto {
  @Optional()
  id: string;

  @Optional()
  username: string;

  @Optional()
  email: string;

  @Optional()
  password: string;

  @Optional()
  contact_number: string;

  @Optional()
  address: string;
}
