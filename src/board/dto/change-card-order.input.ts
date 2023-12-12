import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangeCardOrderInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'List id' })
	listId: string

	@Field({ description: 'First index' })
	firstIndex: number

	@Field({ description: 'Second index' })
	secondIndex: number
}
