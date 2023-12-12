import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Role, RoleDocument } from './models/role.model'
import { Model } from 'mongoose'

@Injectable()
export class RoleService {
	constructor(
		@InjectModel(Role.name) private readonly model: Model<RoleDocument>
	) {
	}

	async getAllRoles():Promise<Role[]>{
		return await this.model.find().exec();
	}

	async getRoleById(_id: string):Promise<Role>{
		return await this.model.findById(_id).exec();
	}
}
