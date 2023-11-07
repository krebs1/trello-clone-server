import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Color, ColorDocument } from './schemas/color.model'
import { Model } from 'mongoose'

@Injectable()
export class ColorService {
	constructor(
		@InjectModel(Color.name) private readonly model: Model<ColorDocument>,
	) {}

	async findAllColors(): Promise<Color[]> {
		return await this.model.find().exec()
	}

	async findColorById(_id: string): Promise<Color> {
		return await this.model.findById(_id).exec()
	}
}
