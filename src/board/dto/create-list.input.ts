import { Field, InputType } from '@nestjs/graphql'
import { List } from '../models/list.model'

@InputType()
export class CreateListInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field(type => String, { description: 'List name' })
	name: string
}
