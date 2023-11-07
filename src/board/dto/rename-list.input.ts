import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RenameListInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'List id' })
	listId: string

	@Field({ description: 'List name' })
	name: string
}
