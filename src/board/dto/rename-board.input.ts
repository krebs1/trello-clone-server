import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RenameBoardInput {
	@Field({ description: 'Board id' })
	_id: string

	@Field({ description: 'Board name' })
	name: string
}
