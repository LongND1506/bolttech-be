import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../user/dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const [type, accessToken] = req.headers.authorization?.split(' ') ?? [];
    const token = type === 'Bearer' ? accessToken : undefined;

    if (!token) throw new UnauthorizedException();

    try {
      const user = await this._jwtService.verifyAsync(token);

      req['user'] = user as UserDto;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }
}
