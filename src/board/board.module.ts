import { Module } from '@nestjs/common'
import { BoardResolver } from './board.resolver'
import { BoardService } from './board.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Board, BoardSchema } from './models/board.model'
import { JwtService } from '@nestjs/jwt'
import { SessionModule } from '../session/session.module'
import { HasAccessGuard } from '../guards/hasAccessGuard'

@Module({
	providers: [BoardResolver, BoardService, JwtService],
	imports: [
		MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
		SessionModule,
	],
})
export class BoardModule {}
