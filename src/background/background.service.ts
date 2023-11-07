import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Background, BackgroundDocument } from './schemas/background.model'
import { Model } from 'mongoose'

@Injectable()
export class BackgroundService {
	constructor(
		@InjectModel(Background.name) private readonly model: Model<BackgroundDocument>,
	) {
	}

	async findAllBackgrounds():Promise<Background[]>{
		return await this.model.find().exec()
	}
}
