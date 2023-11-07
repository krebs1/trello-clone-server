import { Types, Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, ObjectType } from '@nestjs/graphql'

export type ColorDocument = Color & Document

@ObjectType({ description: 'Color entity' })
@Schema()
export class Color {
	@Field(type => String, { description: 'Color id' })
	_id: Types.ObjectId

	@Field({ description: 'Color color code' })
	@Prop({ required: true })
	color: string

	@Field({ description: 'Color name' })
	@Prop({ required: true })
	name: string
}

export const ColorSchema = SchemaFactory.createForClass(Color)
