import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCardInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'List id' })
	listId: string

	@Field(type => String, { description: 'Card name' })
	name: string
}
