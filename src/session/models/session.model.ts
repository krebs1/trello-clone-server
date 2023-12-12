import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type SessionDocument = Session & Document

export class Session {
	_id: Types.ObjectId
	@Prop({ required: true })
	sessionToken: string
	@Prop({ required: true })
	userId: Types.ObjectId
	@Prop({ required: true })
	expires: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session)
