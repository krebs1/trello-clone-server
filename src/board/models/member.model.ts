import { Types, Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../user/schemas/user.model'
import { Field, ObjectType } from '@nestjs/graphql'

export type MemberDocument = Member & Document

@ObjectType({ description: 'Member entity' })
@Schema()
export class Member {
	@Field(type => String, { description: 'User id' })
	_id: Types.ObjectId

	@Field(type => String, { description: 'Member id' })
	@Prop({ type: Types.ObjectId, ref: User.name })
	userId: Types.ObjectId
}

export const MemberSchema = SchemaFactory.createForClass(Member)
