import { HttpException, HttpStatus } from '@nestjs/common';

export class httpErrorException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
