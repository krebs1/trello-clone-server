import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export type RoleDocument = Role & Document

@ObjectType({ description: 'Role entity' })
@Schema()
export class Role {
	@Field(type => String, { description: 'Role id' })
	_id: Types.ObjectId

	@Field(type => String, { description: 'Role name' })
	@Prop({ required: true })
	name: string

	@Field(type => String, { description: 'Role description' })
	@Prop({ required: true })
	description: string

	@Field(type => String, { description: 'Role can be name' })
	@Prop({ required: true })
	canBeName: string
}

export const RoleSchema = SchemaFactory.createForClass(Role)