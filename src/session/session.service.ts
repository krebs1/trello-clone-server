import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Session, SessionDocument } from './models/session.model'
import { Model } from 'mongoose'

@Injectable()
export class SessionService {
	constructor(
		@InjectModel(Session.name) private readonly model: Model<SessionDocument>,
	) {}

	async validate(sessionToken: string): Promise<boolean> {
		const session = await this.model
			.findOne({ sessionToken: sessionToken })
			.exec()
		return !!session
	}
}
