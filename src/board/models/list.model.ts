import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document } from 'mongoose'
import { Card, CardSchema } from './card.model'
import { Member } from './member.model'

export type ListDocument = List & Document

@ObjectType({ description: 'List entity' })
@Schema()
export class List {
	@Field(type => String, { description: 'List id' })
	_id: string

	@Field({ description: 'List name' })
	@Prop({ required: true })
	name: string

	@Field(type => [Card], { description: 'List cards array', nullable: true })
	@Prop({ type: [CardSchema], default: null })
	cards: Types.Array<Card> | null
}

export const ListSchema = SchemaFactory.createForClass(List)
