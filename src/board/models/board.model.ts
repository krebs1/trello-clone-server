import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { List, ListSchema } from './list.model'
import { Member, MemberSchema } from './member.model'
import { Label, LabelSchema } from './label.model'
import { Background } from '../../background/schemas/background.model'
import { Role } from '../../role/models/role.model'

export type BoardDocument = Board & Document

@ObjectType({ description: 'Board entity' })
@Schema()
export class Board {
	@Field(type => String, { description: 'Board id' })
	_id: string

	@Field({ description: 'Board name' })
	@Prop({ required: true })
	name: string

	@Field(type => String, { description: 'Board background id' })
	@Prop({ type: Types.ObjectId, ref: Background.name })
	background: Types.ObjectId

	@Field(type => Background, { description: 'Board background info' })
	backgroundInfo: Background

	@Field(type => [Member], { description: 'Board members', nullable: true })
	@Prop({ type: [MemberSchema], default: null })
	members: Types.Array<Member> | null

	@Field(type => [List], { description: 'Board lists', nullable: true })
	@Prop({ type: [ListSchema], default: null })
	lists: Types.Array<List> | null

	@Field(type => [Label], { description: 'Board labels', nullable: true })
	@Prop({ type: [LabelSchema], default: null })
	labels: Types.Array<Label> | null

	@Field(type => String, { description: 'Board invite link', nullable: true })
	@Prop({ default: null })
	inviteLink: string | null

	@Field(type => String, { description: 'Board default role' })
	@Prop({ type: Types.ObjectId, ref: Role.name })
	defaultRole: Types.ObjectId
}

export const BoardSchema = SchemaFactory.createForClass(Board)
