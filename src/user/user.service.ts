import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './models/user.model'
import { Model } from 'mongoose'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly model: Model<UserDocument>,
	) {}

	async getUserById(_id: string): Promise<User>{
		return await this.model.findById(_id).exec();
	}
}
