import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class EditLabelInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'Label id' })
	labelId: string

	@Field({ description: 'Color id' })
	colorId: string

	@Field({ description: 'Label text', nullable: true })
	text: string | null
}
