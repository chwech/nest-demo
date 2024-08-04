import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // console.log(context);
    const request = context.switchToHttp().getRequest();

    // console.log('守卫', request.headers);

    // return false的话，将不进入controller，响应403
    return true;
  }
}
