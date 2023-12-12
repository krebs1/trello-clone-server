import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { BoardService } from '../board/board.service'
import { Request } from 'express'
import { SessionService } from '../session/session.service'

enum Roles {
	ADMIN = '655cd1c9dc7883f2632ccbcf',
	MEMBER = '655cce56dc7883f2632ccbcd',
	OBSERVER = '655ccee0dc7883f2632ccbce',
}

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly boardService: BoardService,
		private readonly sessionService: SessionService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<string[]>('roles', context.getHandler())
		const rolesIds = roles.map(role => Roles[role])

		const gqlCtx = context.getArgByIndex(1)
		const boardId = gqlCtx.boardId

		const request: Request = context.getArgByIndex(2).req
		const token = this.extractTokenFromCookie(request)

		const session = await this.sessionService.getSessionByToken(token)

		const member = await this.boardService.getMemberByUserId(boardId, session.userId.toString())

		const check = rolesIds.includes(member.role.toString());

		if(!check){
			throw new UnauthorizedException('У вас не подходящая роль для совершения данного действия');
		}

		return true
	}

	private extractTokenFromCookie(request: Request): string | undefined {
		return request.cookies['next-auth.session-token']
	}
}
