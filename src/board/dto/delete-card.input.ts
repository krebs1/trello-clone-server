import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteCardInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'List id' })
	listId: string

	@Field({ description: 'Card id' })
	cardId: string
}
