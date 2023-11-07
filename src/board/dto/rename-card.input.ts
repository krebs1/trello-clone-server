import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RenameCardInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'List id' })
	listId: string

	@Field({ description: 'Card id' })
	cardId: string

	@Field({ description: 'Card name' })
	name: string
}
