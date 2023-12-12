import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Field, ObjectType } from '@nestjs/graphql'

export type UserDocument = User & Document

@ObjectType({ description: 'User entity' })
@Schema({ timestamps: true })
export class User {
	@Field(type => String, { description: 'User id' })
	_id: MongooseSchema.Types.ObjectId

	@Field({ description: 'User name' })
	@Prop({ required: false })
	name: string

	@Field({ description: 'User email' })
	@Prop({ required: true, unique: true })
	email: string

	@Field({ description: 'User image' })
	@Prop({ required: false })
	image: string

	@Field({ description: 'User emailVerified', nullable: true })
	@Prop({ required: false })
	emailVerified: Date | null
}

export const UserSchema = SchemaFactory.createForClass(User)
