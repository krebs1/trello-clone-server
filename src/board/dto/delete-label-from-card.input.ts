import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteLabelFromCardInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'List id' })
	listId: string

	@Field({ description: 'Card id' })
	cardId: string

	@Field({ description: 'Label id' })
	labelId: string
}
