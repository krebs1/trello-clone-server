import { Types, Document } from 'mongoose'
import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Color } from '../../color/schemas/color.model'

export type LabelDocument = Label & Document

@ObjectType({ description: 'Label entity' })
@Schema()
export class Label {
	@Field(type => String, { description: 'Label id' })
	_id: Types.ObjectId

	@Field(type => String, { description: 'Label color id', nullable: true })
	@Prop({
		required: false,
		type: Types.ObjectId,
		ref: Color.name,
		default: null,
	})
	colorId: Types.ObjectId | null

	@Field(type => Color, { description: 'Label color info', nullable: true })
	colorInfo: Color | null

	@Field({ description: 'Label text', nullable: true })
	@Prop({ required: false, default: null })
	text: string | null
}

export const LabelSchema = SchemaFactory.createForClass(Label)
