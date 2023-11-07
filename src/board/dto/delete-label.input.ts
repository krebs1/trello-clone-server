import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteLabelInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'Label id' })
	labelId: string
}
