import { Module } from '@nestjs/common'
import { BackgroundService } from './background.service'
import { BackgroundResolver } from './background.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Background, BackgroundSchema } from './schemas/background.model'

@Module({
	providers: [BackgroundService, BackgroundResolver],
	imports: [
		MongooseModule.forFeature([
			{ name: Background.name, schema: BackgroundSchema },
		]),
	],
})
export class BackgroundModule {}
