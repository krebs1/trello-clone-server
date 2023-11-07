import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class CreateLabelInput {
	@Field({ description: 'Board id' })
	boardId: string

	@Field({ description: 'Color id' })
	colorId: string

	@Field({ description: 'Label text', nullable: true })
	text: string | null
}
