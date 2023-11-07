import { Module } from '@nestjs/common'
import { SessionService } from './session.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Session, SessionSchema } from './models/session.model'

@Module({
	providers: [SessionService],
	imports: [
		MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
	],
	exports: [SessionService],
})
export class SessionModule {}
