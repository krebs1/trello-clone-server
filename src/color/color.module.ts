import { Module } from '@nestjs/common'
import { ColorResolver } from './color.resolver'
import { ColorService } from './color.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Color, ColorSchema } from './schemas/color.model'

@Module({
	providers: [ColorResolver, ColorService],
	imports: [
		MongooseModule.forFeature([{ name: Color.name, schema: ColorSchema }]),
	],
})
export class ColorModule {}
