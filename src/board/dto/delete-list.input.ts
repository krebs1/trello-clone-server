import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteListInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'List id' })
	listId: string
}
