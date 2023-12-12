import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { SessionService } from '../session/session.service'

@Injectable()
export class GqlGuard implements CanActivate {
	constructor(private readonly sessionService: SessionService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const gqlCtx = context.getArgByIndex(2)
		const request: Request = gqlCtx.req
		const token = this.extractTokenFromCookie(request)

		if (!token) {
			throw new UnauthorizedException('Вы не авторизованы')
		}

		return this.sessionService.validate(token)
	}

	private extractTokenFromCookie(request: Request): string | undefined {
		return request.cookies['next-auth.session-token']
	}
}
