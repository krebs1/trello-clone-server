import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MoveCardInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'Source list id' })
	sourceListId: string

	@Field({ description: 'Source card id' })
	sourceCardId: string

	@Field({ description: 'Destination list id' })
	destinationListId: string

	@Field({ description: 'Destination index' })
	destinationIndex: number
}
