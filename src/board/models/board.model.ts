import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { List, ListSchema } from './list.model'
import { Member, MemberSchema } from './member.model'
import { Label, LabelSchema } from './label.model'

export type BoardDocument = Board & Document

@ObjectType({ description: 'Board entity' })
@Schema()
export class Board {
	@Field(type => String, { description: 'Board id' })
	_id: string

	@Field({ description: 'Board name' })
	@Prop({ required: true })
	name: string

	@Field({ description: 'Board background', nullable: true })
	@Prop({ default: null })
	background: string | null

	@Field(type => [Member], { description: 'Board members', nullable: true })
	@Prop({ type: [MemberSchema], default: null })
	members: Types.Array<Member> | null

	@Field(type => [List], { description: 'Board lists', nullable: true })
	@Prop({ type: [ListSchema], default: null })
	lists: Types.Array<List> | null

	@Field(type => [Label], { description: 'Board labels', nullable: true })
	@Prop({ type: [LabelSchema], default: null })
	labels: Types.Array<Label> | null
}

export const BoardSchema = SchemaFactory.createForClass(Board)
