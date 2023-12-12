import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { SessionService } from '../session/session.service'
import { BoardService } from '../board/board.service'

@Injectable()
export class HasAccessGuard implements CanActivate {
	constructor(
		private readonly sessionService: SessionService,
		private readonly boardService: BoardService
	) {
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const gqlCtx = context.getArgByIndex(1)
		const boardId = gqlCtx.boardId

		const request: Request = context.getArgByIndex(2).req
		const token = this.extractTokenFromCookie(request)

		const session = await this.sessionService.getSessionByToken(token)

		const check = await this.boardService.checkUserHasAccess(boardId, session.userId)

		if(!check) {
			throw new UnauthorizedException('У вас нет доступа к доске')
		}

		return true
	}

	private extractTokenFromCookie(request: Request): string | undefined {
		return request.cookies['next-auth.session-token']
	}
}