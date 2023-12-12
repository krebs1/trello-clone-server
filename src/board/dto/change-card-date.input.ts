import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangeCardDateInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'List id' })
	listId: string

	@Field({ description: 'Card id' })
	cardId: string

	@Field(type => Date, { description: 'Start date', nullable: true })
	startDate: Date | null

	@Field(type => Date, { description: 'Due date', nullable: true })
	dueDate: Date | null
}
