import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export type BackgroundDocument = Background & Document

@ObjectType({description: 'Background entity'})
@Schema()
export class Background{
	@Field(type => String, { description: 'Background id' })
	_id: Types.ObjectId

	@Field({ description: 'Image path' })
	@Prop({ required: true })
	imagePath: string

	@Field({ description: 'Preview path' })
	@Prop({ required: true })
	previewPath: string
}

export const BackgroundSchema = SchemaFactory.createForClass(Background)