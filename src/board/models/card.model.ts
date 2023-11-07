import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document } from 'mongoose'
import { Label } from './label.model'
import { Member } from './member.model'

export type CardDocument = Card & Document

@ObjectType({ description: 'Card entity' })
@Schema()
export class Card {
	@Field(type => String, { description: 'Card id' })
	_id: string

	@Field({ description: 'Card name' })
	@Prop({ required: true })
	name: string

	@Field({ description: 'Card name', nullable: true })
	@Prop({ default: null })
	description: string | null

	@Field({ description: 'Card start date', nullable: true })
	@Prop({ default: null })
	startDate: Date | null

	@Field({ description: 'Card due date', nullable: true })
	@Prop({ default: null })
	dueDate: Date | null

	@Field(type => [String], { description: 'Card labels', nullable: true })
	@Prop({ type: [Types.ObjectId], default: null })
	labels: Types.Array<Types.ObjectId> | null
}

export const CardSchema = SchemaFactory.createForClass(Card)
